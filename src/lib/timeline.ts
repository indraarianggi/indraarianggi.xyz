import { formatMonth } from './dates';

export type Role = {
  company: string;
  role: string;
  /** First month in the role, `YYYY-MM`. */
  start: string;
  /** Last month in the role, `YYYY-MM`; `null` while it is the current role. */
  end: string | null;
  type: 'full-time' | 'part-time';
  summary: string;
};

export type TimelineBar = {
  role: Role;
  /** Years since the origin. */
  from: number;
  to: number;
  lane: 1 | 2;
  current: boolean;
};

export type Timeline = { origin: number; span: number; now: number; bars: TimelineBar[] };

const parseMonth = (month: string) => month.split('-').map(Number) as [number, number];

/** Fractional years for a `YYYY-MM` month: its first day, or (edge `end`) the day after it ends. */
export function monthToYears(month: string, edge: 'start' | 'end' = 'start'): number {
  const [year, m] = parseMonth(month);
  return year + (m - 1 + (edge === 'end' ? 1 : 0)) / 12;
}

function dateToYears(date: Date): number {
  return date.getUTCFullYear() + (date.getUTCMonth() + (date.getUTCDate() - 1) / 31) / 12;
}

export function buildTimeline(roles: Role[], today: Date, origin = 2018): Timeline {
  const now = dateToYears(today) - origin;
  const bars: TimelineBar[] = roles
    .map((role) => ({
      role,
      from: monthToYears(role.start) - origin,
      to: role.end ? monthToYears(role.end, 'end') - origin : now,
      lane: role.type === 'part-time' ? (2 as const) : (1 as const),
      current: role.end === null,
    }))
    .toSorted((a, b) => a.from - b.from);

  // A handover month would draw two same-lane bars on top of each other: the earlier one yields.
  for (const lane of [1, 2]) {
    const inLane = bars.filter((bar) => bar.lane === lane);
    for (let i = 1; i < inLane.length; i++) {
      inLane[i - 1].to = Math.min(inLane[i - 1].to, inLane[i].from);
    }
  }

  return { origin, span: Math.max(1, Math.ceil(now)), now, bars };
}

/** `May 2022 — Aug 2024`, `Nov 2024 — now`, or `2020` for one full calendar year. */
export function roleDates({ start, end }: Pick<Role, 'start' | 'end'>): string {
  if (end && start.endsWith('-01') && end.endsWith('-12') && start.slice(0, 4) === end.slice(0, 4)) {
    return start.slice(0, 4);
  }
  const label = (month: string) => {
    const [year, m] = parseMonth(month);
    return formatMonth(new Date(Date.UTC(year, m - 1)));
  };
  return `${label(start)} — ${end ? label(end) : 'now'}`;
}

/** Pushes each label (in top-to-bottom order) down until it is at least `minGap` below the one before. */
export function stackLabels(tops: number[], minGap: number): number[] {
  const placed: number[] = [];
  for (const top of tops) {
    const previous = placed.at(-1);
    placed.push(previous === undefined ? top : Math.max(top, previous + minGap));
  }
  return placed;
}

/** Mobile geometry in px, indexed like `timeline.bars`: newest on top, labels kept apart. */
export function verticalLayout(timeline: Timeline, pxPerYear = 56, labelGap = 66) {
  const order = timeline.bars
    .map((bar, index) => ({ index, top: Math.round((timeline.now - bar.to) * pxPerYear), from: bar.from }))
    // Bars ending together: the one that started later sits higher.
    .toSorted((a, b) => a.top - b.top || b.from - a.from);
  const labelTops = stackLabels(order.map(({ top }) => top), labelGap);

  const layout: Array<{ barTop: number; barHeight: number; labelTop: number }> = [];
  order.forEach(({ index, top }, k) => {
    const bar = timeline.bars[index];
    layout[index] = { barTop: top, barHeight: Math.round((bar.to - bar.from) * pxPerYear), labelTop: labelTops[k] };
  });
  return layout;
}
