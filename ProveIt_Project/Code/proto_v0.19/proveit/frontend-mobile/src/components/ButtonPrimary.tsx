import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';

const ButtonPrimary = (props: any) => (
    <TouchableOpacity onPress={props.onPress} style={[styles.button, props.style]}>
        <Text style={styles.text}>{props.title}</Text>
    </TouchableOpacity>
);

const styles = StyleSheet.create({
    button: {
        backgroundColor: '#194185',
        padding: 10,
        borderRadius: 5,
        display: 'flex',
        justifyContent: 'center'
    },
    text: {
        fontFamily: 'Montserrat-Regular',
        color: 'white',
        textAlign: 'center',
        justifyContent: 'center',
    },
});

export default ButtonPrimary;