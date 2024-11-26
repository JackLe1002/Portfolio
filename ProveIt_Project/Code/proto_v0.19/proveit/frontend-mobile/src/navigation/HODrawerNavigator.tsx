import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';

import HomeownerTabNavigator from './HOTabNavigator';
import Settings from '../screens/Settings';
import { COLOURS } from '../components/Theme';

const Drawer = createDrawerNavigator();
const screenOptions = {
    headerStyle: {backgroundColor: COLOURS.blue,},
    headerTitleStyle: {color: 'white', fontFamily: 'Montserrat-Regular'},
    headerTintColor: 'white',
    drawerActiveTintColor: COLOURS.blue,
    drawerInactiveTintColor: 'gray',
}

const HomeownerDrawerNavigator = () => {
    return (
        <Drawer.Navigator screenOptions={screenOptions}>
            <Drawer.Screen name="HOHomeTabs" component={HomeownerTabNavigator} options={{ title: 'Dashboard' }} />
            <Drawer.Screen name="Settings" component={Settings} />
        </Drawer.Navigator>
    );
};

export default HomeownerDrawerNavigator;
