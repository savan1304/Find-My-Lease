import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, Button, Modal, TouchableOpacity, FlatList } from 'react-native';
import MapHolder from '../Components/MapHolder';
import HouseListItem from '../Components/HouseListItem'; 

const Home = () => {
    const [searchText, setSearchText] = useState('');
    const [filters, setFilters] = useState({
        bedrooms: 0,
        area: 0,
    });
    const [isModalVisible, setModalVisible] = useState(false);

    const houses = [
        { id: '1', name: 'House 1', bedrooms: 3, area: '120m²', price: '$300,000' },
        { id: '2', name: 'House 2', bedrooms: 4, area: '150m²', price: '$450,000' },
        { id: '3', name: 'House 3', bedrooms: 2, area: '100m²', price: '$250,000' },
    ];

    const handleHousePress = house => {
        console.log('House selected:', house);
    };

    return (
        <View style={styles.container}>
            <Text style={styles.header}>Home Screen</Text>
            <TextInput
                style={styles.searchBar}
                placeholder="Search..."
                value={searchText}
                onChangeText={setSearchText}
            />
            <Button title="Open Filters" onPress={() => setModalVisible(true)} />
            <MapHolder />
            <FlatList
                data={houses}
                renderItem={({ item }) => <HouseListItem house={item} onPress={handleHousePress} />}
                keyExtractor={item => item.id}
                style={styles.list}
            />
            <Modal
                animationType="slide"
                transparent={true}
                visible={isModalVisible}
                onRequestClose={() => setModalVisible(!isModalVisible)}
            >
                <View style={styles.centeredView}>
                    <View style={styles.modalView}>
                        <TextInput
                            style={styles.input}
                            onChangeText={(value) => setFilters({ ...filters, bedrooms: parseInt(value) || 0 })}
                            value={filters.bedrooms.toString()}
                            keyboardType="number-pad"
                            placeholder="Bedrooms"
                        />
                        <TextInput
                            style={styles.input}
                            onChangeText={(value) => setFilters({ ...filters, area: parseInt(value) || 0 })}
                            value={filters.area.toString()}
                            keyboardType="number-pad"
                            placeholder="Area (m²)"
                        />
                        <TouchableOpacity
                            style={[styles.button, styles.buttonClose]}
                            onPress={() => setModalVisible(!isModalVisible)}
                        >
                            <Text style={styles.textStyle}>Hide Filters</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </View>
    );
};

const styles = StyleSheet.create({
    // Add your existing styles here
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    header: {
        fontSize: 24,
        marginBottom: 20,
    },
    searchBar: {
        height: 40,
        width: '90%',
        borderColor: '#333',
        borderWidth: 1,
        borderRadius: 10,
        paddingLeft: 10,
        marginBottom: 20,
    },
    list: {
        width: '100%',
    },
    // Additional styles for the modal and other elements
});

export default Home;
