import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import TenantTabNavigator from './TenantTabNavigator';
import SettingsScreen from '../screens/Settings';
import { COLOURS } from '../components/Theme';

const Drawer = createDrawerNavigator();
const screenOptions = {
    headerStyle: {backgroundColor: COLOURS.blue,},
    headerTitleStyle: {color: 'white', fontFamily: 'Montserrat-Regular'},
    headerTintColor: 'white',
    drawerActiveTintColor: COLOURS.blue,
    drawerInactiveTintColor: 'gray',
}

const TenantDrawerNavigator = () => {
    return (
        <Drawer.Navigator screenOptions={screenOptions}>
            <Drawer.Screen name="TenantHomeTabs" component={TenantTabNavigator} options={{ title: 'Dashboard' }} />
            <Drawer.Screen name="Settings" component={SettingsScreen} />
        </Drawer.Navigator>
    );
};

export default TenantDrawerNavigator;
