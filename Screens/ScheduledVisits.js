import { StyleSheet, Text, View, FlatList } from 'react-native'
import React, { useState, useEffect } from 'react'
import PressableItem from '../Components/PressableItem';
import Visit from '../Components/Visit';
import { collection, onSnapshot, query } from 'firebase/firestore';
import { deleteFromDB } from '../Firebase/firestoreHelper';
import { Colors } from '../Config/Colors';
import Icon from 'react-native-vector-icons/Ionicons';
import { auth, database } from '../Firebase/firebaseSetup';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import call from 'react-native-phone-call'


export default function ScheduledVisits({ navigation }) {
    const [visits, setVisits] = useState([])
    const user = auth.currentUser;
    useEffect(() => {
        const unsubscribe = onSnapshot(query(
            collection(database, 'User', user.uid, 'ScheduledVisits')),
            (querySnapshot) => {
                let newArray = []
                if (!querySnapshot.empty) {
                    querySnapshot.forEach((docSnapShot) => {
                        let rescheduleDate;
                        let rescheduleTime;
                        console.log(docSnapShot.id)
                        console.log('docSnapShot data: ', docSnapShot.data())
                        console.log('docSnapShot date: ', docSnapShot.data().date)
                        const date = docSnapShot.data().date
                        const time = docSnapShot.data().time
                        if (docSnapShot.data().rescheduleDate) {
                            rescheduleDate = docSnapShot.data().rescheduleDate.toDate();
                        }
                        if (docSnapShot.data().rescheduleTime) {
                            rescheduleTime = docSnapShot.data().rescheduleTime.toDate();
                        }
                        newArray.push({
                            ...docSnapShot.data(),
                            id: docSnapShot.id,
                            date: date.toDate().toLocaleDateString(),
                            time: time.toDate().toLocaleTimeString(),
                            rescheduleDate: rescheduleDate?.toLocaleDateString() || '',
                            rescheduleTime: rescheduleTime?.toLocaleTimeString() || ''
                        })
                    });
                }
                console.log("newArray in scheduledVisits: ", newArray)
                setVisits(newArray);
            }, (e) => { console.log(e) })


        return () => unsubscribe()  // Detaching the listener when no longer listening to the changes in data
    }, [])

    async function handleDeleteVisit(visit) {
        console.log("Inside handleDeleteVisit with visit: ", visit)

        try {
            const listingDocRef = doc(database, 'Listing', visit.listingId);
            const listingDocSnap = await getDoc(listingDocRef);

            if (!listingDocSnap.exists()) {
                throw new Error("Listing not found");
            }
            const listingData = listingDocSnap.data();
            const updatedVisitRequests = listingData.visitRequests.filter(
                request => request.id !== visit.id
            );
            await updateDoc(listingDocRef, { visitRequests: updatedVisitRequests });
            console.log("Visit deleted from visitRequests successfully");
        } catch (error) {
            console.log("Error deleting visit from visitRequests: ", error)
        }

        const visitCollectionName = `User/${user.uid}/ScheduledVisits`;
        deleteFromDB(visit.id, visitCollectionName)

    }


    async function handleEditVisit(visitToBeEditedID) {
        console.log("Inside handleEditVisit")
        let visitData = {}
        let listingData = {}
        try {
            const userDocRef = doc(database, "User", user.uid);
            const visitSubcollectionRef = collection(userDocRef, "ScheduledVisits");
            const visitDocRef = doc(visitSubcollectionRef, visitToBeEditedID);
            const docSnap = await getDoc(visitDocRef);

            if (docSnap.exists()) {
                visitData = docSnap.data();
                console.log("inside if block with visitData: ", visitData)
                visitData.id = visitToBeEditedID
                console.log("visitData before navigating to ScheduleVisit page: ", visitData)

                const listingDocRef = doc(database, 'Listing', visitData.listingId);
                const listingDocSnap = await getDoc(listingDocRef);
                console.log("response from getDoc for listingData: ", listingDocSnap)

                if (listingDocSnap.exists()) {
                    listingData = listingDocSnap.data();
                    console.log("listingData from listingDocSnap: ", listingDocSnap)
                }
                console.log("listingData before navigating to ScheduleVisit page: ", listingData)

                navigation.navigate('ScheduleVisit', { visitData, listingData });
            }

        } catch (error) {
            console.error('Error in navigating to editing visit page:', error);
        }

    }

    async function getDataById(id, collectionName) {
        let data = {}
        try {
            const docRef = doc(database, collectionName, id);
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
                data = docSnap.data()
            }
            return data
        } catch (error) {
            console.log("Error in getDataById with collectonName: ", collectionName)
        }
    }


    return (
        <View>

            {visits.length === 0 ? (
                <Text style={styles.text}>You have no upcoming scheduled visits</Text>
            ) :
                (
                    <FlatList data={visits}
                        renderItem={({ item }) => {
                            console.log('item in Flatlist in ScheduledVisits: ', item)

                            async function handleContactLandlord() {
                                const listingId = item.listingId
                                const listingData = await getDataById(listingId, 'Listing')
                                const landlordId = listingData.createdBy
                                const landLordData = await getDataById(landlordId, 'User')
                                const landlordNumber = landLordData.phoneNumber
                                const args = {
                                    number: landlordNumber,
                                    prompt: true
                                }
                                call(args).catch(console.error)
                            }

                            function renderRescheduleOptions() {
                                const time = item.time
                                const date = item.date
                                const rescheduleDate = item.rescheduleDate
                                const rescheduleTime = item.rescheduleTime
                                if (date === rescheduleDate && time === rescheduleTime) {
                                    return false
                                }
                                return true
                            }

                            async function handleAcceptReschedule() {
                                try {
                                    const userDocRef = doc(database, "User", user.uid);
                                    const visitSubcollectionRef = collection(userDocRef, "ScheduledVisits");
                                    const visitDocRef = doc(visitSubcollectionRef, item.id);

                                    const docSnap = await getDoc(visitDocRef);
                                    if (docSnap.exists()) {
                                        visitData = docSnap.data();
                                    }

                                    console.log("visitData in handleAcceptReschedule: ", visitData)
                                    await updateDoc(visitDocRef, {
                                        date: visitData.rescheduleDate,
                                        time: visitData.rescheduleTime,
                                        rescheduleResponse: 'accepted'
                                    });

                                    const listingData = await getDataById(visitData.listingId, 'Listing')
                                    console.log("existing visitRequest from listingData: ", listingData.visitRequests)
                                    const updatedVisitRequests = listingData.visitRequests.map(request =>
                                        request.id === visitData.id ? {
                                            ...request,
                                            date: item.rescheduleDate,
                                            time: item.rescheduleTime,
                                            rescheduleResponse: 'accepted'
                                        } : request
                                    );
                                    console.log("updatedVisitRequests in handleAcceptReschedule: ", updatedVisitRequests)
                                    const listingDocRef = doc(database, 'Listing', visitData.listingId);
                                    await updateDoc(listingDocRef, { visitRequests: updatedVisitRequests });


                                } catch (error) {
                                    console.log("Error in handleAcceptReschedule: ", error)
                                }
                            }

                            return (
                                <View style={styles.container}>
                                    <View style={styles.visitDetails}>
                                        <Visit visit={item} />
                                        {item.status === 'rescheduled' && renderRescheduleOptions() && (
                                            <View>
                                                <Text style={[styles.info, { color: Colors.blue, fontWeight: '500' }]}>Requested Date: {item.rescheduleDate}</Text>
                                                <Text style={[styles.info, { color: Colors.blue, fontWeight: '500' }]}>Requested Time: {item.rescheduleTime}</Text>
                                            </View>

                                        )}
                                        <View style={styles.rescheduleRequestActionsContainer}>
                                            <PressableItem onPress={() => { handleContactLandlord() }} style={[styles.rescheduleRequestActionsStyle, { width: '55%' }]} >
                                                <Text style={{ color: Colors.background }}>Contact Landlord</Text>
                                            </PressableItem>
                                            {item.status === 'rescheduled' && renderRescheduleOptions() && (
                                                <PressableItem onPress={() => { handleAcceptReschedule() }} style={[styles.rescheduleRequestActionsStyle, { width: '40%' }]} >
                                                    <Text style={{ color: Colors.background }}>Accept</Text>
                                                </PressableItem>
                                            )}
                                        </View>

                                    </View>
                                    <View style={styles.editDeleteButtonContainer}>
                                        <PressableItem onPress={() => { handleEditVisit(item.id) }} style={styles.editDeleteButtonStyle} >
                                            <Icon name="pencil" size={24} color={Colors.blue} />
                                        </PressableItem>
                                        <PressableItem onPress={() => { handleDeleteVisit(item) }} style={styles.editDeleteButtonStyle} >
                                            <Icon name="trash" size={24} color={Colors.red} />
                                        </PressableItem>
                                    </View>
                                </View>
                            )
                        }}
                    />
                )
            }
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        marginHorizontal: 15,
        paddingVertical: 3,
        justifyContent: 'center',
        alignItems: 'center',
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
        flex: 3
    },
    visitDetails: {
        flex: 2,
        marginVertical: 5
    },
    info: {
        fontSize: 16,
        color: '#666',
        marginBottom: 5,
    },
    editDeleteButtonStyle: {
        margin: 5,
        backgroundColor: 'transparent',
    },
    editDeleteButtonContainer: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'flex-end',
    },
    rescheduleRequestActionsContainer: {
        flexDirection: 'row',
    },
    rescheduleRequestActionsStyle: {
        marginLeft: 0,
        backgroundColor: Colors.blue,
        alignItems: 'center',
        marginVertical: 7
    }
})