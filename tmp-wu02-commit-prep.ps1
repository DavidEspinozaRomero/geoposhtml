$ErrorActionPreference = 'Stop'
$root = 'C:\Proyectos\gestionEmpleadosHorarios\geoposhtml'

Set-Location -LiteralPath $root

Write-Output '=== status (porcelain) ==='
git status --porcelain=v1

Write-Output ''
Write-Output '=== diff --stat (unstaged) ==='
git diff --stat

Write-Output ''
Write-Output '=== untracked under src ==='
git ls-files --others --exclude-standard | Select-String -Pattern 'src/'

Write-Output ''
Write-Output '=== confirm design-system files exist ==='
@(
  'src/app/components/design-system/design-system-page.component.ts',
  'src/app/components/design-system/design-system-page.component.html',
  'src/app/components/design-system/design-system-page.component.scss',
  'src/app/shared/ui/index.ts',
  'src/app/shared/ui/btn/btn.directive.ts'
) | ForEach-Object {
  $p = Join-Path $root $_
  "{0} -> {1}" -f $_, (Test-Path -LiteralPath $p)
}
