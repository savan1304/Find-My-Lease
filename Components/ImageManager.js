import { Alert, StyleSheet, Text, View, Image } from 'react-native'
import React, { useContext, useState } from 'react'
import * as ImagePicker from "expo-image-picker"
import PressableItem from './PressableItem';
import { appStyles } from '../Config/Styles';
import { AuthContext } from '../Components/AuthContext'; 

export default function ImageManager({ imageUriHandler }) {
    const { language } = useContext(AuthContext);
    const [response, requestPermission] = ImagePicker.useCameraPermissions();
    const [imageUris, setImageUris] = useState([]);

    async function verifyPermission() {
        console.log(response)
        if (response.granted) {
            return true;
        }
        const permissionResponse = await requestPermission()
        return permissionResponse.granted;
    }

    const takeImageHandler = async () => {
        try {
            const hasPermission = await verifyPermission()
            if (!hasPermission) {
                Alert.alert(language === 'zh' ? "需要使用相机权限" : "You need to give permission to launch camera");
                return;
            }

            if (hasPermission) {
                const result = await ImagePicker.launchCameraAsync({
                    allowsEditing: true,
                    allowsMultipleSelection: true,
                });

                imageUriHandler(result.assets.map(asset => asset.uri));
            }
        } catch (err) {
            console.log("take photo err: ", err)
        }
    };
    return (
        <View>
            <PressableItem onPress={takeImageHandler} style={{ margin: 25 }}>
                <Text style={appStyles.text}>{language === 'zh' ? "拍照" : "Take a photo"} </Text>
            </PressableItem>
            {imageUris.map((uri, index) => (
                <Image
                    key={index}
                    source={{ uri }}
                    style={styles.images}
                />
            ))}

        </View>
    )
}

const styles = StyleSheet.create({
    images: {
        width: 100,
        height: 100,
    }
})
