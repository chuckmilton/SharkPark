export interface Weather {
  PK: string;
  SK: string;
  EntityType: string;
  timestamp: string;
  temperature_f: number;
  feels_like_f: number;
  humidity_percent: number;
  wind_speed_mph: number;
  conditions: string;
  precipitation_probability: number;
  is_raining: boolean;
}
