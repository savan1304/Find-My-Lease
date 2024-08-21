import { View, Text, TextInput, ScrollView, Image, FlatList } from 'react-native'
import React, { useEffect, useState, useCallback, useRef, useContext } from 'react';
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
import { AuthContext } from '../Components/AuthContext';

export default function PostListing({ navigation }) {
    const { language } = useContext(AuthContext);
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
            style={{ width: 300, height: 250, margin: 5 }} />
    );

    function isListingDataLengthPositive() {
        if (listingData && Object.keys(listingData).length > 0) {
            return true
        }
        return false
    }


    return (
        <ScrollView keyboardShouldPersistTaps='handled' style={appStyles.postListingContainer} contentContainerStyle={{
            justifyContent: 'center',
            alignItems: 'center',
        }}>
            {(images.length > 0 || formData.imageUris.length > 0) ? (
                <View style={appStyles.postImageContainerAfterImageClicked}>
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
                    {/* Option to add more images */}
                    <View style={appStyles.imageOptionsContainer}>
                        <PressableItem onPress={pickImage} style={{ margin: 25 }}>
                        <Text style={appStyles.text}>{language === 'zh' ? '上传图片' : 'Upload Images'} </Text>
                        </PressableItem>
                        <ImageManager imageUriHandler={imageUriHandler} />
                    </View>
                </View>
            ) : (
                <View style={appStyles.postImageContainer} >
                    <View style={appStyles.imageOptionsContainer}>
                        <PressableItem onPress={pickImage} style={{ margin: 25 }}>
                        <Text style={appStyles.text}>{language === 'zh' ? '上传图片' : 'Upload Images'} </Text>
                        </PressableItem>
                        <ImageManager imageUriHandler={imageUriHandler} />
                    </View>
                </View>
            )
            }


            <View style={appStyles.listingDetailsContainer}>

                <View style={appStyles.twoListingInputContainer}>
                    <View style={appStyles.addItemContainer}>
                    <Text style={appStyles.addTitles}>{language === 'zh' ? '类型*' : 'Type*'} </Text>
                        <View>
                            <DropDownPicker
                                open={open}
                                value={type || ''}
                                items={types}
                                setOpen={setOpen}
                                setValue={setType}
                                onChangeValue={(value) => handleDataChange('type', value)}
                                style={{ borderColor: Colors.blue, borderWidth: 1.5, marginHorizontal: 2 }}
                                textStyle={appStyles.addTitles}
                                containerStyle={{ width: 150 }}
                                dropDownContainerStyle={{ borderColor: Colors.blue, backgroundColor: Colors.background, borderWidth: 1.5 }}
                                listMode="SCROLLVIEW"
                            />
                        </View>
                    </View>
                    <View style={appStyles.addItemContainer}>
                    <Text style={appStyles.addTitles}>{language === 'zh' ? '面积*' : 'Area*'} </Text>
                        <View style={[
                            appStyles.addInput,
                            isListingDataLengthPositive() && { alignItems: 'center', paddingLeft: 0 }
                        ]}>
                            <TextInput
                                value={formData.area}
                                onChangeText={(text) => handleDataChange('area', text)}
                                style={appStyles.addTitles}
                            />
                        </View>
                    </View>
                </View>

                <View style={appStyles.addItemContainer}>
                <Text style={appStyles.addTitles}>{language === 'zh' ? '位置*' : 'Location*'} </Text>
                    <View style={[
                        appStyles.addInput, { width: '75%' },
                        isListingDataLengthPositive() && { alignItems: 'center', paddingLeft: 0 }
                    ]}>
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
                    <Text style={appStyles.addTitles}>{language === 'zh' ? '价格*' : 'Price*'} </Text>
                        <View style={[
                            appStyles.addInput,
                            isListingDataLengthPositive() && { alignItems: 'center', paddingLeft: 0 }
                        ]}>
                            <TextInput
                                value={formData.price}
                                onChangeText={(text) => handleDataChange('price', text)}
                                style={appStyles.addTitles}
                                keyboardType="numeric"

                            />
                        </View>
                    </View>
                    <View style={appStyles.addItemContainer}>
                    <Text style={appStyles.addTitles}>{language === 'zh' ? '租客性别' : 'Tenant Gender'} </Text>
                        <View style={[
                            appStyles.addInput,
                            isListingDataLengthPositive() && { alignItems: 'center', paddingLeft: 0 }
                        ]}>
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
                    <Text style={appStyles.addTitles}>{language === 'zh' ? '卧室*' : 'Bed*'} </Text>
                        <View style={[
                            appStyles.addInput,
                            isListingDataLengthPositive() && { alignItems: 'center', paddingLeft: 0 }
                        ]}>
                            <TextInput
                                value={formData.bed}
                                onChangeText={(text) => handleDataChange('bed', text)}
                                style={appStyles.addTitles}
                                keyboardType="numeric"
                            />
                        </View>
                    </View>
                    <View style={appStyles.addItemContainer}>
                    <Text style={appStyles.addTitles}>{language === 'zh' ? '浴室*' : 'Bath*'} </Text>
                        <View style={[
                            appStyles.addInput,
                            isListingDataLengthPositive() && { alignItems: 'center', paddingLeft: 0 }
                        ]}>
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
                <Text style={appStyles.addTitles}>{language === 'zh' ? '交通' : 'Transit options'} </Text>
                    <View style={[
                        appStyles.addInput, { width: '65%' },
                        isListingDataLengthPositive() && { alignItems: 'center', paddingLeft: 0 }
                    ]}>
                        <TextInput
                            value={formData.transit}
                            onChangeText={(text) => handleDataChange('transit', text)}
                            style={appStyles.addTitles}
                        />
                    </View>
                </View>

                <View style={appStyles.twoListingInputContainer}>
                    <View style={[appStyles.checkboxContainer, appStyles.addItemContainer]}>
                    <Text style={appStyles.addTitles}>{language === 'zh' ? '宠物友好？' : 'Pet Friendly?'} </Text>
                        <Checkbox
                            style={appStyles.checkbox}
                            value={formData.petFriendly}
                            onValueChange={(newValue) => { handleDataChange('petFriendly', newValue) }}
                            color={formData.petFriendly ? Colors.blue : undefined}
                        />
                    </View>
                    <View style={appStyles.addItemContainer}>
                    <Text style={appStyles.addTitles}>{language === 'zh' ? '年份' : 'Year'} </Text>
                        <View style={[
                            appStyles.addInput,
                            isListingDataLengthPositive() && { alignItems: 'center', paddingLeft: 0 }
                        ]}>
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
                        <PressableItem onPress={() => handleCancel()} style={[appStyles.buttonStyle, appStyles.cancelButton, { margin: 25, height: 40 }]} >
                        <Text style={appStyles.text}>{language === 'zh' ? '取消' : 'Cancel'} </Text>
                        </PressableItem>
                        <PressableItem onPress={() => handleSave()} style={[appStyles.buttonStyle, appStyles.saveButton, { margin: 25, height: 40 }]} >
                        <Text style={appStyles.text}>{isListingDataLengthPositive() ? (language === 'zh' ? '保存' : 'Save') : (language === 'zh' ? '发布' : 'Post')} </Text>
                        </PressableItem>
                    </View>
                </View>
            </View>


        </ScrollView>
    );
}