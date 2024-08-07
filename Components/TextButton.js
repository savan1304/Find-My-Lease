import React from 'react';
import { Text, StyleSheet } from 'react-native';
import helper from '../Config/Helper';

const TextButton = ({ children, style }) => {
    return (
        <Text style={[styles.title, style]}>
        {children}
        </Text>
    );
};

const styles = StyleSheet.create({
    title: {
        color:"white",
        fontSize: helper.fontSize.Button,
        paddingHorizontal: helper.padding.text,
        flex: 1, 
        fontWeight: 'bold',
        textAlign:"center",
    },
});

export default TextButton;
