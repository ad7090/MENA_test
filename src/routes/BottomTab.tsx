import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import React, { useEffect } from 'react'
import { StyleSheet, } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Icons } from '../components/Icon';
import TabButton from '../components/TabButton';
import CountriesScreen from '../screens/countries';
import WorldScreen from '../screens/world';

const TabNavigator = createBottomTabNavigator();

const TabArr = [
    { route: 'World', label: 'World', type: Icons.FontAwesome5, icon: 'globe-americas', component: WorldScreen },
    { route: 'Countries', label: 'Countries', type: Icons.FontAwesome, icon: 'flag-o', component: CountriesScreen },
];

const BottomTab = () => {

    const safeAreaInsets = useSafeAreaInsets();

    const calcBottomPadding = () => {
        if (safeAreaInsets.bottom) {
            return safeAreaInsets.bottom - 10;
        } else {
            return 16;
        }
    }

    return (
        <TabNavigator.Navigator
            screenOptions={{
                headerShown: false,
                tabBarStyle: [styles.tabBar, { bottom: calcBottomPadding() }],
            }}
            initialRouteName="World"
        >
            {TabArr.map((item, index) => {
                return (
                    <TabNavigator.Screen key={index} name={item.route} component={item.component}
                        options={{
                            tabBarShowLabel: false,
                            tabBarButton: (props) => <TabButton {...props} item={item} />
                        }}
                    />
                )
            })}
        </TabNavigator.Navigator>
    )
}

const styles = StyleSheet.create({
    tabBar: {
        height: 70,
        position: 'absolute',
        right: 16,
        left: 16,
        borderRadius: 16,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
    }
});

export default React.memo(BottomTab);
