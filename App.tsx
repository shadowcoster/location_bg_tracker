import React from 'react';
import { StatusBar, Text } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { Navigation } from './src/navigations/authStack';
import { Login } from './src/screens';

function App() {
  return (
    <SafeAreaProvider>
      <SafeAreaView>
        <StatusBar barStyle="dark-content" backgroundColor="#f8fafc" />
<Login/>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

export default App;
