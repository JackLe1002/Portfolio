import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import PropertyListScreen from '../screens/homeowner/PropertyListScreen';
import TenantListScreen from '../screens/homeowner/TenantListScreen';
import { FontAwesome6 } from '@expo/vector-icons';

import { SIZES, COLOURS, FONTWEIGHT } from '../components/Theme';

const Tab = createBottomTabNavigator();

const HomeownerTabNavigator = () => {
    return (
        <Tab.Navigator
            screenOptions={
                ({ route }) => ({
                        tabBarIcon: ({ focused, color, size }) => {
                        let iconName;

                        if (route.name === 'Properties') {
                            iconName = 'building';
                        } else if (route.name === 'Tenants') {
                            iconName = 'user';
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
            <Tab.Screen name="Properties" component={PropertyListScreen} />
            <Tab.Screen name="Tenants" component={TenantListScreen} />
        </Tab.Navigator>
    );
};

export default HomeownerTabNavigator;
