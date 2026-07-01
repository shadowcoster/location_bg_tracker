import React from 'react';
import { StatusBar } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { Navigation } from './src/navigations/authStack';

function App() {
  return (
    <SafeAreaProvider>
      <SafeAreaView style={{ flex: 1,backgroundColor:"#252525" }}>
        <StatusBar  animated backgroundColor={"white"} barStyle='default'  />
        <Navigation />
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

export default App;
