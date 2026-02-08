/**
 * Round a Date to the nearest minute, then format as time string.
 * Fixes the truncation issue where 7:02:45 would show as "7:02" instead of "7:03".
 */
function roundToMinute(date: Date): Date {
  const rounded = new Date(date);
  if (rounded.getSeconds() >= 30) {
    rounded.setMinutes(rounded.getMinutes() + 1);
  }
  rounded.setSeconds(0, 0);
  return rounded;
}

export function formatTime(date: Date | null): string {
  if (!date) return '--:--';
  return roundToMinute(date).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
}

export function formatTimeWithSeconds(date: Date | null): string {
  if (!date) return '--:--:--';
  return date.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit', second: '2-digit' });
}

/** Format a Date as short date string, e.g. "9 Feb". */
export function formatShortDate(date: Date | null): string {
  if (!date) return '';
  return date.toLocaleDateString([], { day: 'numeric', month: 'short' });
}
