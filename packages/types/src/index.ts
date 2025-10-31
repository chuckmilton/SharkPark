export type ParkingLot = {
  id: string;
  name: string;
  capacity: number;
  currentOccupancy?: number;
  confidence?: "LOW" | "MED" | "HIGH";
};

export type OccupancyEvent = {
  lotId: string;
  timestamp: string; // ISO8601
  event: "ENTER" | "LEAVE";
  source: "GEOFENCE" | "USER_REPORT" | "SYSTEM" | "COLD_START";
};

export type Forecast = {
  lotId: string;
  timestamp: string;
  predictedOccupancy: number;
  ciLow: number;
  ciHigh: number;
};

export type UserIdentity = {
  sub: string;
  email: string;
  provider: "CSULB_SSO";
};
