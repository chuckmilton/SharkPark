export const isoNow = () => new Date().toISOString();

export const toOccupancyBucket = (percent: number): "LOW" | "MED" | "HIGH" => {
  if (percent < 50) return "LOW";
  if (percent < 85) return "MED";
  return "HIGH";
};

// simple helper to normalize a CSULB email
export const normalizeEmail = (email: string) => email.trim().toLowerCase();
