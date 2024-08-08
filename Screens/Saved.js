import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image } from 'react-native';
import { collection, query, onSnapshot } from 'firebase/firestore';
import { database, auth } from '../Firebase/firebaseSetup';

const Saved = ({ navigation }) => {
  const [savedHouses, setSavedHouses] = useState([]);

  useEffect(() => {
    const user = auth.currentUser;
    if (user) {
      const q = query(collection(database, `User/${user.uid}/saved`));
      const unsubscribe = onSnapshot(q, (querySnapshot) => {
        let newArray = [];
        querySnapshot.forEach((doc) => {
          newArray.push({ ...doc.data(), id: doc.id });
        });
        setSavedHouses(newArray);
      });

      return () => unsubscribe(); // Detach the listener when component unmounts
    }
  }, []);

  const handleHousePress = (house) => {
    console.log('House selected:', house);
    navigation.navigate('HouseDetails', { house });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Saved Listings</Text>
      {savedHouses.length > 0 ? (
        <FlatList
          data={savedHouses}
          renderItem={({ item }) => (
            <TouchableOpacity style={styles.item} onPress={() => handleHousePress(item)}>
              <Image source={{ uri: item.imageUri || 'https://via.placeholder.com/150' }} style={styles.image} />
              <View style={styles.info}>
                <Text style={styles.title}>{item.location}</Text>
                <Text>{item.price}</Text>
                <Text>{item.bed} Bed, {item.bath} Bath</Text>
              </View>
            </TouchableOpacity>
          )}
          keyExtractor={item => item.id}
        />
      ) : (
        <Text>No saved listings found.</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  item: {
    flexDirection: 'row',
    marginBottom: 20,
    backgroundColor: '#f9f9f9',
    padding: 10,
    borderRadius: 5,
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 10,
    marginRight: 10,
  },
  info: {
    justifyContent: 'center',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default Saved;
