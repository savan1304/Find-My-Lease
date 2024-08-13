import { Text, View, TouchableOpacity, TextInput, Switch } from 'react-native'
import React, { useState, useEffect } from 'react'
import { appStyles } from '../Config/Styles';
import DateTimePicker from '@react-native-community/datetimepicker';
import PressableItem from './PressableItem';
import { auth, database } from '../Firebase/firebaseSetup';
import { collection, addDoc, updateDoc, doc } from 'firebase/firestore';
import { useRoute } from '@react-navigation/native';
import { Colors } from '../Config/Colors';
import { scheduleNotification, requestNotificationPermissions } from '../Components/NotificationManager'; 

export default function ScheduleVisit({ navigation }) {

    const route = useRoute();
    const user = auth.currentUser;
    const { visitData = {} } = route.params || {};
    console.log("received visitData in ScheduleVisit: ", visitData)
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
    });
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [showTimePicker, setShowTimePicker] = useState(false);

    useEffect(() => {
        // Updating visit whenever visitData from route params changes
        setVisit({
            listingId: visitData?.listingId || listing.id,
            listingLocation: visitData?.listingLocation || listing.location,
            listingPrice: visitData?.listingPrice || listing.price,
            date: visitData?.date ? new Date(visitData.date.seconds * 1000) : new Date(),
            time: visitData?.time ? new Date(visitData.time.seconds * 1000) : new Date(),
            questions: visitData?.questions || '',
            setReminder: visitData?.setReminder || false,
        });

    }, [route]); // Adding route as a dependency

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
                time: selectedTime // It can be helpful to separately store the time if needed elsewhere
            }));
            console.log("Time updated to:", selectedTime.toLocaleTimeString());
        }
    };
    

    function handleCancel() {
        if (visitData) {
            navigation.navigate('ScheduledVisits')
        } else {
            navigation.goBack();
        }
        reset()
    }

    async function handleSubmit() {
        console.log("scheduled a visit: ", visit);
        try {
            if (!user) {
                throw new Error("User not authenticated");
            }
            if (visitData.id) {
                const userDocRef = doc(database, "User", user.uid);
                const visitSubcollectionRef = collection(userDocRef, "ScheduledVisits");
                const visitDocRef = doc(visitSubcollectionRef, visitData.id);
                await updateDoc(visitDocRef, visit);
            } else {
                const scheduledVisitsCollectionRef = collection(database, 'User', user.uid, 'ScheduledVisits');
                await addDoc(scheduledVisitsCollectionRef, visit);
            }
    
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
    
    

    console.log("inside ScheduleVisit with listing: ", listing)
    return (
        <View style={appStyles.container}>
            <View style={appStyles.visitLocationAndPriceContainer}>
                <Text style={[appStyles.title, { color: Colors.shadowColor }]}>{visit.listingLocation}</Text>
                <Text style={[appStyles.title, { color: Colors.shadowColor }]}>C$ {visit.listingPrice}/mo</Text>
            </View>


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
                <View style={[appStyles.addInput, { height: 100, paddingLeft: 10, width: '70%' }]}
                >
                    <TextInput
                        style={appStyles.addTitles}
                        multiline
                        placeholder="Any questions for the landlord?"
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
                    <View style={appStyles.saveAndCancelButtonContainer}>
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