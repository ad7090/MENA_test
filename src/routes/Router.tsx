import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import * as React from 'react';
import SplashScreen from '../screens/splash';
import Navigation from '../services/navigation';
import BottomTab from './BottomTab';

const Stack = createNativeStackNavigator();

function Router() {
    return (
        <NavigationContainer
            ref={(ref) => {
                // @ts-ignore
                Navigation.setInstance(ref);
            }}
        >
            <Stack.Navigator screenOptions={{ headerShown: false }} initialRouteName="SplashScreen">
                <Stack.Screen name="BottomTab" children={() => <BottomTab />} />
                <Stack.Screen name="SplashScreen" children={() => <SplashScreen />} />
            </Stack.Navigator>
        </NavigationContainer>
    );
}

export default Router;
