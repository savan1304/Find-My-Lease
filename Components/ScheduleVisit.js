import { StyleSheet, Text, View, TouchableOpacity, TextInput, Switch, Button } from 'react-native'
import React, { useState } from 'react'
import { appStyles } from '../Config/Styles';
import DateTimePicker from '@react-native-community/datetimepicker';

export default function ScheduleVisit({ route }) {

    const listing = route.params.listing;
    const [visit, setVisit] = useState({
        listingId: listing.id,
        date: new Date(),
        time: new Date(),
        questions: '',
        setReminder: false,
    });
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [showTimePicker, setShowTimePicker] = useState(false);

    const handleDateChange = (event, selectedDate) => {
        setShowDatePicker(false);

        if (selectedDate) {
            setVisit(prevVisit => ({ ...prevVisit, date: selectedDate }));
        }
    };

    const handleTimeChange = (event, selectedTime) => {
        setShowTimePicker(false);
        if (selectedTime) {
            setVisit(prevVisit => ({ ...prevVisit, time: selectedTime }));
        }
    };

    function handleSubmit() {
        console.log("scheduled a visit: ", visit);
    };

    console.log("inside ScheduleVisit with listing: ", listing)
    return (
        <View style={styles.container}>
            <Text style={appStyles.title}>{listing.location}</Text>
            <Text style={appStyles.title}>{listing.price}</Text>

            <TouchableOpacity onPress={() => setShowDatePicker(true)}>
                <Text>{visit.date.toLocaleDateString()}</Text>
            </TouchableOpacity>
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

            <TouchableOpacity onPress={() => setShowTimePicker(true)}>
                <Text>{visit.time.toLocaleTimeString()}</Text>
            </TouchableOpacity>
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


            {/* Questions */}
            <TextInput
                style={appStyles.input}
                multiline
                placeholder="Any questions for the landlord?"
                value={visit.questions}
                onChangeText={text => setVisit(prevVisit => ({ ...prevVisit, questions: text }))}
            />

            {/* Reminder Switch */}
            <View style={appStyles.reminderContainer}>
                <Text>Set reminder 1 day before?</Text>
                <Switch
                    value={visit.setReminder}
                    onValueChange={value => setVisit(prevVisit => ({ ...prevVisit, setReminder: value }))}
                />
            </View>

            <Button title="Schedule Visit" onPress={handleSubmit} />
        </View>
    )
}

const styles = StyleSheet.create({})