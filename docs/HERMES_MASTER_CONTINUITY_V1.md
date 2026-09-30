# HERMES — DOCUMENTO MAESTRO DE CONTINUIDAD Y CONTEXTO
**Versión:** 1.0  
**Fecha:** 11 de septiembre de 2026  
**Propósito:** Preservar el contexto conceptual, las decisiones, las correcciones y la dirección estratégica de Hermes para poder continuar el trabajo en otro chat sin reconstruirlo desde cero.

---

## 1. CONTEXTO GENERAL
El usuario está desarrollando Hermes Agent y quiere que el asistente actúe como mentor técnico, arquitecto y contraparte crítica del proyecto.  
La intención no es recibir respuestas complacientes.  
El criterio acordado es:  
> **Si una idea es técnicamente mala, irrealista, innecesariamente compleja, contradictoria, una falacia, un eufemismo o una fantasía, debe decirse explícitamente.**  
> No se debe proteger una decisión simplemente porque ya se haya invertido trabajo en ella.  

La prioridad es:  
$$\text{corrección} \longrightarrow \text{evidencia} \longrightarrow \text{seguridad} \longrightarrow \text{arquitectura} \longrightarrow \text{utilidad} \longrightarrow \text{velocidad}$$  
*No al revés.*

---

## 2. OBJETIVO MAESTRO DE HERMES
### Definición vigente
Hermes debe entenderse como:  
> **Un sistema de ingeniería, gobierno y operación capaz de diseñar, construir, validar, desplegar, operar, mantener y evolucionar sistemas digitales complejos —incluyendo software tradicional, agentes de IA y sistemas multiagente— a partir de cualquier intención, requisito, conocimiento, artefacto o sistema existente, utilizando la arquitectura y combinación de componentes que determine apropiadas para cada problema.**  
*Esta es la definición que debe prevalecer.*

---

## 3. LO QUE HERMES NO ES
Hermes **NO** debe definirse como:
- Un conversor de prototipos
- Un sistema “prototype-to-product”
- Un generador de aplicaciones
- Un auditor de código
- Un agente de programación
- Un wrapper de un LLM
- Un sistema basado en Gemini
- Un sistema basado en NVIDIA
- Una colección de Skills
- Un catálogo de herramientas
- Un framework de agentes convencional

*Puede realizar o contener todas esas funciones, pero ninguna define su identidad.*

---

## 4. LA CORRECCIÓN CONCEPTUAL MÁS IMPORTANTE
Anteriormente apareció una formulación demasiado limitada: *“Convertir prototipos en sistemas reales.”*  
Esa formulación fue descartada. Un prototipo es solamente una de las posibles entradas.  

Hermes debe poder partir de:
- Una idea
- Lenguaje natural
- Requisitos empresariales, funcionales, no funcionales, industriales o de ingeniería
- Una especificación
- Documentación
- Un diseño o landing page o web
- Una aplicación existente o legacy
- Un repositorio o proyecto incompleto
- Datos o código
- Un prototipo o un proyecto completamente nuevo

**Por tanto: El tipo de entrada no define Hermes.**

---

## 5. EL RESULTADO TAMPOCO DEBE ESTAR PREDEFINIDO
Hermes no debe asumir que toda necesidad termina en una “aplicación”. Dependiendo del problema, podría producir:
- Software tradicional
- Aplicación web o móvil
- API o microservicios
- Sistema distribuido
- Workflow o automatización
- Infraestructura
- Agente o sistema multiagente
- Sistema híbrido (humano + software + agentes)
- Plataforma o arquitectura híbrida

*La decisión debe ser de ingeniería, no de moda tecnológica.*

---

## 6. AGENTES Y SISTEMAS MULTIAGENTE
Una meta importante de Hermes es que pueda crear e ingenierizar agentes y sistemas multiagente.  
Esto no significa convertir Hermes en un simple framework de agentes.  

La relación conceptual correcta es:
```
                        HERMES
              Ingeniería + Gobierno
                         │
             ┌───────────┼───────────┐
             │           │           │
          Agente       Software    Workflow
             │
       ┌─────┼─────┐
       │     │     │
    Agent A Agent B Agent C
       │     │     │
       └─────┼─────┘
             │
          Tools
             │
       APIs / DB / Web
```
*Los agentes son componentes que Hermes puede diseñar, construir y gobernar. No son la autoridad de Hermes.*

---

## 7. HERMES DEBE PODER DECIDIR NO USAR AGENTES
Principio fundamental: Hermes no debe convertirse en una máquina que “agentifica” todos los problemas.  
Debe poder concluir:
- **NO SE NECESITA UN AGENTE**
- **UN AGENTE ES SUFICIENTE**
- **SE REQUIERE UN SISTEMA MULTIAGENTE**
- **SE REQUIERE UNA ARQUITECTURA HÍBRIDA**

La decisión debe considerar: requisitos, determinismo, coste, riesgo, seguridad, latencia, mantenibilidad, verificabilidad, complejidad, disponibilidad de datos, necesidad de autonomía y necesidad de coordinación.  
*Multiagente no es un objetivo en sí mismo.*

---

## 8. HERMES COMO SISTEMA DE COMPOSICIÓN
Hermes compone:
$$\text{SOFTWARE} + \text{AGENTES} + \text{MULTIAGENTE} + \text{WORKFLOWS} + \text{HUMANOS} + \text{TOOLS} + \text{MODELOS} + \text{DATOS} + \text{APIs} + \text{SERVICIOS} + \text{INFRAESTRUCTURA}$$  
La arquitectura concreta dependerá del problema.

---

## 9. CICLO MAESTRO
El ciclo conceptual de Hermes es:
1. INTENCIÓN
2. DESCUBRIMIENTO
3. REQUISITOS
4. CRITERIOS DE ACEPTACIÓN
5. INVARIANTES
6. AMENAZAS / SEGURIDAD
7. ARQUITECTURA
8. DISEÑO DEL SISTEMA
9. DISEÑO DE AGENTES (SI APLICA)
10. DISEÑO MULTIAGENTE (SI APLICA)
11. MODELO DE DATOS
12. PLANIFICACIÓN
13. APROBACIÓN
14. IMPLEMENTACIÓN
15. BUILD
16. TESTING
17. EVALUACIÓN
18. AUDITORÍA
19. REMEDIACIÓN
20. REVALIDACIÓN
21. RELEASE
22. DESPLIEGUE
23. OPERACIÓN
24. OBSERVABILIDAD
25. MANTENIMIENTO
26. EVOLUCIÓN

*Hermes debe determinar cuáles corresponden a cada sistema y dejar evidencia verificable de ello.*

---

## 10. AUTORIDAD
**Principio fundamental:** Los componentes que Hermes utiliza no son automáticamente autoridades de Hermes (LLMs, agentes, Skills, Plugins, MCP, APIs, proveedores, herramientas externas).  

Hermes Core conserva autoridad sobre:
- Workflow state
- Políticas y autorizaciones
- Aprobaciones
- Evidencia y verificación
- Seguridad y secretos
- Auditoría
- Cambios críticos, ejecución y recuperación

---

## 11. MODELO-AGNOSTICISMO
Hermes no pertenece a ningún proveedor de IA. Debe poder utilizar NVIDIA, Gemini, OpenAI, Anthropic, modelos locales o futuros proveedores.  
```
AIProvider
├── NVIDIAProvider
├── GeminiProvider
├── OpenAIProvider
├── AnthropicProvider
└── LocalModelProvider
```
El modelo puede interpretar, proponer, razonar, generar, clasificar o recomendar. Pero **no debe ser la autoridad soberana**.

---

## 12. EVIDENCIA Y EPISTEMOLOGÍA
Una de las bases más importantes de Hermes es distinguir:
- `DISCOVERED`
- `INSTALLED`
- `AVAILABLE`
- `EXECUTABLE`
- `AUTHORIZED`
- `GOVERNED`
- `VERIFIED`
- `PRODUCTION_READY`

*No son sinónimos.* Una Skill existente no demuestra que funciona. Una entrada de manifest no demuestra disponibilidad. Una herramienta registrada no demuestra autorización. Una respuesta de un modelo no constituye evidencia. Una ejecución simulada no constituye ejecución real.

---

## 13. AUDITORÍA DE CAPACIDADES REALIZADA
- **Universo descubierto:** 125 capacidades.
- **Instaladas:** 43 (13 builtin, 30 locales).
- **Habilitadas:** 43 (interpretado con cuidado: "enabled" != "autorizada y gobernada").
- **Activables:** 82 (60 en manifest, 22 optional).
- **Verificadas mediante SKILL.md:** 25 de las 43 instaladas.
- **Parciales:** 18 (instaladas pero sin evidencia suficiente de implementación completa).
- **Plugins:** 0.
- **MCP:** 0 configurado.
- **Cron:** 1.

---

## 14. LOS 1.900+ SKILLS
La cifra de 1.900+ Skills no está demostrada. La auditoría actual demuestra 125 capacidades en fuentes locales.  
**Estado epistemológico:** `1900+ = CLAIM_UNVERIFIED`.  
Hasta localizar una fuente concreta y auditable que permita demostrar catálogo, identidad, origen, versión, disponibilidad, integridad, instalación, activación y ejecución, no se debe inventar ni extrapolar esa cifra.

---

## 15. SANDBOX
Las Skills no tienen actualmente un sandbox general. Esto es crítico porque pueden ejecutar shell, acceder a filesystem, red, secretos, repositorios, etc.  
Evolución obligatoria:
$$\text{Hermes Core} \rightarrow \text{Policy} \rightarrow \text{Authorization} \rightarrow \text{Execution Gate} \rightarrow \text{Sandbox} \rightarrow \text{Skill / Plugin / MCP} \rightarrow \text{External System}$$  
*El sandbox es una frontera de seguridad innegociable.*

---

## 16. NO RECONSTRUIR CAPACIDADES INNECESARIAMENTE
Antes de implementar cualquier nueva capacidad:  
¿Ya existe? $\rightarrow$ ¿Dónde? $\rightarrow$ ¿Está realmente implementada? $\rightarrow$ ¿Funciona? $\rightarrow$ ¿Puede ejecutarse? $\rightarrow$ ¿Tiene evidencia? $\rightarrow$ ¿Puede gobernarse? $\rightarrow$ ¿Necesita wrapper? $\rightarrow$ ¿Necesita sandbox?

---

## 17. ESTADO REAL DEL SOFTWARE DE INGENIERÍA DE HERMES
Base de gobierno y auditoría completada (245/245 tests):
- **Fase 01 — Domain Types:** 57/57 pruebas
- **Fase 02 — Evidence / Claims:** 41/41 pruebas
- **Fase 03 — Policy Engine:** 17/17 pruebas
- **Fase 04 — Secret Boundary + Egress:** 42/42 pruebas
- **Fase 05 — Validation:** 38/38 pruebas
- **Fase 06 — State Machine:** 50/50 pruebas

---

## 18. LIMITACIÓN CRÍTICA DEL EXECUTION ENGINE
`src/audit/execution-engine.ts` existe, pero actualmente es limitado: utiliza **ejecución simulada**.  
*No debe presentarse como ejecución real.* La arquitectura futura depende de distinguir `SIMULATED EXECUTION` de `REAL EXECUTION` con evidencia verificable.

---

## 19. ESTADO ACTUAL DE OTRAS ÁREAS
- **GitHub ingestion:** No implementado completamente.
- **ZIP ingestion:** No implementado.
- **Persistencia:** Checkpoint conceptual existe; persistencia real por desarrollar.
- **Recovery:** Pendiente.
- **Backend:** `server.ts` existe, falta verificación integral.
- **Frontend:** React/TypeScript/Vite/Tailwind configurado.
- **Gemini:** Integración desacoplada del core.

---

## 20. ARQUITECTURA CONGELADA
Existe un **ARCHITECTURE CONTRACT V1 — CONGELADO**.  
No debe reabrirse salvo P0, contradicción real con requisitos o imposibilidad técnica demostrable.

---

## 21. PRINCIPIOS DE SEGURIDAD
- **Secrets:** Ningún contenido llega a un LLM sin sanitización. Ningún contenido llega a exportación sin secret scan + policy. Ningún contenido llega a logs sin sanitización. Ausencia de detección no garantiza ausencia de secretos. `originalContent` no debe existir normalmente en el dominio.
- **Evidence:** `VERIFIED` requiere evidencia válida, suficiente y fresca. `PASSED` requiere ejecución real y `EXECUTION` evidence. Evidencia insuficiente $\rightarrow$ `UNVERIFIED`.
- **Patch:** Aprobación ligada al hash. Cambio del patch invalida aprobación. Un patch aplicado no se convierte retroactivamente en `REJECTED`. Fallo posterior $\rightarrow$ `VALIDATION_FAILED`.
- **Approval:** Ligada a `targetId` y `targetHash`. Sin aprobación retroactiva.

---

## 22. PRINCIPIO DE NO COMPLACENCIA
El asistente debe actuar como contraparte crítica. Si una idea es inviable, compleja, arriesgada o una fantasía, debe señalarse de forma directa e implacable.

---

## 23. RIESGOS PRINCIPALES DEL PROYECTO
Explosión de alcance, complejidad del sistema, autonomía no confiable, dificultad de verificación, seguridad de agentes, efectos secundarios de ejecución, costes de inferencia, coordinación multiagente, observabilidad, dependencias de proveedores y falsa confianza en modelos.  
*Mitigación:* Dividir mediante contratos, estados, evidencia y fases verificables.

---

## 24. ROADMAP CONCEPTUAL ACTUAL
- **Fase 07:** Persistencia, checkpoints y recovery.
- **Fase 08:** Ejecución real y sandbox.
- **Fase 09:** Abstracción AIProvider e integración de modelos.
- **Fase 10:** Backend y rutas.
- **Fase 11:** Frontend.
- **Posterior:** Registry, extensiones, agentes, multiagente, deploy, observabilidad.

---

## 25. PRINCIPIO DE EXTENSIBILIDAD
Cualquier extensión (Skills, Plugins, MCP, Providers) está subordinada a la capa de gobierno de Hermes Core. Su mera existencia no le otorga autoridad.

---

## 26. INGENIERÍA DE AGENTES
Disciplina formal para especificar: rol, propósito, capacidades, herramientas, permisos, memoria, contexto, modelo, enrutamiento, restricciones, supervisión humana, criterios de terminación, etc. Un agente no puede auto-concederse capacidades o permisos.

---

## 27. HERMES COMO META-SISTEMA
Hermes ingenieriza sistemas compuestos por software, agentes, herramientas, datos, modelos e infraestructura, y gobierna su ciclo de vida permaneciendo como autoridad superior.

---

## 28. REGLA PARA FUTURAS CONVERSACIONES
No comenzar desde cero. Recuperar este documento, Architecture Contract, Decision Log, estado de fases y auditorías. La conversación debe partir de este contexto.

---

## 29. JERARQUÍA DE FUENTES
1. **Nivel 1:** Decisiones explícitas del usuario sobre el producto.
2. **Nivel 2:** Architecture Contract V1 para cuestiones arquitectónicas congeladas.
3. **Nivel 3:** Master Context / Continuity Document (este documento).
4. **Nivel 4:** Implementación real y evidencia de pruebas.
5. **Nivel 5:** Memoria e historial de Hermes.
6. **Nivel 6:** Skills, manifests, plugins, MCP y registros.
7. **Nivel 7:** Suposiciones del modelo. *(Las suposiciones nunca superan a la evidencia).*

---

## 30. REGLA ABSOLUTA SOBRE EL ESTADO
Nunca declarar *"Hermes tiene X capacidad"* sin evidencia adecuada, verificable y auditable.

---

## 31. DEFINICIÓN FINAL PARA RECORDAR
> **Hermes es un sistema de ingeniería, gobierno y operación de sistemas digitales complejos. Puede recibir cualquier intención, requisito, artefacto o sistema existente y determinar qué arquitectura necesita —software tradicional, agentes, sistemas multiagente, workflows, humanos o combinaciones de estos— para satisfacer esa necesidad. Debe poder diseñar, construir, validar, desplegar, operar, mantener y evolucionar esos sistemas bajo reglas de seguridad, autorización, evidencia, trazabilidad y verificación. Los modelos de IA, agentes, Skills, Plugins, MCP y proveedores son componentes subordinados; Hermes Core conserva la autoridad.**

---

## 32. ESTADO DE LA VISIÓN
La visión no debe confundirse con el estado actual de implementación. Actualmente Hermes tiene una base de gobierno y auditoría significativa (245 pruebas superadas), pero aún no ha demostrado end-to-end la ejecución de todo el ciclo. La diferencia debe ser explícita en todo momento.

*Regla final: No proteger la narrativa. Proteger la verdad del sistema.*
