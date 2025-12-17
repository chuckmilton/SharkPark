export const getOccupancyColor = (occupancy: number): string => {
  if (occupancy < 50) return '#4ade80';
  if (occupancy < 75) return '#fbbf24';
  return '#ef4444';
};