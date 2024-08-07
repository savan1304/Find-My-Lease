import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import MapHolder from '../Components/MapHolder';
import HouseListItem from '../Components/HouseListItem';
import { collection, onSnapshot, where, query } from 'firebase/firestore';
import { database } from '../Firebase/firebaseSetup';
import PressableItem from '../Components/PressableItem';


const Home = ({ navigation }) => {
    const [searchText, setSearchText] = useState('');
    // const [filters, setFilters] = useState({
    //     type: 'all', // Initial type is 'all' (no filter)
    //     bedrooms: 'any', // Initial bedrooms is 'any'
    //     baths: 'any',
    //     price: 'any',
    // });
    const [filters, setFilters] = useState({
        bedrooms: 0,
        area: 0
    })
    const [isModalVisible, setModalVisible] = useState(false);

    const houses = [
        { id: '1', name: 'House 1', bedrooms: 3, area: '120m²', price: '$300,000' },
        { id: '2', name: 'House 2', bedrooms: 4, area: '150m²', price: '$450,000' },
        { id: '3', name: 'House 3', bedrooms: 2, area: '100m²', price: '$250,000' },
    ];

    const handleHousePress = house => {
        console.log('House selected:', house);
    };

    const [listings, setListings] = useState([])


    useEffect(() => {
        const unsubscribe = onSnapshot(query(
            collection(database, 'Listing')),
            (querySnapshot) => {
                let newArray = []
                if (!querySnapshot.empty) {
                    querySnapshot.forEach((docSnapShot) => {
                        console.log(docSnapShot.id)
                        newArray.push({ ...docSnapShot.data(), id: docSnapShot.id })
                    });
                }
                setListings(newArray);
            }, (e) => { console.log(e) })


        return () => unsubscribe()  // Detaching the listener when no longer listening to the changes in data
    }, [])

    function handlePressListing() {
        console.log("listing pressed from Home page")
    }

    function handleScheduleVisit(listing) {
        console.log("in handleScheduleVisit in home page with listing: ", listing)
        navigation.navigate('ScheduleVisit', { listing });
    }

    return (
        <View>
            <MapHolder />
            {listings.length === 0 ? (
                <Text style={styles.text}>You have not posted any listings yet</Text>
            ) :
                (
                    <FlatList data={listings}
                        renderItem={({ item }) => {
                            console.log(item)
                            // don't need the key={item.id} here since we are not rendering the list manually anymore
                            return (
                                <View>
                                    <HouseListItem listing={item} onPress={handlePressListing} />
                                    <PressableItem onPress={() => { handleScheduleVisit(item) }} style={styles.editDeleteButtonStyle} >
                                        <Text>Schedule a Visit</Text>
                                    </PressableItem>
                                </View>

                            )
                        }}
                    />
                )
            }
        </View>
        // <View style={styles.container}>
        //     <Text style={styles.header}>Home Screen</Text>
        //     <TextInput
        //         style={styles.searchBar}
        //         placeholder="Search Location..."
        //         value={searchText}
        //         onChangeText={setSearchText}
        //     />

        /* <View style={styles.filterRow}>s
                <Picker
                    style={styles.picker}
                    selectedValue={filters.type}
                    onValueChange={(itemValue) => setFilters({ ...filters, type: itemValue })}
                >
                    <Picker.Item label="All" value="all" />
                    <Picker.Item label="Shared" value="shared" />
                    <Picker.Item label="Private" value="private" />
                </Picker>

                <Picker
                    style={styles.picker}
                    selectedValue={filters.bedrooms}
                    onValueChange={(itemValue) => setFilters({ ...filters, bedrooms: itemValue })}
                >
                    <Picker.Item label="Any Beds" value="any" />
                    <Picker.Item label="1 Bed" value="1" />
                    <Picker.Item label="2 Beds" value="2" />
                    <Picker.Item label="3 Beds" value="3" />
                    <Picker.Item label="3+ Beds" value="3+" />
                </Picker>

            </View>

            <View style={styles.filterRow}>

                <Picker
                    style={styles.picker}
                    selectedValue={filters.baths}
                    onValueChange={(itemValue) => setFilters({ ...filters, baths: itemValue })}
                >
                    <Picker.Item label="Any Baths" value="any" />
                    <Picker.Item label="1 Bath" value="1" />
                    <Picker.Item label="1.5 Baths" value="1.5" />
                    <Picker.Item label="2 Baths" value="2" />
                    <Picker.Item label="2.5 Baths" value="2.5" />
                    <Picker.Item label="3+ Baths" value="3+" />
                </Picker>

                <Picker
                    style={styles.picker}
                    selectedValue={filters.price}
                    onValueChange={(itemValue) => setFilters({ ...filters, price: itemValue })}
                >
                    <Picker.Item label="Any Price" value="any" />
                    <Picker.Item label="$0-500" value="0-500" />
                    <Picker.Item label="$500-1000" value="500-1000" />
                    <Picker.Item label="$1000-2000" value="1000-2000" />
                    <Picker.Item label="$2000-3000"
                        value="2000-3000" />
                    <Picker.Item label="$3000+" value="3000+" />
                </Picker>
            </View> */
        /* <Button title="Open Filters" onPress={() => setModalVisible(true)} /> */
        //     <MapHolder />
        //     <Modal
        //         animationType="slide"
        //         transparent={true}
        //         visible={isModalVisible}
        //         onRequestClose={() => setModalVisible(!isModalVisible)}
        //     >
        //         <View style={styles.centeredView}>
        //             <View style={styles.modalView}>
        //                 <TextInput
        //                     style={styles.input}
        //                     onChangeText={(value) => setFilters({ ...filters, bedrooms: parseInt(value) || 0 })}
        //                     value={filters.bedrooms.toString()}
        //                     keyboardType="number-pad"
        //                     placeholder="Bedrooms"
        //                 />
        //                 <TextInput
        //                     style={styles.input}
        //                     onChangeText={(value) => setFilters({ ...filters, area: parseInt(value) || 0 })}
        //                     value={filters.area.toString()}
        //                     keyboardType="number-pad"
        //                     placeholder="Area (m²)"
        //                 />
        //                 <TouchableOpacity
        //                     style={[styles.button, styles.buttonClose]}
        //                     onPress={() => setModalVisible(!isModalVisible)}
        //                 >
        //                     <Text style={styles.textStyle}>Hide Filters</Text>
        //                 </TouchableOpacity>
        //             </View>
        //         </View>
        //     </Modal>
        // </View>

    );
};

const styles = StyleSheet.create({
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

});

export default Home;
