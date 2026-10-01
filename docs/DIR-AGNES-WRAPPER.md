# DIR-AGNES — Documento de Intención y Requisitos

**Proyecto:** AGNES (free-short-video) — Wrapper de Gobierno + UI/UX propia
**Decisor:** Usuario/creador (Nivel 1, Sec. 29)
**Coordinador:** MiMoCode | **Árbitro técnico:** D'Parche SAS
**Fecha:** 2026-10-01 | **Estado:** PENDIENTE DE FIRMA

---

## 1. Intención

Auditar, optimizar y elevar AGNES (generador local de video por API) a un **producto gobernado** que maximice el provecho de la API de generación de video, mediante una capa de control determinista (sin bloqueos creativos) y una UI/UX propia de primer nivel.

## 2. Alcance

**ENTRA (Fase 11, tras firma):**

- Cola de trabajo persistida (SQLite) con estados `PENDING/GENERATING/COMPLETED/FAILED`.
- Idempotencia por hash (doble submit = misma respuesta, no doble gasto).
- Circuit breaker y política de reintentos con reconciliación.
- Almacenamiento propio de los videos (no URLs efímeras).
- Trazabilidad prompt→video→costo (hash SHA-256 encadenado).
- Moderación **opt-in y configurable por el usuario** (por defecto: sin censura).
- Exposición de capacidades de la API que hoy no usa la UI (21:9/4:3/3:4, 960P/2K, multi-referencia, modelos dinámicos, cn_bak, video de referencia).
- UI/UX propia de D'Parche para AGNES (flujo creativo, galería documentada, costos visibles).

**NO ENTRA (fases posteriores):**

- Multiagente autónomo, despliegue cloud, remediación automática, cambio de proveedor de video (salvado por contrato/adapter).

## 3. Requisitos (trazables)

### Funcionales

- RQ-F1: Encolado persistente; tras `kill -9` con cola llena, 100% de tareas reanudan en `pending`.
- RQ-F2: Mismo `idempotency_key` produce una única generación.
- RQ-F3: Circuit breaker: 5 fallos consecutivos del proveedor → OPEN (fail-fast) y cooldown medible.
- RQ-F4: Video generado se descarga y guarda en storage propio con hash.
- RQ-F5: Traza completa: prompt_hash, video_hash, costo, proveedor, tiempos.
- RQ-F6: Moderación opt-in: flag OFF = comportamiento idéntico a hoy; flag ON = bloqueo registrado con razón.
- RQ-F7: Exponer en la UI los parámetros ocultos de la API (ratios 21:9/4:3/3:4, 960P/2K, multi-referencia, video de referencia, modelos dinámicos, cn_bak).
- RQ-F8: Multi-key: añadir claves multiplica throughput (1 submit/min/key hoy).

### No funcionales

- RQ-NF1: Sin regresión: suite existente + E2E simple mantiene umbral base.
- RQ-NF2: Latencia de encolado compatible con política real del proveedor.
- RQ-NF3: Credenciales por variables de entorno; nunca en el repo.
- RQ-NF4: UI usable en flujo creativo continuo (sin recargas manuales).

## 4. Criterios de éxito verificables (evidencia)

Cada RQ lleva prueba automatizable (exit code 0, logs, query SQLite, curl/mocks). La fase se cierra solo con evidencia, no con afirmaciones.

## 5. Restricciones

- `master` queda congelado salvo proceso de cambio formal.
- Decisiones de arquitectura conforme al Documento Maestro (Sec. 7, 10, 12, 15, 21, 29).

## 6. Aprobación

Pendiente de firma del creador. _(Se registra el hash SHA-256 de este documento al firmarse.)_
EOF
cd /Users/edisonrodriguez/orca/workspaces/dparche-sas-project/debate-mesa && HASH=$(shasum -a 256 docs/DIR-AGNES-WRAPPER.md | cut -d' ' -f1); echo "HASH: $HASH"; echo "$HASH" > docs/DIR-AGNES-WRAPPER.md.sha256; git add -A && git commit -m "Fase 10: DIR-AGNES wrapper + hash" 2>&1 | tail -1
