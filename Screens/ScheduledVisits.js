import { StyleSheet, Text, View, FlatList, Alert, Linking } from 'react-native'
import React, { useState, useEffect, useContext } from 'react'
import PressableItem from '../Components/PressableItem';
import Visit from '../Components/Visit';
import { collection, onSnapshot, query } from 'firebase/firestore';
import { deleteFromDB, getDataById, getVisitDataById, getVisitDocRefById } from '../Firebase/firestoreHelper';
import { Colors } from '../Config/Colors';
import Icon from 'react-native-vector-icons/Ionicons';
import { auth, database } from '../Firebase/firebaseSetup';
import { doc, updateDoc } from 'firebase/firestore';
import call from 'react-native-phone-call'
import { AuthContext } from '../Components/AuthContext';


export default function ScheduledVisits({ navigation }) {
    const [visits, setVisits] = useState([])
    const user = auth.currentUser;
    const { language } = useContext(AuthContext);


    useEffect(() => {
        if(user){
        const unsubscribe = onSnapshot(query(
            collection(database, 'User', user.uid, 'ScheduledVisits')),
            (querySnapshot) => {
                let newArray = []
                if (!querySnapshot.empty) {
                    querySnapshot.forEach((docSnapShot) => {
                        let rescheduleDate;
                        let rescheduleTime;
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
                setVisits(newArray);
            }, (e) => { console.log(e) })


        return () => unsubscribe()  // Detaching the listener when no longer listening to the changes in data
        }else{
            setVisits([]);
        }
    }, [user])


    async function handleDeleteVisit(visit) {
        Alert.alert(
            language === 'zh' ? "确认删除" : "Confirm Delete",
            language === 'zh' ? "您确定要删除此访问吗？" : "Are you sure you want to delete this visit?",
            [
                {
                    text: language === 'zh' ? "取消" : "Cancel",
                    style: "cancel",
                },
                {
                    text: language === 'zh' ? "删除" : "Delete",
                    onPress: async () => {
                        const listingData = await getDataById(visit.listingId, 'Listing')
                        const updatedVisitRequests = listingData.visitRequests.filter(
                            request => request.id !== visit.id
                        );

                        const listingDocRef = doc(database, 'Listing', visit.listingId);
                        await updateDoc(listingDocRef, { visitRequests: updatedVisitRequests });

                        const visitCollectionName = `User/${user.uid}/ScheduledVisits`;
                        deleteFromDB(visit.id, visitCollectionName)
                    },
                    style: "destructive",
                },
            ]
        );
    }


    async function handleEditVisit(visitToBeEditedID) {
        let visitData = {}
        let listingData = {}
        try {
            visitData = await getVisitDataById(visitToBeEditedID, user.uid);
            visitData.id = visitToBeEditedID

            listingData = await getDataById(visitData.listingId, 'Listing')

            navigation.navigate('ScheduleVisit', { visitData, listingData });

        } catch (error) {
            console.error('Error in navigating to editing visit page:', error);
        }

    }
    

    return (
        <View style={styles.outerContainer}>

            {visits.length === 0 ? (
                <View style={styles.noItemsContainer}>
                    <View style={styles.noItemsTextContainer}>
                    <Text style={styles.noItemsText}>
                        {language === 'zh' ? '您没有即将到来的预定访问！\n现在就探索可用房源并安排访问。' : 'You have no upcoming scheduled visits! \nExplore the available listings now to schedule a visit.'}
                        {'\n'}
                        </Text>

                    </View>
                    <PressableItem onPress={() => { navigation.navigate('My Home') }} style={{ width: '35%' }}>
                        <Text style={styles.buttonText}>Explore</Text>
                    </PressableItem>
                </View>
            ) :
                (
                    <FlatList data={visits}
                        renderItem={({ item }) => {

                            async function handleContactLandlord() {
                                const listingId = item.listingId
                                const listingData = await getDataById(listingId, 'Listing')
                                const landlordId = listingData.createdBy
                                const landLordData = await getDataById(landlordId, 'User')
                                const landlordNumber = landLordData.phoneNumber
                                const landlordEmail = landLordData.email;
                                Alert.alert(
                                    language === 'zh' ? "联系房东" : "Contact Landlord",
                                    language === 'zh' ? "您想如何联系房东？" : "How would you like to contact the landlord?",
                                    [
                                        {
                                            text: language === 'zh' ? "取消" : "Cancel",
                                            style: "cancel",
                                        },
                                        {
                                            text: language === 'zh' ? "打电话" : "Call",
                                            onPress: () => {
                                                const args = {
                                                    number: landlordNumber,
                                                    prompt: true
                                                }
                                                call(args).catch(console.error)
                                            },
                                        },
                                        {
                                            text: language === 'zh' ? "发邮件" : "Email",
                                            onPress: () => {
                                                Linking.openURL(`mailto:${landlordEmail}`);
                                            },
                                        },
                                    ]
                                );
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
                                    const visitData = await getVisitDataById(item.id, user.uid);

                                    const visitDocRef = getVisitDocRefById(item.id, user.uid)
                                    await updateDoc(visitDocRef, {
                                        date: visitData.rescheduleDate,
                                        time: visitData.rescheduleTime,
                                        rescheduleResponse: 'accepted'
                                    });

                                    const listingData = await getDataById(visitData.listingId, 'Listing')
                                    const updatedVisitRequests = listingData.visitRequests.map(request =>
                                        request.id === visitData.id ? {
                                            ...request,
                                            date: item.rescheduleDate,
                                            time: item.rescheduleTime,
                                            rescheduleResponse: 'accepted'
                                        } : request
                                    );
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
                                                <Text style={[styles.info, { color: Colors.blue, fontWeight: '500' }]}>{language === 'zh' ? `申请的日期: ${item.rescheduleDate}` : `Requested Date: ${item.rescheduleDate}`} </Text>
                                                <Text style={[styles.info, { color: Colors.blue, fontWeight: '500' }]}>{language === 'zh' ? `申请的时间: ${item.rescheduleTime}` : `Requested Time: ${item.rescheduleTime}`} </Text>
                                            </View>

                                        )}
                                        <View style={styles.rescheduleRequestActionsContainer}>
                                            <PressableItem onPress={() => { handleContactLandlord() }} style={[styles.rescheduleRequestActionsStyle, { width: '55%' }]} >
                                                <Text style={{ color: Colors.background }}>{language === 'zh' ? '联系房东' : 'Contact Landlord'} </Text>
                                            </PressableItem>
                                            {item.status === 'rescheduled' && renderRescheduleOptions() && (
                                                <PressableItem onPress={() => { handleAcceptReschedule() }} style={[styles.rescheduleRequestActionsStyle, { width: '40%' }]} >
                                                    <Text style={{ color: Colors.background }}>{language === 'zh' ? '接受' : 'Accept'} </Text>
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
    outerContainer: {
        flex: 1,
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
        marginVertical: 7,
        marginRight: 10
    },
    buttonText: {
        color: 'white',
        fontSize: 16,
        textAlign: 'center'
    },
    noItemsContainer: {
        flex: 1,
        alignItems: 'center',
        marginVertical: 20,
    },
    noItemsTextContainer: {
        marginBottom: 25
    },
    noItemsText: {
        fontWeight: '600',
        fontSize: 16,
        textAlign: 'center',
    }
})