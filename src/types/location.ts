export type LocationSource = 'gps' | 'joystick';

export interface LocationPoint {
  userId: string;
  latitude: number;
  longitude: number;
  accuracy?: number;
  speed?: number;
  source: LocationSource;
  timestamp: string;
}

export interface LocationRecord extends LocationPoint {
  _id?: string;
  createdAt?: string;
}

export interface Coordinate {
  latitude: number;
  longitude: number;
}
