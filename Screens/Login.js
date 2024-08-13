import { appStyles } from '../Config/Styles';
import React, { useState } from 'react';
import { Text, View, TextInput, Alert } from 'react-native';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../Firebase/firebaseSetup';
import PressableItem from '../Components/PressableItem';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function Login({ navigation }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);

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
            navigation.replace('HomeMain');
        } catch (err) {
            setIsLoading(false);
            Alert.alert('Login Error', err.message);
        }
    };

    const signupHandler = () => {
        console.log("Navigating to signup");
        navigation.replace("Signup");
    };

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
            </View>

            <PressableItem onPress={loginHandler} style={[appStyles.buttonStyle, appStyles.cancelButton]}>
                <Text style={appStyles.text}>Login</Text>
            </PressableItem>
            <PressableItem onPress={signupHandler} style={[appStyles.buttonStyle, appStyles.saveButton]}>
                <Text style={appStyles.text}>SignUp</Text>
            </PressableItem>
        </SafeAreaView>
    );
}
