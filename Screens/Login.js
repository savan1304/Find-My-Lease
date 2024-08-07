import { Text, View, TextInput } from 'react-native'
import React, { useState } from 'react'
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../Firebase/firebaseSetup'
import { appStyles } from '../Config/Styles';
import PressableItem from '../Components/PressableItem';
import { SafeAreaView } from 'react-native-safe-area-context';


export default function Login({ navigation }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('')

    async function signupHandler() {
        console.log("register button pressed")
        navigation.navigate("Signup")
    }

    async function loginHandler() {
        console.log("inside loginHandler fn")
        if (!email.length) {
            Alert.alert('email should not be empty')
            return
        }
        if (!password.length) {
            Alert.alert('password should not be empty')
        }
        try {
            console.log("inside try block in loginHandler with email and password:", email, password)
            const userCred = await signInWithEmailAndPassword(auth, email, password)
            console.log("usercred: ", userCred)

        } catch (err) {
            console.log("Login error: ", err)
        }
    }

    return (
        <SafeAreaView style={appStyles.loginSignUpContainer}>
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
                                setEmail(email)
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
                                setPassword(password)
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
                                setConfirmPassword(confirmPassword)
                            }}
                        />
                    </View>
                </View>
            </View>

            <PressableItem onPress={loginHandler} style={[appStyles.buttonStyle, appStyles.cancelButton]} >
                <Text style={appStyles.text}>Login</Text>
            </PressableItem>
            <PressableItem onPress={signupHandler} style={[appStyles.buttonStyle, appStyles.saveButton]} >
                <Text style={appStyles.text}>SignUp</Text>
            </PressableItem>


        </SafeAreaView>

    )
}