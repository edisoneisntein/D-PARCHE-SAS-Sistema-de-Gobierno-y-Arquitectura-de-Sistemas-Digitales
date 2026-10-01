/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { MacroCyclePhase } from '../../types/hermes';

export const MACRO_CYCLE_PHASES: MacroCyclePhase[] = [
  {
    id: 1,
    name: 'INTENCIÓN',
    category: 'discovery',
    description:
      'Captura pura de la necesidad, visión, problema u origen sin predeterminar la solución técnica.',
    requiredInputs: ['Voz, texto, repo legado, landing page, problema de negocio, etc.'],
    expectedOutputs: ['Documento formal de Intención canonizado y firmado'],
    governanceGates: ['Verificación de que no se ha pre-asumido "una app" o "un agente"'],
    evidenceRequired: ['Hash SHA-256 de la entrada original'],
  },
  {
    id: 2,
    name: 'DESCUBRIMIENTO',
    category: 'discovery',
    description:
      'Exploración del dominio, capacidades disponibles, dependencias existentes y datos precursores.',
    requiredInputs: ['Documento de Intención', 'Catálogo de capacidades auditable'],
    expectedOutputs: ['Matriz de capacidades requeridas vs disponibles (125 universo auditado)'],
    governanceGates: ['Consulta estricta al registro de capacidades para no duplicar'],
    evidenceRequired: ['Informe de auditoría previa'],
  },
  {
    id: 3,
    name: 'REQUISITOS',
    category: 'discovery',
    description:
      'Formalización de requisitos funcionales, no funcionales, industriales, normativos y de seguridad.',
    requiredInputs: ['Resultados de Descubrimiento'],
    expectedOutputs: ['Especificación formal de requisitos con identificadores únicos'],
    governanceGates: ['Aprobación por el operador humano'],
    evidenceRequired: ['Traza de trazabilidad de requisitos hacia la intención'],
  },
  {
    id: 4,
    name: 'CRITERIOS DE ACEPTACIÓN',
    category: 'discovery',
    description:
      'Definición binaria, medible y comprobable de cuándo el sistema se considerará completo y correcto.',
    requiredInputs: ['Especificación de Requisitos'],
    expectedOutputs: ['Checklist de aceptación automatizable'],
    governanceGates: ['Cada criterio debe tener un método de prueba no basado en LLM libre'],
    evidenceRequired: ['Firmas de aserción técnica'],
  },
  {
    id: 5,
    name: 'INVARIANTES',
    category: 'discovery',
    description:
      'Postulados matemáticos y de seguridad que NINGUNA ejecución posterior tiene permiso de romper.',
    requiredInputs: ['Requisitos', 'Criterios de Aceptación'],
    expectedOutputs: ['Matriz de invariantes inmutables (ej: no secretos a logs, hash-lock)'],
    governanceGates: ['Verificación de integridad por el Policy Engine de Hermes Core'],
    evidenceRequired: ['Definiciones formales en Domain Types'],
  },
  {
    id: 6,
    name: 'AMENAZAS / SEGURIDAD',
    category: 'discovery',
    description:
      'Modelado de amenazas STRIDE, análisis de frontera de secretos, egress y vectores de inyección.',
    requiredInputs: ['Invariantes', 'Topología tentativa'],
    expectedOutputs: ['Threat Model V1', 'Requisitos de Sandbox y Sanitización'],
    governanceGates: ['Revisión del Secret Boundary + Egress Gate'],
    evidenceRequired: ['Informe de escaneo de vectores de ataque'],
  },
  {
    id: 7,
    name: 'ARQUITECTURA',
    category: 'architecture',
    description:
      'Decisión fundacional: Software tradicional, agente único, multiagente o híbrido humano+software+agentes.',
    requiredInputs: ['Requisitos', 'Invariantes', 'Threat Model'],
    expectedOutputs: ['Architecture Contract con justificación formal'],
    governanceGates: ['Evaluador de "¿Se necesita un agente?" aplicado'],
    evidenceRequired: ['Puntuación formal de determinismo, latencia, costo y riesgo'],
  },
  {
    id: 8,
    name: 'DISEÑO DEL SISTEMA',
    category: 'architecture',
    description:
      'Topología de servicios, APIs, fronteras modulares, buses de comunicación y dependencias.',
    requiredInputs: ['Architecture Contract'],
    expectedOutputs: ['Diagramas de arquitectura de software y esquemas de interfaces'],
    governanceGates: ['Validación de desacoplamiento de AIProvider'],
    evidenceRequired: ['Especificaciones OpenAPI / Protobuf / Tipos'],
  },
  {
    id: 9,
    name: 'DISEÑO DE AGENTES (SI APLICA)',
    category: 'architecture',
    description:
      'Ingeniería de agentes unitarios: rol, propósito, permisos, memoria, routing, sandbox y terminación.',
    requiredInputs: ['Diseño del Sistema (si veredicto incluye agentes)'],
    expectedOutputs: ['Especificación de Agentes con límites estrictos de autonomía'],
    governanceGates: ['Los agentes NO deben poseer permisos de auto-otorgación de tools'],
    evidenceRequired: ['Manifest de gobierno de agentes'],
  },
  {
    id: 10,
    name: 'DISEÑO MULTIAGENTE (SI APLICA)',
    category: 'architecture',
    description:
      'Protocolos de coordinación, consenso, arbitraje, detección de bucles y tolerancia a fallos.',
    requiredInputs: ['Especificación de Agentes'],
    expectedOutputs: ['Grafo de coordinación multiagente y monitor de bucles infinitos'],
    governanceGates: ['Límite formal de rondas de interacción y presupuesto de tokens'],
    evidenceRequired: ['Simulación de protocolos de arbitraje'],
  },
  {
    id: 11,
    name: 'MODELO DE DATOS',
    category: 'architecture',
    description:
      'Esquemas relacionales, de documentos, persistencia de checkpoints y registros de auditoría.',
    requiredInputs: ['Diseño de Sistema y Agentes'],
    expectedOutputs: ['Esquemas DDL/ORM con restricciones de integridad referencial'],
    governanceGates: ['Prohibición de originalContent en tablas de dominio general'],
    evidenceRequired: ['Migraciones validadas y firmas de esquema'],
  },
  {
    id: 12,
    name: 'PLANIFICACIÓN',
    category: 'architecture',
    description:
      'Descomposición en tareas verificables, dependencias ordenadas y estimación de fases.',
    requiredInputs: ['Todos los entregables de diseño'],
    expectedOutputs: ['DAG de ejecución de tareas con puertas de prueba'],
    governanceGates: ['Verificación de recursos y cuotas de inferencia'],
    evidenceRequired: ['Plan de construcción congelado'],
  },
  {
    id: 13,
    name: 'APROBACIÓN',
    category: 'implementation',
    description:
      'Firma criptográfica del operador humano o Hermes Core sobre el diseño antes de escribir código.',
    requiredInputs: ['Plan de construcción y hash de arquitectura'],
    expectedOutputs: ['Token de aprobación SHA-256 vinculado a targetId y targetHash'],
    governanceGates: ['No existe aprobación retroactiva'],
    evidenceRequired: ['Firma en state.db / audit trail'],
  },
  {
    id: 14,
    name: 'IMPLEMENTACIÓN',
    category: 'implementation',
    description:
      'Construcción de código, generación de componentes, configuración de providers y pruebas.',
    requiredInputs: ['Aprobación firmada', 'Especificaciones congeladas'],
    expectedOutputs: ['Código fuente, parches de modificación'],
    governanceGates: ['Filtro de sanitización y secret scanner en cada archivo modificado'],
    evidenceRequired: ['Commit hash y diff validado'],
  },
  {
    id: 15,
    name: 'BUILD',
    category: 'implementation',
    description: 'Compilación estricta sin tolerar advertencias silenciadas ni tipos anómalos.',
    requiredInputs: ['Código fuente'],
    expectedOutputs: ['Artefactos de build limpios (dist, binaries, bundles)'],
    governanceGates: ['tsc --noEmit y empaquetado sin errores'],
    evidenceRequired: ['Logs de compilación auditables'],
  },
  {
    id: 16,
    name: 'TESTING',
    category: 'implementation',
    description:
      'Ejecución de suites unitarias, de integración, de frontera de secretos y de contrato.',
    requiredInputs: ['Artefactos construidos'],
    expectedOutputs: ['Reporte de pruebas con 100% de aserciones críticas aprobadas'],
    governanceGates: ['PASSED requiere ejecución real (no simulada)'],
    evidenceRequired: ['Resultados de test runner con código de salida 0'],
  },
  {
    id: 17,
    name: 'EVALUACIÓN',
    category: 'implementation',
    description:
      'Benchmarking de latencia, coste, fidelidad semántica y cumplimiento de invariantes.',
    requiredInputs: ['Métricas de testing y telemetría'],
    expectedOutputs: ['Scorecard multidimensional del sistema'],
    governanceGates: ['Cumplimiento de presupuestos de latencia y costo'],
    evidenceRequired: ['Matriz de métricas operacionales'],
  },
  {
    id: 18,
    name: 'AUDITORÍA',
    category: 'implementation',
    description:
      'Revisión forense independiente de seguridad, licencias, fugas de secretos y permisos excesivos.',
    requiredInputs: ['Artefactos y traza de pruebas'],
    expectedOutputs: ['Reporte de auditoría de seguridad'],
    governanceGates: ['Cero secretos detectados, cero permisos sin sandbox'],
    evidenceRequired: ['Firma del auditor de Hermes'],
  },
  {
    id: 19,
    name: 'REMEDIACIÓN',
    category: 'implementation',
    description:
      'Corrección inmediata y acotada de cualquier hallazgo de auditoría o falla de prueba.',
    requiredInputs: ['Hallazgos de auditoría'],
    expectedOutputs: ['Parches correctivos con nuevo hash de aprobación'],
    governanceGates: ['Cualquier cambio invalida la aprobación anterior del patch'],
    evidenceRequired: ['Diff de remediación trazable al hallazgo'],
  },
  {
    id: 20,
    name: 'REVALIDACIÓN',
    category: 'implementation',
    description: 'Re-ejecución integral de suites para garantizar ausencia de regresiones.',
    requiredInputs: ['Parches aplicados'],
    expectedOutputs: ['Certificado de revalidación limpia'],
    governanceGates: ['Todas las suites anteriores deben volver a pasar sin excepciones'],
    evidenceRequired: ['Logs de revalidación fresca'],
  },
  {
    id: 21,
    name: 'RELEASE',
    category: 'release',
    description:
      'Empaquetado inmutable, versionado semántico formal y generación de manifiesto de release.',
    requiredInputs: ['Certificado de revalidación'],
    expectedOutputs: ['Release tarball / imagen de contenedor firmada'],
    governanceGates: ['Alineación con SemVer y SBOM completo'],
    evidenceRequired: ['Digest SHA-256 inmutable de la imagen'],
  },
  {
    id: 22,
    name: 'DESPLIEGUE',
    category: 'release',
    description:
      'Promoción a infraestructura productiva mediante despliegue canario o blue/green con rollback automático.',
    requiredInputs: ['Artefacto de Release'],
    expectedOutputs: ['Endpoints productivos en vivo'],
    governanceGates: ['Health check afirmativo y sonda de arranque superada'],
    evidenceRequired: ['Telemetría de despliegue en vivo'],
  },
  {
    id: 23,
    name: 'OPERACIÓN',
    category: 'operation',
    description:
      'Ejecución productiva con gobierno continuo de cuotas, concurrencia y límites de seguridad.',
    requiredInputs: ['Sistema desplegado'],
    expectedOutputs: ['Servicio respondiendo a tráfico real'],
    governanceGates: ['Circuits breakers activos ante desbordamiento'],
    evidenceRequired: ['Métricas de disponibilidad en tiempo real'],
  },
  {
    id: 24,
    name: 'OBSERVABILIDAD',
    category: 'operation',
    description:
      'Trazas distribuidas, métricas de error, consumo de tokens y auditoría forense en vivo.',
    requiredInputs: ['Telemetría de operación'],
    expectedOutputs: ['Dashboards operacionales y alertas proactivas'],
    governanceGates: ['Sanitización de logs en tiempo real (cero secretos a stdout)'],
    evidenceRequired: ['Stream de eventos de observabilidad'],
  },
  {
    id: 25,
    name: 'MANTENIMIENTO',
    category: 'operation',
    description:
      'Actualización de dependencias, rotación de secretos y parches preventivos de estabilidad.',
    requiredInputs: ['Alertas de observabilidad y CVEs'],
    expectedOutputs: ['Actualizaciones controladas sin caída de servicio'],
    governanceGates: ['Misma rigurosidad de testeo que en el ciclo original'],
    evidenceRequired: ['Registro de mantenimientos programados'],
  },
  {
    id: 26,
    name: 'EVOLUCIÓN',
    category: 'operation',
    description:
      'Incorporación de nuevas intenciones, capacidades o arquitecturas preservando invariantes.',
    requiredInputs: ['Nueva intención o cambio de entorno'],
    expectedOutputs: ['Re-inicio del Ciclo Maestro en la fase correspondiente'],
    governanceGates: ['Compatibilidad hacia atrás o migración formal aprobada'],
    evidenceRequired: ['Historial de evolución en state.db'],
  },
];
