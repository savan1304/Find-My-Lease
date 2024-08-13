import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, Image, ScrollView, Alert } from 'react-native';
import { writeToDB } from '../Firebase/firestoreHelper';
import { auth } from '../Firebase/firebaseSetup';
import { scoreApiKey } from '@env';  // Ensure your API key is stored securely

const HouseDetails = ({ route, navigation }) => {
    const { house } = route.params;
    const [locationScores, setLocationScores] = useState(null);

    const sampleImages = [
        'https://via.placeholder.com/200x200.png?text=House+1',
        'https://via.placeholder.com/200x200.png?text=House+2',
        'https://via.placeholder.com/200x200.png?text=House+3',
        'https://via.placeholder.com/200x200.png?text=House+4'
    ];

    useEffect(() => {
        fetchLocationScores();
    }, []);

    const fetchLocationScores = async () => {
        const url = `https://api.walkscore.com/score?format=json&address=${encodeURIComponent(house.location)}&lat=${house.latitude}&lon=${house.longitude}&transit=1&bike=1&wsapikey=${scoreApiKey}`;
        try {
            const response = await fetch(url);
            const data = await response.json();
            if (data.status === 1) {
                setLocationScores(data);
            } else {
                console.error('Failed to fetch scores:', data);
            }
        } catch (error) {
            console.error('Error fetching scores:', error);
        }
    };

    const handleContact = () => {
        console.log('Contact tapped');
    };

    const confirmSave = () => {
        Alert.alert(
            'Save Listing',
            'Are you sure you want to save this listing?',
            [
                { text: 'Cancel', style: 'cancel' },
                { text: 'Save', onPress: handleSave }
            ],
            { cancelable: false }
        );
    };

    const handleSave = async () => {
        try {
            const user = auth.currentUser;
            if (user) {
                const collectionPath = `User/${user.uid}/saved`;
                await writeToDB(house, collectionPath);
            } else {
                Alert.alert('Error', 'No user is signed in');
            }
        } catch (error) {
            console.log('Error saving house:', error);
            Alert.alert('Error', 'Failed to save house. Please try again.');
        }
    };

    const handleScheduleViewing = () => {
        console.log('Schedule Viewing tapped');
        navigation.navigate('ScheduleVisit', { house });
    };

    const handleSetPriceDropAlert = () => {
        console.log('Set Price Drop Alert tapped');
    };

    return (
        <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
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
                {locationScores && (
                    <View style={styles.scoresContainer}>
                        <Text style={styles.detail}>Walking Score: {locationScores.walkscore} ({locationScores.description})</Text>
                        <Text style={styles.detail}>Transit Score: {locationScores.transit.score} ({locationScores.transit.description})</Text>
                        <Text style={styles.detail}>Biking Score: {locationScores.bike.score} ({locationScores.bike.description})</Text>
                    </View>
                )}
            </View>
            <TouchableOpacity style={styles.button} onPress={handleContact}>
                <Text style={styles.buttonText}>Contact</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={confirmSave}>
                <Text style={styles.buttonText}>Save</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={handleScheduleViewing}>
                <Text style={styles.buttonText}>Schedule Viewing</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={handleSetPriceDropAlert}>
                <Text style={styles.buttonText}>Set Price Drop Alert</Text>
            </TouchableOpacity>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff'
    },
    contentContainer: {
        padding: 20,
        paddingBottom: 100  
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
        marginBottom: 20
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
        width: '80%',
        alignSelf: 'center'  
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        textAlign: 'center'
    },
    scoresContainer: {
        marginTop: 10,
        marginBottom: 20,
        padding: 10,
        backgroundColor: '#f0f0f0'
    }
});

export default HouseDetails;
