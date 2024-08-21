import { StyleSheet, Text, View, FlatList, Alert } from 'react-native'
import React, { useEffect, useState, useContext } from 'react'
import { useRoute } from '@react-navigation/native'
import { doc, updateDoc } from 'firebase/firestore'
import { database } from '../Firebase/firebaseSetup'
import PressableItem from './PressableItem'
import { Colors } from '../Config/Colors'
import DateTimePicker from '@react-native-community/datetimepicker';
import { getDataById, getVisitDataById, getVisitDocRefById } from '../Firebase/firestoreHelper'
import { AuthContext } from '../Components/AuthContext';

const VisitRequestItem = ({ visit, listing }) => {
    const { language } = useContext(AuthContext);
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
            const updatedVisitData = await getVisitDataById(visit.id, visit.requester)
            if (Object.keys(updatedVisitData).length !== 0) {
                setUpdatedVisit(updatedVisitData);
            }
        } catch (error) {
            console.log("Error while fetching updatedVisitData: ", error)
        }
    }


    useEffect(() => {
        getUpdatedVisitData();   // Fetching updated visit data when the component mounts on the first render
    }, []);


    useEffect(() => {
        if (updatedVisit.rescheduleResponse === 'accepted' || updatedVisit.status === 'approved') {
            updateDateAndTimeInVisitRequests()
        }
    }, [])


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

                const requesterDetails = await getDataById(visit.requester, "User")
                if (Object.keys(requesterDetails).length !== 0) {
                    setRequesterData(requesterDetails);
                } else {
                    console.log("Requester information is missing for this visit request.");
                }
                setIsLoading(false);
            }
        };

        fetchRequesterData();
    }, [visit.requester]); // Running this effect whenever visit.requester changes

    console.log("visit requester: ", requesterData)
    console.log("visit status: ", visitStatus)


    async function approveVisitInScheduledVisitsAndVisitRequests(visitId) {
        try {
            const visitDocRef = getVisitDocRefById(visitId, visit.requester)
            console.log("approving the visit with: ", visitId)
            await updateDoc(visitDocRef, { status: 'approved' });

            const updatedVisitRequests = listing.visitRequests.map(request =>
                request.id === visitId ? { ...request, status: 'approved' } : request
            );
            const listingDocRef = doc(database, 'Listing', visit.listingId);
            await updateDoc(listingDocRef, { visitRequests: updatedVisitRequests });
        } catch (error) {
            console.log('Error in approveVisitInScheduleVisitAndVisitRequests: ', error)
        }
    }


    async function handleApprove(visitId) {
        try {
            if (updatedVisit.rescheduleResponse && updatedVisit.rescheduleResponse !== '' && updatedVisit.rescheduleResponse !== 'accepted') {
                // Reschedule request exists but not accepted
                Alert.alert(
                    language === 'zh' ? "确认批准" : "Confirm Approval",
                    language === 'zh' ? "请求者尚未接受重新调度请求。您想要批准当前显示的日期和时间吗？" : "The requester has not accepted the reschedule request yet. Do you want to approve the visit with the current displayed date and time?",
                    [
                        {
                            text: language === 'zh' ? "取消" : "Cancel",
                            style: "cancel",
                        },
                        {
                            text: language === 'zh' ? "批准" : "Approve",
                            onPress: async () => {
                                await approveVisitInScheduledVisitsAndVisitRequests(visitId)
                                getUpdatedVisitData();
                            },
                        },
                    ]
                );
            } else {
                // No reschedule request or it's accepted
                Alert.alert(
                    language === 'zh' ? "确认批准" : "Confirm Approval",
                    language === 'zh' ? "您确定要批准此次访问吗？" : "Are you sure you want to approve this visit?",
                    [
                        {
                            text: language === 'zh' ? "取消" : "Cancel",
                            style: "cancel",
                        },
                        {
                            text: language === 'zh' ? "批准" : "Approve",
                            onPress: async () => {
                                await approveVisitInScheduledVisitsAndVisitRequests(visitId)
                                getUpdatedVisitData();
                            },
                        },
                    ]
                );
            }
        } catch (error) {
            console.log("Error inside handleApprove: ", error);
        }
    }


    async function handleReschedule() {
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
        if (event.type === 'set' && selectedTime) {
            setNewVisitTime(selectedTime);
            requestReschedule(visitId, newVisitDate, selectedTime);
        }
    };


    async function requestReschedule(visitId, newDate, newTime) {

        const currentVisitDateString = updatedVisit.date.toDate().toLocaleDateString('en-GB'); // dd/mm/yyyy
        const currentVisitTimeString = updatedVisit.time.toDate().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }); // hh:mm AM/PM

        const newVisitDateString = newDate.toLocaleDateString('en-GB');
        const newVisitTimeString = newTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

        try {
            if (currentVisitDateString === newVisitDateString && currentVisitTimeString === newVisitTimeString) {
                Alert.alert(
                    language === 'zh' ? "日期和时间未更改" : "No change in date or time",
                    language === 'zh' ? "所选的重新安排日期和时间与当前相同。请选择不同的日期或时间。" : "The selected date and time for reschedule is the same as current. Please choose a different date or time.",
                    [
                        {
                            text: "Ok",
                            onPress: async () => {
                                await handleReschedule()
                            },
                        },
                    ]
                );
            } else {
                const visitDocRef = getVisitDocRefById(visitId, visit.requester)
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
            }

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


    function isCurrentAndRescheduleSame() {
        if (Object.keys(updatedVisit).length !== 0 && updatedVisit.date !== '' && updatedVisit.time !== '' && updatedVisit.rescheduleDate !== '' && updatedVisit.rescheduleTime !== '') {
            const updatedVisitDateString = updatedVisit.date.toDate().toLocaleDateString('en-GB'); // dd/mm/yyyy
            const updatedVisitTimeString = updatedVisit.time.toDate().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }); // hh:mm AM/PM

            const updatedVisitRescheduleDateString = updatedVisit.rescheduleDate.toDate().toLocaleDateString('en-GB');
            const updatedVisitRescheduleTimeString = updatedVisit.rescheduleTime.toDate().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

            if (updatedVisitDateString === updatedVisitRescheduleDateString && updatedVisitTimeString === updatedVisitRescheduleTimeString) {
                return true
            }
        }
        return false
    }


    function checkRescheduleDateTimeDisplay() {
        if (
            Object.keys(updatedVisit).length !== 0 && (updatedVisit.rescheduleDate !== '' && updatedVisit.rescheduleTime !== '' && visitStatus !== 'approved') &&
            !isCurrentAndRescheduleSame()
        ) {
            console.log('checkRescheduleDateTimeDisplay returning true');
            return true;
        }
        console.log('checkRescheduleDateTimeDisplay returning false');
        return false;
    }


    function checkRescheduleResponseDisplay() {
        if (Object.keys(updatedVisit).length !== 0 && (updatedVisit.rescheduleResponse !== '' && visitStatus !== 'approved') &&
            !isCurrentAndRescheduleSame()
        ) {
            console.log('checkRescheduleResponseDisplay returning true');
            return true;
        }
        console.log('checkRescheduleResponseDisplay returning false');
        return false
    }


    return (
        <View style={styles.container}>
            <View style={styles.listingDetails}>

                {Object.keys(updatedVisit).length !== 0 ? (
                    <>
                        <Text style={styles.info}>{language === 'zh' ? '日期：' : 'Date: '}{updatedVisitDate.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}</Text>
                        <Text style={styles.info}>{language === 'zh' ? '时间：' : 'Time: '}{updatedVisitTime.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}</Text>
                    </>
                ) : (
                    <>
                        <Text style={styles.info}>{language === 'zh' ? '日期：' : 'Date: '}{visitDate.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}</Text>
                        <Text style={styles.info}>{language === 'zh' ? '时间：' : 'Time: '}{visitTime.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}</Text>
                    </>
                )}

                <Text style={styles.info}>{language === 'zh' ? '疑问：' : 'Questions: '}{visit.questions}</Text>

                {isLoading ? (
                    <Text>{language === 'zh' ? '加载请求者数据中...' : 'Loading requester data...'}</Text>
                ) : (
                    requesterData &&
                    <View>
                        <Text style={styles.info}>{language === 'zh' ? '姓名：' : 'Name: '}{requesterData.name}</Text>
                        <Text style={styles.info}>{language === 'zh' ? '电子邮件：' : 'Email: '}{requesterData.email}</Text>
                        <Text style={styles.info}>{language === 'zh' ? '电话：' : 'Phone: '}{requesterData.phoneNumber}</Text>
                    </View>
                )}

                {checkRescheduleDateTimeDisplay() && (
                    <View style={{ width: 312 }}>
                        <Text style={styles.info}>
                        {language === 'zh' ? '重新安排：' : 'Rescheduled to: '}{new Date(updatedVisit.rescheduleDate.seconds * 1000).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}{language === 'zh' ? ' 于 ' : ' at '}{new Date(updatedVisit.rescheduleTime.seconds * 1000).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}
                        </Text>
                    </View>
                )}

                {(checkRescheduleResponseDisplay() || updatedVisit.rescheduleResponse === 'accepted' || updatedVisit.rescheduleResponse === 'pending') && (
                    <Text style={styles.info}>
                        {language === 'zh' ? '重新安排回应：' : 'Reschedule response: '}{updatedVisit.rescheduleResponse.charAt(0).toUpperCase() + updatedVisit.rescheduleResponse.slice(1)}
                    </Text>
                )}

            </View>


            <View style={styles.editDeleteButtonContainer}>

                {visitStatus === 'approved' ? (
                    <PressableItem onPress={() => { console.log("pressed on already approved request") }} style={[styles.approveButtonStyle, { backgroundColor: Colors.shadowColor, width: '75%' }]} >
                        <Text style={{ color: Colors.background }}>{language === 'zh' ? '批准 ' : 'Approve '}</Text>
                    </PressableItem>) : (
                    <PressableItem onPress={() => { handleApprove(visit.id) }} style={styles.approveButtonStyle} >
                        <Text style={{ color: Colors.background }}>{language === 'zh' ? '批准 ' : 'Approve '}</Text>
                    </PressableItem>
                )
                }

                <PressableItem onPress={() => { handleReschedule() }} style={[styles.approveButtonStyle, { backgroundColor: Colors.yellow, width: '85%' }]} >
                    <Text style={{ color: Colors.background }}>{language === 'zh' ? '重新安排' : 'Reschedule'}</Text>
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