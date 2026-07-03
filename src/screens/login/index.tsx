import { Alert, NativeModules, Platform, Pressable, Text, View } from 'react-native';
import React from 'react';
import { useNavigation } from '@react-navigation/native';
import { styles } from './styles';
import GlobalHeader from '../../components/enzymes/header';

const Login: React.FC = () => {
  const navigation = useNavigation<any>();

  const headerData = {
    name: 'SpiderX',
    value: 'SpiderX',
    onPress: () => {},
  };

  const handleGoogleLogin = async () => {
    if (!NativeModules.NativeGoogleScreen?.open) {
      Alert.alert(
        'Native screen unavailable',
        `Rebuild the ${Platform.OS} app so the native Google screen module is included.`,
      );
      return;
    }

    try {
      await NativeModules.NativeGoogleScreen.open();
    } catch (error) {
      Alert.alert('Native screen failed', String(error));
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
          onPress={() => {
            void handleGoogleLogin();
          }}
          style={({ pressed }) => [
            styles.googleButton,
            pressed && styles.googleButtonPressed,
          ]}
        >
          <Text style={styles.googleIcon}>G</Text>
          <Text style={styles.googleButtonText}>Continue with Google</Text>
        </Pressable>
      </View>
    </View>
  );
};

export default Login;
