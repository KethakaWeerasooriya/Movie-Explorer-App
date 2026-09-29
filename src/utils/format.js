/** Formatting helpers shared across components. */

/** "2024-05-17" -> "2024". Returns "—" for missing dates. */
export function releaseYear(date) {
  return date && date.length >= 4 ? date.slice(0, 4) : '—';
}

/** 7.456 -> "7.5". Returns "NR" (not rated) when there's no rating. */
export function formatRating(value) {
  return typeof value === 'number' && value > 0 ? value.toFixed(1) : 'NR';
}

/** 142 -> "2h 22m". */
export function formatRuntime(minutes) {
  if (!minutes) return null;
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return h ? `${h}h ${m}m` : `${m}m`;
}

/** 150000000 -> "$150,000,000". Returns null for 0/undefined. */
export function formatMoney(amount) {
  if (!amount) return null;
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(amount);
}

/**
 * Picks the best YouTube trailer from a TMDb `videos` payload:
 * official trailers first, then any trailer, then teasers.
 */
export function pickTrailer(videos) {
  const list = (videos?.results || []).filter((v) => v.site === 'YouTube');
  return (
    list.find((v) => v.type === 'Trailer' && v.official) ||
    list.find((v) => v.type === 'Trailer') ||
    list.find((v) => v.type === 'Teaser') ||
    null
  );
}
