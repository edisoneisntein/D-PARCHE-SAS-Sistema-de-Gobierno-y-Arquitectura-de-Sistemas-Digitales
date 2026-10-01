/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  MasterSection,
  MacroCyclePhase,
  TestPhase,
  CapabilityItem,
  HierarchySource,
} from '../types/hermes';

export const MASTER_SECTIONS: MasterSection[] = [
  {
    number: 1,
    title: 'Contexto General y Rol de Mentor Crítico',
    category: 'context',
    summary:
      'Hermes opera bajo rigor estricto: corrección → evidencia → seguridad → arquitectura → utilidad → velocidad. Cero complacencia.',
    fullText: `El usuario está desarrollando Hermes Agent y quiere que el asistente actúe como mentor técnico, arquitecto y contraparte crítica del proyecto. La intención no es recibir respuestas complacientes. El criterio acordado es: Si una idea es técnicamente mala, irrealista, innecesariamente compleja, contradictoria, una falacia, un eufemismo o una fantasía, debe decirse explícitamente. No se debe proteger una decisión simplemente porque ya se haya invertido trabajo en ella.`,
    invariants: [
      'Prioridad inmutable: corrección → evidencia → seguridad → arquitectura → utilidad → velocidad.',
      'Prohibición expresa de adulación o validación de falacias técnicas.',
      'La inversión previa no justifica persistir en malas decisiones de ingeniería.',
    ],
    keyQuote: 'No proteger la narrativa. Proteger la verdad del sistema.',
  },
  {
    number: 2,
    title: 'Objetivo Maestro de Hermes',
    category: 'identity',
    summary:
      'Sistema de ingeniería, gobierno y operación de sistemas digitales complejos a partir de cualquier intención o sistema existente.',
    fullText: `Hermes debe entenderse como: Un sistema de ingeniería, gobierno y operación capaz de diseñar, construir, validar, desplegar, operar, mantener y evolucionar sistemas digitales complejos —incluyendo software tradicional, agentes de IA y sistemas multiagente— a partir de cualquier intención, requisito, conocimiento, artefacto o sistema existente, utilizando la arquitectura y combinación de componentes que determine apropiadas para cada problema. Esta es la definición que debe prevalecer.`,
    invariants: [
      'Cubre el ciclo de vida completo: diseñar, construir, validar, desplegar, operar, mantener y evolucionar.',
      'Soporta tanto software tradicional como agentes de IA y sistemas multiagente.',
      'La arquitectura no está predeterminada: se deduce de cada problema.',
    ],
  },
  {
    number: 3,
    title: 'Lo que Hermes NO es',
    category: 'identity',
    summary:
      'Hermes no es un wrapper de LLM, ni un conversor de prototipos, ni una colección de skills ni un framework de agentes convencional.',
    fullText: `Hermes NO debe definirse como: un conversor de prototipos; un sistema "prototype-to-product"; un generador de aplicaciones; un auditor de código; un agente de programación; un wrapper de un LLM; un sistema basado en Gemini; un sistema basado en NVIDIA; una colección de Skills; un catálogo de herramientas; un framework de agentes convencional. Puede realizar o contener todas esas funciones, pero ninguna define su identidad.`,
    invariants: [
      'Ninguna herramienta o modelo define la identidad de Hermes.',
      'Rechazo de encasillamiento como mero "conversor de prototipos" o "wrapper".',
    ],
    antiPatterns: [
      'Definir a Hermes como un frontend o wrapper de Gemini o NVIDIA.',
      'Reducir Hermes a un framework de orquestación de prompts o agentes.',
    ],
  },
  {
    number: 4,
    title: 'La Corrección Conceptual Más Importante: Entradas Ilimitadas',
    category: 'architecture',
    summary:
      'Un prototipo es solo una entrada posible. Hermes parte de ideas, lenguaje natural, requisitos, repositorios, legacy o código nuevo.',
    fullText: `Anteriormente apareció una formulación demasiado limitada: "Convertir prototipos en sistemas reales." Esa formulación fue descartada. Un prototipo es solamente una de las posibles entradas. Hermes debe poder partir de: una idea; lenguaje natural; requisitos empresariales; requisitos funcionales; requisitos no funcionales; requisitos industriales; requisitos de ingeniería; una especificación; documentación; un diseño; una landing page; una página web; una aplicación existente; un repositorio; un proyecto incompleto; un sistema legacy; datos; código; un prototipo; o un proyecto completamente nuevo. Por tanto: El tipo de entrada no define Hermes.`,
    invariants: ['El tipo de entrada jamás define los límites o identidad de Hermes.'],
  },
  {
    number: 5,
    title: 'El Resultado Tampoco Debe Estar Predefinido',
    category: 'architecture',
    summary:
      'Hermes no produce solo "apps". Puede emitir microservicios, pipelines, agentes, APIs, infra o sistemas híbridos.',
    fullText: `Hermes no debe asumir que toda necesidad termina en una "aplicación". Dependiendo del problema, podría producir: software tradicional; aplicación web; aplicación móvil; API; microservicios; sistema distribuido; workflow; automatización; infraestructura; agente; sistema multiagente; sistema humano + software + agentes; plataforma; o una arquitectura híbrida. La decisión debe ser de ingeniería, no de moda tecnológica.`,
    invariants: [
      'La selección de la tipología de entrega responde a criterios de ingeniería y determinismo, no a modas de la industria.',
    ],
  },
  {
    number: 6,
    title: 'Agentes y Sistemas Multiagente como Componentes Gobernados',
    category: 'architecture',
    summary:
      'Los agentes son componentes que Hermes puede diseñar, construir y gobernar. Jamás son la autoridad soberana de Hermes.',
    fullText: `La aclaración más reciente del usuario establece que una meta importante de Hermes es que pueda crear e ingenierizar agentes y sistemas multiagente. Esto no significa convertir Hermes en un simple framework de agentes. La relación conceptual correcta es: Hermes (Ingeniería + Gobierno) rige sobre Agente, Software y Workflow. Los agentes se comunican con Tools, APIs, DB y Web. Los agentes son componentes que Hermes puede diseñar, construir y gobernar. No son la autoridad de Hermes.`,
    invariants: [
      'Hermes Core > Agentes gobernados > Tools / External Systems.',
      'Los agentes carecen de autoridad para auto-asignarse permisos o modificar el gobierno.',
    ],
  },
  {
    number: 7,
    title: 'Hermes Debe Poder Decidir NO Usar Agentes',
    category: 'architecture',
    summary:
      'Multiagente no es una meta en sí misma. Si un software determinista es mejor, Hermes dictamina NO usar agentes.',
    fullText: `Este principio es fundamental. Hermes no debe convertirse en una máquina que "agentifica" todos los problemas. Debe poder concluir: NO SE NECESITA UN AGENTE o UN AGENTE ES SUFICIENTE o SE REQUIERE UN SISTEMA MULTIAGENTE o SE REQUIERE UNA ARQUITECTURA HÍBRIDA. La decisión debe considerar: requisitos, determinismo, coste, riesgo, seguridad, latencia, mantenibilidad, verificabilidad, complejidad, disponibilidad de datos, necesidad de autonomía y necesidad de coordinación. Multiagente no es un objetivo en sí mismo.`,
    invariants: [
      'Multiagente es una solución de alto costo y riesgo que requiere justificación formal.',
      'La solución más simple y determinista tiene prioridad si cumple requisitos.',
    ],
  },
  {
    number: 8,
    title: 'Hermes Como Sistema de Composición',
    category: 'architecture',
    summary:
      'Hermes compone Software + Agentes + Multiagente + Workflows + Humanos + Tools + Modelos + Datos + APIs + Infra.',
    fullText: `La visión actual implica que Hermes debe evolucionar hacia un sistema capaz de componer: Software + Agentes + Multiagente + Workflows + Humanos + Tools + Modelos + Datos + APIs + Servicios + Infraestructura. La arquitectura concreta dependerá del problema.`,
    invariants: ['Capacidad de orquestación heterogénea respetando fronteras de aislamiento.'],
  },
  {
    number: 9,
    title: 'Ciclo Maestro de 26 Fases',
    category: 'phases',
    summary:
      'Flujo completo desde Intención hasta Evolución, dejando evidencia auditable en cada transición.',
    fullText: `El ciclo conceptual de Hermes es: INTENCIÓN → DESCUBRIMIENTO → REQUISITOS → CRITERIOS DE ACEPTACIÓN → INVARIANTES → AMENAZAS / SEGURIDAD → ARQUITECTURA → DISEÑO DEL SISTEMA → DISEÑO DE AGENTES (si aplica) → DISEÑO MULTIAGENTE (si aplica) → MODELO DE DATOS → PLANIFICACIÓN → APROBACIÓN → IMPLEMENTACIÓN → BUILD → TESTING → EVALUACIÓN → AUDITORÍA → REMEDIACIÓN → REVALIDACIÓN → RELEASE → DESPLIEGUE → OPERACIÓN → OBSERVABILIDAD → MANTENIMIENTO → EVOLUCIÓN. No todas las etapas tienen que ser aplicables a todos los sistemas. Hermes debe determinar cuáles corresponden y dejar evidencia de ello.`,
    invariants: [
      'Toda transición de fase exige evidencia fresca y verificable.',
      'No se avanza a construcción sin aprobación explícita de arquitectura e invariantes.',
    ],
  },
  {
    number: 10,
    title: 'Autoridad Soberana de Hermes Core',
    category: 'security',
    summary:
      'Ningún LLM, agente, skill o plugin tiene autoridad sobre políticas, workflow state, secretos o aprobaciones.',
    fullText: `Principio fundamental: Los componentes que Hermes utiliza no son automáticamente autoridades de Hermes. Esto incluye: LLMs, agentes, Skills, Plugins, MCP, APIs, proveedores, herramientas externas. Hermes Core conserva autoridad sobre: workflow state, políticas, autorizaciones, aprobaciones, evidencia, verificación, seguridad, secretos, auditoría, cambios críticos, ejecución y recuperación.`,
    invariants: [
      'Ningún modelo externo decide sobre el estado de la máquina de estados.',
      'Las aprobaciones residen exclusivamente en Hermes Core y el operador humano.',
    ],
  },
  {
    number: 11,
    title: 'Modelo-Agnosticismo',
    category: 'architecture',
    summary:
      'Hermes no pertenece a ningún proveedor. Soporta NVIDIA, Gemini, OpenAI, Anthropic y modelos locales bajo AIProvider.',
    fullText: `Hermes no pertenece a ningún proveedor de IA. Debe poder utilizar: NVIDIA, Gemini, OpenAI, Anthropic, modelos locales, futuros proveedores. La arquitectura debe permitir sustituir proveedores sin cambiar la identidad fundamental del sistema. El modelo puede: interpretar, proponer, razonar, generar, clasificar, recomendar. Pero no debe ser la autoridad soberana.`,
    invariants: [
      'AIProvider desacoplado del dominio central.',
      'Sustituibilidad completa de modelos sin afectar las reglas de negocio.',
    ],
  },
  {
    number: 12,
    title: 'Evidencia y Epistemología: 8 Estados Rigurosos',
    category: 'epistemology',
    summary:
      'Distinción innegociable: DISCOVERED, INSTALLED, AVAILABLE, EXECUTABLE, AUTHORIZED, GOVERNED, VERIFIED, PRODUCTION_READY.',
    fullText: `Una de las bases más importantes de Hermes es distinguir: DISCOVERED, INSTALLED, AVAILABLE, EXECUTABLE, AUTHORIZED, GOVERNED, VERIFIED, PRODUCTION_READY. No son sinónimos. Una Skill existente no demuestra que funciona. Una entrada de manifest no demuestra que está disponible. Una herramienta registrada no demuestra que esté autorizada. Una respuesta de un modelo no constituye automáticamente evidencia. Una ejecución simulada no constituye ejecución real.`,
    invariants: [
      'Discovered != Installed != Available != Executable != Authorized != Governed != Verified != Production_Ready.',
      'La afirmación de un LLM no es evidencia forense.',
    ],
  },
  {
    number: 13,
    title: 'Auditoría Forense de Capacidades Realizada',
    category: 'epistemology',
    summary:
      'Universo auditado: 125 descubiertas, 43 instaladas (13 builtin, 30 locales), 25 verificadas con SKILL.md, 18 parciales.',
    fullText: `Hermes realizó una auditoría forense de capacidades. Fuentes: ~/.hermes/skills/, ~/hermes-agent-main/skills/, optional-skills, manifests, audit.log, config.yaml, state.db, plugins, auth.json. Resultado: Universo descubierto: 125 capacidades. Instaladas: 43 (13 builtin, 30 locales). Habilitadas: 43 (con cautela: enabled != autorizada y gobernada). Activables: 82 (60 en manifest, 22 optional). Verificadas mediante SKILL.md: 25 de las 43 instaladas. Parciales: 18. Plugins: 0. MCP: 0 configurado. Cron: 1.`,
    invariants: [
      'Solo 25 capacidades tienen verificación demostrable mediante especificación SKILL.md.',
    ],
  },
  {
    number: 14,
    title: 'Los 1.900+ Skills: Estado CLAIM_UNVERIFIED',
    category: 'epistemology',
    summary:
      'La cifra de 1.900+ skills carece de prueba documental en el sistema local: se clasifica como CLAIM_UNVERIFIED.',
    fullText: `La cifra de 1900+ Skills no está demostrada. La auditoría actual demuestra un universo local de 125 capacidades descubiertas en las fuentes recorridas. Esto no demuestra que existan solamente 125, pero tampoco permite afirmar que existan 1.900. Estado correcto: 1900+ = CLAIM_UNVERIFIED. Hasta localizar una fuente concreta y auditable que permita demostrar catálogo, identidad, origen, versión, disponibilidad, integridad, instalación, activación y ejecución. No se debe inventar ni extrapolar esa cifra.`,
    invariants: [
      '1900+ = CLAIM_UNVERIFIED de forma permanente hasta que exista evidencia forense reproducible.',
    ],
  },
  {
    number: 15,
    title: 'Frontera de Seguridad: Sandbox Obligatorio',
    category: 'security',
    summary:
      'Las skills no tienen sandbox general actual. Hermes Core debe imponer: Policy → Auth → Gate → Sandbox.',
    fullText: `Hermes detectó una cuestión crítica: Las Skills no tienen actualmente un sandbox general. Esto es un problema importante porque algunas capacidades pueden: ejecutar shell, acceder a filesystem, acceder a red, utilizar secretos, modificar repositorios, comunicarse con servicios externos, producir side effects. Por tanto, una evolución importante será: Hermes Core → Policy → Authorization → Execution Gate → Sandbox → Skill/Plugin/MCP → External System. El sandbox no debe considerarse un detalle cosmético. Es una frontera de seguridad.`,
    invariants: [
      'Ninguna skill con efectos secundarios puede ejecutarse fuera de un sandbox auditado.',
    ],
  },
  {
    number: 16,
    title: 'No Reconstruir Capacidades Innecesariamente',
    category: 'architecture',
    summary:
      'Auditar antes de codificar: ¿Existe? ¿Dónde? ¿Está implementada? ¿Funciona? ¿Tiene evidencia? ¿Requiere sandbox?',
    fullText: `La auditoría descubrió que Hermes ya dispone o declara capacidades relacionadas con GitHub, análisis de código, secret scanning, documentación, email, browser automation, web search. Por tanto, antes de implementar cualquier nueva capacidad se debe preguntar: ¿Ya existe? → ¿Dónde? → ¿Está realmente implementada? → ¿Funciona? → ¿Puede ejecutarse? → ¿Tiene evidencia? → ¿Puede gobernarse? → ¿Necesita wrapper? → ¿Necesita sandbox? No se debe reconstruir algo solamente porque no sabíamos que ya existía.`,
    invariants: [
      'Verificación previa en el catálogo de 125 capacidades antes de introducir nuevas dependencias.',
    ],
  },
  {
    number: 17,
    title: 'Estado Real de la Base de Ingeniería: 245/245 Tests',
    category: 'phases',
    summary:
      'Fases 01 a 06 completadas con rigor formal en tipos, evidencia, políticas, frontera de secretos y validación.',
    fullText: `El proyecto actual contiene una base de gobierno/auditoría considerablemente más madura que la parte de ejecución real. Fases completadas: Fase 01 — Domain Types (57/57 pruebas). Fase 02 — Evidence / Claims (41/41). Fase 03 — Policy Engine (17/17). Fase 04 — Secret Boundary + Egress (42/42). Fase 05 — Validation (38/38). Fase 06 — State Machine (50/50). Total: 245/245 tests pasados. Pero esto no significa que Hermes completo esté terminado.`,
    invariants: ['245 tests demuestran gobernanza y tipos, pero NO ejecución real completa.'],
  },
  {
    number: 18,
    title: 'Limitación Crítica: Execution Engine es Simulado',
    category: 'epistemology',
    summary:
      'src/audit/execution-engine.ts es SIMULADO. Declararlo como ejecución real violaría el principio de verdad epistemológica.',
    fullText: `El src/audit/execution-engine.ts existe, pero actualmente es limitado. Utiliza ejecución simulada. Por tanto: No debe presentarse como ejecución real. Esto es especialmente importante porque toda la arquitectura futura de Hermes dependerá de poder distinguir: SIMULATED EXECUTION de REAL EXECUTION con evidencia verificable.`,
    invariants: [
      'SIMULATED EXECUTION != REAL EXECUTION.',
      'Prohibición total de presentar mocks o simulaciones como ejecución en entornos de producción.',
    ],
  },
  {
    number: 19,
    title: 'Estado de Otras Áreas del Sistema',
    category: 'phases',
    summary:
      'GitHub & ZIP ingestion incompletos, persistencia conceptual, recovery pendiente, backend en verificación.',
    fullText: `Según la auditoría disponible: GitHub ingestion: No implementado completamente. ZIP ingestion: No implementado. Persistencia: Checkpoint existe conceptualmente, pero la persistencia real debe desarrollarse. Recovery: Pendiente. Backend: Existe server.ts, pero falta verificación integral. Frontend: Hay configuración React/TypeScript/Vite/Tailwind, pero no se debe asumir madurez funcional sin evidencia. Gemini: La integración debe considerarse separada de la arquitectura core.`,
    invariants: ['Transparencia total sobre componentes faltantes o en estado preliminar.'],
  },
  {
    number: 20,
    title: 'Architecture Contract V1 Congelado',
    category: 'architecture',
    summary:
      'El contrato de arquitectura está congelado. No se reabre salvo P0 o contradicción irresoluble.',
    fullText: `Existe un ARCHITECTURE CONTRACT V1 — CONGELADO. No debe reabrirse salvo: P0; contradicción real con requisitos; imposibilidad técnica demostrable. Los defectos normales deben clasificarse como: implementación; pruebas; harness; decisiones técnicas; deuda técnica. No deben utilizarse como excusa para rediseñar continuamente la arquitectura.`,
    invariants: ['El rediseño continuo sin justificación P0 queda terminantemente vetado.'],
  },
  {
    number: 21,
    title: 'Principios de Seguridad y Frontera de Secretos',
    category: 'security',
    summary:
      'Sanitización previa a LLMs/exportación/logs, aprobación atada al hash del patch, sin aprobaciones retroactivas.',
    fullText: `Invariantes importantes: Secrets: Ningún contenido del proyecto llega a un LLM sin sanitización. Ningún contenido llega a exportación sin secret scan + policy. Ningún contenido llega a logs sin sanitización. Ausencia de detección no garantiza ausencia de secretos. originalContent no debe existir normalmente en el dominio. Evidence: VERIFIED requiere evidencia válida, suficiente y fresca. PASSED requiere ejecución real y EXECUTION evidence. Evidencia insuficiente → UNVERIFIED. Patch: Aprobación ligada al hash. Cambio del patch invalida aprobación anterior. Un patch aplicado no puede convertirse retroactivamente en REJECTED. Fallo posterior → VALIDATION_FAILED. Approval: La aprobación está vinculada a targetId y targetHash. No existe aprobación retroactiva.`,
    invariants: [
      'Sanitización estricta antes de egress hacia LLM o logs.',
      'Aprobación criptográfica atada al hash SHA-256 del patch.',
      'Modificar 1 byte de un patch invalida instantáneamente su aprobación.',
    ],
  },
  {
    number: 22,
    title: 'Principio de No Complacencia en la Práctica',
    category: 'context',
    summary:
      'Decir explícitamente "NO" si algo introduce riesgo, viola la arquitectura o carece de sustento.',
    fullText: `El asistente debe actuar como contraparte crítica. Si una idea: no es técnicamente viable; es innecesariamente compleja; introduce riesgo; contradice la arquitectura; no tiene evidencia; depende de una suposición falsa; crea una falsa sensación de progreso; o convierte Hermes en algo distinto del objetivo maestro; debe señalarse directamente. No debe decirse "sí" solamente porque el usuario lo propone.`,
    invariants: [
      'El asistente técnico tiene la obligación ética y metodológica de desafiar ideas defectuosas.',
    ],
  },
  {
    number: 23,
    title: 'Riesgos Principales y Mitigación Formal',
    category: 'architecture',
    summary:
      'Explosión de alcance, autonomía descontrolada y costes de inferencia mitigados por contratos y fases.',
    fullText: `La ambición de Hermes es técnicamente posible como dirección de investigación/desarrollo, pero es extremadamente grande. Los principales riesgos son: explosión de alcance; complejidad del sistema; autonomía no confiable; dificultad de verificación; seguridad de agentes; ejecución de side effects; costes de inferencia; coordinación multiagente; observabilidad; recuperación; mantenimiento; vendor dependencies; falsa confianza en modelos; dificultad para demostrar que un sistema construido realmente funciona. Por tanto: La ambición no debe reducirse artificialmente, pero debe dividirse mediante contratos, estados, evidencia y fases verificables.`,
    invariants: [
      'La complejidad debe contenerse mediante fronteras modulares y verificación matemática/forense.',
    ],
  },
  {
    number: 24,
    title: 'Roadmap Conceptual: Fases 07 a 11 y Subsiguientes',
    category: 'phases',
    summary:
      'Fase 07 Persistencia/Recovery → Fase 08 Sandbox Real → Fase 09 AIProvider → Fase 10 Backend → Fase 11 Frontend.',
    fullText: `La secuencia razonable identificada hasta ahora es: Fase 07: Persistencia, checkpoints y recovery. Fase 08: Ejecución real y sandbox. Fase 09: Abstracción AIProvider e integración de modelos. Fase 10: Backend y rutas. Fase 11: Frontend. Posteriormente: capability registry; extensiones; Skills; Plugins; MCP; agentes; sistemas multiagente; deployment; observability; infraestructura; lifecycle completo. El orden puede cambiar si aparece evidencia técnica que lo justifique.`,
    invariants: ['El sandbox real y la persistencia son prerrequisitos de autonomía segura.'],
  },
  {
    number: 25,
    title: 'Principio de Extensibilidad y Subordinación',
    category: 'architecture',
    summary:
      'Skills, Plugins y MCP son ciudadanos de segunda clase frente al gobierno central de Hermes Core.',
    fullText: `Hermes debería poder incorporar Skills, Plugins, MCP, AI Providers, Execution Providers, Storage Providers, External Integrations; pero todos deben estar subordinados a una capa de gobierno. La existencia de una extensión no le concede autoridad.`,
    invariants: ['Una extensión externa nunca adquiere privilegios de gobierno sobre Hermes Core.'],
  },
  {
    number: 26,
    title: 'Ingeniería de Agentes como Disciplina Formal',
    category: 'architecture',
    summary:
      'Especificación rigurosa de rol, permisos, modelo, restricciones, terminación y supervisión humana.',
    fullText: `A medida que Hermes avance, deberá poder especificar y gobernar: rol, propósito, objetivos, capacidades, herramientas, permisos, memoria, contexto, modelo, routing, restricciones, protocolos, delegación, coordinación, estado, persistencia, supervisión humana, evaluación, observabilidad, coste, límites de autonomía, recuperación, versionado, criterios de terminación. Un agente no puede concederse a sí mismo nuevas capacidades o permisos.`,
    invariants: ['Definición de agentes mediante contratos de ingeniería verificables y acotados.'],
  },
  {
    number: 27,
    title: 'Hermes Como Meta-Sistema',
    category: 'identity',
    summary:
      'Hermes diseña e ingenieriza agentes que a su vez trabajan, pero Hermes permanece por encima como gobierno.',
    fullText: `Hermes no solamente debe poder crear software. Debe poder ingenierizar sistemas complejos compuestos por software, agentes, herramientas, datos, modelos, servicios e infraestructura, y posteriormente gobernar su operación y evolución. Esto significa que Hermes puede llegar a construir sistemas que contengan agentes que, a su vez, realicen trabajo especializado. Pero Hermes permanece por encima de ellos como sistema de gobierno.`,
    invariants: ['Hermes es el meta-gobernador ontológico del ecosistema producido.'],
  },
  {
    number: 28,
    title: 'Regla Para Futuras Conversaciones',
    category: 'rules',
    summary:
      'Nunca comenzar de cero. Cargar primero el Documento Maestro, Contrato V1 y estado de pruebas.',
    fullText: `Cuando se retome este proyecto en un nuevo chat, no comenzar desde cero. Primero recuperar este documento y cualquier: Architecture Contract; Decision Log; estado de fases; evidencia de tests; auditoría de capacidades; informe de Hermes; documentación de continuidad. La conversación nueva debe partir de este contexto.`,
    invariants: ['Continuidad documental estricta entre sesiones de desarrollo.'],
  },
  {
    number: 29,
    title: 'Jerarquía de Fuentes para Resolución de Conflictos',
    category: 'rules',
    summary:
      'Nivel 1 Decisiones de usuario > Nivel 2 Contrato V1 > Nivel 3 Documento Maestro > Nivel 4 Tests > Nivel 7 Suposición de modelo.',
    fullText: `Para resolver contradicciones futuras: Nivel 1: Decisiones explícitas del usuario sobre el producto. Nivel 2: Architecture Contract V1 para cuestiones arquitectónicas congeladas. Nivel 3: Este Master Context / Continuity Document para consolidación conceptual. Nivel 4: Implementación real y evidencia de pruebas. Nivel 5: Memoria e historial de Hermes. Nivel 6: Skills, manifests, plugins, MCP y registros. Nivel 7: Suposiciones del modelo. Las suposiciones del modelo nunca deben superar a la evidencia.`,
    invariants: [
      'Nivel 1 > Nivel 2 > Nivel 3 > Nivel 4 > Nivel 5 > Nivel 6 > Nivel 7.',
      'Las alucinaciones o presunciones de un LLM tienen rango epistemológico nulo frente a evidencia probada.',
    ],
  },
  {
    number: 30,
    title: 'Regla Absoluta Sobre el Estado',
    category: 'epistemology',
    summary:
      'Nunca afirmar que Hermes tiene una capacidad sin evidencia reproducible. Sin evidencia = no existe.',
    fullText: `Nunca declarar: "Hermes tiene X capacidad" simplemente porque: existe un nombre; existe una Skill; aparece en un manifest; hay documentación; existe código parcial; un agente afirma que funciona. Debe existir evidencia adecuada.`,
    invariants: ['Sin prueba de ejecución exitosa y verificada, el estado es UNVERIFIED.'],
  },
  {
    number: 31,
    title: 'Definición Final Para Recordar',
    category: 'identity',
    summary:
      'La declaración canónica de Hermes como sistema de ingeniería, gobierno y operación de sistemas digitales.',
    fullText: `Hermes es un sistema de ingeniería, gobierno y operación de sistemas digitales complejos. Puede recibir cualquier intención, requisito, artefacto o sistema existente y determinar qué arquitectura necesita —software tradicional, agentes, sistemas multiagente, workflows, humanos o combinaciones de estos— para satisfacer esa necesidad. Debe poder diseñar, construir, validar, desplegar, operar, mantener y evolucionar esos sistemas bajo reglas de seguridad, autorización, evidencia, trazabilidad y verificación. Los modelos de IA, agentes, Skills, Plugins, MCP y proveedores son componentes subordinados; Hermes Core conserva la autoridad.`,
    invariants: ['Definición dogmática e inmutable de Hermes.'],
    keyQuote:
      'Los modelos de IA, agentes, Skills y herramientas son componentes subordinados; Hermes Core conserva la autoridad.',
  },
  {
    number: 32,
    title: 'Estado de la Visión vs Realidad de Implementación',
    category: 'context',
    summary:
      'Distinguir la visión global del estado actual: base de gobierno sólida (245 tests), ciclo end-to-end por demostrar.',
    fullText: `La visión no debe confundirse con el estado actual de implementación. Actualmente Hermes tiene una base de gobierno y auditoría significativa, pero todavía no ha demostrado end-to-end la capacidad de: recibir cualquier intención → diseñar automáticamente el sistema apropiado → construirlo → probarlo → desplegarlo → operarlo → mantenerlo. Esa es la dirección objetivo, no una capacidad ya demostrada. La diferencia entre ambas cosas debe permanecer explícita en todo momento. Regla final: No proteger la narrativa. Proteger la verdad del sistema.`,
    invariants: [
      'Diferenciación honesta e implacable entre aspiración de investigación y código verificado en ejecución.',
    ],
    keyQuote: 'No proteger la narrativa. Proteger la verdad del sistema.',
  },
];

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

export const CAPABILITY_AUDIT_UNIVERSE: CapabilityItem[] = [
  // Builtin
  {
    id: 'cap-git-cli',
    name: 'git_operations',
    category: 'git',
    origin: 'builtin',
    epistemologicalState: 'VERIFIED',
    hasSkillMd: true,
    hasSandbox: false,
    notes:
      'Clonado, diff, commit, log. Requiere sandbox obligatorio para prevenir manipulación del repo host.',
    evidenceSource: '~/.hermes/skills/git/SKILL.md',
  },
  {
    id: 'cap-secret-scan',
    name: 'secret_scanner_local',
    category: 'secret_scan',
    origin: 'builtin',
    epistemologicalState: 'VERIFIED',
    hasSkillMd: true,
    hasSandbox: true,
    notes:
      'Detección por entropía y patrones regex de tokens API, claves privadas y secretos conocidos.',
    evidenceSource: '~/.hermes/skills/secret-scan/SKILL.md',
  },
  {
    id: 'cap-file-reader',
    name: 'safe_file_reader',
    category: 'filesystem',
    origin: 'builtin',
    epistemologicalState: 'VERIFIED',
    hasSkillMd: true,
    hasSandbox: true,
    notes: 'Lectura con limitación de rango de líneas y verificación de tamaño máximo.',
    evidenceSource: '~/.hermes/skills/fs-read/SKILL.md',
  },
  {
    id: 'cap-file-writer',
    name: 'atomic_file_writer',
    category: 'filesystem',
    origin: 'builtin',
    epistemologicalState: 'VERIFIED',
    hasSkillMd: true,
    hasSandbox: false,
    notes: 'Escritura atómica. Produce side-effects que requieren confirmación o sandbox.',
    evidenceSource: '~/.hermes/skills/fs-write/SKILL.md',
  },
  {
    id: 'cap-code-ast',
    name: 'typescript_ast_analyzer',
    category: 'core',
    origin: 'builtin',
    epistemologicalState: 'VERIFIED',
    hasSkillMd: true,
    hasSandbox: true,
    notes: 'Parseo de TypeScript con ts-morph / babel para detección de importaciones circulares.',
    evidenceSource: '~/.hermes/skills/ast-analyzer/SKILL.md',
  },
  {
    id: 'cap-web-search',
    name: 'web_search_engine',
    category: 'network',
    origin: 'builtin',
    epistemologicalState: 'VERIFIED',
    hasSkillMd: true,
    hasSandbox: true,
    notes: 'Consulta a motores de búsqueda para recuperación de documentación técnica.',
    evidenceSource: '~/.hermes/skills/web-search/SKILL.md',
  },
  {
    id: 'cap-doc-generator',
    name: 'markdown_doc_generator',
    category: 'core',
    origin: 'builtin',
    epistemologicalState: 'VERIFIED',
    hasSkillMd: true,
    hasSandbox: true,
    notes: 'Extracción automática de comentarios JSDoc y generación de especificaciones técnicas.',
    evidenceSource: '~/.hermes/skills/doc-gen/SKILL.md',
  },
  {
    id: 'cap-cron-scheduler',
    name: 'cron_scheduler',
    category: 'system',
    origin: 'builtin',
    epistemologicalState: 'VERIFIED',
    hasSkillMd: true,
    hasSandbox: false,
    notes: '1 cron activo detectado en auditoría para tareas programadas de mantenimiento.',
    evidenceSource: 'state.db / cron tables',
  },
  // Local (sample of 30)
  {
    id: 'cap-browser-auto',
    name: 'browser_automation_playwright',
    category: 'browser',
    origin: 'local',
    epistemologicalState: 'GOVERNED',
    hasSkillMd: true,
    hasSandbox: false,
    notes:
      'Automatización de navegación headless. Requiere aislamiento estricto de red corporativa.',
    evidenceSource: '~/hermes-agent-main/skills/browser/SKILL.md',
  },
  {
    id: 'cap-email-dispatch',
    name: 'email_notifier',
    category: 'network',
    origin: 'local',
    epistemologicalState: 'AVAILABLE',
    hasSkillMd: true,
    hasSandbox: false,
    notes: 'Envío de notificaciones transaccionales. Falta evidencia de cuotas y rate limiting.',
    evidenceSource: '~/hermes-agent-main/skills/email/SKILL.md',
  },
  {
    id: 'cap-github-ingestion',
    name: 'github_repository_ingest',
    category: 'git',
    origin: 'local',
    epistemologicalState: 'INSTALLED',
    hasSkillMd: false,
    hasSandbox: false,
    notes: 'Incompleto según Sección 19. No implementado end-to-end con evidencia.',
    evidenceSource: '~/hermes-agent-main/skills/github-ingest/ (parcial)',
  },
  {
    id: 'cap-zip-ingestion',
    name: 'zip_archive_extractor',
    category: 'filesystem',
    origin: 'local',
    epistemologicalState: 'DISCOVERED',
    hasSkillMd: false,
    hasSandbox: false,
    notes: 'Sección 19: No implementado. Riesgo de Zip Slip y decompresión masiva (Zip Bomb).',
    evidenceSource: 'Mencionado en manifests pero sin código verificado',
  },
  {
    id: 'cap-shell-exec',
    name: 'bash_shell_executor',
    category: 'system',
    origin: 'builtin',
    epistemologicalState: 'AUTHORIZED',
    hasSkillMd: true,
    hasSandbox: false,
    notes:
      'ALTO RIESGO: Capacidad de ejecución de comandos. Sin sandbox general es vector crítico.',
    evidenceSource: '~/.hermes/skills/shell/SKILL.md',
  },
  {
    id: 'cap-simulated-engine',
    name: 'simulated_execution_engine',
    category: 'core',
    origin: 'builtin',
    epistemologicalState: 'EXECUTABLE',
    hasSkillMd: true,
    hasSandbox: true,
    notes: 'src/audit/execution-engine.ts. Ejecución SIMULADA, NO real. Conforme Sección 18.',
    evidenceSource: 'src/audit/execution-engine.ts',
  },
  // Unverified claim (1900+)
  {
    id: 'cap-1900-claim',
    name: 'unverified_1900_skills_catalog',
    category: 'misc',
    origin: 'unverified_claim',
    epistemologicalState: 'DISCOVERED',
    hasSkillMd: false,
    hasSandbox: false,
    notes:
      'CLAIM_UNVERIFIED conforme a Sección 14. No existe fuente auditable local que lo demuestre.',
    evidenceSource: 'CLAIM_UNVERIFIED (Sección 14 de Documento Maestro)',
  },
];

export const HIERARCHY_SOURCES: HierarchySource[] = [
  {
    level: 1,
    name: 'Decisiones Explícitas del Usuario sobre el Producto',
    scope:
      'Requisitos de negocio, alcance funcional, restricciones humanas directas y preferencias.',
    canOverride: ['Nivel 2', 'Nivel 3', 'Nivel 4', 'Nivel 5', 'Nivel 6', 'Nivel 7'],
    cannotOverride: ['Invariantes matemáticas absolutas de seguridad de datos'],
    doctrineRule:
      'La autoridad humana soberana rige las decisiones del producto, siempre que no viole la integridad de seguridad.',
  },
  {
    level: 2,
    name: 'Architecture Contract V1 (Congelado)',
    scope:
      'Estructura congelada de Hermes, fronteras de aislamiento, invariantes de estado y de parches.',
    canOverride: ['Nivel 3', 'Nivel 4', 'Nivel 5', 'Nivel 6', 'Nivel 7'],
    cannotOverride: ['Nivel 1 (salvo si el usuario contradice la seguridad de forma inviable)'],
    doctrineRule:
      'No se reabre salvo P0, contradicción insalvable de requisitos o imposibilidad técnica demostrable.',
  },
  {
    level: 3,
    name: 'Master Context / Continuity Document (V1.0)',
    scope:
      'Doctrina de continuidad, objetivos maestros, qué NO es Hermes, epistemología y reglas de no complacencia.',
    canOverride: ['Nivel 4', 'Nivel 5', 'Nivel 6', 'Nivel 7'],
    cannotOverride: ['Nivel 1', 'Nivel 2'],
    doctrineRule:
      'Preserva la verdad del sistema entre sesiones de trabajo y evita reconstruir desde cero.',
  },
  {
    level: 4,
    name: 'Implementación Real y Evidencia de Pruebas',
    scope:
      '245/245 tests superados, código TypeScript verificado, compilaciones con código de salida 0.',
    canOverride: ['Nivel 5', 'Nivel 6', 'Nivel 7'],
    cannotOverride: ['Nivel 1', 'Nivel 2', 'Nivel 3'],
    doctrineRule:
      'La evidencia tangible de ejecución real siempre supera a la memoria histórica o suposiciones.',
  },
  {
    level: 5,
    name: 'Memoria e Historial de Hermes',
    scope: 'Logs de auditoría previa, state.db, historial de conversaciones y decisiones pasadas.',
    canOverride: ['Nivel 6', 'Nivel 7'],
    cannotOverride: ['Nivel 1', 'Nivel 2', 'Nivel 3', 'Nivel 4'],
    doctrineRule:
      'Sirve como referencia contextual, pero debe invalidarse si contradice pruebas o contratos.',
  },
  {
    level: 6,
    name: 'Skills, Manifests, Plugins, MCP y Registros',
    scope:
      'Catálogos declarados (.bundled_manifest, auth.json, definiciones de herramientas externas).',
    canOverride: ['Nivel 7'],
    cannotOverride: ['Nivel 1', 'Nivel 2', 'Nivel 3', 'Nivel 4', 'Nivel 5'],
    doctrineRule:
      'Un archivo manifest demuestra registro, pero no disponibilidad ni autorización de ejecución.',
  },
  {
    level: 7,
    name: 'Suposiciones y Alucinaciones del Modelo de IA',
    scope: 'Respuestas probabilísticas, extrapolaciones y propuestas del LLM.',
    canOverride: [],
    cannotOverride: ['Nivel 1', 'Nivel 2', 'Nivel 3', 'Nivel 4', 'Nivel 5', 'Nivel 6'],
    doctrineRule:
      'Rango epistemológico CERO frente a cualquier evidencia comprobable. Una respuesta de LLM no es evidencia.',
  },
];

export const PRESET_CRITIQUE_SCENARIOS = [
  {
    title: 'Agente autónomo con acceso directo a Base de Datos sin pasar por Gate',
    proposal:
      'Queremos acelerar el desarrollo permitiendo que un agente con LLM ejecute consultas SQL directas de mutación (UPDATE/DELETE/ALTER) en la base de datos principal, basándose en lo que pida el usuario por chat, para que sea "completamente autónomo".',
    category: 'Seguridad & Gobierno',
  },
  {
    title: 'Usar 7 agentes especializados comunicándose en bucle para escribir código simple',
    proposal:
      'Para hacer una calculadora de impuestos estándar, vamos a instanciar 7 agentes (Planner, Architect, Coder, Reviewer, Tester, Security, Manager) que conversen entre sí en rondas infinitas hasta llegar a un consenso semántico.',
    category: 'Arquitectura & Costos',
  },
  {
    title: 'Afirmar que Hermes tiene 2.000 herramientas listas porque están en un manifest',
    proposal:
      'Podemos promocionar y asegurar a los usuarios que Hermes ya dispone de 2.000 capacidades de ingeniería de software listas para producción, citando el número declarado en el repositorio.',
    category: 'Epistemología & Verdad',
  },
  {
    title: 'Pipeline determinista con verificación estricta de tipos y sandbox para scripts',
    proposal:
      'Diseñar un sistema de transformación de datos mediante un workflow determinista en TypeScript, con validación de esquemas Zod en los límites, escaneo de secretos antes de exportar y ejecución de scripts auxiliares dentro de un contenedor aislado con permisos de solo lectura.',
    category: 'Diseño Correcto',
  },
];
