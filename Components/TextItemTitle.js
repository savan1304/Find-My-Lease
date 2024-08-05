import React from 'react';
import { Text, StyleSheet } from 'react-native';
import helper from '../Config/Helper';

const TextItemTitle = ({ children, style }) => {
    return (
        <Text style={[styles.title, style]}>
        {children}
        </Text>
    );
};

const styles = StyleSheet.create({
    title: {
        fontSize: helper.fontSize.title,
        padding: helper.padding.text,
        flex: 1, 
        fontWeight: 'bold'
    },
});

export default TextItemTitle;
