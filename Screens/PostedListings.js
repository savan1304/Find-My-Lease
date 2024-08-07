import { StyleSheet, Text, View, FlatList } from 'react-native'
import React, { useState, useEffect } from 'react'
import { deleteFromDB, writeToDB } from '../Firebase/firestoreHelper';
import { collection, onSnapshot, where, query } from 'firebase/firestore';
import { auth, database, storage } from '../Firebase/firebaseSetup';
import { ref } from 'firebase/storage';
import { uploadBytesResumable } from 'firebase/storage';
import HouseListItem from '../Components/HouseListItem';
import { getDoc } from 'firebase/firestore';
import { doc } from 'firebase/firestore';


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

  function handlePressListing() {
    console.log("Listing pressed")
  }

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
              // don't need the key={item.id} here since we are not rendering the list manually anymore
              return (
                <HouseListItem listing={item} onPress={handlePressListing} deleteHandler={handleDeleteListing} editHandler={handleEditListing} />
              )
            }}
          />
        )
      }
    </View>
  )
}

const styles = StyleSheet.create({})