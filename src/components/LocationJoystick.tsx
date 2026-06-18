import React, {useMemo, useRef} from 'react';
import {
  Animated,
  PanResponder,
  StyleSheet,
  View,
  type GestureResponderEvent,
  type PanResponderGestureState,
} from 'react-native';

interface LocationJoystickProps {
  visible: boolean;
  onMove: (deltaLat: number, deltaLng: number) => void;
  movementSpeed?: number;
}

const OUTER_SIZE = 124;
const KNOB_SIZE = 52;
const MAX_DISTANCE = (OUTER_SIZE - KNOB_SIZE) / 2;

function LocationJoystick({
  visible,
  onMove,
  movementSpeed = 0.00008,
}: LocationJoystickProps) {
  const knobPosition = useRef(new Animated.ValueXY()).current;
  const lastGesture = useRef({x: 0, y: 0});
  const onMoveRef = useRef(onMove);
  onMoveRef.current = onMove;

  const moveKnob = (
    _event: GestureResponderEvent,
    gesture: PanResponderGestureState,
  ) => {
    const distance = Math.hypot(gesture.dx, gesture.dy);
    const scale = distance > MAX_DISTANCE ? MAX_DISTANCE / distance : 1;
    const x = gesture.dx * scale;
    const y = gesture.dy * scale;
    knobPosition.setValue({x, y});

    const deltaX = x - lastGesture.current.x;
    const deltaY = y - lastGesture.current.y;
    lastGesture.current = {x, y};

    onMoveRef.current(
      (-deltaY / MAX_DISTANCE) * movementSpeed,
      (deltaX / MAX_DISTANCE) * movementSpeed,
    );
  };

  const resetKnob = () => {
    lastGesture.current = {x: 0, y: 0};
    Animated.spring(knobPosition, {
      toValue: {x: 0, y: 0},
      useNativeDriver: true,
      speed: 24,
      bounciness: 6,
    }).start();
  };

  const panResponder = useMemo(
    () =>
      PanResponder.create({
        onStartShouldSetPanResponder: () => true,
        onMoveShouldSetPanResponder: () => true,
        onPanResponderGrant: () => {
          lastGesture.current = {x: 0, y: 0};
          knobPosition.stopAnimation();
        },
        onPanResponderMove: moveKnob,
        onPanResponderRelease: resetKnob,
        onPanResponderTerminate: resetKnob,
      }),
    // PanResponder remains stable; callbacks read current values from refs.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [knobPosition, movementSpeed],
  );

  if (!visible) {
    return null;
  }

  return (
    <View style={styles.container} pointerEvents="box-none">
      <View style={styles.outerCircle}>
        <View style={styles.crossHorizontal} />
        <View style={styles.crossVertical} />
        <Animated.View
          {...panResponder.panHandlers}
          style={[
            styles.knob,
            {
              transform: knobPosition.getTranslateTransform(),
            },
          ]}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 22,
    left: 20,
  },
  outerCircle: {
    width: OUTER_SIZE,
    height: OUTER_SIZE,
    borderRadius: OUTER_SIZE / 2,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(15, 23, 42, 0.72)',
    borderColor: 'rgba(255, 255, 255, 0.8)',
    borderWidth: 2,
  },
  crossHorizontal: {
    position: 'absolute',
    width: OUTER_SIZE - 24,
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.22)',
  },
  crossVertical: {
    position: 'absolute',
    width: 1,
    height: OUTER_SIZE - 24,
    backgroundColor: 'rgba(255, 255, 255, 0.22)',
  },
  knob: {
    width: KNOB_SIZE,
    height: KNOB_SIZE,
    borderRadius: KNOB_SIZE / 2,
    backgroundColor: '#60a5fa',
    borderColor: '#dbeafe',
    borderWidth: 2,
    shadowColor: '#000',
    shadowOpacity: 0.25,
    shadowRadius: 5,
    shadowOffset: {width: 0, height: 3},
    elevation: 6,
  },
});

export default React.memo(LocationJoystick);
