export function getShowingInformation<T>(
  arr: T[],
  page: number
): {
  showing: string;
  total: number;
} {
  const desiredFinalIndex = page * 6;
  const start = Math.min(desiredFinalIndex - 5, arr.length);
  const end = Math.min(desiredFinalIndex, arr.length);

  return {
    showing: `${start}-${end}`,
    total: arr.length,
  };
}
