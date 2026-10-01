import { describe, it, expect } from 'vitest';
import { evaluateArchitectureDecision } from '../utils/hermesEngine';
import type { DecisionParameters } from '../types/hermes';

describe('hermesEngine - evaluateArchitectureDecision', () => {
  const baseParams: DecisionParameters = {
    problemName: 'Test Problem',
    determinismRequired: 8,
    latencySensitivity: 5,
    costBudgetSensitivity: 5,
    securityRiskSideEffects: 3,
    autonomyRequired: 3,
    multiPartyCoordination: 2,
    dataAvailability: 7,
    failureTolerance: 2,
  };

  it('should return NO_AGENT_NEEDED for simple deterministic requirements', () => {
    const params = {
      ...baseParams,
      determinismRequired: 9,
      autonomyRequired: 1,
      multiPartyCoordination: 1,
      failureTolerance: 1,
    };

    const result = evaluateArchitectureDecision(params);
    expect(result.verdict).toBe('NO_AGENT_NEEDED');
    expect(result.verdictTitle).toContain('NO SE NECESITA UN AGENTE');
    expect(result.architectureSummary).toContain('determinismo');
    expect(result.tradeoffs).toBeDefined();
    expect(typeof result.tradeoffs.determinism).toBe('string');
  });

  it('should return SINGLE_AGENT for moderate complexity with some autonomy need', () => {
    const params = {
      ...baseParams,
      autonomyRequired: 7,
      multiPartyCoordination: 2,
      securityRiskSideEffects: 3,
    };

    const result = evaluateArchitectureDecision(params);
    expect(['SINGLE_AGENT_SUFFICIENT', 'NO_AGENT_NEEDED']).toContain(result.verdict);
    expect(result.tradeoffs).toBeDefined();
    expect(result.tradeoffs.cost).toBeDefined();
    expect(result.tradeoffs.latency).toBeDefined();
    expect(result.tradeoffs.verifiability).toBeDefined();
    expect(result.tradeoffs.safetyRisk).toBeDefined();
  });

  it('should return MULTI_AGENT for high coordination and autonomy needs', () => {
    const params = {
      ...baseParams,
      autonomyRequired: 8,
      multiPartyCoordination: 8,
      costBudgetSensitivity: 3,
      securityRiskSideEffects: 3,
    };

    const result = evaluateArchitectureDecision(params);
    expect(['MULTI_AGENT_REQUIRED', 'HYBRID_SYSTEM_REQUIRED']).toContain(result.verdict);
  });

  it('should return HYBRID for mixed requirements', () => {
    const params = {
      ...baseParams,
      autonomyRequired: 6,
      multiPartyCoordination: 5,
      determinismRequired: 5,
    };

    const result = evaluateArchitectureDecision(params);
    expect(['HYBRID_SYSTEM_REQUIRED', 'SINGLE_AGENT_SUFFICIENT', 'MULTI_AGENT_REQUIRED']).toContain(
      result.verdict
    );
  });

  it('should always include tradeoffs in result', () => {
    const result = evaluateArchitectureDecision(baseParams);
    expect(result.tradeoffs).toBeDefined();
    expect(typeof result.tradeoffs.determinism).toBe('string');
    expect(typeof result.tradeoffs.cost).toBe('string');
    expect(typeof result.tradeoffs.latency).toBe('string');
    expect(typeof result.tradeoffs.verifiability).toBe('string');
    expect(typeof result.tradeoffs.safetyRisk).toBe('string');
  });

  it('should include all required fields in result', () => {
    const result = evaluateArchitectureDecision(baseParams);
    expect(result).toHaveProperty('verdict');
    expect(result).toHaveProperty('verdictTitle');
    expect(result).toHaveProperty('architectureSummary');
    expect(result).toHaveProperty('technicalJustification');
    expect(result).toHaveProperty('contraindications');
    expect(result).toHaveProperty('recommendedComponents');
    expect(result).toHaveProperty('tradeoffs');
    expect(typeof result.verdict).toBe('string');
    expect(typeof result.verdictTitle).toBe('string');
    expect(typeof result.architectureSummary).toBe('string');
    expect(Array.isArray(result.technicalJustification)).toBe(true);
    expect(Array.isArray(result.contraindications)).toBe(true);
    expect(Array.isArray(result.recommendedComponents)).toBe(true);
    expect(typeof result.tradeoffs.determinism).toBe('string');
    expect(typeof result.tradeoffs.cost).toBe('string');
    expect(typeof result.tradeoffs.latency).toBe('string');
    expect(typeof result.tradeoffs.verifiability).toBe('string');
    expect(typeof result.tradeoffs.safetyRisk).toBe('string');
  });
});
