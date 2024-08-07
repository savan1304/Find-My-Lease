import React from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';

const HouseDetails = ({ route, navigation }) => {
    const { house } = route.params;

    return (
        <View style={styles.container}>
            <Text style={styles.header}>House Details</Text>
            <Text style={styles.detail}>Name: {house.name}</Text>
            <Text style={styles.detail}>Bedrooms: {house.bedrooms}</Text>
            <Text style={styles.detail}>Area: {house.area}</Text>
            <Text style={styles.detail}>Price: {house.price}</Text>
            <Button title="Go Back" onPress={() => navigation.goBack()} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
        backgroundColor: '#fff'
    },
    header: {
        fontSize: 22,
        fontWeight: 'bold',
        marginBottom: 20
    },
    detail: {
        fontSize: 18,
        marginBottom: 10
    }
});

export default HouseDetails;
