import React from 'react';
import { View, StyleSheet } from 'react-native';

import ButtonPrimary from '../components/ButtonPrimary';
import { useLogout } from '../hooks/useLogout';

function Settings() {
    const { logout } = useLogout();

    const handleLogOut = () => {
        logout();
    }

    return (
        <View style={styles.container}>
            <ButtonPrimary title='Log Out' onPress={handleLogOut}></ButtonPrimary>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
});

export default Settings;