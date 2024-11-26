import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import SRScreenNew from "../screens/service-provider/SRScreenNewTabbed";
import SRScreenActive from "../screens/service-provider/SRScreenActiveTabbed";
import SRScreenCompleted from "../screens/service-provider/SRScreenCompletedTabbed";
import { FontAwesome6 } from '@expo/vector-icons';

import { COLOURS } from '../components/Theme';

const Tab = createBottomTabNavigator();

const ServiceProviderTabNavigator = () => {
    return (
        <Tab.Navigator
            screenOptions={
                ({ route }) => ({
                        tabBarIcon: ({ focused, color, size }) => {
                        let iconName;

                        switch(route.name) {
                        case 'New Requests':
                            iconName = 'plus';
                            break;
                        case 'Active Requests':
                            iconName = 'helmet-safety';
                            break;
                        case 'Completed Requests':
                            iconName = 'file-circle-check';
                            break;
                    }

                    // You can return any component that you like here!
                    return <FontAwesome6 name={iconName} size={24} color={color} />;
                },
                headerShown: false,
                tabBarActiveTintColor: 'white',
                tabBarInactiveTintColor: 'gray',
                tabBarStyle: {backgroundColor: COLOURS.blue},
            }
        )}>
            <Tab.Screen name="New Requests" component={SRScreenNew} options={{
                headerShown: false
            }}/>
            <Tab.Screen name="Active Requests" component={SRScreenActive} options={{
                headerShown: false
            }}/>
            <Tab.Screen name="Completed Requests" component={SRScreenCompleted} options={{
                headerShown: false
            }}/>
        </Tab.Navigator>
    );
};

export default ServiceProviderTabNavigator;
