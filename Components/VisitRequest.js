import { StyleSheet, Text, View, FlatList } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useRoute } from '@react-navigation/native'
import { auth } from '../Firebase/firebaseSetup'
import { doc, getDoc } from 'firebase/firestore'
import { database } from '../Firebase/firebaseSetup'
import PressableItem from './PressableItem'
import { Colors } from '../Config/Colors'


const VisitRequestItem = ({ visit }) => {
    // Extracting and formatting date and time
    const visitDate = new Date(visit.date.seconds * 1000);
    const visitTime = new Date(visit.time.seconds * 1000);

    // State for storing requester data and loading state
    const [requesterData, setRequesterData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

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

    return (
        <View style={styles.container}>
            <View style={styles.listingDetails}>
                <Text style={styles.info}>Date: {visitDate.toLocaleDateString()}</Text>
                <Text style={styles.info}>Time: {visitTime.toLocaleTimeString()}</Text>
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
            </View>
            <View style={styles.editDeleteButtonContainer}>
                <PressableItem onPress={() => { handleApprove(visit.id) }} style={styles.approveButtonStyle} > 
                    <Text style={{ color: Colors.background }}>Approve</Text>
                </PressableItem>
                <PressableItem onPress={() => { handleReschedule(visit.id) }} style={styles.rescheduleButtonStyle} >
                    <Text style={{ color: Colors.background }}>Reschedule</Text>
                </PressableItem>
            </View>

        </View>
    );
};


export default function VisitRequest({ navigation }) {
    const user = auth.currentUser;
    const route = useRoute();
    const { visitRequest = {} } = route.params || {};
    console.log("inside VisitRequest with visitRequest: ", visitRequest);

    return (
        <View style={styles.container}>
            <FlatList
                data={visitRequest}
                renderItem={({ item }) => <VisitRequestItem visit={item} />} // Render the VisitRequestItem component
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
        height: '25%',
        width: '65%',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: Colors.green,
    },
    rescheduleButtonStyle: {
        margin: 8,
        height: '25%',
        width: '85%',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: Colors.yellow,
    },
    rejectButtonStyle: {
        margin: 5,
        height: '25%',
        width: '65%',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: Colors.red,
    },
    editDeleteButtonContainer: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'flex-end',
        alignItems: 'baseline'
    }
})