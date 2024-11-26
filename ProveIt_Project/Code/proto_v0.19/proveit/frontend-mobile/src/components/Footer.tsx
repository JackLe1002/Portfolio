import React from 'react';
import { View, ViewProps, StyleSheet } from 'react-native';

const Footer = (props: ViewProps) => (
    <View {...props} style={[styles.footer, props.style]} />
);

const styles = StyleSheet.create({
    footer: {
        width: '100%',
        maxHeight: 60,
        minHeight: 60,
        backgroundColor: '#194185',
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
});

export default Footer;