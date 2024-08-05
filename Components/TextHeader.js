import React from 'react';
import { Text, StyleSheet } from 'react-native';
import helper from '../Config/Helper';

const TextHeader = ({ children, style }) => {
    return (
        <Text style={[styles.headerButton, style]}>
        {children}
        </Text>
    );
};

const styles = StyleSheet.create({
    headerButton: {
        fontSize: helper.fontSize.headerButton,
        marginRight: helper.margin.headerButton,
    },
});

export default TextHeader;
