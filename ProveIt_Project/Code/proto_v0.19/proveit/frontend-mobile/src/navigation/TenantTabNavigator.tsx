import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from "../screens/tenant/HomeScreenTabbed";
import SRScreenActive from "../screens/tenant/SRScreenActiveTabbed";
import SRScreenCompleted from '../screens/tenant/SRScreenCompletedTabbed';
import { FontAwesome6 } from '@expo/vector-icons';

import { SIZES, COLOURS, FONTWEIGHT } from '../components/Theme';

const Tab = createBottomTabNavigator();

const TenantTabNavigator = () => {
    return (
        <Tab.Navigator
            screenOptions={
                ({ route }) => ({
                        tabBarIcon: ({ focused, color, size }) => {
                        let iconName;

                        switch(route.name) {
                            case 'Home':
                                iconName = 'house';
                                break;
                            case 'Active Tickets':
                                iconName = 'ticket';
                                break;
                            case 'Completed Tickets':
                                iconName = 'check';
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
            )}
        >
            <Tab.Screen name="Home" component={HomeScreen} options={{
                headerShown: false
            }}/>
            <Tab.Screen name="Active Tickets" component={SRScreenActive} options={{
                headerShown: false
            }}/>
            <Tab.Screen name="Completed Tickets" component={SRScreenCompleted} options={{
                headerShown: false
            }}/>
        </Tab.Navigator>
    );
};

export default TenantTabNavigator;
