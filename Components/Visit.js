import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors } from '../Config/Colors';

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
            <View style={styles.statusContainer}>
                <Text style={styles.info}>Status: </Text>
                <Text style={[styles.info, { color: status === 'Approved' ? Colors.green : status === 'Rescheduled' ? Colors.yellow : '#666', fontWeight: '600' }]}>
                    {status}
                </Text>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    info: {
        fontSize: 16,
        color: '#666',
        marginBottom: 5,
    },
    statusContainer: {
        flexDirection: 'row'
    }
});

export default Visit;