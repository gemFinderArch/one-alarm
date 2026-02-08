export function formatTime(date: Date | null): string {
  if (!date) return '--:--';
  return date.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
}

export function formatTimeWithSeconds(date: Date | null): string {
  if (!date) return '--:--:--';
  return date.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit', second: '2-digit' });
}
