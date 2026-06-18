import {
  NativeEventEmitter,
  NativeModules,
  type EmitterSubscription,
} from 'react-native';
import type {LocationPoint} from '../types/location';

interface BackgroundLocationNativeModule {
  start(userId: string, apiBaseUrl: string): Promise<void>;
  stop(): Promise<void>;
  isTracking(): Promise<boolean>;
  addListener(eventName: string): void;
  removeListeners(count: number): void;
}

const nativeModule = NativeModules.BackgroundLocation as
  | BackgroundLocationNativeModule
  | undefined;

const emitter = nativeModule ? new NativeEventEmitter(nativeModule) : null;

function requireNativeModule() {
  if (!nativeModule) {
    throw new Error('Background location native module is unavailable.');
  }
  return nativeModule;
}

export const backgroundLocation = {
  start(userId: string, apiBaseUrl: string) {
    return requireNativeModule().start(userId, apiBaseUrl);
  },

  stop() {
    return requireNativeModule().stop();
  },

  async isTracking() {
    return nativeModule ? nativeModule.isTracking() : false;
  },

  onLocation(
    listener: (location: LocationPoint) => void,
  ): EmitterSubscription | null {
    return emitter?.addListener('BackgroundLocationUpdate', listener) ?? null;
  },

  onError(listener: (message: string) => void): EmitterSubscription | null {
    return emitter?.addListener('BackgroundLocationError', listener) ?? null;
  },
};
