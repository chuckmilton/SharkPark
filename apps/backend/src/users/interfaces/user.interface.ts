export interface User {
  PK: string;
  SK: string;
  EntityType: string;
  user_id: string;
  email: string;
  first_name: string;
  last_name: string;
  user_type: 'STUDENT' | 'EMPLOYEE';
  phone?: string;
  notification_preferences: {
    favorites_filling?: boolean;
    favorites_clearing?: boolean;
    surge_alerts?: boolean;
    event_alerts?: boolean;
  };
  created_at: string;
  last_login?: string;
  timestamp: string;
}

export interface UserFavorite {
  PK: string;
  SK: string;
  EntityType: string;
  user_id: string;
  lot_id: string;
  added_at: string;
}

export interface UserResponse extends User {
  favorites?: string[];
}
