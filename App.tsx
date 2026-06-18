import React from 'react';
import {StatusBar} from 'react-native';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import LocationTrackingScreen from './src/screens/LocationTrackingScreen';

function App() {
  return (
    <SafeAreaProvider>
      <StatusBar barStyle="dark-content" backgroundColor="#f8fafc" />
      <LocationTrackingScreen />
    </SafeAreaProvider>
  );
}

export default App;
