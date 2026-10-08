/** Frames per second for the HUD timecode. 24 is the film rate. */
export const FPS = 24;

/** Formats a frame count as broadcast timecode, HH:MM:SS:FF. */
export function formatTimecode(frames: number, fps: number = FPS): string {
  const total = Math.max(0, Math.floor(frames));
  const ff = total % fps;
  const totalSeconds = Math.floor(total / fps);
  const ss = totalSeconds % 60;
  const mm = Math.floor(totalSeconds / 60) % 60;
  const hh = Math.floor(totalSeconds / 3600);
  return [hh, mm, ss, ff].map((part) => String(part).padStart(2, '0')).join(':');
}

/** Runtime for pages without a reading time (home, indexes): a one-minute reel. */
export const DEFAULT_RUNTIME_SECONDS = 60;

/**
 * Maps the reader's scroll position to a frame number on the HUD timecode.
 * The page's runtime is its reading time, so the end of an article reads the
 * same runtime its slate promises, and the timecode says roughly how far in
 * the reader is.
 *
 * @param scrollY        current vertical scroll offset in px (0 at the top)
 * @param maxScroll      largest possible scroll offset in px (scrollHeight - innerHeight);
 *                       0 when the page does not scroll
 * @param runtimeSeconds the length of the reel the full scroll maps onto
 * @returns a frame count, later formatted by formatTimecode()
 */
export function framesForScroll(
  scrollY: number,
  maxScroll: number,
  runtimeSeconds: number = DEFAULT_RUNTIME_SECONDS,
): number {
  if (maxScroll <= 0) return 0;
  const progress = Math.min(1, Math.max(0, scrollY / maxScroll));
  return Math.round(progress * runtimeSeconds * FPS);
}

const sceneLabels: Record<string, string> = {
  '': 'Home',
  work: 'Work',
  blog: 'Field notes',
  about: 'About',
  read: 'Read',
};

/** Label shown on the scene wipe when navigating to a path. */
export function labelForPath(pathname: string): string {
  const section = pathname.split('/').filter(Boolean)[0] ?? '';
  return sceneLabels[section] ?? 'Index';
}

/** Rough reading time for a Markdown body, in whole minutes (minimum 1). */
export function readingMinutes(body: string | undefined, wordsPerMinute = 220): number {
  const words = (body ?? '').trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / wordsPerMinute));
}
