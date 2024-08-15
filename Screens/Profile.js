import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { auth, database } from '../Firebase/firebaseSetup'; 
import { doc, getDoc } from 'firebase/firestore'; 

const Profile = ({ navigation }) => {
  const [userData, setUserData] = useState(null);
  const user = auth.currentUser;

  useEffect(() => {
    const fetchUserData = async () => {
      if (user) {
        const userDocRef = doc(database, 'User', user.uid);
        const userDoc = await getDoc(userDocRef);

        if (userDoc.exists()) {
          setUserData(userDoc.data());
        } else {
          console.log("No such document!");
        }
      }
    };

    fetchUserData();
  }, [user]);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Profile</Text>
        <TouchableOpacity style={styles.editButton} onPress={() => console.log('Edit Pressed')}>
          <Icon name="edit" size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      {user ? (
        <>
          <Text style={styles.info}>UID: {user.uid}</Text>
          <Text style={styles.info}>Name: {userData?.name || 'N/A'}</Text>
          <Text style={styles.info}>Contact Info: {user.email}</Text>
        </>
      ) : (
        <>
          <Text style={styles.info}>UID: Temp UID</Text>
          <Text style={styles.info}>Name: Temp User</Text>
          <Text style={styles.info}>Contact Info: N/A</Text>
        </>
      )}

      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Saved')}>
        <Text style={styles.buttonText}>Saved Listings</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('PostedListings')}>
        <Text style={styles.buttonText}>My Posted Listings</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('ScheduledVisits')}>
        <Text style={styles.buttonText}>My Scheduled Visits</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('PostListing')}>
        <Text style={styles.buttonText}>Post a listing</Text>
      </TouchableOpacity>
    </View>
  );
}

export default Profile;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f9f9f9',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  editButton: {
    backgroundColor: 'red',
    padding: 8,
    borderRadius: 10,
  },
  info: {
    fontSize: 16,
    marginVertical: 8,
  },
  button: {
    backgroundColor: '#007BFF',
    padding: 10,
    marginVertical: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
  },
});
