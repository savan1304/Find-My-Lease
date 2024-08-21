import React, { useState, useEffect, useContext } from 'react';
import { View, Text, StyleSheet, FlatList, Image, ScrollView, Alert, Modal, TouchableOpacity, Button, Dimensions } from 'react-native';
import { writeToDB } from '../Firebase/firestoreHelper';
import { scoreApiKey } from '@env';
import Ionicons from '@expo/vector-icons/Ionicons';
import { AuthContext } from '../Components/AuthContext';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { storage, database } from '../Firebase/firebaseSetup';
import { ref, getDownloadURL } from 'firebase/storage';
import PressableItem from '../Components/PressableItem';
import * as Clipboard from 'expo-clipboard';

const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;

const HouseDetails = ({ route, navigation }) => {
    const { house } = route.params;
    const { user, language } = useContext(AuthContext);
    const [locationScores, setLocationScores] = useState(null);
    const [imageUrls, setImageUrls] = useState([]);
    const [ownerContact, setOwnerContact] = useState(null);
    const [modalVisible, setModalVisible] = useState(false);
    const copyToClipboard = async (text) => {
        await Clipboard.setStringAsync(text);
        const copiedText = await Clipboard.getStringAsync(); 
        Alert.alert(language === 'zh' ? '已复制' : 'Copied', `${language === 'zh' ? '已复制到剪贴板: ' : 'Copied to clipboard: '} ${copiedText}`);
    };

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
            Alert.alert(language === 'zh' ? '需要登录' : 'Login Required', language === 'zh' ? '您需要登录才能执行此操作。' : 'You need to be logged in to perform this action.', [
                { text: language === 'zh' ? '取消' : 'Cancel', style: 'cancel' },
                { text: language === 'zh' ? '登录' : 'Login', onPress: () => navigation.navigate('Login') }
            ]);
        }
    };

    const handleContact = () => {
        if (ownerContact) {
            setModalVisible(true);
        } else {
            Alert.alert(language === 'zh' ? '错误' : 'Error', language === 'zh' ? '没有此房东的联系信息。' : 'No contact information available for this owner.');
        }
    };

    const confirmSave = () => {
        requireLogin(() => {
            Alert.alert(
                language === 'zh' ? '保存房源' : 'Save Listing',
                language === 'zh' ? '您确定要保存此房源吗？' : 'Are you sure you want to save this listing?',
                [
                    { text: language === 'zh' ? '取消' : 'Cancel', style: 'cancel' },
                    { text: language === 'zh' ? '保存' : 'Save', onPress: handleSave }
                ],
                { cancelable: false }
            );
        });
    };

    const handleSave = async () => {
        if (!user) {
            Alert.alert(language === 'zh' ? '错误' : 'Error', language === 'zh' ? '没有用户登录。' : 'No user is signed in');
            return;
        }

        const userRef = doc(database, `User/${user.uid}`);
        try {
            const docSnap = await getDoc(userRef);
            if (docSnap.exists()) {
                let savedHouses = docSnap.data().savedHouses || [];
                if (!savedHouses.includes(house.id)) {
                    savedHouses.push(house.id);
                    await updateDoc(userRef, {
                        savedHouses: savedHouses
                    });
                    Alert.alert(language === 'zh' ? '成功' : 'Success', language === 'zh' ? '房源已成功保存。' : 'House saved successfully');
                } else {
                    Alert.alert(language === 'zh' ? '信息' : 'Info', language === 'zh' ? '房源已被保存。' : 'House already saved');
                }
            } else {
                await setDoc(userRef, {
                    savedHouses: [house.id]
                });
                Alert.alert(language === 'zh' ? '成功' : 'Success', language === 'zh' ? '房源已成功保存。' : 'House saved successfully');
            }
        } catch (error) {
            console.error('Error saving house:', error);
            Alert.alert(language === 'zh' ? '错误' : 'Error', language === 'zh' ? '保存房源失败，请重试。' : 'Failed to save house. Please try again.');
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
                <Text style={styles.detail}>{language === 'zh' ? '面积: ' : 'Area: '}{house.area} </Text>
                <Text style={styles.detail}>{language === 'zh' ? '卫生间: ' : 'Bathrooms: '}{house.bath} </Text>
                <Text style={styles.detail}>{language === 'zh' ? '卧室: ' : 'Bedrooms: '}{house.bed} </Text>
                <Text style={styles.detail}>{language === 'zh' ? '位置: ' : 'Location: '}{house.location} </Text>
                <Text style={styles.detail}>{language === 'zh' ? '允许宠物: ' : 'Pet Friendly: '}{house.petFriendly ? (language === 'zh' ? '是' : 'Yes') : (language === 'zh' ? '否' : 'No')} </Text>
                <Text style={styles.detail}>{language === 'zh' ? '价格: ' : 'Price: '}{house.price} </Text>
                <Text style={styles.detail}>{language === 'zh' ? '租户性别: ' : 'Tenant Gender: '}{house.tenantGender} </Text>
                <Text style={styles.detail}>{language === 'zh' ? '交通: ' : 'Transit: '}{house.transit} </Text>
                <Text style={styles.detail}>{language === 'zh' ? '类型: ' : 'Type: '}{house.type} </Text>
                <Text style={styles.detail}>{language === 'zh' ? '建筑年份: ' : 'Year Built: '}{house.year} </Text>
                {locationScores && (
                    <View style={styles.scoresContainer}>
                        <View style={styles.scoreDetail}>
                            <Ionicons name="walk" size={24} color="black" />
                            <Text style={styles.detail}>{language === 'zh' ? '步行评分: ' : 'Walking Score: '}{locationScores.walkscore} ({locationScores.description}) </Text>
                        </View>
                        <View style={styles.scoreDetail}>
                            <Ionicons name="bus" size={24} color="black" />
                            <Text style={styles.detail}>{language === 'zh' ? '交通评分: ' : 'Transit Score: '}{locationScores.transit.score} ({locationScores.transit.description}) </Text>
                        </View>
                        <View style={styles.scoreDetail}>
                            <Ionicons name="bicycle" size={24} color="black" />
                            <Text style={styles.detail}>{language === 'zh' ? '自行车评分: ' : 'Biking Score: '}{locationScores.bike.score} ({locationScores.bike.description}) </Text>
                        </View>
                    </View>
                )}
            </View>
            <PressableItem style={styles.button} onPress={handleContact}>
                <Text style={styles.buttonText}>{language === 'zh' ? '联系' : 'Contact'} </Text>
            </PressableItem>
            <PressableItem style={styles.button} onPress={confirmSave}>
                <Text style={styles.buttonText}>{language === 'zh' ? '保存' : 'Save'} </Text>
            </PressableItem>
            <PressableItem style={styles.button} onPress={handleScheduleViewing}>
                <Text style={styles.buttonText}>{language === 'zh' ? '预约看房' : 'Schedule Viewing'} </Text>
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
                        <Text style={styles.modalTitle}>{language === 'zh' ? '联系信息' : 'Contact Information'} </Text>
                        <Text style={styles.modalTitle}>({language === 'zh' ? '长按复制' : 'Hold to Copy'}) </Text>
                        <TouchableOpacity onPress={() => copyToClipboard(ownerContact?.email || 'N/A')}>
                            <Text style={styles.modalText}>{language === 'zh' ? '电邮: ' : 'Email: '}{ownerContact?.email || 'N/A'} </Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => copyToClipboard(ownerContact?.phoneNumber || 'N/A')}>
                            <Text style={styles.modalText}>{language === 'zh' ? '电话: ' : 'Phone: '}{ownerContact?.phoneNumber || 'N/A'} </Text>
                        </TouchableOpacity>
                        <Button title={language === 'zh' ? '关闭' : 'Close'} onPress={() => setModalVisible(false)} />
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
        width: '51%',
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
        width: screenWidth * 0.75,
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
