import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { getDoc } from 'firebase/firestore';
import { doc } from 'firebase/firestore';
import PressableItem from '../Components/PressableItem';
import { FontAwesome } from '@expo/vector-icons';
import Visit from '../Components/Visit';

export default function ScheduledVisits() {

    const [visits, setVisits] = useState([])


    useEffect(() => {
        const unsubscribe = onSnapshot(query(
            collection(database, 'User', user.uid, 'ScheduledVisits')),
            (querySnapshot) => {
                let newArray = []
                if (!querySnapshot.empty) {
                    querySnapshot.forEach((docSnapShot) => {
                        console.log(docSnapShot.id)
                        newArray.push({ ...docSnapShot.data(), id: docSnapShot.id })
                    });
                }
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
                                    <Visit house={item} onPress={handlePressVisit}/>
                                    <PressableItem onPress={() => { handleEditVisit(item.id) }} style={styles.editDeleteButtonStyle} >
                                        <FontAwesome name="pencil" size={24} color="black" />
                                    </PressableItem>
                                    <PressableItem onPress={() => { handleDeleteVisit(item.id) }} style={styles.editDeleteButtonStyle} >
                                        <FontAwesome name="trash" size={24} color="black" />
                                    </PressableItem>
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