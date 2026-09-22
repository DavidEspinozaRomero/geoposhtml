# ODD — Design System (página /design-system + shared primitives)

## Objetivo
Crear una **página `/design-system`** a nivel de raíz (junto a '' landing y /roadmap), accesible tanto para admin como employee, que sirva como **showcase + playground interactivo** del sistema de diseño, y refactorizar los componentes existentes (admin + employee + landing/roadmap) para consumir esas primitivas en vez de repetir clases Tailwind/SCSS duplicadas.

## Problema
Existe duplicación masiva de clases Tailwind en todos los componentes admin y employee: botones primarios (`bg-blue-600...hover:bg-blue-700`), filtros (`bg-sky-100 rounded-xl p-4`), headers de tabla (`text-xs font-semibold uppercase tracking-wide text-slate-500`), selects/inputs idénticos `rounded-lg border-slate-300 focus:bl...`, y SCSS/sass legacy repetido. No hay un lugar central donde vivan/documenten los tokens, estados (loading/error/empty), badges de estado, primitivas de modal, etc. La migración a Tailwind dejó residuos.

## Por qué
- Misma UI duplicada N veces (drift por copia-pegar).
- Cambios de look & feel tocan archivos por todos lados.
- El refactor llega como **forecast >400 líneas** → entrega **chained/stacked-to-main** (PRs stacked, aprobado en forecast) y **ODD** (no SDD): doc de tareas + commits por work-unit, native interactivo.

## Alcance
- **shared/**: primitivas reutilizables (`src/app/shared/ui/`: barrel `index.ts`, `badge/`, `btn/`, `card/`, `filter/`, `form-field/`, `icon-map.ts`, `input/`, `table/`). **Sin** barrel de shared/ui → refactor NO arranca (gate).
- **Página `/design-system`** a nivel raíz (lazy en `app.routes.ts`, junto a '' y /roadmap), standalone, en español, accesible desde menú admin + menú employee + landing.
- **Refactor (ODD stacked-to-main)**:
  - **Batch admin A (WU01)**: `employees` + `companies` (+ sus **modals singular**: `employee-modal/`, `company-modal/` — NO plural).
  - **Batch admin B (WU02)**: `workday` (NO tiene modal propio; el `day-modal/` de admin pertenece a calendar → batch C).
  - **Batch admin C (WU03)**: `records` + `records-modal/`, `events` + `events-modal/`, `calendar`.
  - **Batch admin D (WU04)**: `reports` + `reports-modal/`, `logs` + `logs-modal/`.
  - **Batch employee (WU05)**: `workday` (employee), `records`, `calendary`.
  - **Batch landing/roadmap (WU06)**: landing + roadmap + roadmap-page.
  - Todos conservan comportamiento, guards, UI en español y modales funcionando.
- **`.gitignore`**: `tmp-wu*.ps1` + `gestionar-*.ps1` (powerole scripts usados para delegar gates; se borran del repo).

## Tareas
1. T1 — Primitivas ui en `shared/` (barrel + badge/btn/card/filter/form-field/icon-map/input/table) [WU01].
2. T2 — Página `/design-system` (raíz) [WU01].
3. T3 — Ruta `/design-system` en `app.routes.ts` + acceso desde menú admin + menú employee [WU02].
4. T4 — Refactor admin batch A: employees + companies (+ modals **singular**) [WU03].
5. T5 — Refactor admin batch B: workday (✅ commit `7b455d1`; sin modal propio) [WU03].
6. T6 — Refactor admin batch C: records ✅ + records-modal ✅, events ✅ + events-modal ✅, calendar ✅ (+ day-modal) [WU03] (commit `0bc2f42`).
7. T7 — Refactor admin batch D: reports ✅ + logs ✅ (NO existen reports-modal/logs-modal, verificado) [WU03].
8. T8 — Refactor employee batch: workday ✅ + records ✅ + calendary ✅ + record-modal ✅ + calendary-modal ✅ [WU03].
9. T9 — Refactor landing ✅ + roadmap ✅ (NO existe roadmap-page; design-system estable fuera de alcance) [WU03].
10. T10 — Limpieza final: remover primitivas no usadas + doc ✅ — auditoría: **0 primitivas sin uso** (478 refs externas / 44 archivos; el playground `design-system` mantiene vivo el barrel completo: badge, btn, card, filter, form-field, icon-map, input, table, dialog). Árbol limpio, build exit 0. FEATURE COMPLETA (T1–T10).

## Criterios de aceptación
- `ng build` (proxy = `npm run build`) verde sin errores.
- El barrel `src/app/shared/ui/index.ts` exporta toda primitiva; no hay imports directos a modales plural que no existen.
- Cada página admin/employee usa primitivas de `shared/ui` (btn, input, card, filter, table, badges) en lugar de clases Tailwind duplicadas y duplicación de tokens.
- UI en español, behavior y guards intactos, modales siguen abriendo (empleado/empresa/workday/records/events/reports/logs/calendar).
- Forecast assert: los modales admin que se refactorizan NO crean paths inexistentes (el gotcha: `employee-modal/`/`company-modal/` singular, no `employees-modal/`).

## Estado / Notas
- Forecast gate final: `PASS` — /design-system con 3 archivos + primitivas + build inicial ok. Gates por WU02 (PASS: barrel + 3 archivos + build 10.19s chunk lazy) y WU03 forecast-check (PASS: employees/companies + modales singular existentes, barrel 8 exports).
- Interactivo: pausa + pregunta en cada gate. Stacked-to-main para el forecast.
- **T5 (admin batch B) PASS**: workday refactorizado a primitivas (`7b455d1`, build 0 errores, scss eliminado). Descubrimiento de path: `workday-modal/` NO existe — workday no tiene modal; el `day-modal/` es de calendar (batch C). RDD ON (global): assess post-commit pendiente por slice.
- Tareas pintadas en español. `tmp-wu*.ps1` gitignored (se limpian del repo).
- **Miércoles ODD:** el forecast usa `odd/tasks` (Engram) para doc de tareas; los paths admin usan **sigular** modals (empleos/empresas employee-modal/company-modal).
- Commit de sanity WU00: en HEAD (fail el forecast de semántica previo, corregido con WU01-verifier).
- PASAR de forecast a forecast: al delegar cada WU, forecast-check gate verifica paths en disco + barrel antes de delegar; verifier del worker verifica en disco+glob antes de reportar; build gate corre build real.
- **Slice 1 REVIEWED (medium → deferido a slice → approved/burned)**: `review-1897b8f539a91ab9` (lens unique `review-reliability`, 608 líneas, 22 paths, base `96c0b312`); acknowledged `sha256:732c370a`, authority burned. Advisory no bloqueante (follow-up): R3-AdminRefactorUnproved (WARNING — sin assert nuevo para componentes admin refactorizados), R3-HasErrorContractUnverified (WARNING — equivalencia `[hasError]` depende de AppInputDirective fuera del candidato), R3-HostClassCompositionUntested (SUGGESTION — composición host-class de directivas sin smoke test).
- Fix runtime reviewer: modelos review-* en config global → `opencode/big-pickle` (free; `deepseek-v4-flash-free` no existe en el runtime).
- **T6 (admin batch C) PASS**: `0bc2f42` — events + events-modal + calendar + day-modal adoptaron primitivas; se borraron `events.component.css` y `events-modal.component.scss` (vacíos); specs intactos; build spot-check exit 0 (warning Sass pre-existente); ng test no lanza (runner roto conocido). RDD assess → **medium** (executable calendar.html), 10 paths / 173 líneas, base `1b4d90b` → **deferido a cierre de slice 2** (budget 400 no alcanzado).
- **T7 (admin batch D) PASS**: `4f8d1a1` — reports (card/body/filterLabel/input/btn) + logs (placeholder; sin markup aplicable); se borraron `reports.component.scss` y `logs.component.css` (vacíos; **no existen reports-modal/logs-modal**); specs intactos; build spot-check exit 0; `npm test` 136/136 passed con 13 rechazos HttpErrorResponse ajenos (specs con fetch a localhost:3000 sin backend, ambiental). RDD assess → **medium**, 15 paths / 205 líneas base `1b4d90b` → **deferido**.
- **T8 (employee batch) PASS**: `a1cbde4` — workday + records + calendary + record-modal + calendary-modal a primitivas; borrados `records.component.scss` y `record-modal.component.scss` (vacíos); modales chrome raw (record-modal body es read-only, sin markup convertible); `[hasError]` coerced con `!!` (misma forma que el util de admin); specs intactos; build spot-check exit 0; npm test exit 1 por 12 rechazos HttpErrorResponse ajenos (admin specs a localhost:3000, ambiental). RDD assess → **medium**, 26 paths / **386 líneas** base `1b4d90b` → **CIERRE DE SLICE 2** (budget 400 alcanzado) → preflight STATUS now.
- **Slice 2 REVIEWED (medium → approved/burned)**: `review-23e7c2899c9e317b` (lens `review-reliability`, 26 paths / 389 líneas, base `bf3d407e`); acknowledged `sha256:34c18f69`, authority burned. Advisory no bloqueante (follow-up): R3-NoTestCoverageForUiRefactor (WARNING), R3-StatusVariantUnguardedLookup (WARNING — `statusVariant[key]` sin fallback para keys desconocidas), R3-HasErrorDirectiveContractUnverified (WARNING), R3-ReportsDisabledAffordanceUnproved (WARNING — `disabled` visual sin utilidades), R3-EventsStatusBadgeNotMigrated (SUGGESTION).
- **T9 (landing + roadmap) PASS**: `179399e` — feature cards/timeline → `appCard` (clases co-located `feature-card`/`timeline-card` conservadas), badges → `appBadge` (variantes success/primary/warning/danger); links/routerLinks byte-idénticos (11 landing + 3 roadmap, spec intacto); CTAs pill/amber "Próximamente"/paneles tintados raw a propósito (las clases del directive los pisarían); scss de ambos componentes reales → conservados; build exit 0; npm test 136/136 passed. RDD assess → **medium**, 5 paths / 91 líneas base `9f20cc9` → **deferido a cierre de slice 3**. NOTA: **no existe `roadmap-page`**.
- **T10 (limpieza) PASS (no-op)**: auditoría conservadora del barrel — todos los exports tienen refs externas vivas (478 en 44 archivos); nada removido; tree limpio; build exit 0. **FEATURE COMPLETA T1–T10.** → cierre de slice 3 (preflight STATUS con base `9f20cc9`).
