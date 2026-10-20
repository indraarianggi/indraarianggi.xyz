/** Whether a nav item (`/`, `/work/`, …) is the current section for a pathname. */
export function isActive(href: string, pathname: string): boolean {
  const path = pathname.endsWith('/') ? pathname : `${pathname}/`;
  return href === '/' ? path === '/' : path.startsWith(href);
}
