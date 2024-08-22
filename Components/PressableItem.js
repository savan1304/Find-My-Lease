import { StyleSheet, View, Pressable } from 'react-native'
import React from 'react'
import { Colors } from '../Config/Colors';


const PressableItem = ({ children, onPress, style }) => {
    return (
        <Pressable onPress={onPress} style={({ pressed }) => {
            return [styles.defaultStyle, style, pressed && styles.pressedStyle]
        }}>
            <View>
                <View>{children}</View>
            </View>
        </Pressable>
    )
}

export default PressableItem

const styles = StyleSheet.create({
    pressedStyle: {
        opacity: 0.5,
        backgroundColor: Colors.shadowColor,
    },
    defaultStyle: {
        backgroundColor: Colors.blue,
        padding: 10,
        marginVertical: 10,
        borderRadius: 5,
    }
})