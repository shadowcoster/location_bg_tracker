import { ActivityIndicator, Alert, Pressable, Text, View } from 'react-native';
import React, { useState } from 'react';
import { styles } from './styles';
import GlobalHeader from '../../components/enzymes/header';
import {
  getAuthErrorMessage,
  isGoogleSignInCancelled,
  isGoogleSignInInProgress,
  signInWithGoogle,
} from '../../services/auth';

const Login: React.FC = () => {
  const [loading, setLoading] = useState(false);

  const headerData = {
    name: 'SpiderX',
    value: 'SpiderX',
    onPress: () => {},
  };

  const handleGoogleLogin = async () => {
    if (loading) {
      return;
    }

    try {
      setLoading(true);
      const user = await signInWithGoogle();

      if (user) {
        Alert.alert('Signed in', `Welcome ${user.displayName ?? user.email}`);
      }
    } catch (error) {
      if (!isGoogleSignInInProgress(error) && !isGoogleSignInCancelled(error)) {
        console.warn('Google sign-in failed', error);
        Alert.alert('Google sign-in failed', getAuthErrorMessage(error));
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.v1}>
      <GlobalHeader key={1} data={headerData} />
      <View style={styles.content}>
        <Text style={styles.title}>Sign in to SpiderX</Text>
        <Text style={styles.subtitle}>Use your Google account to continue.</Text>
        <Pressable
          accessibilityRole="button"
          disabled={loading}
          onPress={() => {
            void handleGoogleLogin();
          }}
          style={({ pressed }) => [
            styles.googleButton,
            pressed && styles.googleButtonPressed,
            loading && styles.googleButtonDisabled,
          ]}
        >
          {loading ? (
            <ActivityIndicator color="#252525" />
          ) : (
            <>
              <Text style={styles.googleIcon}>G</Text>
              <Text style={styles.googleButtonText}>Continue with Google</Text>
            </>
          )}
        </Pressable>
      </View>
    </View>
  );
};

export default Login;
