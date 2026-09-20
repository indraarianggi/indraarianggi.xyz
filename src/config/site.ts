export const site = {
  name: 'Indra Arianggi',
  title: 'Indra Arianggi | Software Engineer',
  description: 'Making software. Learning as I go.',
  headline: 'Making software. Learning as I go.',
  primaryNav: [
    { href: '/', label: 'Home' },
    { href: '/work/', label: 'Work' },
    { href: '/blog/', label: 'Blog' },
  ],
  secondaryNav: [
    { href: '/about/', label: 'About' },
    { href: '/read/', label: 'Read' },
  ],
  socialLinks: [] as ReadonlyArray<{ href: string; label: string }>,
} as const;
