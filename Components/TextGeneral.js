import React from 'react';
import { Text, StyleSheet } from 'react-native';
import helper from '../Config/Helper';

const TextGeneral = ({ children, style }) => {
    return (
        <Text style={[styles.general, style]}>
        {children}
        </Text>
    );
};

const styles = StyleSheet.create({
    general: {
        fontSize: helper.fontSize.general,
        flex: 1,
    },
});

export default TextGeneral;
