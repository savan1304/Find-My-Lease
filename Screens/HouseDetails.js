import React, { useState, useEffect, useContext } from 'react';
import { View, Text, StyleSheet, FlatList, Image, ScrollView, Alert, Modal, Button } from 'react-native';
import { writeToDB } from '../Firebase/firestoreHelper';
import { scoreApiKey } from '@env';  
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { AuthContext } from '../Components/AuthContext';
import { doc, getDoc } from 'firebase/firestore'; 
import { storage, database } from '../Firebase/firebaseSetup'; 
import { ref, getDownloadURL } from 'firebase/storage'; 
import PressableItem from '../Components/PressableItem';

const HouseDetails = ({ route, navigation }) => {
    const { house } = route.params;
    const { user } = useContext(AuthContext);  // Use AuthContext for user state
    const [locationScores, setLocationScores] = useState(null);
    const [imageUrls, setImageUrls] = useState([]);
    const [ownerContact, setOwnerContact] = useState(null);
    const [modalVisible, setModalVisible] = useState(false);

    useEffect(() => {
        fetchLocationScores();
        if (house.imageUris && house.imageUris.length > 0) {
            fetchImageUrls();
        }
    }, []);

    useEffect(() => {
        if (house.createdBy) { 
            fetchOwnerContact();
        } else {
            console.log('No owner information available for this house.');
        }
    }, [house]);

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

    const fetchImageUrls = async () => {
        try {
            const urls = await Promise.all(
                house.imageUris.map(async (imagePath) => {
                    const imageRef = ref(storage, imagePath);
                    return await getDownloadURL(imageRef);
                })
            );
            setImageUrls(urls);
        } catch (error) {
            console.error('Error fetching image URLs:', error);
        }
    };

    const fetchOwnerContact = async () => {
        try {
            const userDocRef = doc(database, 'User', house.createdBy);
            const userDoc = await getDoc(userDocRef);

            if (userDoc.exists()) {
                setOwnerContact(userDoc.data());
            } else {
                console.log('No such user document!');
            }
        } catch (error) {
            console.error('Error fetching owner contact:', error);
        }
    };

    const requireLogin = (action) => {
        if (user) {
            action();
        } else {
            Alert.alert('Login Required', 'You need to be logged in to perform this action.', [
                { text: 'Cancel', style: 'cancel' },
                { text: 'Login', onPress: () => navigation.navigate('Login') }
            ]);
        }
    };

    const handleContact = () => {
        if (ownerContact) {
            setModalVisible(true);
        } else {
            Alert.alert('Error', 'No contact information available for this owner.');
        }
    };

    const confirmSave = () => {
        requireLogin(() => {
            Alert.alert(
                'Save Listing',
                'Are you sure you want to save this listing?',
                [
                    { text: 'Cancel', style: 'cancel' },
                    { text: 'Save', onPress: handleSave }
                ],
                { cancelable: false }
            );
        });
    };

    const handleSave = async () => {
        try {
            if (user) {
                const collectionPath = `User/${user.uid}/saved`;
                const houseToSave = { id: house.id }; // Creating an object that just contains the house ID
                await writeToDB(houseToSave, collectionPath); // Save only the house ID
                Alert.alert('Success', 'House saved successfully');
            } else {
                Alert.alert('Error', 'No user is signed in');
            }
        } catch (error) {
            console.error('Error saving house:', error);
            Alert.alert('Error', 'Failed to save house. Please try again.');
        }
    };

    const handleScheduleViewing = () => {
        requireLogin(() => {
            console.log('Schedule Viewing tapped');
            navigation.navigate('ScheduleVisit', { house });
        });
    };

    return (
        <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
            {imageUrls.length > 0 && (
                <FlatList
                    data={imageUrls} 
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    renderItem={({ item }) => (
                        <Image source={{ uri: item }} style={styles.image} />
                    )}
                    keyExtractor={(_, index) => index.toString()}
                    style={styles.imageList}
                />
            )}
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
                        <View style={styles.scoreDetail}>
                            <MaterialCommunityIcons name="walk" size={24} color="black" />
                            <Text style={styles.detail}>Walking Score: {locationScores.walkscore} ({locationScores.description})</Text>
                        </View>
                        <View style={styles.scoreDetail}>
                            <MaterialCommunityIcons name="bus" size={24} color="black" />
                            <Text style={styles.detail}>Transit Score: {locationScores.transit.score} ({locationScores.transit.description})</Text>
                        </View>
                        <View style={styles.scoreDetail}>
                            <MaterialCommunityIcons name="bike" size={24} color="black" />
                            <Text style={styles.detail}>Biking Score: {locationScores.bike.score} ({locationScores.bike.description})</Text>
                        </View>
                    </View>
                )}
            </View>
            <PressableItem style={styles.button} onPress={handleContact}>
                <Text style={styles.buttonText}>Contact</Text>
            </PressableItem>
            <PressableItem style={styles.button} onPress={confirmSave}>
                <Text style={styles.buttonText}>Save</Text>
            </PressableItem>
            <PressableItem style={styles.button} onPress={handleScheduleViewing}>
                <Text style={styles.buttonText}>Schedule Viewing</Text>
            </PressableItem>

            {/* Modal for Contact Information */}
            <Modal
                visible={modalVisible}
                animationType="slide"
                transparent={true}
                onRequestClose={() => setModalVisible(false)}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Contact Information</Text>
                        <Text style={styles.modalText}>Email: {ownerContact?.email || 'N/A'}</Text>
                        <Text style={styles.modalText}>Phone: {ownerContact?.phoneNumber || 'N/A'}</Text>
                        <Button title="Close" onPress={() => setModalVisible(false)} />
                    </View>
                </View>
            </Modal>
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
    },
    scoreDetail: {
        flexDirection: 'row',
        alignItems: 'center',  
        marginBottom: 10,
    },
    detail: {
        fontSize: 18,
        marginLeft: 5,  
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        width: '80%',
        backgroundColor: 'white',
        borderRadius: 10,
        padding: 20,
        alignItems: 'center',
    },
    modalTitle: {
        fontSize: 20,
        marginBottom: 15,
    },
    modalText: {
        fontSize: 16,
        marginBottom: 10,
    },
});

export default HouseDetails;
