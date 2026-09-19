import { Component, computed, signal } from '@angular/core';
import { LucideX } from '@lucide/angular';

import {
  AppBadgeDirective,
  AppBtnDirective,
  AppCardBodyDirective,
  AppCardDirective,
  AppCardHeaderDirective,
  AppFilterLabelDirective,
  AppFilterSectionDirective,
  AppInputDirective,
  AppSelectDirective,
  AppTableDirective,
  AppTdDirective,
  AppThDirective,
  AppTrBodyDirective,
  AppTrHeadDirective,
  FormFieldComponent,
  statusClasses,
  statusVariant,
} from '../../shared/ui';
import { AppDialogComponent } from '../../shared/ui/dialog/dialog.component';

/** Swatch estático: clase de color real del proyecto + hex del token (WU01). */
interface ColorSwatch {
  name: string;
  token: string;
  hex: string;
  className: string;
}

/** Fila demo de la tabla de empleados. */
interface DemoEmployee {
  name: string;
  company: string;
  status: string;
  hours: string;
}

/** Valores de `--app-color-*` de `_tokens.scss` con su clase Tailwind espejo. */
const COLOR_SWATCHES: ColorSwatch[] = [
  { name: 'primary', token: '--app-color-primary', hex: '#2563eb', className: 'bg-blue-600' },
  {
    name: 'primary-hover',
    token: '--app-color-primary-hover',
    hex: '#1d4ed8',
    className: 'bg-blue-700',
  },
  { name: 'info', token: '--app-color-info', hex: '#3b82f6', className: 'bg-blue-500' },
  { name: 'success', token: '--app-color-success', hex: '#16a34a', className: 'bg-green-600' },
  { name: 'warning', token: '--app-color-warning', hex: '#facc15', className: 'bg-yellow-400' },
  { name: 'danger', token: '--app-color-danger', hex: '#dc2626', className: 'bg-red-600' },
  { name: 'neutral', token: '--app-color-neutral', hex: '#9ca3af', className: 'bg-gray-400' },
  { name: 'surface', token: '--app-color-surface', hex: '#ffffff', className: 'bg-white' },
  { name: 'text', token: '--app-color-text', hex: '#334155', className: 'bg-slate-700' },
  {
    name: 'text-light',
    token: '--app-color-text-light',
    hex: '#64748b',
    className: 'bg-slate-500',
  },
  { name: 'border', token: '--app-color-border', hex: '#e2e8f0', className: 'bg-slate-200' },
];

export type BtnVariant = 'primary' | 'secondary' | 'danger' | 'ghost';
export type BtnSize = 'sm' | 'md' | 'lg';
export type BadgeVariant = 'primary' | 'success' | 'warning' | 'danger' | 'neutral' | 'info';

const BTN_VARIANTS: BtnVariant[] = ['primary', 'secondary', 'danger', 'ghost'];
const BTN_SIZES: BtnSize[] = ['sm', 'md', 'lg'];
const BADGE_VARIANTS: BadgeVariant[] = [
  'primary',
  'success',
  'warning',
  'danger',
  'neutral',
  'info',
];

const DEMO_EMPLOYEES: DemoEmployee[] = [
  { name: 'María López', company: 'TechCorp', status: 'complete', hours: '08:00 – 17:00' },
  { name: 'Juan Pérez', company: 'LogiTrans', status: 'partial', hours: '09:30 – 14:00' },
  { name: 'Ana Gómez', company: 'TechCorp', status: 'absent', hours: '—' },
  { name: 'Carlos Ruiz', company: 'Comercio Sur', status: 'rest', hours: '—' },
  { name: 'Lucía Fernández', company: 'LogiTrans', status: 'event', hours: '10:00 – 13:00' },
];

/**
 * Página playground del sistema de diseño (WU02). Demo interactiva de las
 * primitivas compartidas de WU01: colores, tipografía, botones, badges,
 * inputs, cards, tabla, filtros y dialog. Estado interactivo con signals.
 */
@Component({
  selector: 'app-design-system-page',
  standalone: true,
  imports: [
    AppBadgeDirective,
    AppBtnDirective,
    AppCardBodyDirective,
    AppCardDirective,
    AppCardHeaderDirective,
    AppDialogComponent,
    AppFilterLabelDirective,
    AppFilterSectionDirective,
    AppInputDirective,
    AppSelectDirective,
    AppTableDirective,
    AppTdDirective,
    AppThDirective,
    AppTrBodyDirective,
    AppTrHeadDirective,
    FormFieldComponent,
    LucideX,
  ],
  templateUrl: './design-system-page.component.html',
  styleUrl: './design-system-page.component.scss',
})
export class DesignSystemPageComponent {
  readonly colorSwatches = COLOR_SWATCHES;
  readonly btnVariants = BTN_VARIANTS;
  readonly btnSizes = BTN_SIZES;
  readonly badgeVariants = BADGE_VARIANTS;
  readonly statusClasses = statusClasses;
  readonly statusVariant = statusVariant;
  readonly statusKeys = Object.keys(statusClasses);
  readonly demoEmployees = DEMO_EMPLOYEES;

  /** Botones demo: deshabilita la grilla completa y cuenta clics reales. */
  readonly buttonsDisabled = signal(false);
  readonly clickCount = signal(0);

  /** Inputs demo: conmuta el estado de error del form-field. */
  readonly showError = signal(false);
  readonly emailError = computed(() =>
    this.showError() ? 'Ingrese un correo electrónico válido.' : undefined,
  );

  /** Dialog demo. */
  readonly dialogOpen = signal(false);

  incrementClicks(): void {
    this.clickCount.update((n) => n + 1);
  }
}
