import React from 'react';
import { Platform, Pressable, Text, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import GlobalHeader from '../../components/enzymes/header';
import { styles } from './styles';

const DummyGoogleScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const platformName = Platform.OS === 'ios' ? 'iOS' : 'Android';

  const headerData = {
    name: 'SpiderX',
    value: 'Google',
    onPress: () => navigation.goBack(),
  };

  return (
    <View style={styles.container}>
      <GlobalHeader key={1} data={headerData} />
      <View style={styles.content}>
        <View style={styles.googleMark}>
          <Text style={styles.googleMarkText}>G</Text>
        </View>
        <Text style={styles.title}>{platformName} dummy Google screen</Text>
        <Text style={styles.subtitle}>
          This screen opens inside the app instead of launching the Google sign-in intent.
        </Text>
        <Pressable
          accessibilityRole="button"
          onPress={() => navigation.goBack()}
          style={({ pressed }) => [
            styles.backButton,
            pressed && styles.backButtonPressed,
          ]}
        >
          <Text style={styles.backButtonText}>Back to login</Text>
        </Pressable>
      </View>
    </View>
  );
};

export default DummyGoogleScreen;
