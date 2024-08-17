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
                        console.log(docSnapShot.id)
                        const date = docSnapShot.data().date.toDate();
                        const time = docSnapShot.data().time.toDate();
                        newArray.push({
                            ...docSnapShot.data(),
                            id: docSnapShot.id,
                            date: date.toLocaleDateString(),
                            time: time.toLocaleTimeString(),
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

    return (
        <View>

            {visits.length === 0 ? (
                <Text style={styles.text}>You have no upcoming scheduled visits</Text>
            ) :
                (
                    <FlatList data={visits}
                        renderItem={({ item }) => {
                            console.log(item)
                            return (
                                <View style={styles.container}>
                                    <View style={styles.visitDetails}>
                                        <Visit visit={item} />
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
    }
})