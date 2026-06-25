import { createStaticNavigation } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Login } from '../screens';

const RootStack = createNativeStackNavigator({
initialRouteName: 'Login',
  screenOptions: {headerShown:false
  },
  screens: {
    Login: Login ,
  },
});
export const Navigation = createStaticNavigation(RootStack);

