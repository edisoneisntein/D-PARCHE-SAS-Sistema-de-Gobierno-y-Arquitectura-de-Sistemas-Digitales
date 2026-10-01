/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * Hermes Execution Engine — Phase 08
 * Executes tasks in process sandbox with HMAC approval validation
 * Implements: Fase 08 - Ejecución Real y Sandbox (MVP)
 */

import { spawn, SpawnOptions } from 'child_process';
import { createHmac, timingSafeEqual } from 'crypto';
import { randomUUID } from 'crypto';
import { mkdirSync, rmSync, existsSync } from 'fs';
import { tmpdir } from 'os';
import { join } from 'path';
import pino from 'pino';
import { getDatabase } from '../storage';
import { AIProviderRegistry, AIProviderGenerateContentRequest } from '../providers';

const logger = pino({ name: 'execution-engine' });

// ==================== Types ====================

export interface SandboxSpec {
  command: string;
  args: string[];
  env: Record<string, string>;
  cwd: string;
  timeoutMs: number;
  memoryLimitMb?: number;
}

export interface ExecutionResult {
  exitCode: number | null;
  stdout: string;
  stderr: string;
  timedOut: boolean;
  killed: boolean;
}

export interface TaskDefinition {
  id: string;
  type: 'shell' | 'ai_generate' | 'ai_stream';
  command?: string;
  args?: string[];
  prompt?: string;
  model?: string;
  systemInstruction?: string;
  temperature?: number;
  timeoutMs?: number;
  dependencies?: string[];
}

export interface PhaseExecutionRequest {
  phaseId: string;
  taskDag: {
    nodes: TaskDefinition[];
    edges: Array<{ from: string; to: string }>;
  };
  approvals: Array<{ targetId: string; targetHash: string; hmac: string }>;
}

export interface PhaseExecutionEvent {
  type:
    | 'phase_start'
    | 'task_start'
    | 'task_progress'
    | 'task_complete'
    | 'task_failed'
    | 'phase_complete'
    | 'phase_failed';
  phaseId: string;
  taskId?: string;
  timestamp: number;
  data?: unknown;
  error?: string;
}

export interface ApprovalRecord {
  targetId: string;
  targetHash: string;
  hmac: string;
  verified: boolean;
  verifiedAt?: number;
}

// ==================== Constants ====================

const DEFAULT_TIMEOUT_MS = 60000;
const MAX_STDOUT_SIZE = 1024 * 1024; // 1MB
const MAX_STDERR_SIZE = 1024 * 1024; // 1MB
const HMAC_SECRET_KEY = process.env.HERMES_HMAC_SECRET ?? 'dev-secret-change-in-production';

// ==================== Approval Gate (HMAC) ====================

/**
 * Verify HMAC approval: HMAC_SHA256(targetId + '|' + targetHash, secret) === provided_hmac
 */
export function verifyApproval(approval: ApprovalRecord): boolean {
  const payload = `${approval.targetId}|${approval.targetHash}`;
  const expectedHmac = createHmac('sha256', HMAC_SECRET_KEY).update(payload).digest('hex');

  const providedBuffer = Buffer.from(approval.hmac, 'hex');
  const expectedBuffer = Buffer.from(expectedHmac, 'hex');

  if (providedBuffer.length !== expectedBuffer.length) {
    return false;
  }

  return timingSafeEqual(providedBuffer, expectedBuffer);
}

/**
 * Generate HMAC for approval (used by approval CLI/admin)
 */
export function generateApprovalHmac(targetId: string, targetHash: string): string {
  const payload = `${targetId}|${targetHash}`;
  return createHmac('sha256', HMAC_SECRET_KEY).update(payload).digest('hex');
}

/**
 * Validate all approvals for a phase execution
 */
export function validateApprovals(
  approvals: Array<{ targetId: string; targetHash: string; hmac: string }>
): ApprovalRecord[] {
  return approvals.map((a) => {
    const record: ApprovalRecord = {
      targetId: a.targetId,
      targetHash: a.targetHash,
      hmac: a.hmac,
      verified: false,
    };
    record.verified = verifyApproval(record);
    record.verifiedAt = record.verified ? Date.now() : undefined;
    return record;
  });
}

// ==================== Process Sandbox ====================

/**
 * Execute command in isolated process sandbox
 * Uses: tmp directory, restricted env, timeout, resource limits
 */
export async function runInSandbox(spec: SandboxSpec): Promise<ExecutionResult> {
  const startTime = Date.now();

  // Create isolated working directory
  const sandboxDir = join(tmpdir(), `hermes-sandbox-${randomUUID()}`);
  mkdirSync(sandboxDir, { recursive: true });

  // Prepare environment - only allowlisted vars
  const allowedEnvVars = ['PATH', 'HOME', 'USER', 'LANG', 'LC_ALL', 'TZ'];
  const sandboxEnv: Record<string, string> = {};

  for (const key of allowedEnvVars) {
    if (process.env[key]) {
      sandboxEnv[key] = process.env[key]!;
    }
  }

  // Merge with spec env (spec takes precedence)
  Object.assign(sandboxEnv, spec.env);

  // Ensure cwd exists
  if (!existsSync(spec.cwd)) {
    mkdirSync(spec.cwd, { recursive: true });
  }

  const options: SpawnOptions = {
    cwd: spec.cwd,
    env: sandboxEnv,
    timeout: spec.timeoutMs,
    windowsHide: true,
  };

  logger.debug(
    { command: spec.command, args: spec.args, cwd: spec.cwd, timeout: spec.timeoutMs },
    'Starting sandbox execution'
  );

  return new Promise((resolve) => {
    let stdout = '';
    let stderr = '';
    let timedOut = false;
    let killed = false;
    let exitCode: number | null = null;

    const child = spawn(spec.command, spec.args, options);

    // Track stdout size
    child.stdout?.on('data', (chunk) => {
      stdout += chunk.toString();
      if (stdout.length > MAX_STDOUT_SIZE) {
        stdout = stdout.substring(0, MAX_STDOUT_SIZE) + '\n[TRUNCATED: stdout exceeded limit]';
        child.kill('SIGKILL');
      }
    });

    // Track stderr size
    child.stderr?.on('data', (chunk) => {
      stderr += chunk.toString();
      if (stderr.length > MAX_STDERR_SIZE) {
        stderr = stderr.substring(0, MAX_STDERR_SIZE) + '\n[TRUNCATED: stderr exceeded limit]';
        child.kill('SIGKILL');
      }
    });

    child.on('error', (err) => {
      logger.error({ err: err.message, command: spec.command }, 'Sandbox spawn error');
      killed = true;
      exitCode = null;
    });

    child.on('close', (code, signal) => {
      const duration = Date.now() - startTime;
      exitCode = code;
      killed = signal !== null;

      // Cleanup sandbox directory
      try {
        rmSync(sandboxDir, { recursive: true, force: true });
      } catch {
        // Ignore cleanup errors
      }

      logger.debug({ exitCode, signal, duration, timedOut }, 'Sandbox execution completed');

      resolve({
        exitCode,
        stdout,
        stderr,
        timedOut,
        killed,
      });
    });

    // Hard timeout enforcement
    setTimeout(() => {
      if (!timedOut && child.exitCode === null) {
        timedOut = true;
        child.kill('SIGKILL');
      }
    }, spec.timeoutMs + 5000); // Grace period
  });
}

// ==================== Task Executors ====================

/**
 * Execute shell command task
 */
async function executeShellTask(
  task: TaskDefinition,
  sandboxCwd: string
): Promise<ExecutionResult> {
  if (!task.command) {
    return {
      exitCode: 1,
      stdout: '',
      stderr: 'No command specified for shell task',
      timedOut: false,
      killed: false,
    };
  }

  const spec: SandboxSpec = {
    command: task.command,
    args: task.args ?? [],
    env: {},
    cwd: sandboxCwd,
    timeoutMs: task.timeoutMs ?? DEFAULT_TIMEOUT_MS,
  };

  return runInSandbox(spec);
}

/**
 * Execute AI generation task (non-streaming)
 */
async function executeAiGenerateTask(task: TaskDefinition): Promise<ExecutionResult> {
  if (!task.prompt) {
    return {
      exitCode: 1,
      stdout: '',
      stderr: 'No prompt specified for AI generation task',
      timedOut: false,
      killed: false,
    };
  }

  try {
    const provider = AIProviderRegistry.get();
    const model = task.model ?? provider.supportedModels[0] ?? 'gemini-2.0-flash-exp';

    const req: AIProviderGenerateContentRequest = {
      model,
      contents: [{ role: 'user', parts: [{ text: task.prompt! }] }],
      config: {
        systemInstruction: task.systemInstruction,
        temperature: task.temperature ?? 0.2,
      },
    };

    const response = await provider.generateContent(req);

    return {
      exitCode: 0,
      stdout: response.text,
      stderr: '',
      timedOut: false,
      killed: false,
    };
  } catch (err) {
    return {
      exitCode: 1,
      stdout: '',
      stderr: err instanceof Error ? err.message : 'AI generation failed',
      timedOut: false,
      killed: false,
    };
  }
}

/**
 * Execute AI streaming task (returns chunks via callback)
 */
async function* executeAiStreamTask(
  task: TaskDefinition,
  onChunk: (text: string) => void
): AsyncGenerator<ExecutionResult> {
  if (!task.prompt) {
    yield {
      exitCode: 1,
      stdout: '',
      stderr: 'No prompt specified for AI streaming task',
      timedOut: false,
      killed: false,
    };
    return;
  }

  try {
    const provider = AIProviderRegistry.get();
    const model = task.model ?? provider.supportedModels[0] ?? 'gemini-2.0-flash-exp';

    const req: AIProviderGenerateContentRequest = {
      model,
      contents: [{ role: 'user', parts: [{ text: task.prompt! }] }],
      config: {
        systemInstruction: task.systemInstruction,
        temperature: task.temperature ?? 0.2,
      },
    };

    let fullText = '';
    for await (const chunk of provider.generateContentStream(req)) {
      const text = chunk.text ?? '';
      if (text) {
        fullText += text;
        onChunk(text);
      }
      if (chunk.done) {
        break;
      }
    }

    yield {
      exitCode: 0,
      stdout: fullText,
      stderr: '',
      timedOut: false,
      killed: false,
    };
  } catch (err) {
    yield {
      exitCode: 1,
      stdout: '',
      stderr: err instanceof Error ? err.message : 'AI streaming failed',
      timedOut: false,
      killed: false,
    };
  }
}

// ==================== DAG Executor ====================

/**
 * Topological sort for task DAG
 */
function topologicalSort(
  nodes: TaskDefinition[],
  edges: Array<{ from: string; to: string }>
): TaskDefinition[] {
  const graph = new Map<string, Set<string>>();
  const inDegree = new Map<string, number>();
  const nodeMap = new Map<string, TaskDefinition>();

  for (const node of nodes) {
    graph.set(node.id, new Set());
    inDegree.set(node.id, 0);
    nodeMap.set(node.id, node);
  }

  for (const edge of edges) {
    if (!graph.has(edge.from) || !graph.has(edge.to)) {
      throw new Error(`Invalid edge: ${edge.from} -> ${edge.to}`);
    }
    graph.get(edge.from)!.add(edge.to);
    inDegree.set(edge.to, (inDegree.get(edge.to) ?? 0) + 1);
  }

  const queue: string[] = [];
  for (const [nodeId, degree] of inDegree) {
    if (degree === 0) queue.push(nodeId);
  }

  const sorted: TaskDefinition[] = [];
  while (queue.length > 0) {
    const nodeId = queue.shift()!;
    sorted.push(nodeMap.get(nodeId)!);

    for (const neighbor of graph.get(nodeId)!) {
      const newDegree = (inDegree.get(neighbor) ?? 0) - 1;
      inDegree.set(neighbor, newDegree);
      if (newDegree === 0) queue.push(neighbor);
    }
  }

  if (sorted.length !== nodes.length) {
    throw new Error('Cycle detected in task DAG');
  }

  return sorted;
}

// ==================== Execution Engine ====================

export class ExecutionEngine {
  private db = getDatabase();
  private abortController: AbortController | null = null;

  /**
   * Execute a phase with task DAG
   */
  async *executePhase(request: PhaseExecutionRequest): AsyncGenerator<PhaseExecutionEvent> {
    const { phaseId, taskDag, approvals } = request;
    const executionId = randomUUID();
    const startTime = Date.now();

    // Validate approvals
    const verifiedApprovals = validateApprovals(approvals);
    const allApproved = verifiedApprovals.every((a) => a.verified);

    if (!allApproved) {
      const failed = verifiedApprovals.filter((a) => !a.verified);
      yield {
        type: 'phase_failed',
        phaseId,
        timestamp: Date.now(),
        error: `Approval validation failed for: ${failed.map((f) => f.targetId).join(', ')}`,
      };
      return;
    }

    // Create phase execution record
    this.db.createPhaseExecution(
      executionId,
      phaseId,
      taskDag,
      approvals.map((a) => a.hmac)
    );
    this.db.updatePhaseExecutionStatus(executionId, 'RUNNING');

    // Log audit event
    this.db.appendAuditEvent(phaseId, 'phase_start', {
      executionId,
      taskCount: taskDag.nodes.length,
    });

    yield {
      type: 'phase_start',
      phaseId,
      timestamp: Date.now(),
      data: { executionId, taskCount: taskDag.nodes.length },
    };

    try {
      // Sort tasks topologically
      const sortedTasks = topologicalSort(taskDag.nodes, taskDag.edges);

      // Create isolated working directory for this phase
      const phaseCwd = join(tmpdir(), `hermes-phase-${phaseId}-${executionId}`);
      mkdirSync(phaseCwd, { recursive: true });

      // Execute tasks in order
      for (const task of sortedTasks) {
        const taskStartTime = Date.now();

        // Save task start checkpoint
        this.db.saveCheckpoint(
          phaseId,
          task.id,
          { status: 'RUNNING', startedAt: taskStartTime },
          'RUNNING'
        );
        this.db.appendAuditEvent(
          phaseId,
          'task_start',
          { taskId: task.id, taskType: task.type },
          task.id
        );

        yield {
          type: 'task_start',
          phaseId,
          taskId: task.id,
          timestamp: taskStartTime,
          data: { taskType: task.type },
        };

        try {
          let result: ExecutionResult = {
            exitCode: 1,
            stdout: '',
            stderr: 'Task not executed',
            timedOut: false,
            killed: false,
          };

          switch (task.type) {
            case 'shell':
              result = await executeShellTask(task, phaseCwd);
              break;
            case 'ai_generate':
              result = await executeAiGenerateTask(task);
              break;
            case 'ai_stream': {
              const progressEvents: PhaseExecutionEvent[] = [];
              for await (const chunkResult of executeAiStreamTask(task, (text) => {
                const progressEvent: PhaseExecutionEvent = {
                  type: 'task_progress',
                  phaseId,
                  taskId: task.id,
                  timestamp: Date.now(),
                  data: { text },
                };
                progressEvents.push(progressEvent);
              })) {
                result = chunkResult;
              }
              // Yield progress events
              for (const pe of progressEvents) {
                yield pe;
              }
              break;
            }
            default: {
              const exhaustive: never = task.type;
              throw new Error(`Unknown task type: ${exhaustive}`);
            }
          }

          const duration = Date.now() - taskStartTime;

          // Save task completion checkpoint
          const checkpointState = {
            status: result.exitCode === 0 ? 'COMPLETED' : 'FAILED',
            result: {
              exitCode: result.exitCode,
              stdout: result.stdout,
              stderr: result.stderr,
              timedOut: result.timedOut,
              killed: result.killed,
            },
            duration,
            completedAt: Date.now(),
          };

          this.db.saveCheckpoint(
            phaseId,
            task.id,
            checkpointState,
            result.exitCode === 0 ? 'COMPLETED' : 'FAILED'
          );

          this.db.appendAuditEvent(
            phaseId,
            'task_complete',
            {
              taskId: task.id,
              exitCode: result.exitCode,
              duration,
            },
            task.id
          );

          yield {
            type: result.exitCode === 0 ? 'task_complete' : 'task_failed',
            phaseId,
            taskId: task.id,
            timestamp: Date.now(),
            data: {
              exitCode: result.exitCode,
              stdout: result.stdout,
              stderr: result.stderr,
              duration,
            },
            error:
              result.exitCode !== 0 ? result.stderr || `Exit code ${result.exitCode}` : undefined,
          };

          if (result.exitCode !== 0) {
            throw new Error(
              `Task ${task.id} failed with exit code ${result.exitCode}: ${result.stderr}`
            );
          }
        } catch (err) {
          const error = err instanceof Error ? err.message : 'Unknown error';

          // Save failure checkpoint
          this.db.saveCheckpoint(
            phaseId,
            task.id,
            {
              status: 'FAILED',
              error,
              failedAt: Date.now(),
            },
            'FAILED'
          );

          this.db.appendAuditEvent(
            phaseId,
            'task_failed',
            {
              taskId: task.id,
              error,
            },
            task.id
          );

          yield {
            type: 'task_failed',
            phaseId,
            taskId: task.id,
            timestamp: Date.now(),
            error,
          };

          throw err;
        }
      }

      // Phase completed successfully
      this.db.updatePhaseExecutionStatus(executionId, 'COMPLETED');
      this.db.appendAuditEvent(phaseId, 'phase_complete', {
        executionId,
        duration: Date.now() - startTime,
      });

      yield {
        type: 'phase_complete',
        phaseId,
        timestamp: Date.now(),
        data: { executionId, duration: Date.now() - startTime },
      };
    } catch (err) {
      const error = err instanceof Error ? err.message : 'Unknown error';
      this.db.updatePhaseExecutionStatus(executionId, 'FAILED');
      this.db.appendAuditEvent(phaseId, 'phase_failed', { executionId, error });

      yield {
        type: 'phase_failed',
        phaseId,
        timestamp: Date.now(),
        error,
      };
    }
  }

  /**
   * Get phase execution status
   */
  getPhaseStatus(executionId: string) {
    return this.db.getPhaseExecution(executionId);
  }

  /**
   * Get task checkpoints for a phase
   */
  getPhaseCheckpoints(phaseId: string) {
    return this.db.getPhaseCheckpoints(phaseId);
  }

  /**
   * Recover phase from last valid checkpoint
   */
  recoverPhase(phaseId: string): { recovered: boolean; lastCheckpoint?: string } {
    const tasks = this.db.getPhaseCheckpoints(phaseId);
    const taskIds = [...new Set(tasks.map((t) => t.task_id))];

    let recoveredCount = 0;
    for (const taskId of taskIds) {
      const checkpoint = this.db.recoverLastValidCheckpoint(phaseId, taskId);
      if (checkpoint) {
        recoveredCount++;
      }
    }

    const lastCheckpoint = tasks.length > 0 ? tasks[tasks.length - 1] : undefined;
    return {
      recovered: recoveredCount > 0,
      lastCheckpoint: lastCheckpoint?.hash,
    };
  }
}

// Singleton instance
let engineInstance: ExecutionEngine | null = null;

export function getExecutionEngine(): ExecutionEngine {
  if (!engineInstance) {
    engineInstance = new ExecutionEngine();
  }
  return engineInstance;
}

export function resetExecutionEngine(): void {
  engineInstance = null;
}
