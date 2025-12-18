export interface CampusEvent {
  PK: string;
  SK: string;
  EntityType: string;
  event_id: string;
  event_name: string;
  event_type: 'ATHLETIC' | 'ACADEMIC' | 'PERFORMANCE' | 'OTHER';
  start_time: string;
  end_time: string;
  location: string;
  expected_attendance: number;
  created_at: string;
}

export interface EventImpact {
  PK: string;
  SK: string;
  EntityType: string;
  event_id: string;
  lot_id: string;
  impact_level: 'LOW' | 'MEDIUM' | 'HIGH';
  expected_increase_percent: number;
}
