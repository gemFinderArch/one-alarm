export function formatTime(date: Date | null): string {
  if (!date) return '--:--';
  return date.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
}
