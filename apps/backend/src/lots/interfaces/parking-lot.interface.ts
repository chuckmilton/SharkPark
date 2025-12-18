export interface ParkingLot {
  lot_id: string;
  lot_name: string;
  display_name: string;
  lot_number: string;
  lot_type: 'STUDENT' | 'EMPLOYEE';
  capacity: number;
  current_occupancy: number;
  location_description: string;
  building_proximity: string[];
  center_lat: number;
  center_lng: number;
  geofence_polygon: Array<{ lat: number; lng: number }>;
  geofence_radius: number;
  permit_types: string[];
  daily_permit_allowed: boolean;
  daily_rate?: number;
  hours_weekday: { open: string; close: string } | string;
  hours_saturday: { open: string; close: string } | string;
  hours_sunday: { open: string; close: string } | string;
  ev_charging_stations: number;
  motorcycle_spaces: number;
  accessible_spaces: number;
  has_lighting: boolean;
  has_cameras: boolean;
  has_emergency_phone: boolean;
  is_covered: boolean;
  is_paved: boolean;
  levels?: number;
  penetration_rate: number;
  avg_turnover_minutes: number;
  confidence: 'LOW' | 'MEDIUM' | 'HIGH';
  timestamp: string;
}

export interface ParkingLotResponse extends ParkingLot {
  available: number;
  occupancy_rate: number;
  fill_status: 'AVAILABLE' | 'FILLING' | 'NEARLY_FULL' | 'FULL';
}

export interface GetLotsQueryParams {
  type?: 'STUDENT' | 'EMPLOYEE';
  available_only?: boolean;
  min_available?: number;
  permit_type?: string;
  daily_permit?: boolean;
  ev_charging?: boolean;
}

export interface OccupancySnapshot {
  lot_id: string;
  timestamp: string;
  occupancy: number;
  available: number;
  occupancy_rate: number;
  confidence: string;
}
