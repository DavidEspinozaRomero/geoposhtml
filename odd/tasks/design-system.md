# ODD — Design System (página /design-system + shared primitives)

## Objetivo

Crear una página `/design-system` a nivel de raíz (junto a '' landing y /roadmap), accesible tanto para admin como employee, que sirva como **showcase + playground interactivo** de las primitivas UI compartidas, y refactorizar los componentes existentes para consumir esas primitivas en vez de repetir clases Tailwind/SCSS duplicadas.

## Problema

Existe duplicación masiva de clases Tailwind en todos los componentes admin y employee: botones primarios (`bg-blue-600...hover:bg-blue-700`), filtros (`bg-sky-100 rounded-xl p-4`), headers de tabla (`text-xs font-semibold uppercase tracking-wide text-slate-500`), selects/inputs idénticos `rounded-lg border-slate-300 focus:bl` y SCSS/sass legacy repetido. No hay un lugar central donde vivir/documentar los tokens, estados (loading/error/empty), badges de estado, primitivas de modal, etc. La migración a Tailwind dejó residuos: `<h1>` repetidos iguales, clases de estado en `statusClasses`, layout SCSS con border-radius transparentes, logs con SCSS legacy, employees con CSS puro + Tailwind inline.

## Por qué

El usuario pidió "mejora la UI/UX de cada componente del admin module" y derivó a una página `/design-system` (mismo nivel que landing y roadmap) para documentar el diseño system + primitivas compartidas, y luego refactorizar todo el admin + employee hacia esas primitivas. Preflight confirmó: Interactive pace, Engram artifact store, auto PR. El usuario aceptó "Todo en este cambio" (alcance completo) y eligió ODD (Organic-Driven Development) como flujo y **stacked-to-main** como estrategia de entrega.

## Alcance

- Página raíz `/design-system` con playground interactivo (botones, inputs, selects, badges, chips, cards, tablas, búsquedas/filtros, estados de calendario, modales/dialog).
- Primitivas compartidas en `src/app/shared/ui/` (directivas lucide reutilizables, clases de estado, icon-map, token helper, primitivas de modal/botón/input/select/badge/card/table).
- Tokens en `styles.scss` (variables SCSS + clases utilitarias reutilizables).
- Refactor de los 7 componentes admin: employees, companies, workday, records, calendar, events, reports + sus modales.
- Refactor de los componentes employee: workday, calendary, records + modales.
- Arquitectura: primitivas en `shared/`, NUNCA dentro de modules/admin; refactor parcial que conserva el comportamiento existente.

## Restricciones

- Tailwind es la base: NUNCA volver a Bootstrap (los .css/.scss legacy que queden deben migrarse a Tailwind; SCSS solo como apoyo mínimo).
- Conservar comportamiento: guards, roles, filtros, señales, modales de geolocalización, geolocalización funcional.
- No romper la estructura standalone/control flow de Angular 17 (@if/@for).
- Todo artefacto técnico en inglés; UI en español.
- TDD: correr suite existente (`ng test`); si el runner de testeos está roto, reportarlo sin inventar evidencia.
- Entrega: PRs chained/stacked-to-main con commits por work-unit (conventional commits, sin coauthor).

## Tareas

1. T1 — Primitivas ui en `shared/`: botones (primary/secondary/danger), inputs, selects, badges de estado, cards, headers de tabla, secciones de filtro, chips/badges, icon-map (ya existe → ampliar).
2. T2 — Página `/design-system` (raíz): layout de showcase con secciones interactivas (botones, inputs, tablas, badges, modales [demo], colores de estatus, tipografía tokens, roadmap del design system).
3. T3 — Ruta `/design-system` en `app.routes.ts` (raíz) + acceso desde landing (card/link "Design System"). (Menú sidebar se evalúa en refactor de layouts.)
4. T4 — Refactor admin: employees + companies (+ sus modales) hacia primitivas.
5. T5 — Refactor admin: workday + records (+ modales).
6. T6 — Refactor admin: calendar + events (+ day-modal, event-modal, events-modal).
7. T7 — Refactor admin: reports + logs.
8. T8 — Refactor employee: workday, calendary, records (+ record-modal, calendary-modal).
9. T9 — Index barrels: exportar primitivas en `shared/index.ts`, limpiar/renovar `components/index.ts` y `modules/index.ts` donde aplique.
10. T10 — Chequeos finales: `ng build`, `ng test`, commit por work-unit, PRs chained (stacked-to-main).

## Criterios de aceptación

- `/design-system` cargar por la raíz, navegable y con playground funcional (interactivo).
- Los componentes refactorizados conservan su comportamiento (filtros, señales, modales, guard) y pasan la suite existente.
- No quedan clases Bootstrap/Bootstrap mixin sobrantes; primitivas viven en shared; no hay clases duplicadas obvias.
- PRs encadenados hacia main con commits por work-unit.

## Estado / Notas

- **Detección de paths**: la raíz real del repo es `C:\Proyectos\gestionEmpleadosHorarios\geoposhtml` (¡ojo con `gestionEmpleadosHorarios` vs `gestionEmpleadosHorarios`/`geoposhtml` vs `geoposhtml` — hay variantes en el historial). Usar SIEMPRE `C:\Proyectos\gestionEmpleadosHorarios\geoposhtml`.
- **Contexto base**: app.routes.ts usa `LayoutAdminComponent` en `/administrator`, children: employees/companies/workdays/records/calendar/events/reports. Landing jerárquica igual para employee (`/employee`). Shared dialog existe (`shared/ui/dialog`).
- **Forecast**: >400 líneas → entrega ODD chained-stacked-to-main (aprobado).

### Progreso WU T3 — acceso público desde landing

- T3: la ruta `/design-system` ya existía; faltaba el acceso desde la landing.
- Ruta elegida: delegated direct writer, porque el trabajo toca dos archivos fuente no triviales; el límite de esta work unit es el acceso desde landing + su prueba.
- Aceptación: la navegación pública debe renderizar un enlace `routerLink="/design-system"` junto a Roadmap y la spec enfocada debe probar que se renderiza.
- Checks ejecutados: `pnpm exec ng test --watch=false --include=src/app/components/landing/landing.component.spec.ts` ✅ (1 file, 7/7 tests) y `pnpm exec prettier --check src/app/components/landing/landing.component.html src/app/components/landing/landing.component.spec.ts` ✅ después de normalizar ambos archivos.
- Runtime harness: N/A; no hay navegador automatizado disponible en esta sesión. La navegación prevista es `/` → `/design-system` mediante el nuevo enlace público.
- Estado actual: T3 completada en el commit `92f9a93` (`feat(landing): link public design system`). Siguiente unidad: T4, refactor de admin employees + companies hacia las primitivas compartidas.

### Progreso WU T4 — primitivas compartidas en employees + companies

- Ruta: delegated direct writer; el writer edita directamente el límite autorizado.
- Boundary: `employees`, `companies`, `employee-modal` y `company-modal`, incluyendo sus specs.
- Aceptación: reemplazar markup Tailwind duplicado por `appFilter`, `appInput`/`appSelect`, `appBtn`, `appCard`/`appCardBody`, conservar el comportamiento y los shells `AppDialog`.
- Rollback boundary: revertir únicamente los doce archivos T4 y esta sección del documento; no tocar primitivas, servicios, validadores, rutas, layouts ni componentes ajenos.
- Checks: baseline RED no aisló un fallo de aserción; el runner terminó con 12/12 tests y 1 error no controlado de red hacia `http://localhost:3000/companies`. Tras el refactor, el mismo resultado se mantuvo: compilación correcta, 12/12 tests pasaron y el error de red provocó exit code 1. `pnpm exec prettier --check` sobre los doce archivos fuente/spec pasó.
- Estado actual: T4 completada en el commit `baf8bfc` (`refactor(admin): adopt shared ui primitives for employees and companies`). El fallo de red queda registrado como limitación preexistente del aislamiento de tests, no como fallo visual del refactor. Siguiente unidad: T5, admin workday + records.

### Progreso WU T5 — primitivas compartidas en records y modales

- Ruta: delegated direct writer; el writer edita directamente el límite autorizado.
- Boundary: `records`, `record-modal` y `records-modal`, incluyendo sus specs únicamente si el comportamiento enfocado lo requiere; `workday` queda diferido a otra unidad.
- Aceptación: reemplazar markup Tailwind duplicado por `appInput`/`appSelect`, `appTable`/`appTrHead`/`appTrBody`/`appTh`/`appTd` y `appBtn`, conservando filtros actualmente no-op, semántica de modales, estilos bespoke de Cerrar y etiquetas rectangulares de incidencias.
- Rollback boundary: revertir únicamente los archivos T5 de records-family dentro del write scope y esta sección del documento; no tocar primitivas, servicios, validadores, rutas, layouts ni componentes ajenos.
- Checks: baseline RED observado: los 14 tests enfocados pasaron, pero el runner terminó con exit code 1 por errores no controlados de red hacia `http://localhost:3000/employees` y `http://localhost:3000/companies`. Tras el refactor, el mismo runner compiló correctamente, pasó los 14 tests en 5 archivos y terminó con exit code 1 por 7 errores no controlados de red hacia `http://localhost:3000/records`, `http://localhost:3000/employees` y `http://localhost:3000/companies`; se conserva como limitación preexistente del aislamiento de tests. `pnpm exec prettier --check` sobre todos los archivos T5 fuente/spec y este documento pasó después de normalizar con Prettier.
- Runtime harness: N/A; no hay navegador automatizado disponible en esta sesión. La navegación/edición de records queda cubierta por compilación y pruebas enfocadas.
- Estado: T5 completada en el commit `8a258ef` (`refactor(admin): adopt shared ui primitives for records`). El fallo de red queda documentado como limitación preexistente del aislamiento de tests, no como fallo del refactor visual. Siguiente unidad: T5 restante, admin workday.
