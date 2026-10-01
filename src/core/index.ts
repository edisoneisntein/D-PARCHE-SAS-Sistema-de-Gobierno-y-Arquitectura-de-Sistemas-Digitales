/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * Barrel export for Core Engine
 */

export type {
  ExecutionResult,
  PhaseExecutionRequest,
  PhaseExecutionEvent,
  TaskDefinition,
  SandboxSpec,
} from './execution-engine';

export {
  ExecutionEngine,
  getExecutionEngine,
  resetExecutionEngine,
  verifyApproval,
  generateApprovalHmac,
  validateApprovals,
  runInSandbox,
} from './execution-engine';
