import {useCallback, useEffect, useRef, useState} from 'react';
import {PermissionsAndroid, Platform} from 'react-native';
import Geolocation from '@react-native-community/geolocation';
import {backgroundLocation} from '../services/backgroundLocation';
import {
  getLatestLocation,
  getLocationHistory,
  LOCATION_API_BASE_URL,
  sendLocation,
} from '../services/locationApi';
import type {LocationPoint} from '../types/location';

Geolocation.setRNConfiguration({
  skipPermissionRequests: true,
  authorizationLevel: 'always',
  enableBackgroundLocationUpdates: true,
  locationProvider: 'auto',
});

export const DEFAULT_LOCATION: LocationPoint = {
  userId: '',
  latitude: 28.6139,
  longitude: 77.209,
  source: 'gps',
  timestamp: new Date().toISOString(),
};

export const MOCK_LOCATION_AVAILABLE = __DEV__;

interface UseLocationTrackerResult {
  currentLocation: LocationPoint;
  routeHistory: LocationPoint[];
  isTracking: boolean;
  isMockMode: boolean;
  joystickVisible: boolean;
  isLoading: boolean;
  error: string | null;
  startTracking: () => Promise<void>;
  stopTracking: () => Promise<void>;
  setMockMode: (enabled: boolean) => void;
  setJoystickVisible: (visible: boolean) => void;
  moveWithJoystick: (deltaLat: number, deltaLng: number) => void;
}

async function requestLocationPermission() {
  if (Platform.OS === 'ios') {
    return new Promise<boolean>(resolve => {
      Geolocation.requestAuthorization(
        () => resolve(true),
        () => resolve(false),
      );
    });
  }

  if (Platform.OS !== 'android') {
    return true;
  }

  const fineLocation = await PermissionsAndroid.request(
    PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
  );
  if (fineLocation !== PermissionsAndroid.RESULTS.GRANTED) {
    return false;
  }

  if (Number(Platform.Version) >= 33) {
    const notificationPermission =
      PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS;
    await PermissionsAndroid.request(notificationPermission);
  }

  return true;
}

export function useLocationTracker(
  userId: string,
): UseLocationTrackerResult {
  const initialLocation = {...DEFAULT_LOCATION, userId};
  const [currentLocation, setCurrentLocation] =
    useState<LocationPoint>(initialLocation);
  const [routeHistory, setRouteHistory] = useState<LocationPoint[]>([]);
  const [isTracking, setIsTracking] = useState(false);
  const [isMockMode, setIsMockModeState] = useState(false);
  const [joystickVisible, setJoystickVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const currentLocationRef = useRef(initialLocation);

  const updateLocation = useCallback(
    (location: LocationPoint, sendToApi = true) => {
      currentLocationRef.current = location;
      setCurrentLocation(location);
      setRouteHistory(history => [...history, location]);
      setError(null);

      if (!sendToApi) {
        return;
      }

      sendLocation(location).catch(apiError => {
        setError(
          apiError instanceof Error
            ? apiError.message
            : 'Could not send location',
        );
      });
    },
    [],
  );

  useEffect(() => {
    const locationSubscription = backgroundLocation.onLocation(location => {
      updateLocation(location, false);
    });
    const errorSubscription = backgroundLocation.onError(setError);

    backgroundLocation
      .isTracking()
      .then(setIsTracking)
      .catch(() => setIsTracking(false));

    return () => {
      locationSubscription?.remove();
      errorSubscription?.remove();
    };
  }, [updateLocation]);

  useEffect(() => {
    let mounted = true;

    Promise.all([
      getLatestLocation(userId).catch(() => null),
      getLocationHistory(userId).catch(() => []),
    ])
      .then(([latest, history]) => {
        if (!mounted) {
          return;
        }

        const startingLocation = latest ?? initialLocation;
        currentLocationRef.current = startingLocation;
        setCurrentLocation(startingLocation);
        setRouteHistory(history);
      })
      .finally(() => {
        if (mounted) {
          setIsLoading(false);
        }
      });

    return () => {
      mounted = false;
    };
    // The user identity is stable for the lifetime of this screen.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId]);

  const startTracking = useCallback(async () => {
    setError(null);

    if (isMockMode) {
      setIsTracking(true);
      return;
    }

    const granted = await requestLocationPermission();
    if (!granted) {
      setError('Always-on location permission is required for Live GPS mode.');
      setIsTracking(false);
      return;
    }

    try {
      await backgroundLocation.start(userId, LOCATION_API_BASE_URL);
      setIsTracking(true);
    } catch (startError) {
      setError(
        startError instanceof Error
          ? startError.message
          : 'Could not start background tracking',
      );
      setIsTracking(false);
    }
  }, [isMockMode, userId]);

  const stopTracking = useCallback(async () => {
    try {
      await backgroundLocation.stop();
    } catch (stopError) {
      setError(
        stopError instanceof Error
          ? stopError.message
          : 'Could not stop background tracking',
      );
    } finally {
      setIsTracking(false);
    }
  }, []);

  const setMockMode = useCallback(
    (enabled: boolean) => {
      if (enabled && !MOCK_LOCATION_AVAILABLE) {
        return;
      }

      setIsMockModeState(enabled);
      setJoystickVisible(enabled);
      setError(null);

      if (enabled) {
        backgroundLocation.stop().catch(() => undefined);
        return;
      }

      if (isTracking) {
        requestLocationPermission()
          .then(granted => {
            if (!granted) {
              throw new Error('Always-on location permission is required.');
            }
            return backgroundLocation.start(userId, LOCATION_API_BASE_URL);
          })
          .catch(modeError => {
            setError(
              modeError instanceof Error
                ? modeError.message
                : 'Could not start Live GPS mode',
            );
            setIsTracking(false);
          });
      }
    },
    [isTracking, userId],
  );

  const moveWithJoystick = useCallback(
    (deltaLat: number, deltaLng: number) => {
      if (!isTracking || !isMockMode || !MOCK_LOCATION_AVAILABLE) {
        return;
      }

      const previous = currentLocationRef.current;
      const nextLocation: LocationPoint = {
        userId,
        latitude: Math.max(-90, Math.min(90, previous.latitude + deltaLat)),
        longitude: Math.max(
          -180,
          Math.min(180, previous.longitude + deltaLng),
        ),
        accuracy: 0,
        speed: 0,
        source: 'joystick',
        timestamp: new Date().toISOString(),
      };
      updateLocation(nextLocation);
    },
    [isMockMode, isTracking, updateLocation, userId],
  );

  return {
    currentLocation,
    routeHistory,
    isTracking,
    isMockMode,
    joystickVisible,
    isLoading,
    error,
    startTracking,
    stopTracking,
    setMockMode,
    setJoystickVisible,
    moveWithJoystick,
  };
}
