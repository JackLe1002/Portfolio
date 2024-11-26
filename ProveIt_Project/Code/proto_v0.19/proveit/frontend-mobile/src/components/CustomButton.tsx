import React from 'react';
import { TouchableOpacity, Text, StyleSheet, GestureResponderEvent } from 'react-native';

interface CustomButtonProps {
    title: string;
    onPress: (event: GestureResponderEvent) => void;
}
const CustomButton: React.FC<CustomButtonProps> = ({ onPress, title }) => (
    <TouchableOpacity onPress={onPress} style={styles.button}>
        <Text style={styles.text}>{title}</Text>
    </TouchableOpacity>
);

const styles = StyleSheet.create({
    button: {
        backgroundColor: '#194185',
        padding: 10,
        borderRadius: 5,
        margin: '2%',
        minWidth: '50%',
        minHeight: '5%',
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

export default CustomButton;