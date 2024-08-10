import { StyleSheet, Text, View, FlatList } from 'react-native'
import React, { useState, useEffect } from 'react'
import { deleteFromDB } from '../Firebase/firestoreHelper';
import { collection, onSnapshot, query } from 'firebase/firestore';
import { database } from '../Firebase/firebaseSetup';
import { doc, getDoc } from 'firebase/firestore';
import PressableItem from '../Components/PressableItem';
import { Colors } from '../Config/Colors';
import Icon from 'react-native-vector-icons/Ionicons';


export default function PostedListings({ navigation }) {

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

  function handleDeleteListing(listingToBeDeletedID) {
    console.log("Inside handleDeleteListing")
    deleteFromDB(listingToBeDeletedID, 'Listing')
  }

  async function handleEditListing(listingToBeEditedID) {
    console.log("Inside handleEditListing")

    try {
      const listingRef = doc(database, 'Listing', listingToBeEditedID);
      const docSnap = await getDoc(listingRef);

      if (docSnap.exists()) {
        const listingData = docSnap.data();
        listingData.id = listingToBeEditedID
        console.log("listingData before navigating to PostListing page: ", listingData)
        navigation.navigate('PostListing', { listingData: listingData });
      }

    } catch (error) {
      console.error('Error in navigating to editing listing page:', error);
    }

  }

  return (
    <View>

      {listings.length === 0 ? (
        <Text style={styles.text}>You have not posted any listings yet</Text>
      ) :
        (
          <FlatList data={listings}
            renderItem={({ item }) => {
              console.log(item)
              return (
                <View style={styles.container}>
                  <View style={styles.listingDetails}>
                    <Text style={styles.info}>Location: {item.location}</Text>
                    <Text style={styles.info}>Price: {item.price}</Text>
                    <Text style={styles.info}>Type: {item.type}</Text>
                  </View>

                  <View style={styles.editDeleteButtonContainer}>
                    <PressableItem onPress={() => { handleEditListing(item.id) }} style={styles.editDeleteButtonStyle} >
                      <Icon name="pencil" size={24} color={Colors.blue} />
                    </PressableItem>
                    <PressableItem onPress={() => { handleDeleteListing(item.id) }} style={styles.editDeleteButtonStyle} >
                      <Icon name="trash" size={24} color={Colors.red} />
                    </PressableItem>
                  </View>

                </View>
              )
            }}
          />
        )
      }
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    marginHorizontal: 15,
    paddingVertical: 3,
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    flex: 3
  },
  listingDetails: {
    flex: 2,
    marginVertical: 5
  },
  info: {
    fontSize: 16,
    color: '#666',
    marginBottom: 5,
  },
  editDeleteButtonStyle: {
    margin: 5,
    backgroundColor: 'transparent',
  },
  editDeleteButtonContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-end',
  }

})