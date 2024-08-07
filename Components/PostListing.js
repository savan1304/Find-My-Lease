import { View, Text, ScrollView, TouchableOpacity, Pressable, TextInput, SafeAreaView, Platform } from 'react-native'
import React, { useState } from 'react';
import ImageManager from './ImageManager';
import { appStyles } from '../Config/Styles';
import DropDownPicker from 'react-native-dropdown-picker';
import { Colors } from '../Config/Colors';
import Checkbox from 'expo-checkbox';
import * as ImagePicker from "expo-image-picker"
import PressableItem from './PressableItem';
import { writeToDB } from '../Firebase/firestoreHelper';
import { storage } from '../Firebase/firebaseSetup';
import { ref, uploadBytesResumable } from 'firebase/storage';
import { doc } from 'firebase/firestore';
import { useRoute } from '@react-navigation/native';
import { database } from '../Firebase/firebaseSetup';
import { updateDoc } from 'firebase/firestore';

export default function PostListing({ navigation }) {
    const route = useRoute();
    const { listingData = {} } = route.params || {};
    const [images, setImages] = useState([]);
    const [formData, setFormData] = useState({
        price: listingData?.price || '',
        location: listingData?.location || '',
        bed: listingData?.bed || '',
        bath: listingData?.bath || '',
        area: listingData?.area || '',
        petFriendly: listingData?.petFriendly || false,
        transit: listingData?.transit || '',
        type: listingData?.type || '',
        year: listingData?.year || '',
        tenantGender: listingData?.tenantGender || '',
        imageUri: listingData?.imageUri || ''
    });
    const [imageUri, setImageUri] = useState('')
    const [open, setOpen] = useState(false);
    const [type, setType] = useState(null); // Default value

    const [types, setTypes] = useState([
        { label: 'Shared', value: 'Shared' },
        { label: 'Private', value: 'Private' },
    ]);


    async function imageUriHandler(imageUri) {
        console.log("inside imageUriHandler: ", imageUri)
        setImageUri(imageUri)
    }

    function handleDataChange(field, newValue) {
        setFormData(prevFormData => ({
            ...prevFormData,
            [field]: newValue,
        }));
    };

    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            allowsMultipleSelection:
                true,
            aspect: [4, 3],
            quality: 1,
        });

        if
            (!result.canceled) {
            setImages(result.assets);
        }
    };


    function handleCancel() {
        navigation.navigate('Profile');
    }



    async function retrieveAndUploadImage(uri) {
        console.log("inside retrieveAndUploadImage uri: ", uri)
        try {
            const response = await fetch(uri);
            if (!response.ok) {
                throw new Error("The request was not successful")
            }
            const blob = await response.blob();
            console.log("inside retrieveAndUploadImage blob:", blob)
            const imageName = uri.substring(uri.lastIndexOf('/') + 1);
            console.log("inside retrieveAndUploadImage imageName:", imageName)
            const imageRef = ref(storage, `images/${imageName}`)
            const uploadResult = await uploadBytesResumable(imageRef, blob);
            return uploadResult.metadata.fullPath
        } catch (error) {
            console.log("retrive and upload image error: ", error)
        }
    }

    async function handleSave() {
        try {
            // const listingData = {
            //     ...formData,
            //     imageUri: "", // Store image URIs
            // };
            console.log("inside handleSave: ", listingData)
            if (listingData.id) {
                console.log("updating existing listing", listingData)
                const listingRef = doc(database, 'Listing', listingData.id);
                console.log(listingRef)
                await updateDoc(listingRef, formData);
            } else {
                console.log("creating new listing", listingData)
                await writeToDB(formData, 'Listing');
            }
            navigation.goBack();
        } catch (error) {
            console.error('Error saving listing:', error);
        }
    };

    return (
        <SafeAreaView style={appStyles.postListingContainer}>
            <View style={appStyles.postImageContainer} >
                <View style={appStyles.imageOptionsContainer}>
                    <PressableItem onPress={pickImage}>
                        <Text style={appStyles.text}>Upload Images</Text>
                    </PressableItem>
                    <ImageManager imageUriHandler={imageUriHandler} />
                </View>
            </View>
            <View style={appStyles.listingDetailsContainer}>
                <View style={appStyles.twoListingInputContainer}>
                    <View style={appStyles.addItemContainer}>
                        <Text style={appStyles.addTitles}>Type*</Text>
                        <View>
                            <DropDownPicker
                                open={open}
                                value={type}
                                items={types}
                                setOpen={setOpen}
                                setValue={setType}
                                onChangeValue={(value) => handleDataChange('type', value)}
                                style={{ borderColor: Colors.blue, borderWidth: 2, marginHorizontal: 2 }}
                                textStyle={appStyles.addTitles}
                                containerStyle={{ width: 150 }}
                                dropDownContainerStyle={{ borderColor: Colors.blue }}
                            />
                        </View>
                    </View>
                    <View style={appStyles.addItemContainer}>
                        <Text style={appStyles.addTitles}>Area*</Text>
                        <View style={appStyles.addInput}>
                            <TextInput
                                value={formData.area}
                                onChangeText={(text) => handleDataChange('area', text)}
                                style={appStyles.addTitles}
                            />
                        </View>
                    </View>
                </View>

                <View style={appStyles.addItemContainer}>
                    <Text style={appStyles.addTitles}>Location*</Text>
                    <View style={[appStyles.addInput, { width: '75%' }]}>
                        <TextInput
                            value={formData.location}
                            onChangeText={(text) => handleDataChange('location', text)}
                            style={appStyles.addTitles}
                        />
                    </View>
                </View>

                <View style={appStyles.twoListingInputContainer}>
                    <View style={appStyles.addItemContainer}>
                        <Text style={appStyles.addTitles}>Price*</Text>
                        <View style={appStyles.addInput}>
                            <TextInput
                                value={formData.price}
                                onChangeText={(text) => handleDataChange('price', text)}
                                style={appStyles.addTitles}
                                keyboardType="numeric"

                            />
                        </View>
                    </View>
                    <View style={appStyles.addItemContainer}>
                        <Text style={appStyles.addTitles}>Tenant Gender</Text>
                        <View style={appStyles.addInput}>
                            <TextInput
                                value={formData.tenantGender}
                                onChangeText={(text) => handleDataChange('tenantGender', text)}
                                style={appStyles.addTitles}
                            />
                        </View>
                    </View>
                </View>

                <View style={appStyles.twoListingInputContainer}>
                    <View style={appStyles.addItemContainer}>
                        <Text style={appStyles.addTitles}>Bed*</Text>
                        <View style={appStyles.addInput}>
                            <TextInput
                                value={formData.bed}
                                onChangeText={(text) => handleDataChange('bed', text)}
                                style={appStyles.addTitles}
                                keyboardType="numeric"
                            />
                        </View>
                    </View>
                    <View style={appStyles.addItemContainer}>
                        <Text style={appStyles.addTitles}>Bath*</Text>
                        <View style={appStyles.addInput}>
                            <TextInput
                                value={formData.bath}
                                onChangeText={(text) => handleDataChange('bath', text)}
                                style={appStyles.addTitles}
                                keyboardType="numeric"
                            />
                        </View>
                    </View>
                </View>

                <View style={appStyles.addItemContainer}>
                    <Text style={appStyles.addTitles}>Transit options</Text>
                    <View style={[appStyles.addInput, { width: '65%' }]}>
                        <TextInput
                            value={formData.transit}
                            onChangeText={(text) => handleDataChange('transit', text)}
                            style={appStyles.addTitles}
                        />
                    </View>
                </View>

                <View style={appStyles.twoListingInputContainer}>
                    <View style={[appStyles.checkboxContainer, appStyles.addItemContainer]}>
                        <Text style={appStyles.addTitles}>Pet Friendly? </Text>
                        <Checkbox
                            style={appStyles.checkbox}
                            value={formData.petFriendly}
                            onValueChange={(newValue) => { handleDataChange('petFriendly', newValue) }}
                            color={formData.petFriendly ? Colors.blue : undefined}
                        />
                    </View>
                    <View style={appStyles.addItemContainer}>
                        <Text style={appStyles.addTitles}>Year</Text>
                        <View style={appStyles.addInput}>
                            <TextInput
                                value={formData.year}
                                onChangeText={(text) => handleDataChange('year', text)}
                                style={appStyles.addTitles}
                            />
                        </View>
                    </View>
                </View>
            </View>

            <View style={appStyles.buttonsView}>
                <View style={appStyles.buttonContainer}>
                    <View style={appStyles.saveAndCancelButtonContainer}>
                        <PressableItem onPress={() => handleCancel()} style={[appStyles.buttonStyle, appStyles.cancelButton]} >
                            <Text style={appStyles.text}>Cancel</Text>
                        </PressableItem>
                        <PressableItem onPress={() => handleSave()} style={[appStyles.buttonStyle, appStyles.saveButton]} >
                            <Text style={appStyles.text}>Save</Text>
                        </PressableItem>
                    </View>
                </View>
            </View>


        </SafeAreaView>


    );
}










