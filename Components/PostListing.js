import { View, Text, TextInput, SafeAreaView, ScrollView, Image, FlatList } from 'react-native'
import React, { useEffect, useState, useCallback, useRef } from 'react';
import ImageManager from './ImageManager';
import { appStyles } from '../Config/Styles';
import DropDownPicker from 'react-native-dropdown-picker';
import { Colors } from '../Config/Colors';
import Checkbox from 'expo-checkbox';
import * as ImagePicker from "expo-image-picker"
import PressableItem from './PressableItem';
import { writeToDB } from '../Firebase/firestoreHelper';	
import { storage, database, auth } from '../Firebase/firebaseSetup';
import { ref, uploadBytesResumable } from 'firebase/storage';
import { doc, updateDoc } from 'firebase/firestore';
import { useRoute } from '@react-navigation/native';
import { mapsApiKeyE } from '@env'
import Geocoder from 'react-native-geocoding';
import { getDownloadURL } from 'firebase/storage';

export default function PostListing({ navigation }) {

    const user = auth.currentUser
    const route = useRoute();
    const { listingData = {} } = route.params || {};
    console.log("received listingData in PostListing: ", listingData)
    const [images, setImages] = useState([]);
    const [formData, setFormData] = useState({
        price: '',
        location: '',
        latitude: '',
        longitude: '',
        bed: '',
        bath: '',
        area: '',
        petFriendly: false,
        transit: '',
        type: '',
        year: '',
        tenantGender: '',
        imageUris: [],
        createdBy: user.uid
    });
    const [open, setOpen] = useState(false);
    const [type, setType] = useState('');

    const [types, setTypes] = useState([
        { label: 'Shared', value: 'Shared' },
        { label: 'Private', value: 'Private' },
    ]);
    const [enteredLocation, setEnteredLocation] = useState('')
    Geocoder.init(mapsApiKeyE)
    let fetchedImageUrls = []
    const flatListRef = useRef(null);


    useEffect(() => {
        // Updating formData whenever listingData from route params changes
        async function populateData() {
            const fetchedImageUrls = await fetchImageUrls()
            setFormData({
                price: listingData?.price || '',
                location: listingData?.location || '',
                latitude: listingData?.latitude || '',
                longitude: listingData?.longitude || '',
                bed: listingData?.bed || '',
                bath: listingData?.bath || '',
                area: listingData?.area || '',
                petFriendly: listingData?.petFriendly || false,
                transit: listingData?.transit || '',
                type: listingData?.type || '',
                year: listingData?.year || '',
                tenantGender: listingData?.tenantGender || '',
                imageUris: fetchedImageUrls,
                createdBy: user.uid
            });
        }
        populateData()
    }, [route]); // Adding route as a dependency


    console.log("form data after use effect: ", formData)

    async function fetchImageUrls() {
        console.log("entered fetchImageUrls function with listingData: ", listingData)
        if (listingData && listingData.imageUris && listingData.imageUris.length > 0) {
            try {
                fetchedImageUrls = await Promise.all(
                    listingData.imageUris.map(imageUri =>
                        getDownloadURL(ref(storage, imageUri))
                    )
                );
                console.log("Fetched image URLs:", fetchedImageUrls);
                return fetchedImageUrls
            } catch (error) {
                console.error("Error fetching image URLs:", error);
            }
        }
        return []
    }

    useEffect(() => {
        console.log("enteredLocation inside useEffect: ", enteredLocation)
        if (enteredLocation !== '') {
            let latLngFromGeocoder = ''
            Geocoder.from(formData.location)
                .then(json => {
                    latLngFromGeocoder = json.results[0].geometry.location;
                    setFormData(prevFormData => ({
                        ...prevFormData,
                        latitude: Number(json.results[0].geometry.location.lat),
                        longitude: Number(json.results[0].geometry.location.lng)
                    }));
                    console.log("location from Geocoder: ", latLngFromGeocoder);
                })
                .catch(error => console.warn(error));
        }
        console.log("formData after setting lat and lng: ", formData)
    }, [enteredLocation])




    function reset() {
        setFormData({
            price: '',
            location: '',
            latitude: '',
            longitude: '',
            bed: '',
            bath: '',
            area: '',
            petFriendly: false,
            transit: '',
            type: '',
            year: '',
            tenantGender: '',
            imageUris: [],
        });

    }

    async function imageUriHandler(newImageUris) {
        console.log("inside imageUriHandler: ", newImageUris);
        setImages(prevImages => [...prevImages, ...newImageUris.map(uri => ({ uri }))]);
        setFormData(prevFormData => ({
            ...prevFormData,
            imageUris: [...prevFormData.imageUris, ...newImageUris],
        }));
    }

    async function handleDataChange(field, newValue) {

        setFormData(prevFormData => ({
            ...prevFormData,
            [field]: newValue,
        }));
    };

    function handleLocationBlur() {
        setEnteredLocation(formData.location)
    }

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
        if (listingData) {
            navigation.navigate('PostedListings')
        } else {
            navigation.navigate('Profile');
        }
        reset()
    }



    async function retrieveAndUploadImage(imageUri) {
        console.log("inside retrieveAndUploadImage uri: ", imageUri)
        try {
            const response = await fetch(imageUri);
            if (!response.ok) {
                throw new Error("The request was not successful")
            }
            const blob = await response.blob();
            console.log("inside retrieveAndUploadImage blob:", blob)
            const imageName = imageUri.substring(imageUri.lastIndexOf('/') + 1);
            console.log("inside retrieveAndUploadImage imageName:", imageName)
            const imageRef = ref(storage, `images/${imageName}`)
            const uploadResult = await uploadBytesResumable(imageRef, blob);
            return uploadResult.metadata.fullPath
        } catch (error) {
            console.log("retrive and upload image error: ", error)
        }
    }

    const handleSave = useCallback(async () => {

        let imageUrls = [];
        for (const image of images) {
            const imageUrl = await retrieveAndUploadImage(image.uri); // Accessing the 'uri' property
            imageUrls.push(imageUrl);
        }

        const listingDataToSave = {
            ...formData,
            imageUris: imageUrls, // Storing an array of image URLs
        };

        console.log("inside handleSave: ", listingDataToSave)
        if (listingData.id) {
            console.log("updating existing listing with new data: ", formData)
            const listingRef = doc(database, 'Listing', listingData.id);
            console.log(listingRef)
            await updateDoc(listingRef, listingDataToSave);
            navigation.navigate('PostedListings')
        } else {
            console.log("creating new listing with: ", listingDataToSave)
            await writeToDB(listingDataToSave, 'Listing');
            navigation.goBack();
        }
        reset()

    }, [images, formData]); // Including dependencies that should trigger a re-render

    useEffect(() => {
        if (images.length > 0) {
            console.log("images inside useEffect: ", images);
        }
    }, [images]);

    const renderImage = ({ item }) => (
        <Image source={{ uri: item.uri || item }}
            style={{ width: 250, height: 150, margin: 5 }} />
    );



    return (
        <SafeAreaView style={appStyles.postListingContainer}>

            {(images.length > 0 || formData.imageUris.length > 0) ? (
                <View style={appStyles.postImageContainerAfterImageClicked}>
                    <ScrollView
                        style={[appStyles.scrollViewContainer, { height: 250 }]}
                        contentContainerStyle={appStyles.contentContainer}
                    >
                        <FlatList
                            data={images.length > 0 ? images : formData.imageUris}
                            renderItem={renderImage}
                            keyExtractor={(item, index) => index.toString()}
                            horizontal
                            ref={flatListRef}
                            onContentSizeChange={(width, height) => {
                                flatListRef.current?.setNativeProps({
                                    style: { height },
                                });
                            }}
                            style={appStyles.imageList}
                            showsHorizontalScrollIndicator={true}
                        />
                    </ScrollView>

                    {/* Option to add more images */}
                    <View style={appStyles.imageOptionsContainer}>
                        <PressableItem onPress={pickImage}>
                            <Text style={appStyles.text}>Upload Images</Text>
                        </PressableItem>
                        <ImageManager imageUriHandler={imageUriHandler} />
                    </View>
                </View>
            ) : (
                <View style={appStyles.postImageContainer} >
                    <View style={appStyles.imageOptionsContainer}>
                        <PressableItem onPress={pickImage}>
                            <Text style={appStyles.text}>Upload Images</Text>
                        </PressableItem>
                        <ImageManager imageUriHandler={imageUriHandler} />
                    </View>
                </View>
            )
            }


            <View style={appStyles.listingDetailsContainer}>

                <View style={appStyles.twoListingInputContainer}>
                    <View style={appStyles.addItemContainer}>
                        <Text style={appStyles.addTitles}>Type*</Text>
                        <View>
                            <DropDownPicker
                                open={open}
                                value={type || ''}
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
                            onBlur={handleLocationBlur}
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
                            {listingData ? (
                                <Text style={appStyles.text}>Save</Text>
                            ) : (
                                <Text style={appStyles.text}>Post</Text>
                            )}
                        </PressableItem>
                    </View>
                </View>
            </View>



        </SafeAreaView >
    );
}