import React, { useState, useEffect, useContext } from 'react';
import { View, Text, StyleSheet, FlatList, Button, Alert } from 'react-native';
import { collection, query, onSnapshot, doc, getDoc, updateDoc } from 'firebase/firestore';
import { database } from '../Firebase/firebaseSetup';
import { AuthContext } from '../Components/AuthContext';
import HouseListItem from '../Components/HouseListItem';

const Saved = ({ navigation }) => {
  const { user } = useContext(AuthContext);
  const [houses, setHouses] = useState([]);
  const [savedIds, setSavedIds] = useState([]);

  useEffect(() => {
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

    const fetchSavedIds = async () => {
      if (user) {
        const userRef = doc(database, `User/${user.uid}`);
        const docSnap = await getDoc(userRef);
        if (docSnap.exists() && docSnap.data().savedHouses) {
          setSavedIds(docSnap.data().savedHouses);
          console.log("Fetched saved IDs:", docSnap.data().savedHouses);
        } else {
          setSavedIds([]);
        }
      }
    };

    const housesUnsub = fetchHouses();
    fetchSavedIds(); 

    return () => housesUnsub();
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
              <Button
                title="Remove"
                color="red"
                onPress={() => confirmRemove(item.id)}
              />
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
  }
});

export default Saved;
