import React, { useState, useEffect, useContext } from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { collection, query, onSnapshot, doc, getDoc } from 'firebase/firestore';
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
      });
    };

    
    const fetchSavedIds = async () => {
      if (user) {
        const userRef = doc(database, `User/${user.uid}`);
        const docSnap = await getDoc(userRef);
        if (docSnap.exists() && docSnap.data().savedHouses) {
          setSavedIds(docSnap.data().savedHouses);
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

  return (
    <View style={styles.container}>
      {filteredHouses.length > 0 ? (
        <FlatList
          data={filteredHouses}
          renderItem={({ item }) => (
            <HouseListItem
              house={item}
              onPress={() => handleHousePress(item)}
            />
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
  }
});

export default Saved;
