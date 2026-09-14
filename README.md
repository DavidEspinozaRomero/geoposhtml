# GeoLochtml

Employee workday management frontend — check-in/out records, workday scheduling, events, and a monthly calendar grid.

## Stack

- **Angular 21** — standalone components, lazy-loaded routes, signal-based state (no `zone.js`, zoneless change detection)
- **Tailwind CSS** — UI (self-hosted, no CDN; migrated from Bootstrap 5)
- **Vitest** — unit tests
- **ESLint** + **Prettier** — linting and formatting (via Husky + lint-staged on commit)
- **pnpm** — package manager

## Prerequisites

- Node.js (LTS)
- pnpm (`corepack enable pnpm` or `npm install -g pnpm`)
- A running backend API (see [Backend](#backend))

## Backend

This frontend consumes the REST API from the companion project **management-workday-employee** (NestJS, available on `http://localhost:3000` by default). The base URL is configured in `src/environments/environment.ts` (`apiUrl`).

The list endpoints return a paginated envelope (`PaginatedResponse<T>`: `{ data, total, page, limit, totalPages }`); services unwrap `.data`. The `GET /reports/monthly` endpoint (admin reports page) is different: it returns a raw XLSX binary download (`responseType: 'blob'`), with `month` (`YYYY-MM`) and optional `format` (`xlsx` default; `csv`/`pdf` → 501) query params.

## Getting started

```bash
pnpm install
pnpm start        # or: pnpm dev (watch mode)
```

Navigate to `http://localhost:4200/`. Source changes hot-reload automatically.

## Scripts

| Command               | Description                                   |
| --------------------- | --------------------------------------------- |
| `pnpm start`          | Run the dev server (`ng serve`)               |
| `pnpm dev`            | Dev server in watch mode                      |
| `pnpm build`          | Build the production bundle into `dist/`      |
| `pnpm test`           | Run unit tests (Vitest)                       |
| `pnpm lint`           | Lint with ESLint                              |
| `pnpm lint:fix`       | Lint and auto-fix                             |
| `pnpm format`         | Format with Prettier                          |
| `pnpm format:check`   | Check formatting without writing              |

## Testing

Unit tests run with **Vitest** on the project root. Write specs alongside source files (`*.spec.ts`). When mocking Angular services, use `vi.fn()` and synchronous `of()` / `throwError()` — `fakeAsync`, `waitForAsync`, and `fixture.whenStable()` are not supported in this setup. Use `toBe(false)` instead of Jasmine's `toBeFalse()`.

```bash
pnpm test
```

## Architecture

- `src/app/components/` — app-level components: `login`, `not-found` (404 page with a button back to login)
- `src/app/modules/admin/` — admin app: employees, companies, workdays, records, events, calendar, reports
- `src/app/modules/employee/` — employee app: workday, records, calendar
- `src/app/models/` — TypeScript interfaces for API contracts
- `src/app/services/` — HTTP services (`Auth`, `EmployeesService`, `CompaniesService`, `RecordService`, `EventsService`, `WordaysService`, `CalendarService`, `ReportsService`)
- `src/app/pipes/` — filtering pipes
- `src/app/utils/` — shared helpers (e.g. `buildMonthGrid` for the calendar week rows)

### Change detection

Components hold API data in **signals** (`signal<T>()` + `.set()` / `.update()`) so the UI refreshes automatically — `ChangeDetectorRef` is not needed and `zone.js` is not bundled. Keep this pattern when adding new components.

### Calendar grid

The calendar (admin and employee) renders one **week per row** and one **day per column** (Mon–Sun). Each day is a card whose background color reflects its status (`complete`, `partial`, `absent`, `rest`, `event`) and shows icon buttons (records, events, incidents, workday) that open a detail modal. `buildMonthGrid()` in `src/app/utils/calendar-grid.util.ts` arranges the flat API day list into week rows.

## Deployment

The app is a static SPA — build and host the `dist/` output on any static host (Netlify, Vercel, GitHub Pages, Nginx).

- Configure the **backend URL** in `src/environments/environment.ts` before building for production (the backend must allow CORS for the frontend origin).
- Configure the host's **SPA redirect** so unknown paths serve `index.html` (the app then shows its built-in 404 page).
- Demo data reset is a backend concern: seed with sample data and schedule a periodic re-seed (e.g. `@nestjs/schedule`).

## Code scaffolding

```bash
pnpm ng generate component component-name
# also: directive | pipe | service | class | guard | interface | enum | module
```