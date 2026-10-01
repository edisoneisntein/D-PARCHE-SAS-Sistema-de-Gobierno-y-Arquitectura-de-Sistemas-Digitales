/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { MasterSection } from '../../types/hermes';

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
    fullText: `La auditoría descubrió que Hermes ya dispone o declara capacidades relacionadas con GitHub, análisis de código, secret scanning, documentación, email, browser automation, web search. Por tanto, antes de implementar cualquier nueva capacidad se debe preguntar: ¿Ya existe? → ¿Dónde? → ¿Está realmente implementada? → ¿Funciona? → ¿Tiene evidencia? → ¿Puede gobernarse? → ¿Necesita wrapper? → ¿Necesita sandbox? No se debe reconstruir algo solamente porque no sabíamos que ya existía.`,
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
