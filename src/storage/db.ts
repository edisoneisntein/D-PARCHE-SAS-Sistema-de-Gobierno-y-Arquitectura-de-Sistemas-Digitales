/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * SQLite Persistence Layer for Hermes Core
 * Implements: Fase 07 - Persistencia, Checkpoints y Recovery
 * Uses better-sqlite3 with WAL mode for durability
 */

import Database from 'better-sqlite3';
import { createHash } from 'crypto';
import path from 'path';
import { fileURLToPath } from 'url';
import pino from 'pino';

const logger = pino({ name: 'hermes-storage' });

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Database path - use env or default to project root
const DB_PATH = process.env.HERMES_DB_PATH ?? path.resolve(__dirname, '../../state.db');

export interface CheckpointRow {
  id: number;
  phase_id: string;
  task_id: string;
  state_json: string;
  prev_hash: string;
  hash: string;
  status: 'RUNNING' | 'COMPLETED' | 'FAILED' | 'APPROVED' | 'REJECTED';
  approval_hash?: string;
  created_at: number;
  updated_at: number;
}

export interface AuditEventRow {
  id: number;
  phase_id: string;
  task_id?: string;
  event_type: string;
  event_data: string;
  hash: string;
  created_at: number;
}

export interface PhaseExecutionRow {
  id: string;
  phase_id: string;
  task_dag_json: string;
  status: 'PENDING' | 'RUNNING' | 'COMPLETED' | 'FAILED' | 'CANCELLED';
  approval_hashes: string; // JSON array of approval hashes
  created_at: number;
  updated_at: number;
  completed_at?: number;
}

/**
 * Initialize database schema with WAL mode
 */
function initializeSchema(db: Database.Database): void {
  // Enable WAL mode for better concurrency and durability
  db.pragma('journal_mode = WAL');
  db.pragma('synchronous = FULL');
  db.pragma('busy_timeout = 5000');
  db.pragma('foreign_keys = ON');

  // Checkpoints table - stores task execution state with hash chain
  db.exec(`
    CREATE TABLE IF NOT EXISTS checkpoints (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      phase_id TEXT NOT NULL,
      task_id TEXT NOT NULL,
      state_json TEXT NOT NULL,
      prev_hash TEXT NOT NULL DEFAULT '',
      hash TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'RUNNING',
      approval_hash TEXT,
      created_at INTEGER NOT NULL,
      updated_at INTEGER NOT NULL
    );
  `);

  // Indexes for common queries
  db.exec(`
    CREATE INDEX IF NOT EXISTS idx_checkpoints_phase_task ON checkpoints(phase_id, task_id);
    CREATE INDEX IF NOT EXISTS idx_checkpoints_hash ON checkpoints(hash);
    CREATE INDEX IF NOT EXISTS idx_checkpoints_status ON checkpoints(status);
  `);

  // Audit events table - immutable log of all execution events
  db.exec(`
    CREATE TABLE IF NOT EXISTS audit_events (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      phase_id TEXT NOT NULL,
      task_id TEXT,
      event_type TEXT NOT NULL,
      event_data TEXT NOT NULL,
      hash TEXT NOT NULL,
      created_at INTEGER NOT NULL
    );
  `);

  db.exec(`
    CREATE INDEX IF NOT EXISTS idx_audit_phase ON audit_events(phase_id);
    CREATE INDEX IF NOT EXISTS idx_audit_created ON audit_events(created_at);
  `);

  // Phase executions table - tracks phase-level execution
  db.exec(`
    CREATE TABLE IF NOT EXISTS phase_executions (
      id TEXT PRIMARY KEY,
      phase_id TEXT NOT NULL,
      task_dag_json TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'PENDING',
      approval_hashes TEXT NOT NULL DEFAULT '[]',
      created_at INTEGER NOT NULL,
      updated_at INTEGER NOT NULL,
      completed_at INTEGER
    );
  `);

  db.exec(`
    CREATE INDEX IF NOT EXISTS idx_phase_executions_phase ON phase_executions(phase_id);
    CREATE INDEX IF NOT EXISTS idx_phase_executions_status ON phase_executions(status);
  `);
}

/**
 * Compute SHA-256 hash of input
 */
function computeHash(input: string): string {
  return createHash('sha256').update(input).digest('hex');
}

/**
 * Compute checkpoint hash: sha256(prev_hash + state_json)
 */
function computeCheckpointHash(prevHash: string, stateJson: string): string {
  return computeHash(prevHash + stateJson);
}

/**
 * Compute audit event hash: sha256(phase_id + task_id + event_type + event_data + timestamp)
 */
function computeAuditHash(
  phaseId: string,
  taskId: string | undefined,
  eventType: string,
  eventData: string,
  timestamp: number
): string {
  const payload = `${phaseId}|${taskId ?? ''}|${eventType}|${eventData}|${timestamp}`;
  return computeHash(payload);
}

/**
 * Database class wrapping better-sqlite3 with Hermes-specific methods
 */
export class HermesDatabase {
  private db: Database.Database;

  constructor(dbPath: string = DB_PATH) {
    this.db = new Database(dbPath);
    initializeSchema(this.db);
    logger.info({ path: dbPath }, 'Hermes database initialized');
  }

  // ==================== Checkpoint Methods ====================

  /**
   * Save a checkpoint with hash chain validation
   */
  saveCheckpoint(
    phaseId: string,
    taskId: string,
    state: object,
    status: CheckpointRow['status'] = 'RUNNING',
    approvalHash?: string
  ): CheckpointRow {
    const stateJson = JSON.stringify(state);
    const now = Date.now();

    // Get previous checkpoint hash for this phase/task
    const prevCheckpoint = this.getLatestCheckpoint(phaseId, taskId);
    const prevHash = prevCheckpoint?.hash ?? '';

    const hash = computeCheckpointHash(prevHash, stateJson);

    const stmt = this.db.prepare(`
      INSERT INTO checkpoints (phase_id, task_id, state_json, prev_hash, hash, status, approval_hash, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    const result = stmt.run(
      phaseId,
      taskId,
      stateJson,
      prevHash,
      hash,
      status,
      approvalHash ?? null,
      now,
      now
    );

    const row = this.db
      .prepare('SELECT * FROM checkpoints WHERE id = ?')
      .get(result.lastInsertRowid) as CheckpointRow;

    logger.debug({ phaseId, taskId, hash: hash.substring(0, 16), status }, 'Checkpoint saved');
    return row;
  }

  /**
   * Get latest checkpoint for a phase/task
   */
  getLatestCheckpoint(phaseId: string, taskId: string): CheckpointRow | null {
    return this.db
      .prepare(
        `
      SELECT * FROM checkpoints 
      WHERE phase_id = ? AND task_id = ?
      ORDER BY id DESC LIMIT 1
    `
      )
      .get(phaseId, taskId) as CheckpointRow | null;
  }

  /**
   * Get all checkpoints for a phase
   */
  getPhaseCheckpoints(phaseId: string): CheckpointRow[] {
    return this.db
      .prepare(
        `
      SELECT * FROM checkpoints 
      WHERE phase_id = ?
      ORDER BY id ASC
    `
      )
      .all(phaseId) as CheckpointRow[];
  }

  /**
   * Verify checkpoint chain integrity
   */
  verifyCheckpointChain(phaseId: string, taskId: string): boolean {
    const checkpoints = this.db
      .prepare(
        `
      SELECT * FROM checkpoints 
      WHERE phase_id = ? AND task_id = ?
      ORDER BY id ASC
    `
      )
      .all(phaseId, taskId) as CheckpointRow[];

    if (checkpoints.length === 0) return true;

    let prevHash = '';
    for (const cp of checkpoints) {
      const expectedHash = computeCheckpointHash(prevHash, cp.state_json);
      if (cp.hash !== expectedHash) {
        logger.error(
          { phaseId, taskId, checkpointId: cp.id, expected: expectedHash, actual: cp.hash },
          'Checkpoint hash mismatch'
        );
        return false;
      }
      prevHash = cp.hash;
    }
    return true;
  }

  /**
   * Update checkpoint status
   */
  updateCheckpointStatus(id: number, status: CheckpointRow['status']): void {
    this.db
      .prepare(
        `
      UPDATE checkpoints SET status = ?, updated_at = ? WHERE id = ?
    `
      )
      .run(status, Date.now(), id);
  }

  // ==================== Audit Event Methods ====================

  /**
   * Append immutable audit event
   */
  appendAuditEvent(
    phaseId: string,
    eventType: string,
    eventData: object,
    taskId?: string
  ): AuditEventRow {
    const eventDataJson = JSON.stringify(eventData);
    const timestamp = Date.now();
    const hash = computeAuditHash(phaseId, taskId, eventType, eventDataJson, timestamp);

    const stmt = this.db.prepare(`
      INSERT INTO audit_events (phase_id, task_id, event_type, event_data, hash, created_at)
      VALUES (?, ?, ?, ?, ?, ?)
    `);

    const result = stmt.run(phaseId, taskId ?? null, eventType, eventDataJson, hash, timestamp);

    return this.db
      .prepare('SELECT * FROM audit_events WHERE id = ?')
      .get(result.lastInsertRowid) as AuditEventRow;
  }

  /**
   * Get audit events for a phase
   */
  getAuditEvents(phaseId: string, limit = 1000): AuditEventRow[] {
    return this.db
      .prepare(
        `
      SELECT * FROM audit_events 
      WHERE phase_id = ?
      ORDER BY created_at DESC LIMIT ?
    `
      )
      .all(phaseId, limit) as AuditEventRow[];
  }

  // ==================== Phase Execution Methods ====================

  /**
   * Create new phase execution record
   */
  createPhaseExecution(
    id: string,
    phaseId: string,
    taskDag: object,
    approvalHashes: string[]
  ): PhaseExecutionRow {
    const now = Date.now();
    const approvalHashesJson = JSON.stringify(approvalHashes);

    this.db
      .prepare(
        `
      INSERT INTO phase_executions (id, phase_id, task_dag_json, status, approval_hashes, created_at, updated_at)
      VALUES (?, ?, ?, 'PENDING', ?, ?, ?)
    `
      )
      .run(id, phaseId, JSON.stringify(taskDag), approvalHashesJson, now, now);

    return this.getPhaseExecution(id)!;
  }

  /**
   * Get phase execution by ID
   */
  getPhaseExecution(id: string): PhaseExecutionRow | null {
    return this.db
      .prepare('SELECT * FROM phase_executions WHERE id = ?')
      .get(id) as PhaseExecutionRow | null;
  }

  /**
   * Update phase execution status
   */
  updatePhaseExecutionStatus(id: string, status: PhaseExecutionRow['status']): void {
    const now = Date.now();
    const updates: string[] = ['status = ?', 'updated_at = ?'];
    const params: (string | number)[] = [status, now];

    if (status === 'COMPLETED' || status === 'FAILED' || status === 'CANCELLED') {
      updates.push('completed_at = ?');
      params.push(now);
    }

    params.push(id);

    this.db
      .prepare(`UPDATE phase_executions SET ${updates.join(', ')} WHERE id = ?`)
      .run(...params);
  }

  // ==================== Recovery Methods ====================

  /**
   * Recover last valid checkpoint for a phase/task
   * Scans backwards from latest to find first valid hash chain
   */
  recoverLastValidCheckpoint(phaseId: string, taskId: string): CheckpointRow | null {
    const checkpoints = this.getPhaseCheckpoints(phaseId).filter((c) => c.task_id === taskId);

    if (checkpoints.length === 0) return null;

    // Scan backwards to find first valid checkpoint
    for (let i = checkpoints.length - 1; i >= 0; i--) {
      const subset = checkpoints.slice(0, i + 1);
      let prevHash = '';
      let valid = true;

      for (const cp of subset) {
        const expectedHash = computeCheckpointHash(prevHash, cp.state_json);
        if (cp.hash !== expectedHash) {
          valid = false;
          break;
        }
        prevHash = cp.hash;
      }

      if (valid) {
        const last = subset[subset.length - 1];
        if (last) {
          logger.info({ phaseId, taskId, recoveredId: last.id }, 'Recovered last valid checkpoint');
          return last;
        }
      }
    }

    logger.warn({ phaseId, taskId }, 'No valid checkpoint found in chain');
    return null;
  }

  /**
   * Get all incomplete phase executions (for recovery on startup)
   */
  getIncompletePhaseExecutions(): PhaseExecutionRow[] {
    return this.db
      .prepare(
        `
      SELECT * FROM phase_executions 
      WHERE status IN ('PENDING', 'RUNNING')
      ORDER BY created_at ASC
    `
      )
      .all() as PhaseExecutionRow[];
  }

  // ==================== Utility Methods ====================

  /**
   * Get database instance for direct queries (use sparingly)
   */
  getDb(): Database.Database {
    return this.db;
  }

  /**
   * Close database connection
   */
  close(): void {
    this.db.close();
    logger.info('Database connection closed');
  }

  /**
   * Health check
   */
  healthCheck(): boolean {
    try {
      this.db.prepare('SELECT 1').get();
      return true;
    } catch {
      return false;
    }
  }
}

// Singleton instance
let dbInstance: HermesDatabase | null = null;

export function getDatabase(dbPath?: string): HermesDatabase {
  if (!dbInstance) {
    dbInstance = new HermesDatabase(dbPath);
  }
  return dbInstance;
}

export function resetDatabase(): void {
  if (dbInstance) {
    dbInstance.close();
    dbInstance = null;
  }
}
