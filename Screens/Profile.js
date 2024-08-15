import React, { useEffect, useState, useContext } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Modal, TextInput, Button, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { auth, database } from '../Firebase/firebaseSetup'; 
import { doc, getDoc } from 'firebase/firestore'; 
import { editToDB } from '../Firebase/firestoreHelper'; 
import { AuthContext } from '../Components/AuthContext';

const Profile = ({ navigation }) => {
  const [userData, setUserData] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [name, setName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const { user } = useContext(AuthContext);

  useEffect(() => {
    const fetchUserData = async () => {
      if (user) {
        const userDocRef = doc(database, 'User', user.uid);
        const userDoc = await getDoc(userDocRef);

        if (userDoc.exists()) {
          const data = userDoc.data();
          setUserData(data);
          setName(data.name || '');
          setPhoneNumber(data.phoneNumber || '');
        } else {
          console.log("No such document!");
        }
      }
    };

    fetchUserData();
  }, [user]);

  const handleSave = async () => {
    if (user) {
      try {
        await editToDB(user.uid, { name, phoneNumber }, 'User');
        setUserData({ ...userData, name, phoneNumber });
        setIsModalVisible(false);
      } catch (error) {
        console.error("Failed to update profile:", error);
      }
    }
  };

  const handleNavigation = (screen) => {
    if (user) {
      navigation.navigate(screen);
    } else {
      Alert.alert("Access Denied", "You need to log in to access this feature.");
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Profile</Text>
        <TouchableOpacity style={styles.editButton} onPress={() => setIsModalVisible(true)}>
          <Icon name="edit" size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      {user ? (
        <>
          <Text style={styles.info}>UID: {user.uid}</Text>
          <Text style={styles.info}>Name: {userData?.name || 'N/A'}</Text>
          <Text style={styles.info}>Contact Info: {user.email}</Text>
          <Text style={styles.info}>Phone Number: {userData?.phoneNumber || 'N/A'}</Text>
        </>
      ) : (
        <>
          <Text style={styles.info}>UID: Temp UID</Text>
          <Text style={styles.info}>Name: Temp User</Text>
          <Text style={styles.info}>Contact Info: N/A</Text>
          <Text style={styles.info}>Phone Number: N/A</Text>
        </>
      )}

      <TouchableOpacity style={styles.button} onPress={() => handleNavigation('Saved')}>
        <Text style={styles.buttonText}>Saved Listings</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={() => handleNavigation('PostedListings')}>
        <Text style={styles.buttonText}>My Posted Listings</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={() => handleNavigation('ScheduledVisits')}>
        <Text style={styles.buttonText}>My Scheduled Visits</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={() => handleNavigation('PostListing')}>
        <Text style={styles.buttonText}>Post a listing</Text>
      </TouchableOpacity>

      <Modal
        animationType="slide"
        transparent={true}
        visible={isModalVisible}
        onRequestClose={() => {
          setIsModalVisible(false);
        }}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalView}>
            <Text style={styles.modalTitle}>Edit Profile</Text>
            <TextInput
              style={styles.input}
              placeholder="Name"
              placeholderTextColor="gray"
              value={name}
              onChangeText={setName}
            />
            <TextInput
              style={styles.input}
              placeholder="Phone Number"
              placeholderTextColor="gray"
              value={phoneNumber}
              onChangeText={setPhoneNumber}
              keyboardType="phone-pad"
            />
            <Button title="Save" onPress={handleSave} />
            <Button title="Cancel" color="red" onPress={() => setIsModalVisible(false)} />
          </View>
        </View>
      </Modal>
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
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalView: {
    width: 300,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  input: {
    width: '100%',
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 15,
  },
});
