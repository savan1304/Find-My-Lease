import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { AntDesign } from '@expo/vector-icons';
const Visit = ({ visit, house, onPress }) => {
    const firestoreTimeString = visit.time
    const time = firestoreTimeString.split('at ')[1].slice(0, -9); // "6:00 PM"
    return (
        <TouchableOpacity onPress={() => onPress(house)} style={styles.container}>
            <View style={styles.left}>

                <AntDesign name="home" size={24} color="black" />
            </View>
            <View style={styles.right}>
                <Text style={styles.info}>Location: {house.location}</Text>
                <Text style={styles.info}>Price: {house.price}</Text>
                <Text style={styles.info}>Date: {visit.date}</Text>
                <Text style={styles.info}>Time: {time}</Text>
                <Text style={styles.info}>Questions: {visit.questions}</Text>
                {visit.setReminder ? (
                    <Text style={styles.info}>Reminder set: Yes</Text>

                ) : (
                    <Text style={styles.info}>Reminder set: Yes</Text>

                )}
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        padding: 10,
        justifyContent: 'space-between',
        alignItems: 'center',
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
    },
    left: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    right: {
        flex: 1,
        alignItems: 'flex-end',
    },
    info: {
        fontSize: 16,
        color: '#666',
        marginBottom: 5,
    },
});

export default Visit;