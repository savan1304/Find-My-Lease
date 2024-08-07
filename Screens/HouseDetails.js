import React from 'react';
import { View, Text, StyleSheet, Button, FlatList, Image } from 'react-native';

const HouseDetails = ({ route, navigation }) => {
    const { house } = route.params;
    const sampleImages = [
        'https://via.placeholder.com/200x200.png?text=House+1',
        'https://via.placeholder.com/200x200.png?text=House+2',
        'https://via.placeholder.com/200x200.png?text=House+3',
        'https://via.placeholder.com/200x200.png?text=House+4'
    ];

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
    },
    imageList: {
        height: 220,
        flexGrow: 0, // prevent it from taking up any unnecessary space
    },
    image: {
        width: 200,
        height: 200,
        marginRight: 10,
        borderRadius: 10, // optional, for rounded corners
    }
});

export default HouseDetails;
