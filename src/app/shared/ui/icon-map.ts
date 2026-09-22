import {
  LucideApple,
  LucideBell,
  LucideBriefcase,
  LucideBuilding2,
  LucideCalendarCheck,
  LucideCalendarDays,
  LucideCheck,
  LucideChevronLeft,
  LucideChevronRight,
  LucideCircleArrowRight,
  LucideCircleCheck,
  LucideCircleHelp,
  LucideCircleX,
  LucideClock,
  LucideDot,
  LucideEye,
  LucideFileChartColumn,
  LucideFileDown,
  LucideHouse,
  LucideInfo,
  LucideLayoutGrid,
  LucideLogOut,
  LucideMapPin,
  LucideNotebookText,
  LucidePartyPopper,
  LucidePencil,
  LucideRocket,
  LucideShieldCheck,
  LucideTrash2,
  LucideTriangleAlert,
  LucideUser,
  LucideUserCog,
  LucideUsers,
  type LucideIcon,
} from '@lucide/angular';

import type { BadgeVariant } from './badge/badge.directive';

/**
 * Maps every Bootstrap Icons name used in the codebase to its Lucide
 * equivalent component class. Consumed by templates via [lucideIcon] to
 * render menu icons and any dynamically-dispatched icon (REQ-005).
 *
 * Keys intentionally keep the bi-* name (without the prefix) so the grep
 * guard still finds nothing after migration while the mapping stays
 * auditable. Alias pairs (e.g. geo-alt / geo-alt-fill) share one Lucide
 * component; renames (e.g. info-circle-fill -> LucideInfo) lock the chosen
 * semantics.
 */
export const iconMap = {
  apple: LucideApple,
  'arrow-right-circle': LucideCircleArrowRight,
  balloon: LucidePartyPopper,
  bell: LucideBell,
  'box-arrow-left': LucideLogOut,
  briefcase: LucideBriefcase,
  building: LucideBuilding2,
  'calendar-check': LucideCalendarCheck,
  'calendar-event': LucideCalendarCheck,
  calendar3: LucideCalendarDays,
  'caret-left-fill': LucideChevronLeft,
  'caret-right-fill': LucideChevronRight,
  check: LucideCheck,
  'check-circle-fill': LucideCircleCheck,
  'circle-fill': LucideDot,
  clock: LucideClock,
  'exclamation-triangle': LucideTriangleAlert,
  eye: LucideEye,
  'file-earmark-arrow-down': LucideFileDown,
  'file-earmark-bar-graph': LucideFileChartColumn,
  'geo-alt': LucideMapPin,
  'geo-alt-fill': LucideMapPin,
  'grid-3x3-gap': LucideLayoutGrid,
  'house-door': LucideHouse,
  'info-circle-fill': LucideInfo,
  'journal-text': LucideNotebookText,
  pencil: LucidePencil,
  people: LucideUsers,
  person: LucideUser,
  'person-gear': LucideUserCog,
  'question-circle': LucideCircleHelp,
  'rocket-takeoff': LucideRocket,
  'shield-check': LucideShieldCheck,
  trash: LucideTrash2,
  'x-circle-fill': LucideCircleX,
} satisfies Record<string, LucideIcon>;

/**
 * Tailwind literal classes for the day-status badge in the day/calendary
 * modals (REQ-009). Values must stay in sync with the DayStatus union in
 * models/calendar.model.ts; the `secondary` catch-all key guards unknown
 * statuses and mirrors the `rest` palette.
 */
export const statusClasses: Record<string, string> = {
  complete: 'bg-green-600 text-white',
  partial: 'bg-yellow-400 text-black',
  absent: 'bg-red-600 text-white',
  rest: 'bg-gray-400 text-white',
  secondary: 'bg-gray-400 text-white',
  event: 'bg-blue-500 text-white',
};

/**
 * Maps the same day-status keys to `BadgeVariant` values so consumers can
 * render status badges with `[appBadge] [variant]="statusVariant[day.status]"`
 * once migrated (WU01). Values mirror the `statusClasses` colors above; keep
 * both in sync with the DayStatus union in models/calendar.model.ts. Unknown
 * keys resolve to `secondary` -> `neutral`, and the badge directive adds a
 * final `neutral` fallback for anything still unmapped.
 */
export const statusVariant: Record<string, BadgeVariant> = {
  complete: 'success',
  partial: 'warning',
  absent: 'danger',
  rest: 'neutral',
  secondary: 'neutral',
  event: 'info',
};
