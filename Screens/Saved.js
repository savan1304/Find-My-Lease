import React, { useState, useEffect, useContext } from 'react';
import { View, Text, StyleSheet, FlatList, Button, Alert, Dimensions } from 'react-native';
import { collection, query, onSnapshot, doc, getDoc, updateDoc } from 'firebase/firestore';
import { database } from '../Firebase/firebaseSetup';
import { AuthContext } from '../Components/AuthContext';
import HouseListItem from '../Components/HouseListItem';
import PressableItem from '../Components/PressableItem';

const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;

const Saved = ({ navigation }) => {
  const { user } = useContext(AuthContext);
  const [houses, setHouses] = useState([]);
  const [savedIds, setSavedIds] = useState([]);

  const fetchHouses = () => {
    const q = query(collection(database, 'Listing'));
    return onSnapshot(q, (querySnapshot) => {
      let houseData = [];
      querySnapshot.forEach(doc => {
        houseData.push({ ...doc.data(), id: doc.id });
      });
      setHouses(houseData);
      console.log("Fetched houses:", houseData);
    });
  };

  const fetchSavedIds = () => {
    if (user) {
      const userRef = doc(database, `User/${user.uid}`);
      return onSnapshot(userRef, (docSnap) => {
        if (docSnap.exists() && docSnap.data().savedHouses) {
          setSavedIds(docSnap.data().savedHouses);
          console.log("Fetched and updated saved IDs:", docSnap.data().savedHouses);
        } else {
          setSavedIds([]);
        }
      });
    }
    return undefined; 
  };
  
  useEffect(() => {
    const housesUnsub = fetchHouses();
    const savedIdsUnsub = fetchSavedIds(); 
  
    return () => {
      housesUnsub();
      if (savedIdsUnsub) {
        savedIdsUnsub(); 
      }
    };
  }, [user]);
  

  const filteredHouses = houses.filter(house => savedIds.includes(house.id));

  const handleHousePress = (house) => {
    navigation.navigate('HouseDetails', { house });
  };

  const handleRemoveSaved = async (houseId) => {
    const updatedSavedIds = savedIds.filter(id => id !== houseId);
    setSavedIds(updatedSavedIds);

    const userRef = doc(database, `User/${user.uid}`);
    await updateDoc(userRef, {
      savedHouses: updatedSavedIds
    });
  };

  const confirmRemove = (houseId) => {
    Alert.alert(
      "Remove Listing",
      "Are you sure you want to remove this listing from your saved?",
      [
        { text: "Cancel", style: "cancel" },
        { text: "Remove", onPress: () => handleRemoveSaved(houseId), style: "destructive" }
      ]
    );
  };

  return (
    <View style={styles.container}>
      {filteredHouses.length > 0 ? (
        <FlatList
          data={filteredHouses}
          renderItem={({ item }) => (
            <View style={styles.listItemContainer}>
              <HouseListItem
                house={item}
                onPress={() => handleHousePress(item)}
              />
              <PressableItem onPress={() => confirmRemove(item.id)} style={styles.removeButton}>
                  <Text style={styles.buttonText}>Remove</Text>
              </PressableItem>
            </View>
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
  listItemContainer: {
    flexDirection: 'column', 
    justifyContent: 'space-between',
    alignItems: 'stretch', 
    marginBottom: 10,
    padding: 10,
    borderWidth: 1, 
    borderColor: '#ccc', 
  },
  removeButton: {
    backgroundColor: 'red',
    padding: 10,
    borderRadius: 5,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    textAlign: 'center'
  },
});

export default Saved;
