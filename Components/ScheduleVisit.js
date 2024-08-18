import { Text, View, TouchableOpacity, TextInput, Switch, Image, ScrollView, FlatList } from 'react-native'
import React, { useState, useEffect } from 'react'
import { appStyles } from '../Config/Styles';
import DateTimePicker from '@react-native-community/datetimepicker';
import PressableItem from './PressableItem';
import { auth, database } from '../Firebase/firebaseSetup';
import { collection, addDoc, updateDoc, doc, getDoc } from 'firebase/firestore';
import { useRoute } from '@react-navigation/native';
import { Colors } from '../Config/Colors';
import { scheduleNotification, requestNotificationPermissions } from '../Components/NotificationManager';
import { getDownloadURL, ref } from 'firebase/storage';
import { storage } from '../Firebase/firebaseSetup';

export default function ScheduleVisit({ navigation }) {

    const route = useRoute();
    const user = auth.currentUser;
    const { visitData = {}, listingData = {} } = route.params || {};
    console.log("received visitData in ScheduleVisit: ", visitData)
    console.log("received listingData in ScheduleVisit: ", listingData)
    let listing = {};
    if (Object.keys(visitData).length === 0) {
        listing = route.params.house;
        console.log("no visitData, value of listing: ", listing)
    }
    const [visit, setVisit] = useState({
        listingId: listing.id,
        listingLocation: listing.location,
        listingPrice: listing.price,
        date: new Date(),
        time: new Date(),
        questions: '',
        setReminder: false,
        requester: user.uid,
        status: 'pending',
        rescheduleDate: '',
        rescheduleTime: '',
        rescheduleResponse: ''
    });
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [showTimePicker, setShowTimePicker] = useState(false);

    const [imageUrls, setImageUrls] = useState([]); // Storing fetched image URLs
    const [listingDetails, setListingDetails] = useState({})


    useEffect(() => {
        // Updating visit whenever visitData from route params changes
        async function populateData() {
            setVisit({
                listingId: visitData?.listingId || listing.id,
                listingLocation: visitData?.listingLocation || listing.location,
                listingPrice: visitData?.listingPrice || listing.price,
                date: visitData?.date ? new Date(visitData.date.seconds * 1000) : new Date(),
                time: visitData?.time ? new Date(visitData.time.seconds * 1000) : new Date(),
                questions: visitData?.questions || '',
                setReminder: visitData?.setReminder || false,
                requester: user.uid,
                status: 'pending',
                rescheduleDate: '',
                rescheduleTime: '',
                rescheduleResponse: ''
            });

            await fetchImageUrls()

            console.log("fetchedImageUrls at the end of useEffect: ", imageUrls)
        }

        populateData()

    }, [route]); // Adding route as a dependency


    useEffect(() => {
        const listingID = listingData?.id || listing.id
        async function getListingDetails() {
            try {
                const listingDocRef = doc(database, 'Listing', listingID);
                const listingDocSnap = await getDoc(listingDocRef);
                if (!listingDocSnap.exists()) {
                    throw new Error("Listing not found");
                }
                const listingData = listingDocSnap.data();
                console.log('getListingData listingData: ', listingData)
                setListingDetails(listingData)
            } catch (error) {
                console.log('error in getListingData in useEffect: ', error)
            }
        }
        getListingDetails()
    }, [route])


    async function fetchImageUrls() {
        console.log("entered fetchImageUrls function with listingData: ", listing)
        try {

            let data = {}
            if (listing && listing.imageUris && listing.imageUris.length > 0) {
                data = listing
            } else if (listingData && listingData.imageUris && listingData.imageUris.length > 0) {
                data = listingData
            } else {
                return
            }

            const urls = await Promise.all(
                data.imageUris.map(imageUri =>
                    getDownloadURL(ref(storage, imageUri))
                )
            );
            setImageUrls(urls);

            console.log("Fetched image URLs:", imageUrls);
        } catch (error) {
            console.error("Error fetching image URLs:", error);
        }

    }


    function reset() {
        setVisit({
            listingId: '',
            listingLocation: '',
            listingPrice: '',
            longitude: '',
            date: new Date(),
            time: new Date(),
            questions: '',
            setReminder: false,
            requester: '',
            status: 'pendng',
            rescheduleDate: '',
            rescheduleTime: '',
            rescheduleResponse: ''
        });

    }


    const handleDateChange = (event, selectedDate) => {
        setShowDatePicker(false);
        if (selectedDate) {
            setVisit(prevVisit => ({
                ...prevVisit,
                date: new Date(
                    selectedDate.getFullYear(),
                    selectedDate.getMonth(),
                    selectedDate.getDate(),
                    prevVisit.time.getHours(),
                    prevVisit.time.getMinutes(),
                    prevVisit.time.getSeconds()
                )
            }));
        }
    };


    const handleTimeChange = (event, selectedTime) => {
        setShowTimePicker(false);
        if (selectedTime) {
            setVisit(prevVisit => ({
                ...prevVisit,
                date: new Date(
                    prevVisit.date.getFullYear(),
                    prevVisit.date.getMonth(),
                    prevVisit.date.getDate(),
                    selectedTime.getHours(),
                    selectedTime.getMinutes(),
                    selectedTime.getSeconds()
                ),
                time: selectedTime // separately storing the time if needed elsewhere
            }));
            console.log("Time updated to:", selectedTime.toLocaleTimeString());
        }
    };


    function handleCancel() {
        navigation.goBack();
        reset()
    }


    async function handleSubmit() {
        console.log("scheduled a visit: ", visit);
        try {
            if (!user) {
                throw new Error("User not authenticated");
            }

            let visitID = ''
            let updatedVisitRequests = []
            if (visitData.id) {
                const userDocRef = doc(database, "User", user.uid); // storing the changes in 'ScheduledVisits'
                const visitSubcollectionRef = collection(userDocRef, "ScheduledVisits");
                const visitDocRef = doc(visitSubcollectionRef, visitData.id);
                console.log("updating the visit with: ", visit)
                await updateDoc(visitDocRef, visit);

                updatedVisitRequests = listingData.visitRequests.map(request => {   // For updating the changes in visitRequests in 'Listing'
                    if (request.id === visitData.id) {
                        return { ...request, ...visit }; // Merge updated data
                    } else {
                        return request;
                    }
                });

            } else {
                const scheduledVisitsCollectionRef = collection(database, 'User', user.uid, 'ScheduledVisits');
                console.log("creating a visit with: ", visit)
                const newVisitDocRef = await addDoc(scheduledVisitsCollectionRef, visit);   // creating a visit in 'ScheduledVisits'
                visitID = newVisitDocRef.id
                console.log('visitID from newVsitDocRef after adding visit in ScheduledVisits: ', visitID)
                
                updatedVisitRequests = [                // For storing the visit in visitRequests in 'Listing'
                    ...(listing.visitRequests || []),
                    { ...visit, id: visitID },
                ];
            }

            const listingDocRef = doc(database, 'Listing', visit.listingId);
            const listingDocSnap = await getDoc(listingDocRef);
            if (!listingDocSnap.exists()) {
                throw new Error("Listing not found");
            }
            await updateDoc(listingDocRef, { visitRequests: updatedVisitRequests });    // storing or updating visitRequests in 'Listing'


            // Schedule a notification if the reminder is set
            if (visit.setReminder) {
                const reminderDate = new Date(visit.date.getTime());
                reminderDate.setDate(reminderDate.getDate() - 1); // Set reminder 1 day before the actual visit

                await scheduleNotification(reminderDate, "Reminder", `Visit scheduled for ${visit.listingLocation} at ${visit.date.toLocaleDateString()}`);
            }

            navigation.goBack();
            reset();
        } catch (error) {
            console.error("Error scheduling visit:", error);
        }
    }


    const renderImage = ({ item }) => (
        <Image source={{ uri: item }} style={{ width: 250, height: 150, margin: 5 }} />
    );

    console.log("inside ScheduleVisit with listing: ", listing)


    return (
        <View style={appStyles.container}>

            <View style={appStyles.visitLocationAndPriceContainer}>
                <View style={appStyles.locationOrPriceContainer1}>
                    <Text style={[appStyles.title, { color: Colors.shadowColor }]}>{visit.listingLocation}</Text>
                </View>
                <View style={appStyles.locationOrPriceContainer2}>
                    <Text style={[appStyles.title, { color: Colors.shadowColor }]}>C$ {visit.listingPrice}/mo</Text>
                </View>
            </View>

            {imageUrls.length > 0 ? (
                <ScrollView style={appStyles.scrollViewContainer} contentContainerStyle={appStyles.contentContainer}>
                    <FlatList
                        data={imageUrls}
                        renderItem={renderImage}
                        keyExtractor={(item, index) => index.toString()}
                        horizontal
                        style={appStyles.imageList}
                        showsHorizontalScrollIndicator={true}
                    />
                </ScrollView>
            ) : (
                <>
                </>
            )}

            <View style={appStyles.addItemContainer}>
                <Text style={appStyles.addTitles}>Date (dd/mm/yyy)</Text>
                <TouchableOpacity onPress={() => setShowDatePicker(true)} style={[appStyles.addInput, { width: '35%', height: '100%', alignItems: 'center' }]}>
                    <Text style={appStyles.addTitles}>{visit.date.toLocaleDateString()}</Text>
                </TouchableOpacity>
            </View>

            {showDatePicker && (
                <DateTimePicker
                    testID="datePicker"
                    value={visit.date}
                    mode="date"
                    is24Hour={true}
                    display="default"
                    onChange={handleDateChange}
                />
            )}

            <View style={appStyles.addItemContainer}>
                <Text style={appStyles.addTitles}>Time</Text>
                <TouchableOpacity onPress={() => setShowTimePicker(true)} style={[appStyles.addInput, { width: '35%', height: '100%', alignItems: 'center' }]}>
                    <Text style={appStyles.addTitles}>{visit.time.toLocaleTimeString()}</Text>
                </TouchableOpacity>
            </View>

            {showTimePicker && (
                <DateTimePicker
                    testID="timePicker"
                    value={visit.time}
                    mode="time"
                    is24Hour={true}
                    display="default"
                    onChange={handleTimeChange}
                />
            )}

            <View style={appStyles.addItemContainer}>
                <Text style={appStyles.addTitles}>Questions</Text>
                <View style={[appStyles.addInput, { height: 100, width: '70%' }]}
                >
                    <TextInput
                        style={appStyles.addTitles}
                        multiline
                        placeholder={"Any questions for the \nlandlord?"}
                        value={visit.questions}
                        onChangeText={text => setVisit(prevVisit => ({ ...prevVisit, questions: text }))}
                    />
                </View>
            </View>

            <View style={[appStyles.addItemContainer, { alignItems: 'center' }]}>
                <Text style={[appStyles.addTitles, { padding: 0, margin: 0 }]}>Set reminder 1 day before?</Text>
                <Switch
                    value={visit.setReminder}
                    onValueChange={async (value) => {
                        if (value) {
                            const hasPermission = await requestNotificationPermissions();
                            if (!hasPermission) {
                                console.log("Permission Required");
                                return;
                            }
                        }
                        setVisit(prevVisit => ({ ...prevVisit, setReminder: value }));
                    }}
                />
            </View>

            <View style={appStyles.buttonsView}>
                <View style={appStyles.buttonContainer}>
                    <View style={appStyles.saveAndCancelButtonContainerForVisit}>
                        <PressableItem onPress={handleCancel} style={[appStyles.buttonStyle, appStyles.cancelButton]} >
                            <Text style={appStyles.text}>Cancel</Text>
                        </PressableItem>
                        <PressableItem onPress={handleSubmit} style={[appStyles.buttonStyle, appStyles.saveButton]} >
                            {visitData ? (<Text style={appStyles.text}>Save</Text>
                            ) : (
                                <Text style={appStyles.text}>Schedule</Text>
                            )}
                        </PressableItem>
                    </View>
                </View>
            </View>

        </View>
    )
}