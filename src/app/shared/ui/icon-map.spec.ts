import { describe, expect, it } from 'vitest';
import {
  LucideCalendarCheck,
  LucideDot,
  LucideInfo,
  LucideMapPin,
  LucidePartyPopper,
} from '@lucide/angular';
import { iconMap } from './icon-map';

describe('iconMap (REQ-005 dynamic icon mapping)', () => {
  it('exposes an entry for every bi icon name used in the codebase', () => {
    const expectedKeys = [
      'apple',
      'arrow-right-circle',
      'balloon',
      'bell',
      'box-arrow-left',
      'briefcase',
      'building',
      'calendar-check',
      'calendar-event',
      'calendar3',
      'caret-left-fill',
      'caret-right-fill',
      'check',
      'check-circle-fill',
      'circle-fill',
      'clock',
      'exclamation-triangle',
      'eye',
      'file-earmark-arrow-down',
      'file-earmark-bar-graph',
      'geo-alt',
      'geo-alt-fill',
      'grid-3x3-gap',
      'house-door',
      'info-circle-fill',
      'journal-text',
      'pencil',
      'people',
      'person',
      'person-gear',
      'question-circle',
      'rocket-takeoff',
      'shield-check',
      'trash',
      'x-circle-fill',
    ].sort();

    expect(Object.keys(iconMap).sort()).toEqual(expectedKeys);
  });

  it('resolves every key to a concrete Lucide icon component', () => {
    for (const [biName, icon] of Object.entries(iconMap)) {
      expect(icon.icon, `${biName} must map to a LucideIcon component`).toBeDefined();
    }
  });

  it('maps renamed bi icons to the chosen Lucide semantics', () => {
    expect(iconMap['info-circle-fill']).toBe(LucideInfo);
    expect(iconMap['circle-fill']).toBe(LucideDot);
    expect(iconMap['calendar-event']).toBe(LucideCalendarCheck);
    expect(iconMap['calendar-check']).toBe(LucideCalendarCheck);
    expect(iconMap['geo-alt-fill']).toBe(LucideMapPin);
    expect(iconMap['geo-alt']).toBe(LucideMapPin);
    expect(iconMap['balloon']).toBe(LucidePartyPopper);
  });
});
