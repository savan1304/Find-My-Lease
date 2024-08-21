import React, { useEffect, useState, useContext } from 'react';
import { StyleSheet, Text, View, Modal, TextInput, Button, Alert, ScrollView, Dimensions } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { auth, database } from '../Firebase/firebaseSetup';
import { doc, getDoc } from 'firebase/firestore';
import { editToDB } from '../Firebase/firestoreHelper';
import { AuthContext } from '../Components/AuthContext';
import PressableItem from '../Components/PressableItem';

const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;

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
      Alert.alert('Login Required', 'You need to be logged in to perform this action.', [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Login', onPress: () => navigation.navigate('Login') }
      ]);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.profileDetailsContainer}>
          {user ? (
            <>
              <Text style={styles.info}>UID: {user.uid}</Text>
              <Text style={styles.info}>Name: {userData?.name || 'N/A'}</Text>
              <Text style={styles.info}>Email: {user.email}</Text>
              <Text style={styles.info}>Phone Number: {userData?.phoneNumber || 'N/A'}</Text>
            </>
          ) : (
            <>
              <Text style={styles.info}>UID: Temp UID</Text>
              <Text style={styles.info}>Name: Temp User</Text>
              <Text style={styles.info}>Email: N/A</Text>
              <Text style={styles.info}>Phone Number: N/A</Text>
            </>
          )}
        </View>
        <PressableItem style={styles.editButton} onPress={() => setIsModalVisible(true)}>
          <Ionicons name="pencil" size={24} color="rgb(0, 122, 255)" />
        </PressableItem>
      </View>

      <View style={styles.profileOptionsContainer}>
        <PressableItem style={styles.button} onPress={() => handleNavigation('PostListing')}>
          <Text style={styles.buttonText}>Post a listing</Text>
        </PressableItem>
        <PressableItem style={styles.button} onPress={() => handleNavigation('PostedListings')}>
          <Text style={styles.buttonText}>My Posted Listings</Text>
        </PressableItem>
        <PressableItem style={styles.button} onPress={() => handleNavigation('ScheduledVisits')}>
          <Text style={styles.buttonText}>My Scheduled Visits</Text>
        </PressableItem>
      </View>

      <Modal
        animationType="slide"
        transparent={true}
        visible={isModalVisible}
        onRequestClose={() => {
          setIsModalVisible(false);
        }}
      >

        <View style={styles.modalContainer}>
          <ScrollView contentContainerStyle={{ flex: 1, justifyContent: 'center', alignItems: 'center' }} keyboardShouldPersistTaps='handled'>
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

              <PressableItem style={styles.saveButton} onPress={handleSave}>
                <Text style={styles.buttonText}>Save</Text>
              </PressableItem>
              <PressableItem style={styles.cancelButton} onPress={() => setIsModalVisible(false)}>
                <Text style={styles.buttonText}>Cancel</Text>
              </PressableItem>
            </View>
          </ScrollView>
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
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  profileDetailsContainer: {
    flex: 3
  },
  profileOptionsContainer: {
    alignItems: 'center',
    marginTop: 25,
    justifyContent: 'center',
  },
  button: {
    margin: 10,
    width: '52%',
    alignItems: 'center'
  },
  editButton: {
    backgroundColor: 'transparent',
    padding: 8,
    borderRadius: 10,
    marginRight: 0,
  },
  info: {
    fontSize: 16,
    marginVertical: 8,
  },
  saveButton: {
    backgroundColor: '#007BFF',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginBottom: 10
  },
  cancelButton: {
    backgroundColor: 'red',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center'
  },
  buttonText: {
    color: 'white',
    fontSize: 16
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalView: {
    width: screenWidth * .7,
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
