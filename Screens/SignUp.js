import { Text, View, TextInput, Alert, SafeAreaView, StyleSheet } from 'react-native'
import React, { useState } from 'react'
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth, database } from '../Firebase/firebaseSetup';
import { appStyles } from '../Config/Styles';
import PressableItem from '../Components/PressableItem';
import { collection, doc, setDoc } from 'firebase/firestore';
import { MaterialIcons } from '@expo/vector-icons'; 

export default function SignUp({ navigation }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    function isPasswordValid(password) {
        const hasNumber = /\d/; // Regular expression to check if the password contains a number
        const hasLetter = /[a-zA-Z]/; // Regular expression to check if the password contains a letter

        return hasNumber.test(password) && hasLetter.test(password);
    }

    async function loginHandler() {
        navigation.replace("Login")
    }

    async function signupHandler() {
        console.log("register button pressed")

        let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w\w+)+$/;

        if (email.length === 0 || password.length === 0) {
            Alert.alert("Email or password cannot be empty");
            return;
        } else if (reg.test(email) === false) {
            Alert.alert("Please enter a valid email address");
            return;
        } else if (!isPasswordValid(password)) {
            Alert.alert("Password must contain both numbers and letters");
            return;
        } else if (password !== confirmPassword) {
            Alert.alert("Passwords do not match");
            return;
        }

        try {
            console.log("Auth in signup page before calling firebase fn:", auth)
            const userCred = await createUserWithEmailAndPassword(auth, email, password);
            console.log(userCred);
            const user = userCred.user;

            const usersCollectionRef = collection(database, 'User');
            await setDoc(doc(usersCollectionRef, user.uid), {
                email: user.email,
            });

            console.log("User created and data saved to Firestore!");
            navigation.navigate('My Home');
        } catch (err) {
            console.log("SIGN UP ", err);
        }
    }

    return (
        <SafeAreaView style={appStyles.loginSignUpContainer}>
            <View style={styles.iconContainer}>
                <MaterialIcons name="apartment" size={64} color="blue" />
            </View>
            <View style={styles.introContainer}>
                <Text style={styles.introText}>
                    Welcome to FindMyLease! This platform is designed to help you find the perfect place to rent as a renter or post your property for others to rent. Whether you're searching for a new home or looking to rent out your property, our app makes the process easy and efficient. 
                    {"\n\n"}
                    Sign up now to unlock the full functionality of FindMyLease!
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
                            onChangeText={(email) => {
                                setEmail(email);
                            }}
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
                            onChangeText={(password) => {
                                setPassword(password);
                            }}
                        />
                    </View>
                </View>

                <View style={appStyles.loginSignUpFieldContainer}>
                    <Text>Confirm Password</Text>
                    <View style={appStyles.loginSignUpInput}>
                        <TextInput
                            placeholder="Confirm Password"
                            value={confirmPassword}
                            autoCorrect={false}
                            autoCapitalize="none"
                            secureTextEntry={true}
                            onChangeText={(confirmPassword) => {
                                setConfirmPassword(confirmPassword);
                            }}
                        />
                    </View>
                </View>
            </View>
            <View style={styles.buttonContainer}>
                <PressableItem onPress={signupHandler} style={[appStyles.buttonStyle, appStyles.cancelButton]} >
                    <Text style={appStyles.text}>Register</Text>
                </PressableItem>
                <PressableItem onPress={loginHandler} style={[appStyles.buttonStyle, appStyles.saveButton]} >
                    <Text style={appStyles.text}>Already Registered? Log in</Text>
                </PressableItem>
            </View>
        </SafeAreaView>
    )
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
    buttonContainer: {
        justifyContent: 'center',
        alignItems: 'center'
    }
});
