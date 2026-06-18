import {Platform} from 'react-native';
import type {LocationPoint, LocationRecord} from '../types/location';

const DEVELOPMENT_HOST = Platform.OS === 'android' ? '10.0.2.2' : 'localhost';

// Replace this with your HTTPS API URL for release builds.
export const LOCATION_API_BASE_URL = __DEV__
  ? `http://${DEVELOPMENT_HOST}:3000/api/v1`
  : 'https://api.example.com/api/v1';

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const response = await fetch(`${LOCATION_API_BASE_URL}${path}`, {
    ...options,
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      ...options?.headers,
    },
  });

  if (!response.ok) {
    const body = await response.json().catch(() => null);
    throw new Error(body?.message ?? `Location API failed (${response.status})`);
  }

  return response.json() as Promise<T>;
}

export function sendLocation(location: LocationPoint) {
  return request<LocationRecord>('/location', {
    method: 'POST',
    body: JSON.stringify(location),
  });
}

export async function getLatestLocation(userId: string) {
  const response = await fetch(
    `${LOCATION_API_BASE_URL}/location/latest/${encodeURIComponent(userId)}`,
    {headers: {Accept: 'application/json'}},
  );

  if (response.status === 404) {
    return null;
  }

  if (!response.ok) {
    throw new Error(`Could not load latest location (${response.status})`);
  }

  return response.json() as Promise<LocationRecord>;
}

export function getLocationHistory(userId: string) {
  return request<LocationRecord[]>(
    `/location/history/${encodeURIComponent(userId)}`,
  );
}
