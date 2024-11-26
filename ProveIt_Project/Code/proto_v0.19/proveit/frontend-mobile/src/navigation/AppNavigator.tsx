import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Home from '../screens/Home';
import Login from '../screens/Login';
import HomeownerDrawerNavigator from "./HODrawerNavigator";
import TenantDrawerNavigator from "./TenantDrawerNavigator";
import SPDrawerNavigator from "./SPDrawerNavigator";
import ServiceRequest from "../screens/tenant/ServiceRequest";
import Homie from "../screens/tenant/Homie";

import { COLOURS, SIZES } from '../components/Theme';

export type AppStackParamList = {
    Home: undefined;
    Login: undefined;
    HomeownerDashboard: undefined;
    TenantDashboard: undefined;
    SPDashboard: undefined;
    TenantServiceRequest: undefined;
    Homie: { propertyId: string | null };
};

const Stack = createNativeStackNavigator<AppStackParamList>();
const optionsTenantServiceRequest = {
    headerShown: true,
    headerTitle: 'Dashboard',
    headerBackTitle: 'Back',
    headerStyle: {backgroundColor: COLOURS.blue,},
    headerTitleStyle: {color: 'white', fontFamily: 'Montserrat-Regular', fontSize: SIZES.h1+2},
    headerBackTitleStyle: {color: 'white', fontFamily: 'Montserrat-Regular', fontSize: SIZES.h1},
    headerTintColor: 'white',
}
const optionsHomie = {
    headerShown: true,
    headerTitle: 'Homie',
    headerBackTitle: 'Back',
    headerStyle: {backgroundColor: COLOURS.blue,},
    headerTitleStyle: {color: 'white', fontFamily: 'Montserrat-Regular', fontSize: SIZES.h1+2},
    headerBackTitleStyle: {color: 'white', fontFamily: 'Montserrat-Regular', fontSize: SIZES.h1},
    headerTintColor: 'white',
}

function AppNavigator() {
    return (
        <Stack.Navigator
            screenOptions={{headerShown: false}}
        >
            <Stack.Screen name="Home" component={Home} options={{gestureEnabled: false}} />
            <Stack.Screen name="Login" component={Login} />
            <Stack.Screen name="HomeownerDashboard" component={HomeownerDrawerNavigator} options={{ headerShown: false }}/>
            <Stack.Screen name="TenantDashboard" component={TenantDrawerNavigator} options={{ headerShown: false }}/>
            <Stack.Screen name="SPDashboard" component={SPDrawerNavigator} options={{ headerShown: false }}/>
            <Stack.Screen name="TenantServiceRequest" component={ServiceRequest} options={optionsTenantServiceRequest}/>
            <Stack.Screen name="Homie" component={Homie} initialParams={{ propertyId: null }} options={optionsHomie}/>
        </Stack.Navigator>
    );
}

export default AppNavigator;
