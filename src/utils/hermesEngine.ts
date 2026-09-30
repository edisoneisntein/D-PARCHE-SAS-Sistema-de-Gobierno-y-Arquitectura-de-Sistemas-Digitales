/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  DecisionParameters,
  DecisionResult,
  CritiqueResult,
  DecisionVerdict,
} from '../types/hermes';

export function evaluateArchitectureDecision(params: DecisionParameters): DecisionResult {
  const {
    problemName,
    determinismRequired,
    latencySensitivity,
    costBudgetSensitivity,
    securityRiskSideEffects,
    autonomyRequired,
    multiPartyCoordination,
    failureTolerance,
  } = params;

  let verdict: DecisionVerdict = 'NO_AGENT_NEEDED';
  let verdictTitle = '';
  let summary = '';
  const technicalJustification: string[] = [];
  const contraindications: string[] = [];
  const recommendedComponents: string[] = [];

  // Decision logic following Hermes Sections 6, 7 & 8
  const prefersDeterministic = determinismRequired >= 7 || failureTolerance <= 3;
  const isHighRisk = securityRiskSideEffects >= 7;
  const needsCoordination = multiPartyCoordination >= 7;
  const needsAutonomy = autonomyRequired >= 6;
  const isCostSensitive = costBudgetSensitivity >= 7 || latencySensitivity >= 7;

  if (prefersDeterministic && (!needsAutonomy || isHighRisk) && !needsCoordination) {
    verdict = 'NO_AGENT_NEEDED';
    verdictTitle = 'NO SE NECESITA UN AGENTE (Software Tradicional / Workflow Determinista)';
    summary = `Para el problema "${problemName || 'Análisis'}", introducir un agente de IA sería una decisión de ingeniería contraproducente, costosa y frágil. Los requisitos exigen determinismo estricto (${determinismRequired}/10) y bajo perfil de error.`;
    technicalJustification.push(
      'La probabilidad de fallo estocástico de un LLM es inaceptable cuando se requiere determinismo matemático o de reglas de negocio.',
      'Un software estructurado (TypeScript/Go/SQL) ofrece latencia de microsegundos frente a segundos de inferencia.',
      'El costo de computación determinista es órdenes de magnitud inferior a la inferencia recurrente de modelos de lenguaje.',
      'La verificabilidad mediante suites de tests (unit/integration) es 100% reproducible en código determinista.'
    );
    contraindications.push(
      'Evitar frameworks de agentes (LangChain, AutoGen, CrewAI) para problemas de cómputo determinista o pipelines lineales.',
      'No delegar validaciones de esquemas o cálculos financieros a prompts de lenguaje natural.'
    );
    recommendedComponents.push(
      'Motor de Reglas Determinista / AST Parser',
      'API REST / gRPC fuertemente tipada con validación Zod',
      'Base de datos relacional con restricciones ACID',
      'Pipeline de ejecución en lote con transacciones atómicas'
    );
  } else if (needsAutonomy && !needsCoordination && !isHighRisk) {
    verdict = 'SINGLE_AGENT_SUFFICIENT';
    verdictTitle = 'UN AGENTE ES SUFICIENTE (Autonomía Acotada y Gobernada)';
    summary = `Se requiere razonamiento heurístico adaptativo (${autonomyRequired}/10), pero la coordinación entre múltiples entidades no está justificada (${multiPartyCoordination}/10). Un único agente gobernado bajo sandbox minimiza complejidad.`;
    technicalJustification.push(
      'Un solo agente con prompt estructurado y herramientas gobernadas reduce el riesgo de bucles de retroalimentación infinita.',
      'La latencia y el coste por invocación se mantienen dentro de límites predecibles y auditables.',
      'El espacio de depuración se mantiene acotado: existe un único contexto de ejecución y un único actor responsable.'
    );
    contraindications.push(
      'No dividir la tarea en múltiples agentes si un solo agente con schema de llamadas a herramientas bien definido resuelve el problema.',
      'Prohibir que el agente tenga acceso a shell o APIs mutantes sin un Execution Gate intermedio.'
    );
    recommendedComponents.push(
      'Agente único con Context Window optimizado',
      'Herramientas gobernadas (Tool Registry con esquemas JSON-Schema)',
      'Execution Gate con confirmación de políticas de Hermes',
      'Monitor de presupuesto de tokens y temporizador de terminación'
    );
  } else if (needsCoordination && needsAutonomy && !isCostSensitive) {
    verdict = 'MULTI_AGENT_REQUIRED';
    verdictTitle = 'SISTEMA MULTIAGENTE (Especialización, Arbitraje y Coordinación Formal)';
    summary = `El problema requiere múltiples dominios de especialización autónomos y negociación entre roles distintos (${multiPartyCoordination}/10). Requiere protocolo de arbitraje estricto en Hermes Core para evitar deadlocks.`;
    technicalJustification.push(
      'Diferenciación ontológica real de competencias (ej: un agente generador adversarial y un agente auditor forense con metas contrapuestas).',
      'Aislamiento de contextos cognitivos para prevenir contaminación de instrucciones.',
      'Capacidad de orquestar flujos no lineales donde agentes independientes producen artefactos intermedios verificables.'
    );
    contraindications.push(
      'ALERTA CRÍTICA: Multiagente multiplica el consumo de tokens y la latencia por cada ronda de negociación.',
      'Riesgo severo de consensos alucinatorios (dos agentes validando errores mutuos sin anclaje en pruebas reales).',
      'Hermes Core DEBE imponer límite máximo de rondas (ej: máx 4) y actuar como juez supremo.'
    );
    recommendedComponents.push(
      'Agente Especialista A + Agente Especialista B (con roles disjuntos)',
      'Bus de Mensajes Tipado y Auditado (Hermes State Machine)',
      'Árbitro Determinista Central de Hermes (detector de bucles y consenso)',
      'Sandbox individual por agente para evitar interferencias cruzadas'
    );
  } else {
    verdict = 'HYBRID_SYSTEM_REQUIRED';
    verdictTitle = 'ARQUITECTURA HÍBRIDA (Humano + Software Determinista + Agente Gobernado)';
    summary = `Equilibrio óptimo para sistemas digitales complejos de alta criticidad: Software determinista para ejecución y verificación, Agente de IA para síntesis y propuesta, y Operador Humano en las aprobaciones críticas.`;
    technicalJustification.push(
      'Preserva el principio maestro de Hermes: los componentes que ejecutan no son la autoridad del sistema.',
      'Garantiza que ningún efecto secundario irreversible ocurra sin validación criptográfica o supervisión humana.',
      'Combina la agilidad interpretativa de los LLMs con la robustez y bajo costo del código tradicional.'
    );
    contraindications.push(
      'No permitir que la parte agéntica omita los invariantes de validación del software determinista.',
      'No asumir que la aprobación humana automática ("rubber stamping") sustituye a las suites de pruebas automatizadas.'
    );
    recommendedComponents.push(
      'Núcleo Determinista de Estado (State Machine + Policy Engine de Hermes)',
      'Sub-agente de análisis semántico (AIProvider desacoplado)',
      'Sandbox de contención para ejecución de scripts (gVisor / Docker)',
      'Gate de Aprobación Humana / Hash-locked tokens para cambios críticos'
    );
  }

  return {
    verdict,
    verdictTitle,
    architectureSummary: summary,
    technicalJustification,
    contraindications,
    recommendedComponents,
    tradeoffs: {
      determinism: determinismRequired >= 7 ? 'Crítico (100% exigido)' : 'Heurístico admisible',
      cost: costBudgetSensitivity >= 7 ? 'Bajo presupuesto (minimizar tokens)' : 'Tolerante a inferencia',
      latency: latencySensitivity >= 7 ? 'Baja latencia requerida (<200ms)' : 'Asíncrono tolerable',
      verifiability: 'Requiere evidencia tangible y repetible (Sección 12)',
      safetyRisk: isHighRisk ? 'Alto impacto destructivo: Sandbox obligatorio' : 'Bajo impacto colateral'
    }
  };
}

export function critiqueArchitectureProposal(proposal: string): CritiqueResult {
  const pLower = proposal.toLowerCase();

  const detectedAntiPatterns: string[] = [];
  const priorityViolations: string[] = [];
  const requiredRemediations: string[] = [];
  const unforgivingAnalysis: string[] = [];

  let verdict: 'RECHAZADO' | 'CORRECCION_OBLIGATORIA' | 'APROBADO_CON_CONDICIONES' = 'APROBADO_CON_CONDICIONES';
  let score = 85;

  // Check 1: Agent direct DB access / bypass gates
  if (
    (pLower.includes('directa') || pLower.includes('directo') || pLower.includes('sin pasar') || pLower.includes('autónomo')) &&
    (pLower.includes('base de datos') || pLower.includes('db') || pLower.includes('sql') || pLower.includes('mutación'))
  ) {
    verdict = 'RECHAZADO';
    score = 15;
    detectedAntiPatterns.push('Acceso directo de agente de IA a base de datos mutacional sin Execution Gate.');
    priorityViolations.push('Violación P0 de Seguridad (Sección 10, 15, 21): Hermes Core debe gobernar toda mutación.');
    unforgivingAnalysis.push(
      'Un LLM es un componente estocástico y probabilístico. Darle credenciales de escritura directa en bases de datos es un fallo arquitectónico severo (vulnerabilidad de inyección indirecta de prompt, borrado accidental o corrupción de integridad referencial).',
      'En Hermes, los agentes proponen cambios estructurados; Hermes Core evalúa la política, verifica esquemas, sanitiza y ejecuta bajo una transacción atómica.'
    );
    requiredRemediations.push(
      'Interponer un Execution Gate gobernado por el Policy Engine de Hermes.',
      'Forzar que el agente emita un AST o un Patch tipado con firma SHA-256.',
      'Requerir aprobación y ejecución en sandbox con rollback automático en caso de fallo.'
    );
  }

  // Check 2: Multi-agent hype for trivial problems
  if (
    (pLower.includes('7 agentes') || pLower.includes('5 agentes') || pLower.includes('múltiples agentes') || pLower.includes('en bucle')) &&
    (pLower.includes('calculadora') || pLower.includes('simple') || pLower.includes('infinitas') || pLower.includes('consenso'))
  ) {
    verdict = 'RECHAZADO';
    score = 25;
    detectedAntiPatterns.push('Hiper-agentificación injustificada (Over-agentification) y bucles no convergentes.');
    priorityViolations.push('Violación de Arquitectura y Utilidad (Sección 7): "Hermes debe poder decidir NO USAR AGENTES".');
    unforgivingAnalysis.push(
      'Proponer una constelación de agentes comunicándose en bucles para resolver tareas estructuradas es una fantasía de complejidad innecesaria. Multiplica el coste de tokens por 10x o 50x, introduce latencia intolerable y produce alucinaciones cruzadas.',
      'Una calculadora de impuestos o un cálculo aritmético exige software determinista en código estándar, no agentes charlando entre sí.'
    );
    requiredRemediations.push(
      'Sustituir la orquestación multiagente por un módulo de software tradicional con pruebas unitarias deterministas.',
      'Si se requiere razonamiento, acotarlo a un único agente con esquema JSON estricto y límite de 1 turno.'
    );
  }

  // Check 3: Claiming 2000 skills / manifest = reality
  if (
    (pLower.includes('2.000') || pLower.includes('2000') || pLower.includes('1.900') || pLower.includes('1900') || pLower.includes('manifest')) &&
    (pLower.includes('listas') || pLower.includes('dispone') || pLower.includes('promocionar') || pLower.includes('afirmar'))
  ) {
    verdict = 'RECHAZADO';
    score = 10;
    detectedAntiPatterns.push('Falacia Epistemológica: Confundir entradas de manifest con capacidades listas para producción.');
    priorityViolations.push('Violación flagrante de la Sección 12, 14 y 30: "1900+ = CLAIM_UNVERIFIED". Regla absoluta sobre el estado.');
    unforgivingAnalysis.push(
      'La auditoría forense demostró un universo local de 125 capacidades, de las cuales solo 43 están instaladas y únicamente 25 están verificadas mediante SKILL.md.',
      'Declarar que 1.900 o 2.000 capacidades están "listas para producción" es una falsedad sin evidencia verificable. Destruye la credibilidad del sistema y viola el principio epistemológico fundacional de Hermes.'
    );
    requiredRemediations.push(
      'Etiquetar cualquier catálogo no demostrado como CLAIM_UNVERIFIED hasta auditoría forense reproducible.',
      'Presentar únicamente las 25 capacidades verificadas como disponibles y las 18 parciales con advertencia explícita.'
    );
  }

  // Check 4: General hygiene checks
  if (pLower.includes('sin sandbox') || (pLower.includes('ejecutar') && pLower.includes('shell') && !pLower.includes('sandbox'))) {
    if (verdict !== 'RECHAZADO') verdict = 'CORRECCION_OBLIGATORIA';
    score = Math.min(score, 40);
    detectedAntiPatterns.push('Ejecución de efectos secundarios en host sin contenedor de aislamiento (Sandbox).');
    priorityViolations.push('Violación de Seguridad (Sección 15): "El sandbox es una frontera de seguridad innegociable".');
    unforgivingAnalysis.push(
      'Cualquier comando shell, acceso a red o escritura a filesystem que se ejecute fuera de un sandbox expone el host del sistema a corrupción de archivos o exfiltración de credenciales.'
    );
    requiredRemediations.push('Implementar gVisor/Docker/WASM isolation gate antes de ejecutar la acción.');
  }

  if (pLower.includes('llm decide') || pLower.includes('llm apruebe') || pLower.includes('llm como autoridad')) {
    if (verdict !== 'RECHAZADO') verdict = 'CORRECCION_OBLIGATORIA';
    score = Math.min(score, 35);
    detectedAntiPatterns.push('Transferencia de autoridad soberana a un modelo de lenguaje.');
    priorityViolations.push('Violación de Autoridad (Sección 10): "Hermes Core conserva la autoridad; los modelos son subordinados".');
    unforgivingAnalysis.push(
      'Un LLM puede proponer o clasificar, pero NUNCA puede ser la autoridad final de aprobación de estado o de políticas.'
    );
    requiredRemediations.push('El aprobador debe ser Hermes Core determinista o el operador humano con firma de hash.');
  }

  // Clean / well-architected case
  if (detectedAntiPatterns.length === 0) {
    verdict = 'APROBADO_CON_CONDICIONES';
    score = 92;
    unforgivingAnalysis.push(
      'La propuesta respeta la jerarquía de prioridades: corrección → evidencia → seguridad → arquitectura → utilidad → velocidad.',
      'Se mantiene el desacoplamiento entre componentes de ejecución y reglas de gobierno.',
      'El uso de validación de esquemas Zod y sandboxes cumple con el Contrato de Arquitectura V1.'
    );
    requiredRemediations.push(
      'Asegurar que los tokens de aprobación se aten criptográficamente al hash SHA-256 del código generado.',
      'Garantizar que ningún contenido del proyecto llegue al LLM sin pasar por el módulo de sanitización de secretos.'
    );
  }

  const summary =
    verdict === 'RECHAZADO'
      ? 'PROPUESTA RECHAZADA: Viola invariantes críticas de seguridad, epistemología o arquitectura de Hermes.'
      : verdict === 'CORRECCION_OBLIGATORIA'
      ? 'CORRECCIÓN TÉCNICA OBLIGATORIA: Contiene suposiciones de riesgo o falta de contención que deben remediarse antes de proceder.'
      : 'PROPUESTA TÉCNICAMENTE SÓLIDA: Alineada con los principios del Documento Maestro V1.';

  return {
    verdict,
    confidenceScore: score,
    summary,
    unforgivingAnalysis,
    detectedAntiPatterns,
    priorityViolations,
    requiredRemediations,
    sourceReference: 'Documento Maestro de Continuidad V1.0 (Secciones 1, 7, 10, 12, 15, 21)'
  };
}
