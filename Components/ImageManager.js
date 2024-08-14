import { Alert, StyleSheet, Text, View, Image } from 'react-native'
import React, { useState } from 'react'
import * as ImagePicker from "expo-image-picker"
import PressableItem from './PressableItem';
import { appStyles } from '../Config/Styles';

export default function ImageManager({ imageUriHandler }) {

    const [response, requestPermission] = ImagePicker.useCameraPermissions();
    const [imageUri, setImageUri] = useState('')

    async function verifyPermission() {
        console.log(response)
        if (response.granted) {
            return true;
        }
        const permissionResponse = await requestPermission()
        return permissionResponse.granted;
    }

    const takeImageHandler = async () => {
        console.log("inside takeImageHandler")
        try {
            const hasPermission = await verifyPermission()
            if (!hasPermission) {
                Alert.alert("You need to give permission to launch camera")
                return;
            }
            if (hasPermission) {
                const result = await ImagePicker.launchCameraAsync({
                    allowsEditing: true
                })
                console.log("result from takeImageHandler: ",result)
                setImageUri(result.assets[0].uri)
                imageUriHandler(result.assets[0].uri)   // didn't pass imageUri here because setImageUri is async so it will be set in the next render, and immediately imageUri will still be empty string.

            }
        }
        catch (err) {
            console.log("take photo err: ", err)
        }

    };
    return (
        <View>
            <PressableItem onPress={takeImageHandler}>
                <Text style={appStyles.text}>Take a photo</Text>
            </PressableItem>
            {imageUri && (<Image source={{
                uri: imageUri,
            }} style={styles.images}
            />)}

        </View>
    )
}

const styles = StyleSheet.create({
    images: {
        width: 100,
        height: 100,
    }
})