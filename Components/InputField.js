import React from 'react';
import { TextInput, StyleSheet } from 'react-native';
import helper from '../Config/Helper';

const InputField = ({ value, onChangeText, placeholder, onBlur, keyboardType, style, onFocus}) => {
    return (
        <TextInput
        style={[styles.input, style]}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        onBlur={onBlur}
        keyboardType={keyboardType}
        onFocus = {onFocus}
        />
    );
};

const styles = StyleSheet.create({
    input: {
        borderColor: helper.color.inputBottomBorder, 
        borderWidth: 1, 
        padding: helper.padding.input,
        width: '100%', 
    },
});

export default InputField;
