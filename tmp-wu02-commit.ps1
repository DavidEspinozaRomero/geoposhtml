$ErrorActionPreference = 'Stop'
$root = 'C:\Proyectos\gestionEmpleadosHorarios\geoposhtml'
Set-Location -LiteralPath $root

git add -A

Write-Output '=== staged stat ==='
git diff --cached --stat

Write-Output ''
Write-Output '=== committing WU01+WU02 (hito design-system) ==='
git commit -m "feat(design-system): shared ui primitives + interactive /design-system page

WU01 (shared/ui primitives):
- tokens semánticos (_tokens.scss) + class-utils + barrel index.ts
- directivas btn (4 variantes x 3 tamanos + disabled), badge (6 variantes),
  input/select (hasError), card (header/body), table (th/td/tr head/body),
  filter (section/label)
- icon-map: +16 entries y statusClasses conservadas
- styles.scss: uso de tokens + fix scroll-lock dialog (body:has)

WU02 (playground /design-system):
- design-system-page standalone lazy: colores, tipografia, botones, badges,
  inputs/form-field, cards, tabla, filtros, dialog demo interactivo (signals)
- ruta raiz /design-system en app.routes.ts
- entradas de menu en layout-admin y layout-employee

Verificacion: ng build OK (10.19s, chunk lazy design-system-page-component)
Entrega: ODD, stacked-to-main (PR chained) - commit work-unit del hito"