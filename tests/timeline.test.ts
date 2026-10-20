import { describe, expect, it } from 'vitest';
import { buildTimeline, monthToYears, roleDates, stackLabels, verticalLayout, type Role } from '../src/lib/timeline';

const role = (company: string, start: string, end: string | null, type: Role['type'] = 'full-time'): Role => ({
  company,
  role: 'Engineer',
  start,
  end,
  type,
  summary: '',
});

const roles = [
  role('Indorelawan', '2018-08', '2020-12'),
  role('FishGo', '2020-01', '2020-12', 'part-time'),
  role('Warung Pintar', '2021-01', '2022-05'),
  role('eFishery', '2022-05', '2024-08'),
  role('ADW Consulting', '2024-11', null),
];
const today = new Date('2026-10-20');

describe('monthToYears', () => {
  it('places a month at its first day, or just after its last day', () => {
    expect(monthToYears('2018-08')).toBeCloseTo(2018 + 7 / 12);
    expect(monthToYears('2018-08', 'end')).toBeCloseTo(2018 + 8 / 12);
  });
});

describe('buildTimeline', () => {
  const timeline = buildTimeline(roles, today);

  it('spans whole years from the origin to now', () => {
    expect(timeline.origin).toBe(2018);
    expect(timeline.now).toBeCloseTo(8.8, 1);
    expect(timeline.span).toBe(9);
  });

  it('orders bars oldest first and runs the current role to now', () => {
    expect(timeline.bars.map((bar) => bar.role.company)).toEqual([
      'Indorelawan',
      'FishGo',
      'Warung Pintar',
      'eFishery',
      'ADW Consulting',
    ]);
    const current = timeline.bars.at(-1)!;
    expect(current.current).toBe(true);
    expect(current.from).toBeCloseTo(6 + 10 / 12);
    expect(current.to).toBeCloseTo(timeline.now);
  });

  it('puts part-time work on the second lane', () => {
    expect(timeline.bars.find((bar) => bar.role.company === 'FishGo')!.lane).toBe(2);
    expect(timeline.bars.find((bar) => bar.role.company === 'eFishery')!.lane).toBe(1);
  });

  it('trims a same-lane handover month so bars never overlap', () => {
    const warung = timeline.bars.find((bar) => bar.role.company === 'Warung Pintar')!;
    const efishery = timeline.bars.find((bar) => bar.role.company === 'eFishery')!;
    expect(warung.to).toBeCloseTo(efishery.from);
  });
});

describe('roleDates', () => {
  it('collapses a full calendar year', () => {
    expect(roleDates({ start: '2020-01', end: '2020-12' })).toBe('2020');
  });

  it('shows a month range, open-ended for the current role', () => {
    expect(roleDates({ start: '2022-05', end: '2024-08' })).toBe('May 2022 — Aug 2024');
    expect(roleDates({ start: '2024-11', end: null })).toBe('Nov 2024 — now');
  });
});

describe('stackLabels', () => {
  it('pushes a label down until it clears the one above', () => {
    expect(stackLabels([0, 121, 252, 327, 327], 66)).toEqual([0, 121, 252, 327, 393]);
  });
});

describe('verticalLayout', () => {
  it('puts the newest role on top and keeps labels apart', () => {
    const layout = verticalLayout(buildTimeline(roles, today));
    const adw = layout[4];
    const fishgo = layout[1];
    const indorelawan = layout[0];
    expect(adw.barTop).toBe(0);
    expect(fishgo.labelTop).toBe(fishgo.barTop);
    expect(indorelawan.labelTop).toBe(fishgo.labelTop + 66);
  });
});
