import { StyleSheet, Text, View, Pressable } from 'react-native'
import React from 'react'
import helper from '../Config/Helper';


const PressableItem = ({children, onPress, style}) => {
    return (
        <Pressable 
            onPress={onPress}
            style={({ pressed }) => [
                style || styles.default,
                pressed && styles.pressedStyle  
              ]}>
            {children}
        </Pressable>
      )
}

export default PressableItem

const styles = StyleSheet.create({
    pressedStyle: {
        opacity: 0.5,  
    },
    default:{
        width:"45%",
        flexDirection: 'row',
        padding: helper.padding.listItemContainer,
        backgroundColor: helper.color.pressedDefaultBackgroundColor,
        justifyContent: 'center',
        alignItems: 'center',

    }  
})