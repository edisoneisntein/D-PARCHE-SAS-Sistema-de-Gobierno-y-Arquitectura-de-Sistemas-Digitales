/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type EpistemologicalState =
  | 'DISCOVERED'
  | 'INSTALLED'
  | 'AVAILABLE'
  | 'EXECUTABLE'
  | 'AUTHORIZED'
  | 'GOVERNED'
  | 'VERIFIED'
  | 'PRODUCTION_READY';

export type CapabilityOrigin = 'builtin' | 'local' | 'manifest_only' | 'optional' | 'unverified_claim';

export interface CapabilityItem {
  id: string;
  name: string;
  category: 'core' | 'git' | 'filesystem' | 'network' | 'secret_scan' | 'browser' | 'ai_provider' | 'system' | 'misc';
  origin: CapabilityOrigin;
  epistemologicalState: EpistemologicalState;
  hasSkillMd: boolean;
  hasSandbox: boolean;
  notes: string;
  evidenceSource: string;
}

export interface MasterSection {
  number: number;
  title: string;
  category: 'context' | 'identity' | 'architecture' | 'epistemology' | 'security' | 'phases' | 'rules';
  summary: string;
  fullText: string;
  invariants: string[];
  antiPatterns?: string[];
  keyQuote?: string;
}

export type DecisionVerdict =
  | 'NO_AGENT_NEEDED'
  | 'SINGLE_AGENT_SUFFICIENT'
  | 'MULTI_AGENT_REQUIRED'
  | 'HYBRID_SYSTEM_REQUIRED';

export interface DecisionParameters {
  problemName: string;
  determinismRequired: number; // 1-10
  latencySensitivity: number; // 1-10
  costBudgetSensitivity: number; // 1-10
  securityRiskSideEffects: number; // 1-10
  autonomyRequired: number; // 1-10
  multiPartyCoordination: number; // 1-10
  dataAvailability: number; // 1-10
  failureTolerance: number; // 1-10
}

export interface DecisionResult {
  verdict: DecisionVerdict;
  verdictTitle: string;
  architectureSummary: string;
  technicalJustification: string[];
  contraindications: string[];
  recommendedComponents: string[];
  tradeoffs: {
    determinism: string;
    cost: string;
    latency: string;
    verifiability: string;
    safetyRisk: string;
  };
}

export interface MacroCyclePhase {
  id: number;
  name: string;
  category: 'discovery' | 'architecture' | 'implementation' | 'release' | 'operation';
  description: string;
  requiredInputs: string[];
  expectedOutputs: string[];
  governanceGates: string[];
  evidenceRequired: string[];
}

export interface TestPhase {
  id: string;
  phaseNumber: number;
  name: string;
  status: 'COMPLETED_PASSED' | 'IN_DEVELOPMENT' | 'ROADMAP';
  passedTests: number;
  totalTests: number;
  description: string;
  verificationEvidence: string;
  modules: string[];
}

export interface HierarchySource {
  level: number;
  name: string;
  scope: string;
  canOverride: string[];
  cannotOverride: string[];
  doctrineRule: string;
}

export interface CritiqueResult {
  verdict: 'RECHAZADO' | 'CORRECCION_OBLIGATORIA' | 'APROBADO_CON_CONDICIONES';
  confidenceScore: number;
  summary: string;
  unforgivingAnalysis: string[];
  detectedAntiPatterns: string[];
  priorityViolations: string[];
  requiredRemediations: string[];
  sourceReference: string;
}
