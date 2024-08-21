import { StyleSheet, Text, View, FlatList, Alert } from 'react-native'
import React, { useState, useEffect, useContext } from 'react'
import { deleteFromDB, getDataById } from '../Firebase/firestoreHelper';
import { collection, onSnapshot, query, where } from 'firebase/firestore';
import { auth, database } from '../Firebase/firebaseSetup';
import PressableItem from '../Components/PressableItem';
import { Colors } from '../Config/Colors';
import Icon from 'react-native-vector-icons/Ionicons';
import { AuthContext } from '../Components/AuthContext';

export default function PostedListings({ navigation }) {
  const [listings, setListings] = useState([]);
  const { language } = useContext(AuthContext);
  const user = auth.currentUser;

  useEffect(() => {
    const unsubscribe = onSnapshot(query(
      collection(database, 'Listing'),
      where('createdBy', '==', user.uid)
    ),
      (querySnapshot) => {
        let newArray = [];
        if (!querySnapshot.empty) {
          querySnapshot.forEach((docSnapShot) => {
            console.log(docSnapShot.id);
            newArray.push({ ...docSnapShot.data(), id: docSnapShot.id });
          });
        }
        setListings(newArray);

      }, (e) => { console.log(e) });

    return () => unsubscribe();
  }, []);

  function handleDeleteListing(listingToBeDeletedID) {
    console.log("Inside handleDeleteListing");

    Alert.alert(
      language === 'zh' ? "确认删除" : "Confirm Delete",
      language === 'zh' ? "您确定要删除此列表吗？" : "Are you sure you want to delete this listing?",
      [
        {
          text: language === 'zh' ? "取消" : "Cancel",
          style: "cancel",
        },
        {
          text: language === 'zh' ? "删除" : "Delete",
          onPress: () => {
            deleteFromDB(listingToBeDeletedID, 'Listing');
          },
          style: "destructive",
        },
      ]
    );
  }

  async function handleEditListing(listingToBeEditedID) {
    console.log("Inside handleEditListing");

    try {
      const listingData = await getDataById(listingToBeEditedID, 'Listing');
      listingData.id = listingToBeEditedID;
      console.log("listingData before navigating to PostListing page: ", listingData);
      navigation.navigate('PostListing', { listingData: listingData });
    } catch (error) {
      console.error('Error in navigating to editing listing page:', error);
    }
  }

  function handleZeroVisitRequestCounterPress() {
    Alert.alert(language === 'zh' ? '无请求' : 'No requests', language === 'zh' ? '此列表尚无观看请求。' : 'There are no viewing requests for this listing yet.', [
      { text: 'Ok', style: 'default' },
    ]);
  }

  console.log('listingss value in PostedListing: ', listings);
  return (
    <View>
      {listings.length === 0 ? (
        <Text style={styles.text}>{language === 'zh' ? '您尚未发布任何列表。' : 'You have not posted any listings yet.'}</Text>
      ) : (
        <FlatList
          data={listings}
          renderItem={({ item }) => (
            <View style={styles.container}>
              <View style={styles.listingDetails}>
                <Text style={styles.info}>{language === 'zh' ? '位置: ' : 'Location: '}{item.location}</Text>
                <Text style={styles.info}>{language === 'zh' ? '价格: ' : 'Price: '}C$ {item.price}/mo</Text>
                <Text style={styles.info}>{language === 'zh' ? '类型: ' : 'Type: '}{item.type}</Text>
                {item.visitRequests ? (
                  <PressableItem
                    onPress={async () => await handlePostiveVisitRequestCounterPress(item.visitRequests, item.id)}
                    style={[styles.editDeleteButtonStyle, { backgroundColor: Colors.shadowColor, marginHorizontal: 0, marginVertical: 5, width: '64%' }]}
                  >
                    <Text style={{ color: Colors.background }}>{language === 'zh' ? '观看请求: ' : 'Viewing Requests: '}{item.visitRequests.length}</Text>
                  </PressableItem>
                ) : (
                  <PressableItem
                    onPress={handleZeroVisitRequestCounterPress}
                    style={[styles.editDeleteButtonStyle, { backgroundColor: Colors.shadowColor, marginHorizontal: 0, marginVertical: 5, width: '64%' }]}
                  >
                    <Text style={{ color: Colors.background }}>{language === 'zh' ? '观看请求: 0' : 'Viewing Requests: 0'}</Text>
                  </PressableItem>
                )}
              </View>
              <View style={styles.editDeleteButtonContainer}>
                <PressableItem onPress={() => handleEditListing(item.id)} style={styles.editDeleteButtonStyle}>
                  <Icon name="pencil" size={24} color={Colors.blue} />
                </PressableItem>
                <PressableItem onPress={() => handleDeleteListing(item.id)} style={styles.editDeleteButtonStyle}>
                  <Icon name="trash" size={24} color={Colors.red} />
                </PressableItem>
              </View>
            </View>
          )}
          keyExtractor={item => item.id.toString()}
        />
      )}
    </View>
  );
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