import React, { useEffect, useState, useContext } from 'react';
import { StyleSheet, Text, View, Modal, TextInput, Button, Alert, ScrollView, Dimensions } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { database } from '../Firebase/firebaseSetup';
import { doc, getDoc } from 'firebase/firestore';
import { editToDB } from '../Firebase/firestoreHelper';
import { AuthContext } from '../Components/AuthContext';
import PressableItem from '../Components/PressableItem';
import { EmailAuthProvider, reauthenticateWithCredential } from 'firebase/auth';

const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;

const Profile = ({ navigation }) => {
  const [userData, setUserData] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
  const [showPasswordInput, setShowPasswordInput] = useState(false);
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const { user, language } = useContext(AuthContext);

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
      Alert.alert(language === 'zh' ? '需要登录' : 'Login Required', language === 'zh' ? '您需要登录才能执行此操作。' : 'You need to be logged in to perform this action.', [
        { text: language === 'zh' ? '取消' : 'Cancel', style: 'cancel' },
        { text: language === 'zh' ? '登录' : 'Login', onPress: () => navigation.navigate('Login') }
      ]);
    }
  };

  const handleProceed = () => {
    setShowPasswordInput(true);
  };

  const handleDelete = async () => {
    Alert.alert(
      "Final Confirmation",
      "Are you sure you want to delete your account? This action cannot be undone.",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Delete",
          onPress: async () => {
            try {
              const credential = EmailAuthProvider.credential(user.email, password);
              await reauthenticateWithCredential(user, credential);

              // Delete the user document from Firestore
              const userDocRef = doc(database, 'User', user.uid);
              await deleteDoc(userDocRef);

              // Delete the user from Firebase Authentication
              await user.delete();

              // Navigate to the 'SignUp' screen
              navigation.navigate('My Home');

              // Close the modal
              setIsDeleteModalVisible(false);
            } catch (error) {
              console.error("Error deleting account:", error);
              // Handle errors appropriately (e.g., show an error message to the user)
            }
          },
          style: "destructive",
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.profileDetailsContainer}>
          {user ? (
            <>
              <Text style={styles.info}>{language === 'zh' ? '用户ID: ' : 'UID: '}{user.uid}</Text>
              <Text style={styles.info}>{language === 'zh' ? '姓名: ' : 'Name: '}{userData?.name || 'N/A'}</Text>
              {/* needs translation below */}
              <Text style={styles.info}>{language === 'zh' ? '联系方式: ' : 'Email: '}{user.email}</Text>
              <Text style={styles.info}>{language === 'zh' ? '电话号码: ' : 'Phone Number: '}{userData?.phoneNumber || 'N/A'}</Text>
            </>
          ) : (
            <>
              <Text style={styles.info}>{language === 'zh' ? '用户ID: ' : 'UID: '}Temp UID</Text>
              <Text style={styles.info}>{language === 'zh' ? '姓名: ' : 'Name: '}Temp User</Text>
              <Text style={styles.info}>{language === 'zh' ? '联系方式: ' : 'Email: '}N/A</Text>
              <Text style={styles.info}>{language === 'zh' ? '电话号码: ' : 'Phone Number: '}N/A</Text>
            </>
          )}
        </View>

        <PressableItem style={styles.editButton} onPress={() => setIsModalVisible(true)}>
          <Ionicons name="pencil" size={24} color="rgb(0, 122, 255)" />
        </PressableItem>
      </View>

      <View style={styles.profileOptionsContainer}>
        <PressableItem style={styles.button} onPress={() => handleNavigation('PostListing')}>
          <Text style={styles.buttonText}>{language === 'zh' ? '发布列表' : 'Post a listing'} </Text>
        </PressableItem>
        <PressableItem style={styles.button} onPress={() => handleNavigation('PostedListings')}>
          <Text style={styles.buttonText}>{language === 'zh' ? '我的已发布列表' : 'My Posted Listings'} </Text>
        </PressableItem>
        <PressableItem style={styles.button} onPress={() => handleNavigation('ScheduledVisits')}>
          <Text style={styles.buttonText}>{language === 'zh' ? '我的预定访问' : 'My Scheduled Visits'} </Text>
        </PressableItem>
      </View>

      {user && user.uid && (
        <View style={styles.profileOptionsContainer}>
          <PressableItem style={[styles.button, { backgroundColor: 'rgb(255, 59, 48)' }]} onPress={() => setIsDeleteModalVisible(true)}>
            <Text style={styles.buttonText}>Delete My Account</Text>
          </PressableItem>
        </View>
      )}

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
              <Text style={styles.modalTitle}>{language === 'zh' ? '编辑个人资料' : 'Edit Profile'} </Text>
              <TextInput
                style={styles.input}
                placeholder={language === 'zh' ? '姓名' : 'Name'}
                placeholderTextColor="gray"
                value={name}
                onChangeText={setName}
              />
              <TextInput
                style={styles.input}
                placeholder={language === 'zh' ? '电话号码' : 'Phone Number'}
                placeholderTextColor="gray"
                value={phoneNumber}
                onChangeText={setPhoneNumber}
                keyboardType="phone-pad"
              />

              <View style={styles.accountActionsContainer}>
                <PressableItem style={styles.cancelButton} onPress={() => setIsModalVisible(false)}>
                  <Text style={styles.buttonText}>{language === 'zh' ? '取消' : 'Cancel'} </Text>
                </PressableItem>
                <PressableItem style={styles.saveButton} onPress={handleSave}>
                  <Text style={styles.buttonText}>{language === 'zh' ? '保存' : 'Save'} </Text>
                </PressableItem>
              </View>

            </View>
          </ScrollView>
        </View>
      </Modal>

      {/* needs translation in the modal component below */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={isDeleteModalVisible}
        onRequestClose={() => {
          setIsModalVisible(false);
        }}
      >
        <View style={styles.modalContainer}>
          <ScrollView contentContainerStyle={{ flex: 1, justifyContent: 'center', alignItems: 'center' }} keyboardShouldPersistTaps='handled'>
            <View style={styles.modalView}>
              <Text style={styles.modalTitle}>Delete Account</Text>
              <Text style={[styles.info, { color: 'rgb(255, 59, 48)', fontWeight: '600' }]}>You will lose all your visits and saved or posted listings! {"\n"}Are you sure you want to proceed?</Text>


              {!showPasswordInput && (
                <View style={styles.accountActionsContainer}>
                  <PressableItem style={styles.cancelButton} onPress={() => { setIsDeleteModalVisible(false); setShowPasswordInput(false) }}>
                    <Text style={styles.buttonText}>Cancel</Text>
                  </PressableItem>
                  <PressableItem style={styles.saveButton} onPress={handleProceed}>
                    <Text style={styles.buttonText}>Proceed</Text>
                  </PressableItem>
                </View>
              )}

              {showPasswordInput && (
                <>
                  <TextInput
                    style={styles.input}
                    placeholder="Enter your password to confirm"
                    placeholderTextColor="gray"
                    secureTextEntry
                    value={password}
                    onChangeText={setPassword}
                  />
                  <View style={styles.accountActionsContainer}>
                    <PressableItem style={styles.cancelButton} onPress={() => { setIsDeleteModalVisible(false); setShowPasswordInput(false) }}>
                      <Text style={styles.buttonText}>Cancel</Text>
                    </PressableItem>
                    <PressableItem style={styles.saveButton} onPress={handleDelete}>
                      <Text style={styles.buttonText}>Delete</Text>
                    </PressableItem>
                  </View>
                </>
              )}
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
    marginBottom: 10,
    width: '35%'
  },
  cancelButton: {
    backgroundColor: 'rgb(255, 59, 48)',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    width: '35%',
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
    width: screenWidth * .8,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 20,
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
  accountActionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 25
  }
});
