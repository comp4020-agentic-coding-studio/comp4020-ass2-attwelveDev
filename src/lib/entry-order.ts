export function neighbors<T extends { id: string }>(
  sorted: T[],
  currentId: string,
): { previous?: T; next?: T } {
  const index = sorted.findIndex((entry) => entry.id === currentId);
  if (index === -1) return {};
  return { previous: sorted[index - 1], next: sorted[index + 1] };
}
