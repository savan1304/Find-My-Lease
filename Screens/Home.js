import React, { useState, useEffect, useContext } from 'react';
import { View, Text, StyleSheet, TextInput, Button, Modal, FlatList, Dimensions, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { collection, query, onSnapshot } from 'firebase/firestore';
import MapHolder from '../Components/MapHolder';
import HouseListItem from '../Components/HouseListItem';
import helper from '../Config/Helper';
import { database } from '../Firebase/firebaseSetup';
import PressableItem from '../Components/PressableItem';
import { appStyles } from '../Config/Styles';
import { AuthContext } from '../Components/AuthContext';

const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;

const Home = ({ navigation }) => {
    const { user, language } = useContext(AuthContext);
    const [searchText, setSearchText] = useState('');
    const [filters, setFilters] = useState({
        bedrooms: { min: null, max: null },
        area: { min: null, max: null },
        bath: { min: null, max: null },
        petFriendly: null,
        price: { min: null, max: null },
        type: null,
    });
    const [isModalVisible, setModalVisible] = useState(false);
    const [houses, setHouses] = useState([]);

    useEffect(() => {
        const q = query(collection(database, 'Listing'));
        const unsubscribe = onSnapshot(q, (querySnapshot) => {
            let newArray = [];
            if (!querySnapshot.empty) {
                querySnapshot.forEach((docSnapShot) => {
                    const houseData = docSnapShot.data();
                    // Filter out houses created by the current user so user cannot see their own listing 
                    if (!user || houseData.createdBy !== user.uid) {
                        newArray.push({ ...houseData, id: docSnapShot.id });
                    }
                });
            }
            setHouses(newArray);
        }, (e) => { console.log(e) });

        return () => unsubscribe();
    }, [user]);


    const filteredHouses = houses.filter(house => {
        const bedroomsWithinRange = (
            (filters.bedrooms.min === null || house.bed >= filters.bedrooms.min) &&
            (filters.bedrooms.max === null || house.bed <= filters.bedrooms.max)
        );
        const houseAreaNumber = parseInt(house.area);
        const areaWithinRange = (
            (filters.area.min === null || houseAreaNumber >= filters.area.min) &&
            (filters.area.max === null || houseAreaNumber <= filters.area.max)
        );
        const bathWithinRange = (
            (filters.bath.min === null || house.bath >= filters.bath.min) &&
            (filters.bath.max === null || house.bath <= filters.bath.max)
        );
        const priceWithinRange = (
            (filters.price.min === null || house.price >= filters.price.min) &&
            (filters.price.max === null || house.price <= filters.price.max)
        );
        const petFriendlyMatch = (
            filters.petFriendly === null || house.petFriendly === filters.petFriendly
        );
        const typeMatch = (
            filters.type === null || house.type === filters.type
        );

        return bedroomsWithinRange && areaWithinRange && bathWithinRange && priceWithinRange && petFriendlyMatch && typeMatch;
    });

    const clearFilters = () => {
        setFilters({
            bedrooms: { min: null, max: null },
            area: { min: null, max: null },
            bath: { min: null, max: null },
            petFriendly: null,
            price: { min: null, max: null },
            type: null,
        });
    };

    const handleHousePress = house => {
        console.log('House selected:', house);
        navigation.navigate('HouseDetails', { house });
    };

    return (
        <View style={styles.container}>
            <TextInput
                style={styles.searchBar}
                placeholder={language === 'zh' ? "搜索..." : "Search..."}
                value={searchText}
                onChangeText={setSearchText}
            />
            <PressableItem onPress={() => setModalVisible(true)} style={{ margin: 0 }}>
                <Text style={appStyles.text}>{language === 'zh' ? "打开筛选器" : "Open Filters"}</Text>
            </PressableItem>
            <MapHolder navigation={navigation} houses={houses} />
            <FlatList
                data={filteredHouses}
                renderItem={({ item }) => (
                    <HouseListItem
                        house={item}
                        onPress={() => handleHousePress(item)}
                    />
                )}
                keyExtractor={item => item.id}
                style={styles.list}
            />
            <Modal
                animationType="slide"
                transparent={true}
                visible={isModalVisible}
                onRequestClose={() => setModalVisible(!isModalVisible)}
            >
                <KeyboardAvoidingView
                    style={styles.centeredView}
                    behavior={Platform.OS === "ios" ? "padding" : "height"}
                >
                    <View style={styles.modalView}>
                        <ScrollView contentContainerStyle={{ justifyContent: 'center', alignItems: 'center' }} keyboardShouldPersistTaps='handled' horizontal={true}>
                            <ScrollView contentContainerStyle={{ justifyContent: 'center' }}>
                                <View style={styles.inputContainer}>
                                    <Text style={styles.label}>{language === 'zh' ? "卧室" : "Bedrooms"}</Text>
                                    <TextInput
                                        style={styles.input}
                                        onChangeText={(value) => setFilters(prev => ({
                                            ...prev,
                                            bedrooms: { ...prev.bedrooms, min: value ? parseInt(value) : null }
                                        }))}
                                        value={filters.bedrooms.min ? filters.bedrooms.min.toString() : ''}
                                        keyboardType="number-pad"
                                        placeholder={language === 'zh' ? "最小" : "Min"}
                                        placeholderTextColor={helper.color.placeholderTextColor}
                                    />
                                    <TextInput
                                        style={styles.input}
                                        onChangeText={(value) => setFilters(prev => ({
                                            ...prev,
                                            bedrooms: { ...prev.bedrooms, max: value ? parseInt(value) : null }
                                        }))}
                                        value={filters.bedrooms.max ? filters.bedrooms.max.toString() : ''}
                                        keyboardType="number-pad"
                                        placeholder={language === 'zh' ? "最大" : "Max"}
                                        placeholderTextColor={helper.color.placeholderTextColor}
                                    />
                                </View>
                                <View style={styles.inputContainer}>
                                    <Text style={styles.label}>{language === 'zh' ? "面积(平方米)" : "Area (m²)"}</Text>
                                    <TextInput
                                        style={styles.input}
                                        onChangeText={(value) => setFilters(prev => ({
                                            ...prev,
                                            area: { ...prev.area, min: value ? parseInt(value) : null }
                                        }))}
                                        value={filters.area.min ? filters.area.min.toString() : ''}
                                        keyboardType="number-pad"
                                        placeholder={language === 'zh' ? "最小" : "Min"}
                                        placeholderTextColor={helper.color.placeholderTextColor}
                                    />
                                    <TextInput
                                        style={styles.input}
                                        onChangeText={(value) => setFilters(prev => ({
                                            ...prev,
                                            area: { ...prev.area, max: value ? parseInt(value) : null }
                                        }))}
                                        value={filters.area.max ? filters.area.max.toString() : ''}
                                        keyboardType="number-pad"
                                        placeholder={language === 'zh' ? "最大" : "Max"}
                                        placeholderTextColor={helper.color.placeholderTextColor}
                                    />
                                </View>
                                <View style={styles.inputContainer}>
                                    <Text style={styles.label}>{language === 'zh' ? "浴室" : "Bathrooms"}</Text>
                                    <TextInput
                                        style={styles.input}
                                        onChangeText={(value) => setFilters(prev => ({
                                            ...prev,
                                            bath: { ...prev.bath, min: value ? parseInt(value) : null }
                                        }))}
                                        value={filters.bath.min ? filters.bath.min.toString() : ''}
                                        keyboardType="number-pad"
                                        placeholder={language === 'zh' ? "最小" : "Min"}
                                        placeholderTextColor={helper.color.placeholderTextColor}
                                    />
                                    <TextInput
                                        style={styles.input}
                                        onChangeText={(value) => setFilters(prev => ({
                                            ...prev,
                                            bath: { ...prev.bath, max: value ? parseInt(value) : null }
                                        }))}
                                        value={filters.bath.max ? filters.bath.max.toString() : ''}
                                        keyboardType="number-pad"
                                        placeholder={language === 'zh' ? "最大" : "Max"}
                                        placeholderTextColor={helper.color.placeholderTextColor}
                                    />
                                </View>
                                <View style={styles.inputContainer}>
                                    <Text style={styles.label}>{language === 'zh' ? "价格" : "Price"}</Text>
                                    <TextInput
                                        style={styles.input}
                                        onChangeText={(value) => setFilters(prev => ({
                                            ...prev,
                                            price: { ...prev.price, min: value ? parseInt(value) : null }
                                        }))}
                                        value={filters.price.min ? filters.price.min.toString() : ''}
                                        keyboardType="number-pad"
                                        placeholder={language === 'zh' ? "最小" : "Min"}
                                        placeholderTextColor={helper.color.placeholderTextColor}
                                    />
                                    <TextInput
                                        style={styles.input}
                                        onChangeText={(value) => setFilters(prev => ({
                                            ...prev,
                                            price: { ...prev.price, max: value ? parseInt(value) : null }
                                        }))}
                                        value={filters.price.max ? filters.price.max.toString() : ''}
                                        keyboardType="number-pad"
                                        placeholder={language === 'zh' ? "最大" : "Max"}
                                        placeholderTextColor={helper.color.placeholderTextColor}
                                    />
                                </View>
                                <View style={styles.inputContainer}>
                                    <Text style={styles.label}>{language === 'zh' ? "允许宠物" : "Pet Friendly"}</Text>
                                    <PressableItem
                                        style={[styles.checkbox, { width: '25%' }]}
                                        onPress={() => setFilters(prev => ({
                                            ...prev,
                                            petFriendly: !filters.petFriendly
                                        }))}
                                    >
                                        <Text style={styles.checkboxLabel}>{filters.petFriendly ? (language === 'zh' ? '是' : 'Yes') : (language === 'zh' ? '否' : 'No')}</Text>
                                    </PressableItem>
                                </View>
                                <View style={styles.inputContainer}>
                                    <Text style={styles.label}>{language === 'zh' ? "类型" : "Type"}</Text>
                                    <PressableItem
                                        style={[styles.checkbox, { width: '35%' }]}
                                        onPress={() => setFilters(prev => ({
                                            ...prev,
                                            type: filters.type === 'Private' ? 'Shared' : 'Private'
                                        }))}
                                    >
                                        <Text style={styles.checkboxLabel}>{filters.type || (language === 'zh' ? '私人' : 'Private')}</Text>
                                    </PressableItem>
                                </View>
                            </ScrollView>
                        </ScrollView>
                        <View style={styles.buttonContainer}>
                            <PressableItem
                                style={[styles.button, styles.buttonClose]}
                                onPress={() => setModalVisible(!isModalVisible)}
                            >
                                <Text style={styles.textStyle}>{language === 'zh' ? "隐藏筛选器" : "Hide Filters"}</Text>
                            </PressableItem>
                            <PressableItem
                                style={[styles.button, styles.buttonClear]}
                                onPress={clearFilters}
                            >
                                <Text style={styles.textStyle}>{language === 'zh' ? "清除筛选器" : "Clear Filters"}</Text>
                            </PressableItem>
                        </View>
                    </View>
                </KeyboardAvoidingView>
            </Modal>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 3,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    header: {
        fontSize: 24,
        marginBottom: 20,
    },
    searchBar: {
        width: screenWidth * 0.8,
        height: screenHeight * 0.05,
        borderColor: '#333',
        borderWidth: 1,
        borderRadius: 10,
        paddingLeft: 10,
        marginBottom: 20,
    },
    list: {
        width: '100%',
        flex: 2
    },
    centeredView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 22,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalView: {
        margin: 10,
        width: screenWidth * 0.8,
        backgroundColor: 'white',
        borderRadius: 20,
        padding: 25,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
    },
    label: {
        fontSize: 16,
        marginHorizontal: 10,
    },
    input: {
        width: '20%',
        height: 40,
        borderWidth: 1,
        padding: 10,
        borderColor: '#ddd',
        borderRadius: 10,
        marginRight: 25,
    },
    button: {
        borderRadius: 10,
        padding: 10,
        elevation: 2
    },
    buttonClose: {
        backgroundColor: 'rgb(0, 122, 255)',
    },
    textStyle: {
        color: "white",
        fontWeight: "bold",
        textAlign: "center"
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        width: '100%',
        marginTop: 10,
    },
    buttonClear: {
        backgroundColor: 'rgb(255, 59, 48)',
    },
    checkbox: {
        height: 45,
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 10,
    },
    checkboxLabel: {
        fontSize: 16,
        color: '#f5f5f7'
    },
});

export default Home;
