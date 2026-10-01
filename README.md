# D'Parche SAS — Hermes Agent Governance Console

> **Consola de gobernanza para Hermes Agent** — Sistema de ingeniería, gobierno y operación de sistemas digitales complejos.

## Descripción

Esta es la consola de gobernanza (frontend + backend API) para **Hermes**, un sistema de ingeniería, gobierno y operación capaz de diseñar, construir, validar, desplegar, operar, mantener y evolucionar sistemas digitales complejos —incluyendo software tradicional, agentes de IA y sistemas multiagente— a partir de cualquier intención, requisito, conocimiento, artefacto o sistema existente.

**Estado actual:** Base de ingeniería verificable (Fases 0-9 completadas). Hermes **no existe todavía** como sistema ejecutable end-to-end completo, pero ya tiene **execution engine real + persistencia + AIProvider multi-modelo** operativos. Esta consola proporciona la interfaz de gobierno, visualización epistemológica, cockpit de arquitectura y **ejecución real de fases en sandbox**. La ejecución completa end-to-end (Fases 10-11 del Master Cycle) está en roadmap.

## Arquitectura

```
┌─────────────────────────────────────────────────────────────┐
│                      Hermes Console                         │
├─────────────────────────────────────────────────────────────┤
│  Frontend (React 19 + TypeScript + Vite + Tailwind 4)      │
│  ├── Chat View (Hermes Core interaction)                   │
│  ├── Document Master View (32 sections)                    │
│  ├── Epistemology Matrix (8 states)                        │
│  ├── Decision Engine (architecture verdicts)               │
│  ├── Master Cycle View (26 phases)                         │
│  ├── Phases Readiness (test evidence)                      │
│  ├── Critical Counterpart (adversarial review)             │
│  └── Hierarchy & Security (governance doctrine)            │
├─────────────────────────────────────────────────────────────┤
│  Backend API (Express + Node.js)                           │
│  ├── POST /api/hermes/chat (SSE streaming, auth required)  │
│  ├── POST /api/hermes/phase/execute (SSE, auth required)   │
│  ├── GET  /api/hermes/phase/status/:executionId            │
│  ├── POST /api/hermes/phase/recover/:phaseId               │
│  ├── GET  /healthz                                         │
│  └── Static file serving (production)                      │
├─────────────────────────────────────────────────────────────┤
│  Shared Libraries                                          │
│  ├── Sanitizer (secret boundary, SHA-256)                  │
│  ├── Hermes Engine (decision + critique logic)             │
│  ├── System Prompt (single source of truth)                │
│  ├── Auth Config (API key hashing, CORS, rate limiting)    │
│  ├── AIProvider (Gemini + NVIDIA + Anthropic, swappable)   │
│  ├── Execution Engine (DAG executor + process sandbox)     │
│  └── Storage (SQLite WAL + checkpoints + recovery)         │
└─────────────────────────────────────────────────────────────┘
```

## Stack Tecnológico

| Capa      | Tecnología                                                                                                     |
| --------- | -------------------------------------------------------------------------------------------------------------- |
| Frontend  | React 19, TypeScript (strict), Vite 6, Tailwind CSS 4, React Router 6                                          |
| Backend   | Express 4, TypeScript, tsx (dev), Node.js 20+                                                                  |
| IA        | Google GenAI SDK (@google/genai), OpenAI SDK, Anthropic SDK, Gemini 2.0/1.5, NVIDIA Nemotron, Anthropic Claude |
| Seguridad | Helmet, express-rate-limit, custom auth middleware, sanitizer                                                  |
| Testing   | Vitest, React Testing Library, jsdom                                                                           |
| Calidad   | ESLint (flat config), Prettier, Husky, lint-staged, TypeScript strict                                          |

## Inicio Rápido

### Prerrequisitos

- Node.js >= 20.0.0 (ver `.nvmrc`)
- API Keys: Google Gemini (requerido), NVIDIA (opcional), Anthropic (opcional)

### Instalación

```bash
# Clonar e instalar dependencias
git clone <repo-url>
cd debate-mesa
npm install

# Configurar variables de entorno
cp .env.example .env.local
# Editar .env.local con tus valores:
# GEMINI_API_KEY=tu_api_key_de_gemini
# NVIDIA_API_KEY=tu_api_key_de_nvidia (opcional)
# ANTHROPIC_API_KEY=tu_api_key_de_anthropic (opcional)
# AUTH_KEY_HASHES=sha256_hash1,sha256_hash2  # para autenticación API
# VITE_HERMES_API_KEY=tu_api_key_para_cliente  # misma key, sin hashear
# ALLOWED_ORIGIN=http://localhost:5173  # opcional, para CORS
# REQUIRE_AUTH=false  # solo en desarrollo

# Desarrollo
npm run dev

# Producción
npm run build
npm start
```

### Variables de Entorno

| Variable              | Requerida | Descripción                                                          |
| --------------------- | --------- | -------------------------------------------------------------------- |
| `GEMINI_API_KEY`      | Sí        | API key de Google Gemini para el backend                             |
| `NVIDIA_API_KEY`      | No        | API key de NVIDIA Nemotron (opcional)                                |
| `ANTHROPIC_API_KEY`   | No        | API key de Anthropic Claude (opcional)                               |
| `AUTH_KEY_HASHES`     | En prod   | Hashes SHA-256 (hex) de API keys autorizadas, separados por coma     |
| `VITE_HERMES_API_KEY` | Sí        | API key plana para el cliente (Vite expone VITE_*)                   |
| `ALLOWED_ORIGIN`      | No        | Origen CORS permitido (default: localhost en dev)                    |
| `REQUIRE_AUTH`        | No        | `true` para forzar auth en dev (default: false en dev, true en prod) |
| `NODE_ENV`            | No        | `development` \| `production`                                        |
| `PORT`                | No        | Puerto del servidor (default: 3000)                                  |
| `LOG_LEVEL`           | No        | Nivel de log pino (default: info)                                    |

### Generar Hash de API Key

```bash
# Generar una key aleatoria y su hash SHA-256
node -e "
const crypto = require('crypto');
const key = 'hk_' + crypto.randomBytes(32).toString('hex');
const hash = crypto.createHash('sha256').update(key).digest('hex');
console.log('API Key (guardar seguro):', key);
console.log('Hash para AUTH_KEY_HASHES:', hash);
"
```

## Scripts Disponibles

```bash
npm run dev          # Desarrollo (Vite + Express con HMR)
npm run build        # Build de producción (Vite + compila server.ts)
npm run start        # Ejecuta build de producción
npm run preview      # Preview de build Vite
npm run lint         # ESLint (flat config)
npm run typecheck    # TypeScript strict check (sin emitir)
npm run format       # Prettier --write
npm run test         # Vitest run
npm run test:watch   # Vitest watch mode
npm run test:coverage # Vitest con cobertura
npm run clean        # Limpia dist/
```

## Estructura del Proyecto

```
debate-mesa/
├── src/
│   ├── components/           # Componentes React (8 vistas principales)
│   ├── config/               # Configuración compartida
│   │   ├── auth.ts           # Auth config + key hashing
│   │   ├── systemPrompt.ts   # System prompt único (SSOT)
│   │   └── providers.ts      # AIProvider registry init
│   ├── data/                 # Datos estáticos (módulos barrel)
│   │   ├── modules/          # masterSections, cyclePhases, etc.
│   │   └── index.ts
│   ├── hooks/                # Custom hooks (useHermesStream, etc.)
│   ├── middleware/           # Express middleware (auth, CORS)
│   ├── services/             # Cliente API (hermesClient.ts)
│   ├── types/                # Tipos TypeScript (hermes.ts)
│   ├── utils/                # Utilidades compartidas
│   │   ├── sanitizer.ts      # Secret boundary + SHA-256
│   │   ├── hermesEngine.ts   # Decision + critique engine
│   │   └── hermesEngine.test.ts
│   ├── core/                 # Execution Engine (Fase 08)
│   │   ├── execution-engine.ts
│   │   └── index.ts
│   ├── providers/            # AIProviders (Fase 09)
│   │   ├── ai-provider.ts    # Interface + Registry
│   │   ├── gemini.ts         # Google GenAI
│   │   ├── nvidia.ts         # NVIDIA Nemotron
│   │   ├── anthropic.ts      # Anthropic Claude
│   │   ├── init.ts           # Provider initialization
│   │   └── index.ts
│   ├── storage/              # Persistence (Fase 07)
│   │   ├── db.ts             # SQLite WAL + checkpoints
│   │   └── index.ts
│   ├── App.tsx               # App principal + Router + ErrorBoundary
│   └── main.tsx              # Entry point
├── server.ts                 # Express server + API endpoints
├── package.json
├── tsconfig.json             # TypeScript strict
├── vite.config.ts            # Vite + manualChunks + Tailwind
├── vitest.config.ts          # Vitest config
├── eslint.config.mjs         # ESLint flat config
├── .env.example              # Template de variables de entorno
├── .nvmrc                    # Node version
├── WORK_PLAN.md              # Plan de remediación (4 fases + roadmap)
├── DEBATE.md                 # Mesa de debate técnico
└── docs/
    └── HERMES_MASTER_CONTINUITY_V1.md  # Documento maestro (32 secciones)
```

## Vistas de la Consola

| Ruta            | Vista                    | Descripción                                  |
| --------------- | ------------------------ | -------------------------------------------- |
| `/chat`         | HermesChatView           | Chat streaming con Hermes Core (SSE)         |
| `/document`     | DocumentMasterView       | 32 secciones del documento maestro           |
| `/epistemology` | EpistemologyMatrixView   | Matriz de 8 estados epistemológicos          |
| `/decision`     | DecisionEngineView       | Motor de decisiones de arquitectura          |
| `/cycle`        | MasterCycleView          | 26 fases del Ciclo Maestro                   |
| `/readiness`    | PhasesReadinessView      | Estado de fases (tests, evidencia)           |
| `/critic`       | CriticalCounterpartView  | Contraparte crítica + hash-locked patch demo |
| `/hierarchy`    | HierarchyAndSecurityView | Jerarquía de fuentes + doctrinas             |

## Seguridad

- **Autenticación obligatoria en producción**: Bearer token (API key) validado contra hashes SHA-256 en `AUTH_KEY_HASHES`
- **Rate limiting doble**: Por IP (60/min) + por API key (30/min)
- **Sanitización de secretos**: Frontera compartida (cliente + servidor) antes de cualquier egress a LLM/logs
- **CSP estricto**: Sin `'unsafe-inline'` en producción (nonces en dev para HMR)
- **Headers de seguridad**: COOP, CORP, HSTS, X-Frame-Options, Referrer-Policy
- **CORS restrictivo**: Allowlist por entorno (`ALLOWED_ORIGIN`)
- **Logs sanitizados**: Redacción automática de `Authorization` header y contenido sensible

## Epistemología (8 Estados)

Hermes distingue rigurosamente:

1. **DISCOVERED** — Se conoce la existencia
2. **INSTALLED** — Código presente en filesystem
3. **AVAILABLE** — Puede invocarse (permisos, deps)
4. **EXECUTABLE** — Se ha ejecutado al menos una vez
5. **AUTHORIZED** — Aprobado por política de Hermes Core
6. **GOVERNED** — Bajo control de Hermes Core (sandbox, cuotas)
7. **VERIFIED** — Evidencia forense de correctitud (tests, auditoría)
8. **PRODUCTION_READY** — Verificado + operado en producción sin incidentes

> **Regla:** Una afirmación de LLM no es evidencia. Se exige código de salida 0 y pruebas reales.

## Ciclo Maestro (26 Fases)

Fases completadas (gobernanza): 01-06 (245 tests en codebase separado)

- Fase 01: Domain Types (57/57)
- Fase 02: Evidence/Claims (41/41)
- Fase 03: Policy Engine (17/17)
- Fase 04: Secret Boundary + Egress (42/42)
- Fase 05: Validation (38/38)
- Fase 06: State Machine (50/50)

**Fases completadas (ejecución real): 07-09**

- Fase 07: **Persistencia, checkpoints, recovery** — SQLite WAL + hash chain + recovery ✅
- Fase 08: **Ejecución Real y Sandbox** — DAG executor + process sandbox + HMAC approval gate ✅
- Fase 09: **AIProvider Abstraction** — Gemini + NVIDIA Nemotron + Anthropic, swappable ✅

En roadmap (ejecución real): 10-11

- Fase 10: Backend API routes para ejecución de fases (parcialmente completado)
- Fase 11: Frontend operacional = consola de EJECUCIÓN (no solo visual)

## Testing

```bash
# Ejecutar todos los tests
npm run test

# Con cobertura
npm run test:coverage

# Tests de integración auth (requiere server corriendo)
# Ver src/test/integration/auth.test.ts

# Tests de integración Fase 09 (providers + execute)
# Ver src/test/integration/phase09.test.ts
```

## CI/CD

Pipeline definido en `.github/workflows/ci.yml` (pendiente de crear en Fase 4):

1. Install dependencies
2. Lint (ESLint)
3. Typecheck (tsc --noEmit)
4. Test (Vitest + coverage)
5. Build (Vite)

## Documentación

- **WORK_PLAN.md** — Plan de remediación en 4 fases + roadmap Fases 07-11
- **DEBATE.md** — Mesa de debate técnico (análisis independientes + revisiones cruzadas)
- **docs/HERMES_MASTER_CONTINUITY_V1.md** — Documento maestro (32 secciones, fuente de verdad)
- **src/data/modules/** — Datos estructurados del documento maestro

## Principios de Ingeniería (del Documento Maestro)

1. **Corrección → Evidencia → Seguridad → Arquitectura → Utilidad → Velocidad**
2. **No proteger la narrativa. Proteger la verdad del sistema.**
3. **Hermes debe poder decidir NO USAR AGENTES** (multiagente no es fin en sí mismo)
4. **Autoridad soberana en Hermes Core** — LLMs/agentes son subordinados
5. **Model-agnosticismo** — AIProvider desacoplado
6. **Evidencia forense** — CLAIM_UNVERIFIED hasta prueba reproducible
7. **Sandbox obligatorio** — Para cualquier side effect
8. **Aprobación criptográfica** — Hash-locked (SHA-256)

## Contribuir

1. Lee `WORK_PLAN.md` y `DEBATE.md` para entender el estado actual
2. Ejecuta `npm run lint && npm run typecheck && npm run test` antes de commit
3. Husky pre-commit bloquea commits sucios
4. Abre PR con descripción del cambio y evidencia de tests

## Licencia

Apache-2.0 — Ver `LICENSE` (pendiente)

---

**Regla final:** _No proteger la narrativa. Proteger la verdad del sistema._ (Sección 32, Documento Maestro V1)
