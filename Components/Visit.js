import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const Visit = ({ visit }) => {

    let visitStatus = visit.status
    let status = visitStatus.charAt(0).toUpperCase() + visitStatus.slice(1);
    return (
        <View>
            <Text style={styles.info}>Location: {visit.listingLocation}</Text>
            <Text style={styles.info}>Price: {visit.listingPrice}</Text>
            <Text style={styles.info}>Date: {visit.date}</Text>
            <Text style={styles.info}>Time: {visit.time}</Text>
            <Text style={styles.info}>Questions: {visit.questions}</Text>
            {visit.setReminder ? (
                <Text style={styles.info}>Reminder set: Yes</Text>
            ) : (
                <Text style={styles.info}>Reminder set: No</Text>
            )}
            <Text style={styles.info}>Status: {status}</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    info: {
        fontSize: 16,
        color: '#666',
        marginBottom: 5,
    },
});

export default Visit;