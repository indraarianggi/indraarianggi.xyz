import type { Role } from '../lib/timeline';

export const site = {
  name: 'Indra Arianggi',
  role: 'Software engineer',
  title: 'Indra Arianggi | Software Engineer',
  description: 'I build to understand. I write to remember. I read because useful ideas rarely stay inside one field.',
  nav: [
    { href: '/', label: 'Home' },
    { href: '/work/', label: 'Work' },
    { href: '/blog/', label: 'Writing' },
    { href: '/read/', label: 'Reading' },
    { href: '/about/', label: 'About' },
  ],
  contact: [
    { href: 'https://github.com/indraarianggi', label: 'GitHub', external: true },
    { href: 'https://www.linkedin.com/in/indraarianggi', label: 'LinkedIn', external: true },
    { href: '/rss.xml', label: 'RSS', external: false },
  ],
} as const;

/** Oldest first. */
export const experience: Role[] = [
  {
    company: 'Indorelawan',
    role: 'Full Stack Engineer',
    start: '2018-08',
    end: '2020-12',
    type: 'full-time',
    summary:
      'Migrated the legacy codebase from AngularJS to React, built a custom CMS for creating and managing events, and redesigned the site to grow registrations and engagement.',
  },
  {
    company: 'FishGo',
    role: 'Backend Engineer',
    start: '2020-01',
    end: '2020-12',
    type: 'part-time',
    summary: 'Designed and built the RESTful APIs behind the mobile app, and the database schemas they ran on.',
  },
  {
    company: 'Warung Pintar',
    role: 'Software Engineer, Frontend',
    start: '2021-01',
    end: '2022-05',
    type: 'full-time',
    summary:
      "Shipped features for the React Native app and the React internal dashboard, reviewed teammates' code, and tracked down bugs to keep the app stable.",
  },
  {
    company: 'eFishery',
    role: 'Software Engineer, Frontend',
    start: '2022-05',
    end: '2024-08',
    type: 'full-time',
    summary:
      'Built a real-time dashboard for SLA and operational metrics, internal tools that replaced manual admin work, asset tracking to cut stock discrepancies, diagnostic tools for field technicians, and an automated complaint workflow.',
  },
  {
    company: 'ADW Consulting',
    role: 'Frontend Engineer',
    start: '2024-11',
    end: null,
    type: 'full-time',
    summary:
      "Building and maintaining the team's internal UI component library with React, TypeScript, Tailwind CSS, Radix UI and Storybook. Planned and built the mobile-responsive version of a Next.js web app. Leading pull request reviews, and building full-stack features with Hono, NestJS, TanStack Start and PostgreSQL.",
  },
];

export const toolGroups = ['Languages', 'Frontend', 'Backend'] as const;

export type Tool = {
  name: string;
  group: (typeof toolGroups)[number];
  /** Simple Icons slug. Omit when Simple Icons has no mark; `monogram` is drawn instead. */
  icon?: string;
  monogram?: string;
  /** Brand colour revealed on hover, without `#`. */
  brandHex?: string;
  learning?: boolean;
};

export const toolkit: Tool[] = [
  { name: 'TypeScript', group: 'Languages', icon: 'typescript', brandHex: '3178C6' },
  { name: 'JavaScript', group: 'Languages', icon: 'javascript', brandHex: 'F7DF1E' },
  { name: 'HTML', group: 'Languages', icon: 'html5', brandHex: 'E34F26' },
  { name: 'CSS', group: 'Languages', icon: 'css', brandHex: '663399' },
  { name: 'React', group: 'Frontend', icon: 'react', brandHex: '61DAFB' },
  { name: 'Next.js', group: 'Frontend', icon: 'nextdotjs', brandHex: '000000' },
  { name: 'React Native', group: 'Frontend', icon: 'react', brandHex: '61DAFB' },
  // TanStack's own #ECE8D1 vanishes on the page background; TanStack Query's red reads.
  { name: 'TanStack', group: 'Frontend', icon: 'tanstack', brandHex: 'FF4154' },
  { name: 'Zustand', group: 'Frontend', monogram: 'Zu' },
  { name: 'Tailwind', group: 'Frontend', icon: 'tailwindcss', brandHex: '06B6D4' },
  { name: 'Radix UI', group: 'Frontend', icon: 'radixui', brandHex: '161618' },
  { name: 'Storybook', group: 'Frontend', icon: 'storybook', brandHex: 'FF4785' },
  { name: 'Node.js', group: 'Backend', icon: 'nodedotjs', brandHex: '5FA04E' },
  { name: 'Hono', group: 'Backend', icon: 'hono', brandHex: 'E36002' },
  { name: 'NestJS', group: 'Backend', icon: 'nestjs', brandHex: 'E0234E' },
  { name: 'Express', group: 'Backend', icon: 'express', brandHex: '0A0A0A' },
  { name: 'PostgreSQL', group: 'Backend', icon: 'postgresql', brandHex: '4169E1' },
  { name: 'Laravel', group: 'Backend', icon: 'laravel', brandHex: 'FF2D20', learning: true },
];
