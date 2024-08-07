import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';

const HouseListItem = ({ listing, onPress }) => {

    return (

        <View>
            <Pressable style={({ pressed }) => {
                return [styles.horizontalContainer, pressed && styles.pressedStyle]
            }}
                onPress={() => { onPress() }} android_ripple={{ color: 'pink' }}
            >
                <Text>Location: {listing.location}</Text>
                <Text>Price: {listing.price}</Text>
                <Text>Type: {listing.type}</Text>
                <Text>Area (Sqft): {listing.area}</Text>
                <Text>Bed: {listing.bed}</Text>
                <Text>Bath: {listing.bath}</Text>
                {listing.petFriendly ? (
                    <Text>Pet Friendly: Yes</Text>
                ) : (
                    <Text>Pet Friendly: No</Text>
                )
                }
                <Text>Preffered Gender: {listing.tenantGender}</Text>
                <Text>Transit connectivity: {listing.transit}</Text>
                <Text>Year of Construction: {listing.year}</Text>

            </Pressable>
        </View>
        // <TouchableOpacity onPress={() => onPress(house)} style={styles.container}>
        //     <View style={styles.left}>
        //         <Text style={styles.houseName}>{house.name}</Text>
        //         <AntDesign name="home" size={24} color="black" />
        //     </View>
        //     <View style={styles.right}>
        //         <Text style={styles.info}>Bedrooms: {house.bedrooms}</Text>
        //         <Text style={styles.info}>Area: {house.area}</Text>
        //         <Text style={styles.info}>Price: {house.price}</Text>
        //     </View>
        // </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        padding: 10,
        justifyContent: 'space-between',
        alignItems: 'center',
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
    },
    left: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    right: {
        flex: 1,
        alignItems: 'flex-end',
    },
    houseName: {
        fontSize: 18,
        fontWeight: 'bold',
        marginRight: 10,
    },
    info: {
        fontSize: 16,
        color: '#666',
        marginBottom: 5,
    },
    editDeleteButtonStyle: {
        margin: 5,
        padding: 5,
        backgroundColor: 'transparent'
    }
});

export default HouseListItem;
