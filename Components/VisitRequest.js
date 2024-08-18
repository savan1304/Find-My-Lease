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

    // State for storing requester data and loading state
    const [requesterData, setRequesterData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    const [visitStatus, setVisitStatus] = useState('');
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [showTimePicker, setShowTimePicker] = useState(false);
    const [newVisitDate, setNewVisitDate] = useState(visit.rescheduleDate ? new Date(visit.date.seconds * 1000) : new Date());
    const [newVisitTime, setNewVisitTime] = useState(visit.rescheduleTime ? new Date(visit.time.seconds * 1000) : new Date());
    const [updatedVisit, setUpdatedVisit] = useState({})

    const visitDate = new Date(visit.date.seconds * 1000);
    const visitTime = new Date(visit.time.seconds * 1000);

    let updatedVisitDate = ''
    let updatedVisitTime = ''
    if (Object.keys(updatedVisit).length !== 0) {
        updatedVisitDate = new Date(updatedVisit.date.seconds * 1000);
        updatedVisitTime = new Date(updatedVisit.time.seconds * 1000);
    }


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
        getUpdatedVisitData();   // Fetching updated visit data when the component mounts on the first render
    }, []);


    useEffect(() => {
        updateDateAndTimeInVisitRequests()
    }, [updatedVisit])


    // updating visitStatus whenever updatedVisit changes
    useEffect(() => {
        if (Object.keys(updatedVisit).length !== 0) {
            setVisitStatus(updatedVisit.status)
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

    console.log("visit status: ", visitStatus)


    async function handleApprove(visitId) {
        try {
            const visitDocRef = await getVisitDocRefById(visitId)
            console.log("approving the visit with: ", visitId)
            await updateDoc(visitDocRef, { status: 'approved' });

            const updatedVisitRequests = listing.visitRequests.map(request =>
                request.id === visitId ? { ...request, status: 'approved' } : request
            );
            const listingDocRef = doc(database, 'Listing', visit.listingId);
            await updateDoc(listingDocRef, { visitRequests: updatedVisitRequests });

            getUpdatedVisitData()

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
            requestReschedule(visitId, newVisitDate, selectedTime);
        }
    };


    async function requestReschedule(visitId, newDate, newTime) {
        console.log("inside requestReschedule with new visit Date: ", newDate)
        console.log("inside requestReschedule with new visit Time: ", newTime)
        try {
            const visitDocRef = await getVisitDocRefById(visitId)

            await updateDoc(visitDocRef, {
                rescheduleDate: newDate,
                rescheduleTime: newTime,
                status: 'rescheduled',
                rescheduleResponse: 'pending'
            });

            const updatedVisitRequests = listing.visitRequests.map(request =>
                request.id === visitId ? { ...request, rescheduleDate: newDate, rescheduleTime: newTime, status: 'rescheduled' } : request
            );

            const listingDocRef = doc(database, 'Listing', visit.listingId);
            await updateDoc(listingDocRef, { visitRequests: updatedVisitRequests });

            getUpdatedVisitData();

        } catch (error) {
            console.log("Error inside requestReschedule: ", error)
        }
    }


    async function updateDateAndTimeInVisitRequests() {
        try {
            if (Object.keys(updatedVisit).length !== 0) {
                const updatedVisitRequests = listing.visitRequests.map(request =>
                    request.id === visit.id ? { ...request, date: updatedVisit.rescheduleDate, time: updatedVisit.rescheduleTime, status: 'rescheduled' } : request
                );

                const listingDocRef = doc(database, 'Listing', visit.listingId);
                await updateDoc(listingDocRef, { visitRequests: updatedVisitRequests });
            }
        } catch (error) {
            console.log("Error in updateDateAndTimeInVisitRequests: ", error)
        }
    }


    function checkRescheduleDateTimeDisplay() {
        if (
            Object.keys(updatedVisit).length !== 0 && (updatedVisit.rescheduleDate !== '' && updatedVisit.rescheduleTime !== '') &&
            (
                (updatedVisit.rescheduleDate.seconds !== updatedVisit.date.seconds ||
                    updatedVisit.rescheduleDate.nanoseconds !== updatedVisit.date.nanoseconds) ||
                (updatedVisit.rescheduleTime.seconds !== updatedVisit.time.seconds ||
                    updatedVisit.rescheduleTime.nanoseconds !== updatedVisit.time.nanoseconds)
            )
        ) {
            console.log('checkRescheduleDateTimeDisplay returning true');
            return true;
        }
        console.log('checkRescheduleDateTimeDisplay returning false');
        return false;
    }


    return (
        <View style={styles.container}>
            <View style={styles.listingDetails}>

                {Object.keys(updatedVisit).length !== 0 ? (
                    <>
                        <Text style={styles.info}>Date: {updatedVisitDate.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}</Text>
                        <Text style={styles.info}>Time: {updatedVisitTime.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}</Text>
                    </>
                ) : (
                    <>
                        <Text style={styles.info}>Date: {visitDate.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}</Text>
                        <Text style={styles.info}>Time: {visitTime.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}</Text>
                    </>
                )}

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

                {checkRescheduleDateTimeDisplay() && (
                    <View style={{ width: 312 }}>
                        <Text style={styles.info}>
                            Rescheduled to: {new Date(updatedVisit.rescheduleDate.seconds * 1000).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })} at {new Date(updatedVisit.rescheduleTime.seconds * 1000).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}
                        </Text>
                    </View>
                )}

                {(Object.keys(updatedVisit).length !== 0 && updatedVisit.rescheduleResponse !== '') && (
                    <Text style={styles.info}>
                        Reschedule response: {updatedVisit.rescheduleResponse.charAt(0).toUpperCase() + updatedVisit.rescheduleResponse.slice(1)}
                    </Text>
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


export default function VisitRequest() {
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