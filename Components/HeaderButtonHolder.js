import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import helper from '../Config/Helper';


const headerButtonHolder = ({onPress, children, style }) => {
    return (
        <Pressable
            onPress={onPress} 
            style={({ pressed }) => [
                styles.buttonContainer,
                style,
                pressed ? styles.pressed : null,
            ]}
            >
                {children}
            </Pressable>
    );
};

const styles = StyleSheet.create({
    buttonContainer: {
        flexDirection: "row",
        marginRight: helper.margin.headerButtonRight,
        alignContent:"flex-end",
        justifyContent:"flex-end",
        width: "30%",
        paddingRight: 10,
    },
    pressed: {
        opacity: 0.5, 
        backgroundColor: "#E8E8E8" 
    }
});

export default headerButtonHolder;
