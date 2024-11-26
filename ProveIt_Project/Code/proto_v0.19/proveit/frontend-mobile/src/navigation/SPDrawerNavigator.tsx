import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import SPTabNavigator from './SPTabNavigator';
import SPServices from '../screens/service-provider/SPServices';
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

const ServiceProviderDrawerNavigator = () => {
    return (
        <Drawer.Navigator screenOptions={screenOptions}>
            <Drawer.Screen name="SPHomeTabs" component={SPTabNavigator} options={{ title: 'Dashboard' }} />
            <Drawer.Screen name="SPServices" component={SPServices} options={{ title: 'My Services' }} />
            <Drawer.Screen name="Settings" component={SettingsScreen} />
        </Drawer.Navigator>
    );
};

export default ServiceProviderDrawerNavigator;
