import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { auth } from '../Firebase/firebaseSetup';

const Profile = ({ navigation }) => {
  const user = auth.currentUser;


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
          <Text style={styles.info}>Name: </Text>
          <Text style={styles.info}>Contact Info: {user.email}</Text>
        </>
      ) : (
        <>
          <Text style={styles.info}>Name: </Text>
          <Text style={styles.info}>Contact Info:</Text>
        </>
      )}

      <TouchableOpacity style={styles.button} onPress={() => console.log('Navigate to Saved Listings')}>
        <Text style={styles.buttonText}>Saved Listings</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('PostedListings')}>
        <Text style={styles.buttonText}>My Posted Listings</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={() => console.log('Navigate to My Scheduled Visits')}>
        <Text style={styles.buttonText}>My Scheduled Visits</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('PostListing')}>
        <Text style={styles.buttonText}>Post a listing</Text>
      </TouchableOpacity>
    </View>
  )
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
