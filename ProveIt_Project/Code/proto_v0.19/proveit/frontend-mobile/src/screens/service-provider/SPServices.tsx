import React from 'react';
import { View, Image, StyleSheet, Button, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';



type RootStackParamList = {
    Login: undefined;
    SignUp: undefined;
};

type NavigationType = StackNavigationProp<RootStackParamList, 'Login'>;

function Home() {
    const navigation = useNavigation<NavigationType>();

    const handleLogIn = () => {
        navigation.navigate("Login");
    };

    // TODO: Set up SIGN UP page
    const handleSignUp = () => {
        navigation.navigate("SignUp");
    };

    return null;
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    logoContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    logo: {
        width: 100,
        height: 100,
        resizeMode: 'contain',
    },
    hr: {
        height: 1,
        backgroundColor: 'gray',
        width: '80%',
        marginVertical: 20,
    },
    mainContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    mainLeft: {
        flex: 1,
        alignItems: 'center',
    },
    mainRight: {
        flex: 1,
        alignItems: 'center',
    },
    graphic: {
        width: 200,
        height: 200,
        resizeMode: 'contain',
    },
});

export default Home;