import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';

const ButtonSecondary = (props: any) => (
    <TouchableOpacity onPress={props.onPress} style={[styles.button, props.style]}>
        <Text style={styles.text}>{props.title}</Text>
    </TouchableOpacity>
);

const styles = StyleSheet.create({
    button: {
        marginLeft: 4,
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderWidth: 1,
        borderColor: '#007bff',
        borderRadius: 4,
    },
    text: {
        fontFamily: 'Montserrat-Regular',
        color: 'black',
        textAlign: 'center',
        justifyContent: 'center',
    },
});

export default ButtonSecondary;