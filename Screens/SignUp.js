import React, { useState, useContext } from 'react';
import { Text, View, TextInput, Alert, SafeAreaView, KeyboardAvoidingView, Platform, ScrollView, StyleSheet } from 'react-native';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth, database } from '../Firebase/firebaseSetup';
import { appStyles } from '../Config/Styles';
import PressableItem from '../Components/PressableItem';
import { collection, doc, setDoc } from 'firebase/firestore';
import { MaterialIcons } from '@expo/vector-icons';
import { AuthContext } from '../Components/AuthContext';

export default function SignUp({ navigation }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const { language } = useContext(AuthContext);

    function isPasswordValid(password) {
        const hasNumber = /\d/;
        const hasLetter = /[a-zA-Z]/;

        return hasNumber.test(password) && hasLetter.test(password);
    }

    async function loginHandler() {
        navigation.replace("Login");
    }

    async function signupHandler() {
        let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w\w+)+$/;

        if (email.length === 0 || password.length === 0) {
            Alert.alert(language === 'zh' ? '电子邮件或密码不能为空' : "Email or password cannot be empty");
            return;
        } else if (reg.test(email) === false) {
            Alert.alert(language === 'zh' ? '请输入有效的电子邮件地址' : "Please enter a valid email address");
            return;
        } else if (!isPasswordValid(password)) {
            Alert.alert(language === 'zh' ? '密码必须包含数字和字母' : "Password must contain both numbers and letters");
            return;
        } else if (password !== confirmPassword) {
            Alert.alert(language === 'zh' ? '密码不匹配' : "Passwords do not match");
            return;
        }

        try {
            const userCred = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCred.user;
            const usersCollectionRef = collection(database, 'User');
            await setDoc(doc(usersCollectionRef, user.uid), {
                email: user.email,
            }); 
            navigation.navigate('Root');
        } catch (err) {
            if (err.code === 'auth/email-already-in-use') {
                Alert.alert(language === 'zh' ? '电子邮件已在使用' : 'Email Already in Use', 'This email is already in use. Please try a different email or log in if you already have an account.');
            } else {
                // Handling other errors
                console.error('Error during signup:', err);
                Alert.alert(language === 'zh' ? '错误' : 'Error', 'An error occurred during signup. Please try again later.');
            }
        }
    }

    return (
        <SafeAreaView style={appStyles.loginSignUpContainer}>
            <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={{ flex: 1 }}>
                <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'center' }}>
                    <View style={{ alignItems: 'center', marginBottom: 10 }}>
                        <MaterialIcons name="apartment" size={64} color="blue" />
                    </View>
                    <View style={{ marginBottom: 20, paddingHorizontal: 20 }}>
                        <Text style={{ fontSize: 16, textAlign: 'center', color: 'blue' }}>
                            {language === 'zh' ? '欢迎来到FindMyLease！本平台旨在帮助您找到完美的租赁地点。无论您是在寻找新家还是希望出租您的房产，我们的应用程序都能使过程变得简单高效。现在注册，解锁FindMyLease的全部功能！' :
                                'Welcome to FindMyLease! This platform is designed to help you find the perfect place to rent as a renter or post your property for others to rent. Whether you\'re searching for a new home or looking to rent out your property, our app makes the process easy and efficient. Sign up now to unlock the full functionality of FindMyLease!'}
                        </Text>
                    </View>
                    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
                        <View style={appStyles.loginSignUpFieldContainer}>
                            <Text style={styles.addTitles}>{language === 'zh' ? '电子邮件' : 'Email'}</Text>
                            <View style={appStyles.loginSignUpInput}>
                                <TextInput
                                    placeholder={language === 'zh' ? '电子邮件' : "Email"}
                                    value={email}
                                    autoCorrect={false}
                                    autoCapitalize="none"
                                    onChangeText={setEmail}
                                />
                            </View>
                        </View>

                        <View style={appStyles.loginSignUpFieldContainer}>
                            <Text style={styles.addTitles}>{language === 'zh' ? '密码' : 'Password'}</Text>
                            <View style={appStyles.loginSignUpInput}>
                                <TextInput
                                    placeholder={language === 'zh' ? '密码' : "Password"}
                                    value={password}
                                    autoCorrect={false}
                                    autoCapitalize="none"
                                    secureTextEntry={true}
                                    onChangeText={setPassword}
                                />
                            </View>
                        </View>

                        <View style={appStyles.loginSignUpFieldContainer}>
                            <Text style={styles.addTitles}>{language === 'zh' ? '确认密码' : 'Confirm Password'}</Text>
                            <View style={appStyles.loginSignUpInput}>
                                <TextInput
                                    placeholder={language === 'zh' ? '确认密码' : "Confirm Password"}
                                    value={confirmPassword}
                                    autoCorrect={false}
                                    autoCapitalize="none"
                                    secureTextEntry={true}
                                    onChangeText={setConfirmPassword}
                                />
                            </View>
                        </View>

                        <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                            <PressableItem onPress={signupHandler} style={[appStyles.buttonStyle, appStyles.cancelButton, { width: '35%' }]} >
                                <Text style={appStyles.text}>{language === 'zh' ? '注册' : "Register"} </Text>
                            </PressableItem>
                            <PressableItem onPress={loginHandler} style={[appStyles.buttonStyle, appStyles.saveButton, { width: '55%' }]} >
                                <Text style={appStyles.text}>{language === 'zh' ? '已注册？登录' : "Already Registered? Log in"} </Text>
                            </PressableItem>
                        </View>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
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
    buttonContainer: {
        justifyContent: 'center',
        alignItems: 'center'
    },
    centeredView: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    addTitles: {
        fontWeight: 'bold'
    }
});
