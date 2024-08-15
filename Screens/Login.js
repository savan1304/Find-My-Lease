import React, { useState } from 'react';
import { Text, View, TextInput, Alert, Modal, StyleSheet, Button } from 'react-native';
import { signInWithEmailAndPassword, sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '../Firebase/firebaseSetup';
import PressableItem from '../Components/PressableItem';
import { SafeAreaView } from 'react-native-safe-area-context';
import { appStyles } from '../Config/Styles';
import { MaterialIcons } from '@expo/vector-icons'; 

export default function Login({ navigation }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [resetEmail, setResetEmail] = useState('');

    const loginHandler = async () => {
        console.log("Attempting to login");
        if (!email) {
            Alert.alert('Validation Error', 'Email should not be empty');
            return;
        }
        if (!password) {
            Alert.alert('Validation Error', 'Password should not be empty');
            return;
        }
        setIsLoading(true);
        try {
            const userCred = await signInWithEmailAndPassword(auth, email, password);
            console.log("Login successful: ", userCred);
            setIsLoading(false);
            navigation.navigate('HomeMain');
        } catch (err) {
            setIsLoading(false);
            Alert.alert('Login Error', err.message);
        }
    };

    const signupHandler = () => {
        console.log("Navigating to signup");
        navigation.replace("Signup");
    };

    const handleForgotPassword = () => {
        if (!resetEmail) {
            Alert.alert("Input required", "Please enter your email address to reset your password.");
            return;
        }
        sendPasswordResetEmail(auth, resetEmail)
            .then(() => {
                Alert.alert("Check your email", "A link to reset your password has been sent to your email.");
                setModalVisible(false); 
                setResetEmail(''); 
            })
            .catch((error) => {
                Alert.alert("Error", error.message);
            });
    };

    return (
        <SafeAreaView style={appStyles.loginSignUpContainer}>
            <View style={styles.iconContainer}>
                <MaterialIcons name="apartment" size={64} color="blue" />
            </View>
            <View style={styles.introContainer}>
                <Text style={styles.introText}>
                    Welcome back to FindMyLease! Continue your journey to find the perfect place to rent or manage your property rentals with ease. Log in now to access your account and all the features of FindMyLease!
                </Text>
            </View>
            <View>
                <View style={appStyles.loginSignUpFieldContainer}>
                    <Text>Email</Text>
                    <View style={appStyles.loginSignUpInput}>
                        <TextInput
                            placeholder="Email"
                            value={email}
                            autoCorrect={false}
                            autoCapitalize="none"
                            onChangeText={setEmail}
                        />
                    </View>
                </View>

                <View style={appStyles.loginSignUpFieldContainer}>
                    <Text>Password</Text>
                    <View style={appStyles.loginSignUpInput}>
                        <TextInput
                            placeholder="Password"
                            value={password}
                            autoCorrect={false}
                            autoCapitalize="none"
                            secureTextEntry={true}
                            onChangeText={setPassword}
                        />
                    </View>
                </View>

                <Modal
                    animationType="slide"
                    transparent={true}
                    visible={modalVisible}
                    onRequestClose={() => {
                        Alert.alert("Modal has been closed.");
                        setModalVisible(!modalVisible);
                    }}
                >
                    <View style={styles.centeredView}>
                        <View style={styles.modalView}>
                            <TextInput
                                style={styles.modalText}
                                onChangeText={setResetEmail}
                                value={resetEmail}
                                placeholderTextColor="gray"
                                placeholder="Enter your email for password reset"
                                keyboardType="email-address"
                                autoFocus={true}
                            />
                            <Button title="Send Reset Email" onPress={handleForgotPassword} />
                            <Button title="Cancel" color="red" onPress={() => setModalVisible(!modalVisible)} />
                        </View>
                    </View>
                </Modal>
                <View style={styles.buttonContainer}>
                <PressableItem onPress={loginHandler} style={[appStyles.buttonStyle, appStyles.cancelButton]}>
                    <Text style={appStyles.text}>Log in</Text>
                </PressableItem>
                <PressableItem onPress={signupHandler} style={[appStyles.buttonStyle, appStyles.saveButton]}>
                    <Text style={appStyles.text}>Sign Up</Text>
                </PressableItem>
                <PressableItem onPress={() => setModalVisible(true)} style={[appStyles.buttonStyle, appStyles.saveButton]}>
                    <Text style={appStyles.text}>Forgot Password?</Text>
                </PressableItem>
                </View>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    iconContainer: {
        alignItems: 'center',
        marginBottom: 10,
    },
    introContainer: {
        marginBottom: 20,
        paddingHorizontal: 20,
    },
    introText: {
        fontSize: 16,
        textAlign: 'center',
        color: 'blue',
    },
    centeredView: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        marginTop: 22
    },
    modalView: {
        margin: 20,
        backgroundColor: "white",
        borderRadius: 20,
        padding: 35,
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5
    },
    modalText: {
        marginBottom: 15,
        textAlign: "center",
        width: 250, 
    },
    buttonContainer: {
        justifyContent: 'center',
        alignItems: 'center'
    }
});
