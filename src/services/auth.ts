import { Platform } from 'react-native';
import {
  GoogleSignin,
  statusCodes,
} from '@react-native-google-signin/google-signin';
import {
  getAuth,
  GoogleAuthProvider,
  signInWithCredential,
} from '@react-native-firebase/auth';
import { firebaseConfig } from '../config/firebase';

GoogleSignin.configure({
  webClientId: firebaseConfig.googleWebClientId,
  iosClientId: firebaseConfig.iosClientId,
  offlineAccess: false,
});

function hasValidGoogleWebClientId() {
  return (
    firebaseConfig.googleWebClientId.length > 0 &&
    !firebaseConfig.googleWebClientId.startsWith('YOUR_FIREBASE_WEB_CLIENT_ID')
  );
}

export async function signInWithGoogle() {
  if (!hasValidGoogleWebClientId()) {
    throw new Error(
      'Add your Firebase Web client ID in src/config/firebase.ts before using Google sign-in.',
    );
  }

  if (Platform.OS === 'android') {
    await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
  }

  const response = await GoogleSignin.signIn();

  if (response.type === 'cancelled') {
    return null;
  }

  const { idToken } = response.data;

  if (!idToken) {
    throw new Error('Google sign-in did not return an ID token.');
  }

  const credential = GoogleAuthProvider.credential(idToken);
  const userCredential = await signInWithCredential(getAuth(), credential);

  return userCredential.user;
}

export function isGoogleSignInInProgress(error: unknown) {
  return (
    typeof error === 'object' &&
    error !== null &&
    'code' in error &&
    error.code === statusCodes.IN_PROGRESS
  );
}

export function isGoogleSignInCancelled(error: unknown) {
  return (
    typeof error === 'object' &&
    error !== null &&
    'code' in error &&
    error.code === statusCodes.SIGN_IN_CANCELLED
  );
}

export function getAuthErrorMessage(error: unknown) {
  if (
    typeof error === 'object' &&
    error !== null &&
    'code' in error &&
    error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE
  ) {
    return 'Google Play services are not available or need to be updated.';
  }

  if (typeof error === 'object' && error !== null && 'message' in error) {
    return String(error.message);
  }

  return 'Please try again.';
}
