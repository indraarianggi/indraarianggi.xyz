/** Rough reading time for a Markdown body, in whole minutes (minimum 1). */
export function readingTime(body: string | undefined, wordsPerMinute = 220): number {
  const words = (body ?? '').trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / wordsPerMinute));
}
