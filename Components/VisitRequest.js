import { StyleSheet, Text, View, FlatList } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useRoute } from '@react-navigation/native'
import { auth } from '../Firebase/firebaseSetup'
import { collection, doc, getDoc, updateDoc } from 'firebase/firestore'
import { database } from '../Firebase/firebaseSetup'
import PressableItem from './PressableItem'
import { Colors } from '../Config/Colors'
import DateTimePicker from '@react-native-community/datetimepicker';


const VisitRequestItem = ({ visit, listing }) => {

    console.log("inside VisitRequestItem with visit: ", visit)
    console.log("inside VisitRequestItem with listing: ", listing)
    // Extracting and formatting date and time
    const visitDate = new Date(visit.date.seconds * 1000);
    const visitTime = new Date(visit.time.seconds * 1000);

    // State for storing requester data and loading state
    const [requesterData, setRequesterData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [visitStatus, setVisitStatus] = useState('');
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [showTimePicker, setShowTimePicker] = useState(false);
    const [newVisitDate, setNewVisitDate] = useState(visit.rescheduleDate ? new Date(visit.date.seconds * 1000) : new Date());
    const [newVisitTime, setNewVisitTime] = useState(visit.rescheduleTime ? new Date(visit.time.seconds * 1000) : new Date());
    const [updatedVisit, setUpdatedVisit] = useState({})
    const [rescheduleDate, setRescheduleDate] = useState(null);
    const [rescheduleTime, setRescheduleTime] = useState(null);
    async function getUpdatedVisitData() {
        try {
            const updatedVisitDocRef = await getVisitDocRefById(visit.id)
            console.log("updtedVisitDocRef", updatedVisitDocRef)
            const updateddocSnap = await getDoc(updatedVisitDocRef);
            if (updateddocSnap.exists()) {
                setUpdatedVisit(updateddocSnap.data());
            }
        } catch (error) {
            console.log("Error while fetching updatedVisitData: ", error)
        }
    }

    useEffect(() => {
        // Fetching updated visit data when the component mounts on the first render
        getUpdatedVisitData();
    }, []);

    // updating rescheduleDate and rescheduleTime whenever updatedVisit changes
    useEffect(() => {
        if (Object.keys(updatedVisit).length !== 0) {
            if (updatedVisit.rescheduleDate !== null && updatedVisit.rescheduleTime !== null) {
                setRescheduleDate(new Date(updatedVisit.rescheduleDate.seconds * 1000));
                setRescheduleTime(new Date(updatedVisit.rescheduleTime.seconds * 1000));
            }
            setVisitStatus(updatedVisit.status)

        } else {
            // Reset rescheduleDate and rescheduleTime if updatedVisit is empty
            setRescheduleDate(null);
            setRescheduleTime(null);
        }
    }, [updatedVisit]);
    console.log("updated visit value: ", updatedVisit)

    useEffect(() => {
        // Fetching requester data
        const fetchRequesterData = async () => {
            if (visit.requester) {
                setIsLoading(true);
                const requesterDocRef = doc(database, "User", visit.requester);
                const docSnap = await getDoc(requesterDocRef);
                if (docSnap.exists()) {
                    setRequesterData(docSnap.data());
                } else {
                    console.log("Requester information is missing for this visit request.");
                }
                setIsLoading(false);
            }
        };

        fetchRequesterData();
    }, [visit.requester]); // Running this effect whenever visit.requester changes

    async function getVisitDocRefById(visitId) {
        try {
            const userDocRef = doc(database, "User", visit.requester);
            const visitSubcollectionRef = collection(userDocRef, "ScheduledVisits");
            const visitDocRef = doc(visitSubcollectionRef, visitId);
            return visitDocRef
        } catch (error) {
            console.log("Error in getVisitDocRefById: ", error)
        }
    }


    async function handleApprove(visitId) {
        try {
            const visitDocRef = await getVisitDocRefById(visitId)
            console.log("approving the visit with: ", visitId)
            await updateDoc(visitDocRef, { status: 'approved' });
        } catch (error) {
            console.log("Error inside handleApprove: ", error)
        }
    }

    async function handleReschedule(visitId) {
        setShowDatePicker(true);
    }

    const handleDateChange = (event, selectedDate) => {
        setShowDatePicker(false);
        if (event.type === 'set' && selectedDate) {
            setNewVisitDate(selectedDate);
            setShowTimePicker(true);
        }
    };

    const handleTimeChange = (event, selectedTime, visitId) => {
        setShowTimePicker(false);
        if (selectedTime) {
            setNewVisitTime(selectedTime);

            const combinedDateTime = new Date(newVisitDate);
            combinedDateTime.setHours(selectedTime.getHours(), selectedTime.getMinutes(), selectedTime.getSeconds());

            requestReschedule(visitId, combinedDateTime);
        }
    };

    async function requestReschedule(visitId, newDateTime) {
        console.log("inside requestReschedule with new visit Date: ", newVisitDate)
        console.log("inside requestReschedule with new visit Time: ", newVisitTime)
        try {
            const visitDocRef = await getVisitDocRefById(visitId)

            // Updating Firebase with the combined date and time for reschedule request
            await updateDoc(visitDocRef, {
                rescheduleDate: newDateTime,
                rescheduleTime: newDateTime,
                status: 'rescheduled'
            });

            const updatedVisitRequests = listing.visitRequests.map(request =>
                request.id === visitId ? { ...request, rescheduleDate: newDateTime, rescheduleTime: newDateTime, status: 'rescheduled' } : request
            );

            const listingDocRef = doc(database, 'Listing', visit.listingId);
            await updateDoc(listingDocRef, { visitRequests: updatedVisitRequests });

            getUpdatedVisitData();

        } catch (error) {
            console.log("Error inside requestReschedule: ", error)
        }
    }


    return (
        <View style={styles.container}>
            <View style={styles.listingDetails}>
                <Text style={styles.info}>Date: {visitDate.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}</Text>
                <Text style={styles.info}>Time: {visitTime.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}</Text>
                <Text style={styles.info}>Questions: {visit.questions}</Text>
                {isLoading ? (
                    <Text>Loading requester data...</Text>
                ) : (
                    requesterData && requesterData.name &&
                    <View>
                        <Text style={styles.info}>Name: {requesterData.name}</Text>
                        <Text style={styles.info}>Email: {requesterData.email}</Text>
                        <Text style={styles.info}>Phone: {requesterData.phoneNumber}</Text>
                    </View>
                )}
                {(rescheduleDate !== null && rescheduleTime !== null) && (
                    <View style={{ width: 312 }}>
                        <Text style={styles.info}>
                            Rescheduled to: {rescheduleTime.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })} on {rescheduleDate.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                        </Text>
                    </View>
                )}
            </View>

            <View style={styles.editDeleteButtonContainer}>
                {visitStatus === 'approved' ? (
                    <PressableItem onPress={() => { console.log("pressed on already approved request") }} style={[styles.approveButtonStyle, { backgroundColor: Colors.shadowColor, width: '75%' }]} >
                        <Text style={{ color: Colors.background }}>Approved</Text>
                    </PressableItem>) : (
                    <PressableItem onPress={() => { handleApprove(visit.id) }} style={styles.approveButtonStyle} >
                        <Text style={{ color: Colors.background }}>Approve</Text>
                    </PressableItem>
                )
                }
                <PressableItem onPress={() => { handleReschedule(visit.id) }} style={[styles.approveButtonStyle, { backgroundColor: Colors.yellow, width: '85%' }]} >
                    <Text style={{ color: Colors.background }}>Reschedule</Text>
                </PressableItem>

            </View>

            {showDatePicker && (
                <DateTimePicker
                    testID="datePicker"
                    value={newVisitDate || new Date()}
                    mode="date"
                    is24Hour={true}
                    display="default"
                    onChange={handleDateChange}
                />
            )}

            {showTimePicker && (
                <DateTimePicker
                    testID="timePicker"
                    value={newVisitTime || new Date()}
                    mode="time"
                    is24Hour={true}
                    display="default"
                    onChange={(event, selectedTime) => handleTimeChange(event, selectedTime, visit.id)}
                />
            )}

        </View>
    );
};


export default function VisitRequest({ navigation }) {
    const user = auth.currentUser;
    const route = useRoute();
    const { visitRequest = [] } = route.params || [];
    const { listingData = {} } = route.params || {};
    console.log("inside VisitRequest with visitRequest: ", visitRequest);
    console.log("inside VisitRequest with listingData: ", listingData);

    return (
        <View style={styles.container}>
            <FlatList
                data={visitRequest}
                renderItem={({ item }) => <VisitRequestItem visit={item} listing={listingData} />}
                keyExtractor={(item) => item.id}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        marginHorizontal: 5,
        paddingVertical: 3,
        justifyContent: 'center',
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
        flex: 3
    },
    listingDetails: {
        flex: 2,
        marginVertical: 5
    },
    info: {
        fontSize: 16,
        color: '#666',
        marginBottom: 5,
    },
    approveButtonStyle: {
        margin: 5,
        height: 40,
        width: '65%',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: Colors.green,
    },
    editDeleteButtonContainer: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'flex-end',
        alignItems: 'baseline'
    }
})