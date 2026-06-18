import React, {useEffect, useMemo, useRef} from 'react';
import {StyleSheet, View} from 'react-native';
import Mapbox from '@rnmapbox/maps';
import {MAPBOX_ACCESS_TOKEN} from '../config/mapbox';
import type {LocationPoint} from '../types/location';

Mapbox.setAccessToken(MAPBOX_ACCESS_TOKEN);

const ROUTE_LINE_STYLE = {
  lineColor: '#2563eb',
  lineWidth: 4,
  lineCap: 'round' as const,
  lineJoin: 'round' as const,
};

interface MapViewTrackerProps {
  currentLocation: LocationPoint;
  routeHistory: LocationPoint[];
  autoFollow: boolean;
}

function MapViewTracker({
  currentLocation,
  routeHistory,
  autoFollow,
}: MapViewTrackerProps) {
  const cameraRef = useRef<Mapbox.Camera>(null);
  const currentCoordinate = useMemo<[number, number]>(
    () => [currentLocation.longitude, currentLocation.latitude],
    [currentLocation.latitude, currentLocation.longitude],
  );

  const routeShape = useMemo<GeoJSON.Feature<GeoJSON.LineString>>(
    () => ({
      type: 'Feature',
      properties: {},
      geometry: {
        type: 'LineString',
        coordinates: routeHistory.map(location => [
          location.longitude,
          location.latitude,
        ]),
      },
    }),
    [routeHistory],
  );

  useEffect(() => {
    if (!autoFollow) {
      return;
    }

    cameraRef.current?.setCamera({
      centerCoordinate: currentCoordinate,
      zoomLevel: 16,
      animationDuration: 250,
      animationMode: 'easeTo',
    });
  }, [
    autoFollow,
    currentCoordinate,
    currentLocation.latitude,
    currentLocation.longitude,
  ]);

  return (
    <Mapbox.MapView
      style={styles.map}
      styleURL={Mapbox.StyleURL.Street}
      scaleBarEnabled={false}
      logoEnabled
      attributionEnabled>
      <Mapbox.Camera
        ref={cameraRef}
        defaultSettings={{
          centerCoordinate: currentCoordinate,
          zoomLevel: 16,
        }}
      />

      {routeHistory.length > 1 && (
        <Mapbox.ShapeSource id="route-source" shape={routeShape}>
          <Mapbox.LineLayer
            id="route-line"
            style={ROUTE_LINE_STYLE}
          />
        </Mapbox.ShapeSource>
      )}

      <Mapbox.PointAnnotation
        id="current-location"
        coordinate={currentCoordinate}>
        <View
          style={[
            styles.marker,
            currentLocation.source === 'joystick' && styles.mockMarker,
          ]}>
          <View style={styles.markerCenter} />
        </View>
      </Mapbox.PointAnnotation>
    </Mapbox.MapView>
  );
}

const styles = StyleSheet.create({
  map: {
    flex: 1,
  },
  marker: {
    width: 26,
    height: 26,
    borderRadius: 13,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#dc2626',
    borderColor: '#fff',
    borderWidth: 3,
    shadowColor: '#000',
    shadowOpacity: 0.25,
    shadowRadius: 4,
    shadowOffset: {width: 0, height: 2},
    elevation: 5,
  },
  mockMarker: {
    backgroundColor: '#7c3aed',
  },
  markerCenter: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#fff',
  },
});

export default React.memo(MapViewTracker);
