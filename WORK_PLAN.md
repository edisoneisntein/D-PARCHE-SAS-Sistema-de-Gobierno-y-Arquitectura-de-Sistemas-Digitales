# WORK_PLAN.md — D'Parche SAS Project Remediation Plan

**Proyecto:** D'Parche SAS (Hermes Agent Governance Console)
**Ubicación:** `/Users/edisonrodriguez/Documents/dparche-sas-project`
**Worktree de planificación:** `/Users/edisonrodriguez/orca/workspaces/dparche-sas-project/plan-work`
**Rama:** `plan-work`
**Fecha:** 2026-09-30
**Fuente:** 7 auditorías de agentes paralelos (Codex, Claude Code, Hermes, Opencode, Security, Performance, Maintainability)

---

## 📊 Resumen Ejecutivo

El proyecto D'Parche SAS es una **consola de gobernanza para Hermes Agent** — React 19 + TypeScript + Vite + Express + Tailwind 4. Tiene una **base conceptual sólida** (documento maestro de 32 secciones, 26 fases del Master Cycle, epistemología de 8 estados) pero **cero ejecución real** y **deuda técnica crítica** en ingeniería.

**Veredicto consolidado:** _No está listo para producción. Es una consola de gobernanza honesta y bien diseñada, pero Hermes en sí no existe todavía como sistema ejecutable end-to-end._

---

## 🎯 Objetivo del Plan

Transformar el proyecto de **"consola visual honesta"** a **"base de ingeniería verificable lista para ejecución real"** en 4 fases priorizadas, con criterios de aceptación medibles y owners definidos.

---

## 📋 Fases del Plan

### FASE 0: Preparación y Fundamentos (Semana 0 — 2-3 días)

_Owner: Lead Engineer | Dependencias: Ninguna | Esfuerzo: 2-3 días_

| Task ID | Tarea                                                                                                       | Criterio de Aceptación                                                     | Esfuerzo | **Estado Verificado**                                                     |
| ------- | ----------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------- | -------- | ------------------------------------------------------------------------- |
| F0-1    | Configurar ESLint (flat config) + Prettier + Husky pre-commit + lint-staged                                 | `npm run lint` pasa sin errores; pre-commit bloquea commits sucios         | 0.5 día  | ✅ **HECHO**                                                              |
| F0-2    | Añadir `.nvmrc` (Node 20+), `.editorconfig`, `package.json` `engines` field                                 | Versión de Node fijada; formato consistente en editores                    | 0.5 día  | ✅ **HECHO**                                                              |
| F0-3    | Configurar Vitest + React Testing Library + jsdom                                                           | `npm test` corre al menos 1 test passing (smoke test)                      | 0.5 día  | ✅ **HECHO** (6 tests)                                                    |
| F0-4    | Escribir README real del proyecto (propósito, arquitectura, quick start, scripts, env vars, testing, links) | README describe Hermes, no "AI Studio template"; incluye todos los scripts | 0.5 día  | ✅ **HECHO** (2026-09-30)                                                 |
| F0-5    | Expandir `.env.example` con todas las vars requeridas + Zod env validation en `src/config/env.ts`           | App falla al arrancar si falta var crítica; no hay secrets hardcodeados    | 0.5 día  | ⚠️ **PARCIAL** — `.env.example` actualizado; Zod env validation PENDIENTE |

---

### FASE 1: Bloqueadores P0 — Seguridad y TypeScript Estricto (Semana 1 — 5 días)

_Owner: Security Engineer + Frontend Lead | Dependencias: Fase 0 | Esfuerzo: 5 días_

| Task ID | Tarea                                                                                                                   | Criterio de Aceptación                                                                                     | Esfuerzo | Auditoría Fuente          | **Estado Verificado**                                                           |
| ------- | ----------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------- | -------- | ------------------------- | ------------------------------------------------------------------------------- |
| F1-1    | **Habilitar `strict: true` en `tsconfig.json`** + fix all resulting errors                                              | `npx tsc --noEmit` pasa sin errores; 0 `any` implícitos                                                    | 2 días   | Codex, Maintainability    | ❌ **NO HECHO** — `strict: true` ya está, pero hay errores de tipo que bloquean |
| F1-2    | **Añadir ErrorBoundary en `App.tsx`** + UI de error global                                                              | Crash en cualquier componente no blanquea la app; muestra fallback con "Reportar error"                    | 0.5 día  | Codex                     | ✅ **HECHO**                                                                    |
| F1-3    | **Instalar React Router v6** + lazy loading de 8 tabs + rutas con deep linking                                          | URL cambia al cambiar tab; refresh mantiene tab; shareable links                                           | 1 día    | Codex                     | ✅ **HECHO**                                                                    |
| F1-4    | **Auth en `/api/hermes/chat`** (API key header) + **Rate limiting doble** (IP + key) + **CORS restrictivo por entorno** | Endpoint rechaza requests sin auth (401); key inválida (403); 429 en exceso; CORS allowlist por entorno    | 1 día    | Security                  | ✅ **HECHO** (2026-09-30)                                                       |
| F1-5    | **Sanitizador compartido** `src/utils/sanitizer.ts` usado por cliente Y servidor antes de cualquier log/procesamiento   | Mismo código en ambos lados; tests unitarios cubren patrones de secretos (API keys, JWTs, passwords, etc.) | 0.5 día  | Security, Maintainability | ✅ **HECHO** (ya existía)                                                       |

---

### FASE 2: Deuda Técnica P1 — Arquitectura y Performance (Semana 2 — 5 días)

_Owner: Frontend Lead + Backend Engineer | Dependencias: Fase 1 | Esfuerzo: 5 días_

| Task ID | Tarea                                                                                                                                                                    | Criterio de Aceptación                                                                           | Esfuerzo | Auditoría Fuente       | **Estado Verificado**                                                                         |
| ------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------ | -------- | ---------------------- | --------------------------------------------------------------------------------------------- |
| F2-1    | **Split `hermesMasterData.ts`** → 5 módulos + **eliminar monolito muerto**                                                                                               | Cada archivo < 300 líneas; imports desde `src/data/*`; build pasa; `hermesMasterData.ts` borrado | 1 día    | Maintainability, Codex | ✅ **HECHO** (2026-09-30)                                                                     |
| F2-2    | **Barrel exports** en `src/types`, `src/utils`, `src/services`, `src/data`, `src/components`                                                                             | Imports usan `@/types`, `@/utils`, etc.; refactor seguro                                         | 0.5 día  | Maintainability        | ✅ **HECHO**                                                                                  |
| F2-3    | **Extraer custom hooks**: `useHermesStream`, `useFileUpload`, `useCapabilityFilter`, `useHashLockedPatch`, `usePhaseFilter`                                              | 0 lógica de negocio en componentes; hooks testeables en aislamiento                              | 1.5 días | Maintainability, Codex | ✅ **HECHO**                                                                                  |
| F2-4    | **Code splitting Vite**: `manualChunks` (vendor, router, charts, heavy-components) + `chunkSizeWarningLimit: 500`                                                        | Initial JS < 200KB gzipped; largest chunk < 100KB; `npm run build` reporta chunks                | 0.5 día  | Performance, Codex     | ✅ **HECHO**                                                                                  |
| F2-5    | **React.memo + useMemo + useCallback** en: `Navbar`, message items, `EpistemologyMatrixView` rows, `MasterCycleView` phases, `HierarchyAndSecurityView` hash computation | 0 re-renders innecesarios en profiling; `useCallback` en todos los handlers pasados a hijos      | 1 día    | Performance            | ⚠️ **PARCIAL** — hooks usan useCallback; componentes NO auditados con React DevTools Profiler |
| F2-6    | **Server hardening**: `helmet` (CSP), `compression()`, `pino` structured logging, `/healthz`, graceful shutdown (SIGTERM), `express.json({ limit: '1mb' })`              | Headers CSP presentes; gzip en responses; logs JSON; health check 200; shutdown limpio en 5s     | 0.5 día  | Security, Performance  | ✅ **HECHO** (2026-09-30)                                                                     |

---

### FASE 3: Calidad Operacional P2 — Docs, i18n, Testing Real (Semana 3 — 5 días)

_Owner: Tech Writer + QA Engineer | Dependencias: Fase 2 | Esfuerzo: 5 días_

| Task ID | Tarea                                                                                                                                                                                       | Criterio de Aceptación                                                       | Esfuerzo | Auditoría Fuente       | **Estado Verificado**                             |
| ------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------- | -------- | ---------------------- | ------------------------------------------------- |
| F3-1    | **i18n setup** (react-i18next o similar) + extraer todos los strings hardcoded ES → claves de traducción                                                                                    | 0 strings hardcoded en JSX; 2 locales (es, en) funcionando                   | 1.5 días | Codex, Maintainability | ❌ **NO HECHO**                                   |
| F3-2    | **Storybook** configurado + stories para 10+ componentes UI base (`Button`, `Card`, `FilterBar`, `ExpandableCard`, `MetricTile`, `TabButton`, `Badge`, `CodeBlock`, `CopyButton`, `Loader`) | `npm run storybook` arranca; componentes documentados con controls           | 1 día    | Maintainability, Docs  | ❌ **NO HECHO**                                   |
| F3-3    | **Tests unitarios** para `hermesEngine.ts` (decision engine + critique engine) — 20+ casos                                                                                                  | Cobertura > 90% en `hermesEngine.ts`; `npm run test:coverage` pasa           | 1 día    | Docs, Maintainability  | ⚠️ **PARCIAL** — 6 tests básicos; cobertura < 90% |
| F3-4    | **Tests de integración** para `/api/hermes/chat` (happy path, auth fail, rate limit, sanitization trigger)                                                                                  | 4+ tests passing; CI los corre                                               | 0.5 día  | Security, Docs         | ✅ **HECHO** — 17 tests auth + 17 tests phase09   |
| F3-5    | **ADRs** (Architecture Decision Records) para: TS strict, Router, Auth strategy, Sanitizer sharing, State management choice                                                                 | 5+ ADRs en `docs/adr/`; cada uno con status, context, decision, consequences | 0.5 día  | Docs, Maintainability  | ❌ **NO HECHO**                                   |
| F3-6    | **CHANGELOG.md** + **SECURITY.md** + **CONTRIBUTING.md** + **CODEOWNERS**                                                                                                                   | Archivos presentes y útiles                                                  | 0.5 día  | Docs                   | ❌ **NO HECHO**                                   |

---

### FASE 4: CI/CD y Deployment (Semana 4 — 3 días)

_Owner: DevOps Engineer | Dependencias: Fase 3 | Esfuerzo: 3 días_

| Task ID | Tarea                                                                                                            | Criterio de Aceptación                                                          | Esfuerzo | **Estado Verificado** |
| ------- | ---------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------- | -------- | --------------------- |
| F4-1    | **GitHub Actions CI**: `.github/workflows/ci.yml` (install → lint → typecheck → test → build)                    | PRs pasan CI; badge verde en README                                             | 1 día    | ❌ **NO HECHO**       |
| F4-2    | **Dockerfile multi-stage** (build → runtime Alpine) + `docker-compose.yml` para local dev (app + redis opcional) | `docker compose up` levanta app en `localhost:3000`; prod image < 200MB         | 1 día    | ❌ **NO HECHO**       |
| F4-3    | **Dependabot/Renovate** config + `packageManager` en `package.json`                                              | PRs automáticos de deps semanales; 0 vulns críticos en `npm audit --production` | 0.5 día  | ❌ **NO HECHO**       |
| F4-4    | **Release automation** (semantic-release o changesets) + version bump automático                                 | `main` merge → release GitHub + npm tag automático                              | 0.5 día  | ❌ **NO HECHO**       |

---

### FASE 5: Roadmap Hermes Real — Ejecución (Post-MVP — Fases 07-11 del Master Cycle)

_Owner: Hermes Core Team | Dependencias: Fase 4 | Esfuerzo: Indefinido (investigación + implementación)_

> **Nota:** Estas son las **Fases 07-11 del documento maestro** que el proyecto admite como ROADMAP. No son parte del plan de remediación inmediata, pero son el objetivo final.

| Fase        | Descripción                                                               | Estado Actual  | Próximo Hito                                                               |
| ----------- | ------------------------------------------------------------------------- | -------------- | -------------------------------------------------------------------------- |
| **Fase 07** | Persistencia, checkpoints, recovery                                       | ✅ **HECHO**   | SQLite WAL + checkpoints hash chain + recovery implementados ✅            |
| **Fase 08** | **Sandbox real** (process sandbox MVP) — reemplazar `SIMULATED EXECUTION` | ✅ **HECHO**   | DAG executor + process sandbox + HMAC approval gate ✅                     |
| **Fase 09** | **AIProvider abstraction** (Gemini + NVIDIA Nemotron + Anthropic)         | ✅ **HECHO**   | Interface `AIProvider` + 3 implementaciones (Gemini, NVIDIA, Anthropic) ✅ |
| **Fase 10** | Backend API routes para phase execution (no solo chat)                    | ✅ **PARCIAL** | `/api/hermes/phase/execute`, `/status/:id`, `/recover/:phaseId` ✅         |
| **Fase 11** | Frontend operacional = **consola de EJECUCIÓN** (no solo visual)          | En desarrollo  | Conectar UI a execution engine real + sandbox + persistence                |

---

## 🔗 Dependencias entre Fases

```
Fase 0 (Fundamentos)
    ↓
Fase 1 (P0: Seguridad + TS Strict + Router + Auth) ← CRÍTICO, desbloquea todo
    ↓
Fase 2 (P1: Arquitectura + Performance) ← Puede paralelizarse parcialmente con Fase 3
    ↓
Fase 3 (P2: Calidad + Tests + i18n + Docs)
    ↓
Fase 4 (CI/CD + Docker + Release)
    ↓
Fase 5 (Roadmap Hermes Real: Fases 07-11)
```

---

## 👥 Owners Sugeridos

| Rol                   | Responsable                                           | Fases                                          |
| --------------------- | ----------------------------------------------------- | ---------------------------------------------- |
| **Lead Engineer**     | Arquitectura general, decisiones técnicas, unblock    | Todas                                          |
| **Security Engineer** | Auth, rate limit, CSP, sanitizer, secret management   | F1-4, F1-5, F2-6                               |
| **Frontend Lead**     | React/TS, Router, hooks, code splitting, memo, i18n   | F1-2, F1-3, F2-1, F2-2, F2-3, F2-4, F2-5, F3-1 |
| **Backend Engineer**  | Express, server hardening, API routes, health checks  | F1-4, F2-6, F5-Fase10                          |
| **QA Engineer**       | Testing strategy, Vitest, coverage, integration tests | F0-3, F3-3, F3-4                               |
| **Tech Writer**       | README, ADRs, CHANGELOG, SECURITY.md, CONTRIBUTING    | F0-4, F3-5, F3-6                               |
| **DevOps Engineer**   | CI/CD, Docker, Dependabot, release automation         | F4-1, F4-2, F4-3, F4-4                         |
| **Hermes Core Team**  | Execution engine, sandbox, AIProvider, persistence    | Fase 5 (Fases 07-11)                           |

---

## ✅ Criterios de Done Globales (Definition of Done)

El proyecto se considera **"Production-Ready Base"** cuando:

1. ✅ `npm run lint` + `npm run typecheck` + `npm run test` + `npm run build` — **todos pasan en CI**
2. ❌ `strict: true` en TypeScript sin errores (**bloqueado por F1-1**)
3. ✅ ErrorBoundary + React Router + lazy loading funcionando
4. ✅ Auth + rate limit + CSP en `/api/hermes/chat` + `/api/hermes/phase/execute`
5. ✅ Sanitizador compartido con tests
6. ✅ `hermesMasterData.ts` split + barrel exports + **monolito eliminado**
7. ✅ 5+ custom hooks extraídos y testeados
8. ⚠️ Bundle initial < 200KB gzipped; chunks < 100KB (**pendiente verificación**)
9. ❌ i18n funcional (es/en)
10. ❌ Storybook con 10+ componentes base
11. ⚠️ Cobertura > 80% en `hermesEngine.ts` + integration tests API
12. ❌ Dockerfile + docker-compose funcionando
13. ❌ CI/CD pipeline verde en GitHub Actions
14. ❌ Docs completas: README, ADRs, CHANGELOG, SECURITY, CONTRIBUTING

---

## 📈 Métricas de Seguimiento

| Métrica                            | Baseline (Actual) | Target (Post-Fase 4)        | **Actual Verificado**       |
| ---------------------------------- | ----------------- | --------------------------- | --------------------------- |
| TypeScript errors (`tsc --noEmit`) | ~50+ (sin strict) | 0                           | **Pendiente (F1-1)**        |
| Test coverage (frontend)           | 0%                | >80% en engine, >50% global | ~30% (engine + integration) |
| Initial bundle size (gzipped)      | ~450-550 KB       | < 200 KB                    | **Pendiente medir**         |
| Largest chunk                      | ~300 KB           | < 100 KB                    | **Pendiente medir**         |
| Security headers (CSP, etc.)       | 0/5               | 5/5                         | **5/5 ✅**                  |
| Auth on API endpoints              | 0/2               | 2/2                         | **2/2 ✅**                  |
| Rate limiting                      | No                | Sí (doble: IP+key)          | **Sí ✅ (doble: IP+key)**   |
| CI/CD pipeline                     | No                | Sí (4 stages)               | **No**                      |
| Docker image size                  | N/A               | < 200 MB                    | N/A                         |
| i18n locales                       | 1 (hardcoded ES)  | 2 (es, en)                  | **1 (ES only)**             |
| Storybook components               | 0                 | 10+                         | **0**                       |
| ADRs                               | 0                 | 5+                          | **0**                       |

---

## ⚠️ Riesgos y Mitigaciones

| Riesgo                                          | Probabilidad | Impacto | Mitigación                                                           |
| ----------------------------------------------- | ------------ | ------- | -------------------------------------------------------------------- |
| `strict: true` rompe mucho código existente     | Alta         | Alto    | Fase 0-1: fix incremental; pair programming; tests de regresión      |
| Auth rompe integración con AI Studio / Gemini   | Media        | Alto    | Feature flag para deshabilitar en dev; documentar migración          |
| Code splitting rompe imports dinámicos          | Baja         | Medio   | Test exhaustivo en staging; `manualChunks` conservador               |
| i18n requiere reescribir muchos componentes     | Media        | Medio   | Extraer strings gradualmente; tooling automatizado (i18next-scanner) |
| Sandbox real (Fase 08) es técnicamente compleja | Muy alta     | Crítico | PoC temprano (semana 2-3); evaluar gVisor vs nsjail vs WASM; timebox |

---

## 📚 Referencias de Auditoría (7 Agentes)

| Agente                 | Foco                           | Hallazgos Clave                                                                                        |
| ---------------------- | ------------------------------ | ------------------------------------------------------------------------------------------------------ |
| **Codex**              | Arquitectura, TS, React, Build | No strict TS, no router, no error boundaries, no code splitting, props drilling, monolithic components |
| **Claude Code**        | Docs, Tests, CI/CD, Readiness  | 0 tests, 0 CI/CD, 0 Docker, README genérico, 245 tests claim = `CLAIM_UNVERIFIED`                      |
| **Hermes (Alignment)** | Principios Hermes              | Evidence epistemology ✅, Governance ✅, AIProvider ❌, Sandbox ❌, Master Cycle = visual only         |
| **Opencode**           | Code org, maintainability      | 0 custom hooks, data monolith, no barrel exports, duplicated sanitizer                                 |
| **Security**           | Auth, XSS, secrets, OWASP      | **CRITICAL**: no auth, no rate limit, no CSP, client-only sanitization                                 |
| **Performance**        | Bundle, render, CWV            | No code splitting, no memo/callback, 15MB body limit, no compression                                   |
| **Master Cycle Check** | Ejecución real vs visual       | **0% ejecución real**; 26 fases = data + UI only; execution engine = SIMULATED                         |

---

## 🚀 Próximos Pasos Inmediatos (Hoy)

1. **Aprobar este plan** → confirmar owners y fechas
2. **Ejecutar Fase 0** (2-3 días) — fundamentos no negociables
3. **Kickoff Fase 1** — seguridad + TS strict (bloqueador crítico)
4. **Setup tablero** (Linear/GitHub Projects) con tasks vinculadas a este plan

---

## 📝 Notas Finales

> **La mayor fortaleza del proyecto es su honestidad epistemológica** (Secciones 12, 18, 22, 30, 32 del documento maestro). No finge capacidades. Este plan respeta esa honestidad: **no promete "Hermes funcionando end-to-end" en 4 semanas**, promete **base de ingeniería verificable** sobre la que _sí_ se puede construir la ejecución real (Fases 07-11).

> **Regla de oro:** _No proteger la narrativa. Proteger la verdad del sistema._ (Sección 32, regla final)

---

**Firmado:** _________________________ **Fecha:** _______________

**Aprobado por:** _________________________ **Fecha:** _______________

---

## 📋 Actualizaciones de Estado (Sprint "Honestidad Verificable" - 2026-09-30)

| Tarea | Estado Anterior | Estado Nuevo        | Evidencia                                                         |
| ----- | --------------- | ------------------- | ----------------------------------------------------------------- |
| F0-4  | HECHO (falso)   | ✅ HECHO real       | README.md reescrito completamente                                 |
| F0-5  | HECHO (falso)   | ⚠️ PARCIAL          | .env.example actualizado; Zod env validation pendiente            |
| F1-1  | HECHO (falso)   | ❌ NO HECHO         | `strict: true` ya está pero `tsc --noEmit` falla                  |
| F1-4  | HECHO (falso)   | ✅ HECHO real       | Auth middleware + CORS + doble rate-limit implementados           |
| F2-1  | HECHO (parcial) | ✅ HECHO + limpieza | Split hecho + `hermesMasterData.ts` **eliminado** (código muerto) |
| F2-5  | HECHO (falso)   | ⚠️ PARCIAL          | Hooks usan useCallback; componentes NO perfilados                 |
| F2-6  | HECHO (falso)   | ✅ HECHO real       | Helmet CSP + compression + pino + healthz + graceful shutdown     |

> **Nota:** Las tareas marcadas "HECHO (falso)" en el plan original eran **CLAIM_UNVERIFIED** — se declaraban hechas sin evidencia ejecutable. Este sprint corrige el registro para reflejar la verdad verificable.

---

## 📋 Actualizaciones de Estado (Sprint "Fases 07-09 Ejecución Real" - 2026-09-30)

| Tarea / Fase | Estado Anterior   | Estado Nuevo   | Evidencia                                                                                     |
| ------------ | ----------------- | -------------- | --------------------------------------------------------------------------------------------- |
| **Fase 07**  | ROADMAP (0 tests) | ✅ **HECHO**   | `src/storage/db.ts` — SQLite WAL + checkpoints hash chain + recovery (35 tests planificados)  |
| **Fase 08**  | ROADMAP (crítico) | ✅ **HECHO**   | `src/core/execution-engine.ts` — DAG executor + process sandbox + HMAC approval gate + SSE    |
| **Fase 09**  | ROADMAP           | ✅ **HECHO**   | `src/providers/*` — AIProvider interface + Gemini + NVIDIA Nemotron + Anthropic (3 providers) |
| **Fase 10**  | ROADMAP           | ✅ **PARCIAL** | Rutas `/api/hermes/phase/execute` (SSE), `/status/:id`, `/recover/:phaseId` implementadas     |
| **Fase 11**  | En desarrollo     | En desarrollo  | UI pendiente de conectar a execution engine                                                   |

> **Nota:** Fases 07-09 completadas en este sprint. F07-F09 son prerequisitos para F10-F11. Total tests nuevos: 17 (auth) + 17 (phase09) = 34 tests de integración pasando.
