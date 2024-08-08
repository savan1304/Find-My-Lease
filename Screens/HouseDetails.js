import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, Image } from 'react-native';

const HouseDetails = ({ route, navigation }) => {
    const { house } = route.params;
    const sampleImages = [
        'https://via.placeholder.com/200x200.png?text=House+1',
        'https://via.placeholder.com/200x200.png?text=House+2',
        'https://via.placeholder.com/200x200.png?text=House+3',
        'https://via.placeholder.com/200x200.png?text=House+4'
    ];

    const handleContact = () => {
        console.log('Contact tapped');
    };
    
    const handleSave = () => {
        console.log('Save tapped');
    };
    
    const handleScheduleViewing = () => {
        console.log('Schedule Viewing tapped');
        navigation.navigate('ScheduleVisit', { house });
    };
    
    const handleSetPriceDropAlert = () => {
        console.log('Set Price Drop Alert tapped');
    };

    return (
        <View style={styles.container}>
            <FlatList
                data={sampleImages}
                horizontal
                showsHorizontalScrollIndicator={false}
                renderItem={({ item }) => (
                    <Image source={{ uri: item }} style={styles.image} />
                )}
                keyExtractor={(_, index) => index.toString()}
                style={styles.imageList}
            />
            <Text style={styles.header}>House Details</Text>
            <View style={styles.detailsContainer}>
                <Text style={styles.detail}>Area: {house.area}</Text>
                <Text style={styles.detail}>Bathrooms: {house.bath}</Text>
                <Text style={styles.detail}>Bedrooms: {house.bed}</Text>
                <Text style={styles.detail}>Location: {house.location}</Text>
                <Text style={styles.detail}>Pet Friendly: {house.petFriendly ? 'Yes' : 'No'}</Text>
                <Text style={styles.detail}>Price: {house.price}</Text>
                <Text style={styles.detail}>Tenant Gender: {house.tenantGender}</Text>
                <Text style={styles.detail}>Transit: {house.transit}</Text>
                <Text style={styles.detail}>Type: {house.type}</Text>
                <Text style={styles.detail}>Year Built: {house.year}</Text>
            </View>
            <TouchableOpacity style={styles.button} onPress={handleContact}>
                <Text style={styles.buttonText}>Contact</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={handleSave}>
                <Text style={styles.buttonText}>Save</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={handleScheduleViewing}>
                <Text style={styles.buttonText}>Schedule Viewing</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={handleSetPriceDropAlert}>
                <Text style={styles.buttonText}>Set Price Drop Alert</Text>
            </TouchableOpacity>
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
    detailsContainer: {
        marginBottom: 20,
        width: '100%',
    },
    detail: {
        fontSize: 18,
        marginBottom: 10
    },
    imageList: {
        height: 220,
        flexGrow: 0, 
    },
    image: {
        width: 200,
        height: 200,
        marginRight: 10,
        borderRadius: 10, 
    },
    button: {
        marginTop: 10,
        backgroundColor: '#007BFF',
        padding: 10,
        borderRadius: 5,
        width: '80%'
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        textAlign: 'center'
    }
});

export default HouseDetails;
