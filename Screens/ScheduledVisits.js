import { StyleSheet, Text, View, FlatList } from 'react-native'
import React, { useState, useEffect } from 'react'
import PressableItem from '../Components/PressableItem';
import { FontAwesome } from '@expo/vector-icons';
import Visit from '../Components/Visit';
import { auth } from '../Firebase/firebaseSetup';
import { collection, onSnapshot, where, query } from 'firebase/firestore';
import { database } from '../Firebase/firebaseSetup';
import { deleteFromDB } from '../Firebase/firestoreHelper';

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
                        newArray.push({ ...docSnapShot.data(), 
                            id: docSnapShot.id, 
                            date: date.toLocaleDateString(), 
                            time: time.toLocaleTimeString(), })
                    });
                }
                console.log("newArray in scheduledVisits: ", newArray)
                setVisits(newArray);
            }, (e) => { console.log(e) })


        return () => unsubscribe()  // Detaching the listener when no longer listening to the changes in data
    }, [])

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
                                <View>
                                    <Visit visit={item} />
                                </View>
                            )
                        }}
                    />
                )
            }
        </View>
    )
}

const styles = StyleSheet.create({})