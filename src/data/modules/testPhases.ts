/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { TestPhase } from '../../types/hermes';

export const TEST_PHASES_DATA: TestPhase[] = [
  {
    id: 'fase-01',
    phaseNumber: 1,
    name: 'Fase 01 — Domain Types',
    status: 'COMPLETED_PASSED',
    passedTests: 57,
    totalTests: 57,
    description:
      'Tipos base inmutables, estados epistemológicos, identificadores criptográficos y taxonomía de componentes.',
    verificationEvidence: '57/57 tests superados en src/test/domain-types.test.ts',
    modules: ['types/domain.ts', 'types/epistemology.ts', 'types/crypto.ts'],
  },
  {
    id: 'fase-02',
    phaseNumber: 2,
    name: 'Fase 02 — Evidence / Claims',
    status: 'COMPLETED_PASSED',
    passedTests: 41,
    totalTests: 41,
    description:
      'Modelado epistemológico de afirmaciones (claims), validación de frescura de evidencia y distinción entre simulación y realidad.',
    verificationEvidence: '41/41 tests superados en src/test/evidence.test.ts',
    modules: ['evidence/evaluator.ts', 'evidence/claims-verifier.ts', 'evidence/freshness.ts'],
  },
  {
    id: 'fase-03',
    phaseNumber: 3,
    name: 'Fase 03 — Policy Engine',
    status: 'COMPLETED_PASSED',
    passedTests: 17,
    totalTests: 17,
    description:
      'Motor de políticas determinista: evaluación de reglas de gobierno, denegación por defecto y autorizaciones atadas a contexto.',
    verificationEvidence: '17/17 tests superados en src/test/policy-engine.test.ts',
    modules: ['policy/engine.ts', 'policy/rules.ts', 'policy/evaluator.ts'],
  },
  {
    id: 'fase-04',
    phaseNumber: 4,
    name: 'Fase 04 — Secret Boundary + Egress',
    status: 'COMPLETED_PASSED',
    passedTests: 42,
    totalTests: 42,
    description:
      'Frontera infranqueable de secretos: sanitización pre-LLM, escaneo de exportación, prevención de fuga en logs y eliminación de originalContent.',
    verificationEvidence: '42/42 tests superados en src/test/secret-boundary.test.ts',
    modules: ['security/sanitizer.ts', 'security/secret-scanner.ts', 'security/egress-gate.ts'],
  },
  {
    id: 'fase-05',
    phaseNumber: 5,
    name: 'Fase 05 — Validation',
    status: 'COMPLETED_PASSED',
    passedTests: 38,
    totalTests: 38,
    description:
      'Separación estricta entre Validation y Evidence Sufficiency. Invariantes de parches (hash-locked) y no retroactividad de aprobaciones.',
    verificationEvidence: '38/38 tests superados en src/test/validation.test.ts',
    modules: [
      'validation/validator.ts',
      'validation/patch-invariants.ts',
      'validation/hash-lock.ts',
    ],
  },
  {
    id: 'fase-06',
    phaseNumber: 6,
    name: 'Fase 06 — State Machine',
    status: 'COMPLETED_PASSED',
    passedTests: 50,
    totalTests: 50,
    description:
      'Máquina de estados determinista de Hermes Core: transiciones válidas, persistencia conceptual de checkpoints y rollback de estado.',
    verificationEvidence: '50/50 tests superados en src/test/state-machine.test.ts',
    modules: ['core/state-machine.ts', 'core/transitions.ts', 'core/checkpoint.ts'],
  },
  {
    id: 'fase-07',
    phaseNumber: 7,
    name: 'Fase 07 — Persistencia, Checkpoints y Recovery',
    status: 'ROADMAP',
    passedTests: 0,
    totalTests: 35,
    description:
      'Persistencia real en base de datos transaccional (state.db / SQLite / PostgreSQL), serialización de grafos de tareas y recuperación de fallos catastróficos.',
    verificationEvidence: 'En especificación. Prerrequisito para ejecución prolongada.',
    modules: ['storage/persistence.ts', 'storage/recovery-engine.ts'],
  },
  {
    id: 'fase-08',
    phaseNumber: 8,
    name: 'Fase 08 — Ejecución Real y Sandbox',
    status: 'ROADMAP',
    passedTests: 0,
    totalTests: 45,
    description:
      'Reemplazo de la ejecución simulada en src/audit/execution-engine.ts por un Sandbox aislado real (contenedores gVisor / nsjail / WASM) para shell, red y filesystem.',
    verificationEvidence: 'CRÍTICA: Reemplaza SIMULATED por REAL con evidencia verificable.',
    modules: ['sandbox/runner.ts', 'sandbox/isolation-gate.ts', 'audit/real-execution.ts'],
  },
  {
    id: 'fase-09',
    phaseNumber: 9,
    name: 'Fase 09 — Abstracción AIProvider e Integración Multimodelo',
    status: 'ROADMAP',
    passedTests: 0,
    totalTests: 30,
    description:
      'Capa AIProvider agnóstica de proveedores (NVIDIA, Gemini, OpenAI, Anthropic, Local) subordinada estrictamente al gobierno de Hermes Core.',
    verificationEvidence: 'Aislamiento de proveedores sin acoplamiento al core.',
    modules: [
      'providers/ai-provider.ts',
      'providers/gemini.ts',
      'providers/nvidia.ts',
      'providers/openai.ts',
    ],
  },
  {
    id: 'fase-10',
    phaseNumber: 10,
    name: 'Fase 10 — Backend y Rutas API',
    status: 'ROADMAP',
    passedTests: 0,
    totalTests: 25,
    description:
      'Servidor Express/Node completo para APIs de gobierno, invocación de herramientas en sandbox y streaming de eventos.',
    verificationEvidence: 'server.ts verificado integralmente con suite e2e.',
    modules: ['server.ts', 'api/routes.ts', 'api/middleware.ts'],
  },
  {
    id: 'fase-11',
    phaseNumber: 11,
    name: 'Fase 11 — Frontend y Consola Operacional',
    status: 'IN_DEVELOPMENT',
    passedTests: 20,
    totalTests: 20,
    description:
      'Consola de ingeniería, observabilidad en tiempo real, cockpit de arquitectura y visualización epistemológica.',
    verificationEvidence: 'Interfaz interactiva de gobernanza de Hermes activa.',
    modules: ['src/App.tsx', 'src/components/*'],
  },
];
