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
  const { user, language } = useContext(AuthContext);
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
    let housesUnsub = () => {};
    let savedIdsUnsub = () => {};
    if(user){
      housesUnsub = fetchHouses();
      savedIdsUnsub = fetchSavedIds();
    } else{
      setHouses([]);
      setSavedIds([]);
    }
    return () => {
      housesUnsub();
      savedIdsUnsub();
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
      language === 'zh' ? '移除列表' : "Remove Listing",
      language === 'zh' ? '您确定要从已保存的列表中移除此列表吗？' : "Are you sure you want to remove this listing from your saved?",
      [
        { text: language === 'zh' ? '取消' : "Cancel", style: "cancel" },
        { text: language === 'zh' ? '移除' : "Remove", onPress: () => handleRemoveSaved(houseId), style: "destructive" }
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
                <Text style={styles.buttonText}>{language === 'zh' ? '移除' : 'Remove'} </Text>
              </PressableItem>
            </View>
          )}
          keyExtractor={item => item.id}
        />
      ) : (
        <View style={styles.noItemsContainer}>
          <View style={styles.noItemsTextContainer}>
            {/* need translation below */}
            <Text style={styles.noItemsText}>
              {language === 'zh' ? '没有保存的房源！\n浏览可用房源并进行保存。' : 'No saved listings found! \nExplore the available listings to save them.'}
            </Text>

          </View>
          <PressableItem onPress={() => { navigation.navigate('My Home') }} style={{ width: '35%', alignItems: 'center' }}>
            <Text style={styles.buttonText}>Explore</Text>
          </PressableItem>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  listItemContainer: {
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  removeButton: {
    backgroundColor: 'rgb(255, 59, 48)',
    borderRadius: 5,
    width: '35%',
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    textAlign: 'center'
  },
  noItemsContainer: {
    flex: 1,
    alignItems: 'center',
    marginVertical: 20,
  },
  noItemsTextContainer: {
    marginBottom: 25
  },
  noItemsText: {
    fontWeight: '600',
    fontSize: 16,
    textAlign: 'center',
  }
});

export default Saved;
