import React, {useState} from 'react';
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Switch,
  Text,
  View,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import LocationJoystick from '../components/LocationJoystick';
import MapViewTracker from '../components/MapViewTracker';
import {
  MOCK_LOCATION_AVAILABLE,
  useLocationTracker,
} from '../hooks/useLocationTracker';

const DEMO_USER_ID = 'demo-user';

function LocationTrackingScreen() {
  const [autoFollow, setAutoFollow] = useState(true);
  const tracker = useLocationTracker(DEMO_USER_ID);

  return (
    <SafeAreaView style={styles.screen} edges={['top', 'bottom']}>
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Location tracker</Text>
          <Text style={styles.status}>
            {tracker.isTracking ? '● Tracking' : '○ Stopped'} ·{' '}
            {tracker.isMockMode ? 'Mock joystick' : 'Live GPS'}
          </Text>
        </View>
        {tracker.isLoading && <ActivityIndicator color="#2563eb" />}
      </View>

      <View style={styles.mapContainer}>
        <MapViewTracker
          currentLocation={tracker.currentLocation}
          routeHistory={tracker.routeHistory}
          autoFollow={autoFollow}
        />

        <View style={styles.controls}>
          <View style={styles.switchRow}>
            <Text style={styles.controlLabel}>Auto-follow</Text>
            <Switch value={autoFollow} onValueChange={setAutoFollow} />
          </View>

          {MOCK_LOCATION_AVAILABLE && (
            <>
              <View style={styles.switchRow}>
                <Text style={styles.controlLabel}>
                  {tracker.isMockMode ? 'Mock Joystick' : 'Live GPS'}
                </Text>
                <Switch
                  value={tracker.isMockMode}
                  onValueChange={tracker.setMockMode}
                  trackColor={{true: '#a78bfa'}}
                />
              </View>
              <Pressable
                style={styles.secondaryButton}
                onPress={() =>
                  tracker.setJoystickVisible(!tracker.joystickVisible)
                }
                disabled={!tracker.isMockMode}>
                <Text
                  style={[
                    styles.secondaryButtonText,
                    !tracker.isMockMode && styles.disabledText,
                  ]}>
                  {tracker.joystickVisible ? 'Hide' : 'Show'} Joystick
                </Text>
              </Pressable>
            </>
          )}

          <View style={styles.buttonRow}>
            <Pressable
              style={[
                styles.actionButton,
                styles.startButton,
                tracker.isTracking && styles.disabledButton,
              ]}
              disabled={tracker.isTracking}
              onPress={tracker.startTracking}>
              <Text style={styles.actionButtonText}>Start Tracking</Text>
            </Pressable>
            <Pressable
              style={[
                styles.actionButton,
                styles.stopButton,
                !tracker.isTracking && styles.disabledButton,
              ]}
              disabled={!tracker.isTracking}
              onPress={tracker.stopTracking}>
              <Text style={styles.actionButtonText}>Stop Tracking</Text>
            </Pressable>
          </View>
        </View>

        <LocationJoystick
          visible={
            MOCK_LOCATION_AVAILABLE &&
            tracker.isMockMode &&
            tracker.joystickVisible
          }
          onMove={tracker.moveWithJoystick}
        />

        {tracker.error && (
          <View style={styles.errorBanner}>
            <Text style={styles.errorText}>{tracker.error}</Text>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  header: {
    minHeight: 72,
    paddingHorizontal: 18,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  title: {
    color: '#0f172a',
    fontSize: 22,
    fontWeight: '700',
  },
  status: {
    color: '#64748b',
    fontSize: 13,
    marginTop: 3,
  },
  mapContainer: {
    flex: 1,
    overflow: 'hidden',
  },
  controls: {
    position: 'absolute',
    top: 14,
    right: 14,
    width: 174,
    padding: 12,
    borderRadius: 14,
    backgroundColor: 'rgba(255, 255, 255, 0.94)',
    shadowColor: '#0f172a',
    shadowOpacity: 0.16,
    shadowRadius: 8,
    shadowOffset: {width: 0, height: 4},
    elevation: 5,
    gap: 10,
  },
  switchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  controlLabel: {
    flex: 1,
    color: '#334155',
    fontSize: 13,
    fontWeight: '600',
  },
  secondaryButton: {
    alignItems: 'center',
    paddingVertical: 7,
    borderWidth: 1,
    borderColor: '#cbd5e1',
    borderRadius: 8,
  },
  secondaryButtonText: {
    color: '#334155',
    fontSize: 12,
    fontWeight: '600',
  },
  disabledText: {
    color: '#94a3b8',
  },
  buttonRow: {
    gap: 7,
  },
  actionButton: {
    alignItems: 'center',
    paddingVertical: 9,
    borderRadius: 8,
  },
  startButton: {
    backgroundColor: '#16a34a',
  },
  stopButton: {
    backgroundColor: '#dc2626',
  },
  disabledButton: {
    opacity: 0.38,
  },
  actionButtonText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '700',
  },
  errorBanner: {
    position: 'absolute',
    left: 14,
    right: 14,
    top: 14,
    padding: 10,
    borderRadius: 8,
    backgroundColor: 'rgba(127, 29, 29, 0.92)',
  },
  errorText: {
    color: '#fff',
    fontSize: 12,
  },
});

export default LocationTrackingScreen;
