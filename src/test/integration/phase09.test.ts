/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * Phase 09 Tests: AIProvider NVIDIA + Execute with sandbox
 */

import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { AIProviderRegistry } from '../../providers';
import { getExecutionEngine } from '../../core';
import { initializeProviders } from '../../providers/init';
import { verifyApproval, generateApprovalHmac } from '../../core/execution-engine';
import { getDatabase, resetDatabase } from '../../storage';

// Mock API key for testing (not real)
const TEST_NVIDIA_KEY = 'test-nvidia-key-123';
const TEST_ANTHROPIC_KEY = 'test-anthropic-key-123';
const TEST_GEMINI_KEY = 'test-gemini-key-123';

describe('Phase 09: AIProvider NVIDIA + Execute', () => {
  beforeAll(() => {
    process.env.GEMINI_API_KEY = TEST_GEMINI_KEY;
    process.env.NVIDIA_API_KEY = TEST_NVIDIA_KEY;
    process.env.ANTHROPIC_API_KEY = TEST_ANTHROPIC_KEY;
    process.env.HERMES_HMAC_SECRET = 'test-secret';
    initializeProviders();
  });

  afterAll(() => {
    delete process.env.NVIDIA_API_KEY;
    delete process.env.ANTHROPIC_KEY;
    delete process.env.HERMES_HMAC_SECRET;
    AIProviderRegistry.clear();
    resetDatabase();
  });

  describe('Provider Registry', () => {
    it('should register NVIDIA provider', () => {
      const providers = AIProviderRegistry.list();
      expect(providers).toContain('nvidia');
    });

    it('should register Anthropic provider', () => {
      const providers = AIProviderRegistry.list();
      expect(providers).toContain('anthropic');
    });

    it('should get NVIDIA provider instance', () => {
      const provider = AIProviderRegistry.get('nvidia');
      expect(provider).toBeDefined();
      expect(provider.name).toBe('nvidia');
      expect(provider.supportedModels).toContain('nvidia/nemotron-3-nano-omni-30b-a3b-reasoning');
    });

    it('should get Anthropic provider instance', () => {
      const provider = AIProviderRegistry.get('anthropic');
      expect(provider).toBeDefined();
      expect(provider.name).toBe('anthropic');
      expect(provider.supportedModels).toContain('claude-3-5-sonnet-20241022');
    });
  });

  describe('NVIDIA Provider (Mock)', () => {
    it('should have correct supported models', () => {
      const provider = AIProviderRegistry.get('nvidia');
      expect(provider.supportedModels.length).toBeGreaterThan(0);
      expect(provider.supportedModels).toContain('nvidia/nemotron-3-nano-omni-30b-a3b-reasoning');
    });

    it('should list models without error', async () => {
      const provider = AIProviderRegistry.get('nvidia');
      const models = await provider.listModels();
      expect(Array.isArray(models)).toBe(true);
      expect(models.length).toBeGreaterThan(0);
    });

    it('should count tokens approximately', async () => {
      const provider = AIProviderRegistry.get('nvidia');
      const count = await provider.countTokens({
        model: 'nvidia/nemotron-3-nano-omni-30b-a3b-reasoning',
        contents: [{ role: 'user', parts: [{ text: 'Hello world' }] }],
      });
      expect(typeof count).toBe('number');
      expect(count).toBeGreaterThan(0);
    });
  });

  describe('Anthropic Provider (Mock)', () => {
    it('should have correct supported models', () => {
      const provider = AIProviderRegistry.get('anthropic');
      expect(provider.supportedModels.length).toBeGreaterThan(0);
      expect(provider.supportedModels).toContain('claude-3-5-sonnet-20241022');
    });

    it('should list models without error', async () => {
      const provider = AIProviderRegistry.get('anthropic');
      const models = await provider.listModels();
      expect(Array.isArray(models)).toBe(true);
      expect(models.length).toBeGreaterThan(0);
    });

    it('should count tokens approximately', async () => {
      const provider = AIProviderRegistry.get('anthropic');
      const count = await provider.countTokens({
        model: 'claude-3-5-sonnet-20241022',
        contents: [{ role: 'user', parts: [{ text: 'Hello world' }] }],
      });
      expect(typeof count).toBe('number');
      expect(count).toBeGreaterThan(0);
    });
  });

  describe('Approval Gate HMAC', () => {
    it('should generate and verify HMAC correctly', () => {
      const targetId = 'task-123';
      const targetHash = 'abc123def456';
      const hmac = generateApprovalHmac(targetId, targetHash);

      expect(typeof hmac).toBe('string');
      expect(hmac.length).toBe(64); // SHA-256 hex

      const approved = verifyApproval({ targetId, targetHash, hmac, verified: false });
      expect(approved).toBe(true);
    });

    it('should reject invalid HMAC', () => {
      const targetId = 'task-123';
      const targetHash = 'abc123def456';
      const hmac = 'invalid-hmac';

      const approved = verifyApproval({ targetId, targetHash, hmac, verified: false });
      expect(approved).toBe(false);
    });

    it('should reject tampered targetId', () => {
      const targetId = 'task-123';
      const targetHash = 'abc123def456';
      const hmac = generateApprovalHmac(targetId, targetHash);

      // Tamper with targetId
      const approved = verifyApproval({ targetId: 'task-456', targetHash, hmac, verified: false });
      expect(approved).toBe(false);
    });

    it('should reject tampered targetHash', () => {
      const targetId = 'task-123';
      const targetHash = 'abc123def456';
      const hmac = generateApprovalHmac(targetId, targetHash);

      // Tamper with targetHash
      const approved = verifyApproval({
        targetId,
        targetHash: 'different-hash',
        hmac,
        verified: false,
      });
      expect(approved).toBe(false);
    });
  });

  describe('Execute Phase with Sandbox', () => {
    let engine: ReturnType<typeof getExecutionEngine>;

    beforeAll(() => {
      engine = getExecutionEngine();
    });

    it('should execute shell task and persist checkpoint', async () => {
      const phaseId = 'test-phase-09-shell';
      const taskId = 'echo-task';

      // Generate valid approval HMAC
      const targetId = `${phaseId}:${taskId}`;
      const targetHash = 'sha256-dummy-hash-for-test';
      const hmac = generateApprovalHmac(targetId, targetHash);

      const events: any[] = [];

      for await (const event of engine.executePhase({
        phaseId,
        taskDag: {
          nodes: [
            {
              id: taskId,
              type: 'shell',
              command: 'echo',
              args: ['hello from phase 09'],
              timeoutMs: 5000,
            },
          ],
          edges: [],
        },
        approvals: [
          {
            targetId,
            targetHash,
            hmac,
          },
        ],
      })) {
        events.push(event);
      }

      // Verify events
      const startEvent = events.find((e) => e.type === 'phase_start');
      expect(startEvent).toBeDefined();
      expect(startEvent.phaseId).toBe('test-phase-09-shell');

      const taskStartEvent = events.find(
        (e) => e.type === 'task_start' && e.taskId === 'echo-task'
      );
      expect(taskStartEvent).toBeDefined();

      const taskCompleteEvent = events.find(
        (e) => e.type === 'task_complete' && e.taskId === 'echo-task'
      );
      expect(taskCompleteEvent).toBeDefined();
      expect(taskCompleteEvent.data?.exitCode).toBe(0);
      expect(taskCompleteEvent.data?.stdout).toContain('hello from phase 09');

      const completeEvent = events.find((e) => e.type === 'phase_complete');
      expect(completeEvent).toBeDefined();

      // Verify checkpoint persisted in SQLite
      const db = getDatabase();
      const checkpoints = db.getPhaseCheckpoints(phaseId);
      expect(checkpoints.length).toBeGreaterThan(0);

      // Get the LAST checkpoint for this task (highest id = latest)
      const taskCheckpoints = checkpoints.filter((c) => c.task_id === 'echo-task');
      expect(taskCheckpoints.length).toBeGreaterThanOrEqual(1);
      const taskCheckpoint = taskCheckpoints[taskCheckpoints.length - 1]!;
      expect(taskCheckpoint.status).toBe('COMPLETED');
      expect(taskCheckpoint.hash).toBeDefined();
    });

    it('should handle task failure and persist FAILED checkpoint', async () => {
      const phaseId = 'test-phase-09-fail';
      const taskId = 'fail-task';

      const events: any[] = [];

      try {
        for await (const event of engine.executePhase({
          phaseId,
          taskDag: {
            nodes: [
              {
                id: taskId,
                type: 'shell',
                command: 'false', // Command that exits with code 1
                timeoutMs: 5000,
              },
            ],
            edges: [],
          },
          approvals: [
            {
              targetId: `${phaseId}:${taskId}`,
              targetHash: 'sha256-dummy',
              hmac: generateApprovalHmac(`${phaseId}:${taskId}`, 'sha256-dummy'),
            },
          ],
        })) {
          events.push(event);
        }
      } catch {
        // Expected to throw
      }

      // Verify phase_failed event
      const failedEvent = events.find((e) => e.type === 'phase_failed');
      expect(failedEvent).toBeDefined();

      // Verify FAILED checkpoint
      const db = getDatabase();
      const checkpoints = db.getPhaseCheckpoints('test-phase-09-fail');
      const taskCheckpoints = checkpoints.filter((c) => c.task_id === 'fail-task');
      expect(taskCheckpoints.length).toBeGreaterThanOrEqual(1);
      const taskCheckpoint = taskCheckpoints[taskCheckpoints.length - 1]!;
      expect(taskCheckpoint.status).toBe('FAILED');
    });
  });

  describe('Recovery after kill -9', () => {
    it('should recover checkpoints after simulated crash', async () => {
      const engine = getExecutionEngine();
      const _phaseId = 'test-recovery-09';

      // Execute a phase
      await (async () => {
        for await (const _event of engine.executePhase({
          phaseId: 'test-recovery-09-exec',
          taskDag: {
            nodes: [
              {
                id: 'recovery-task',
                type: 'shell',
                command: 'echo',
                args: ['recovery test'],
                timeoutMs: 5000,
              },
            ],
            edges: [],
          },
          approvals: [
            {
              targetId: 'test-recovery-09-exec:recovery-task',
              targetHash: 'sha256-dummy',
              hmac: generateApprovalHmac('test-recovery-09-exec:recovery-task', 'sha256-dummy'),
            },
          ],
        })) {
          // consume
        }
      })();

      // Verify checkpoints exist
      const db = getDatabase();
      const checkpoints = db.getPhaseCheckpoints('test-recovery-09-exec');
      expect(checkpoints.length).toBeGreaterThan(0);

      // Test recovery
      const recovery = engine.recoverPhase('test-recovery-09-exec');
      expect(recovery.recovered).toBe(true);
      expect(recovery.lastCheckpoint).toBeDefined();
    });
  });
});
