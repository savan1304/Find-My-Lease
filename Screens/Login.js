import React, { useState, useContext } from 'react';
import { Text, View, TextInput, Alert, Modal, StyleSheet, Button, KeyboardAvoidingView, Platform, ScrollView, Dimensions } from 'react-native';
import { signInWithEmailAndPassword, sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '../Firebase/firebaseSetup';
import PressableItem from '../Components/PressableItem';
import { SafeAreaView } from 'react-native-safe-area-context';
import { appStyles } from '../Config/Styles';
import { MaterialIcons } from '@expo/vector-icons';
import { AuthContext } from '../Components/AuthContext';

const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;

export default function Login({ navigation }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [resetEmail, setResetEmail] = useState('');
    const { language } = useContext(AuthContext);

    const loginHandler = async () => {
        console.log("Attempting to login");
        if (!email) {
            Alert.alert(language === 'zh' ? '验证错误' : 'Validation Error', language === 'zh' ? '电子邮箱不能为空' : 'Email should not be empty');
            return;
        }
        if (!password) {
            Alert.alert(language === 'zh' ? '验证错误' : 'Validation Error', language === 'zh' ? '密码不能为空' : 'Password should not be empty');
            return;
        }
        setIsLoading(true);
        try {
            const userCred = await signInWithEmailAndPassword(auth, email, password);
            console.log("Login successful: ", userCred);
            setIsLoading(false);
            navigation.navigate('Root');
        } catch (err) {
            setIsLoading(false);
            Alert.alert(language === 'zh' ? '登录错误' : 'Login Error', err.message);
        }
    };

    const signupHandler = () => {
        console.log("Navigating to signup");
        navigation.replace("Signup");
    };

    const handleForgotPassword = () => {
        if (!resetEmail) {
            Alert.alert(language === 'zh' ? '需要输入' : "Input required", language === 'zh' ? "请输入您的电子邮箱以重置密码。" : "Please enter your email address to reset your password.");
            return;
        }
        sendPasswordResetEmail(auth, resetEmail)
            .then(() => {
                Alert.alert(language === 'zh' ? '检查您的电子邮件' : "Check your email", language === 'zh' ? "重置密码的链接已发送到您的电子邮件。" : "A link to reset your password has been sent to your email.");
                setModalVisible(false);
                setResetEmail('');
            })
            .catch((error) => {
                Alert.alert(language === 'zh' ? '错误' : "Error", error.message);
            });
    };

    return (
        <SafeAreaView style={appStyles.loginSignUpContainer}>
            <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={{ flex: 1 }}>
                <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'center' }}>
                    <View style={styles.iconContainer}>
                        <MaterialIcons name="apartment" size={64} color="blue" />
                    </View>
                    <View style={styles.introContainer}>
                        <Text style={styles.introText}>
                            {language === 'zh' ? '欢迎回到FindMyLease！继续您的租房之旅，或管理您的房产出租。立即登录，访问您的账户和FindMyLease的所有功能！' :
                                'Welcome back to FindMyLease! Continue your journey to find the perfect place to rent or manage your property rentals with ease. Log in now to access your account and all the features of FindMyLease!'}
                        </Text>
                    </View>
                    <View style={styles.centeredView}>
                        <View style={appStyles.loginSignUpFieldContainer}>
                            <Text style={styles.addTitles}>{language === 'zh' ? '电子邮箱' : 'Email'}</Text>
                            <View style={appStyles.loginSignUpInput}>
                                <TextInput
                                    placeholder={language === 'zh' ? '电子邮箱' : "Email"}
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

                        <Modal
                            animationType="slide"
                            transparent={true}
                            visible={modalVisible}
                            onRequestClose={() => {
                                Alert.alert("Modal has been closed.");
                                setModalVisible(!modalVisible);
                            }}
                        >
                            <View style={styles.modalContainer}>
                                <View style={styles.modalView}>
                                    <TextInput
                                        style={styles.modalText}
                                        onChangeText={setResetEmail}
                                        value={resetEmail}
                                        placeholderTextColor="gray"
                                        placeholder={language === 'zh' ? '输入您的电子邮件以重置密码' : "Enter your email for password reset"}
                                        keyboardType="email-address"
                                        autoFocus={true}
                                    />
                                    <PressableItem onPress={handleForgotPassword} >
                                        <Text style={appStyles.text}>{language === 'zh' ? '发送重置邮件' : "Send Reset Email"} </Text>
                                    </PressableItem>
                                    <PressableItem onPress={() => setModalVisible(!modalVisible)} style={{ backgroundColor: 'rgb(255, 59, 48)', width: 95, alignItems: 'center' }}>
                                        <Text style={appStyles.text}>{language === 'zh' ? '取消' : "Cancel"} </Text>
                                    </PressableItem >
                                </View>
                            </View>
                        </Modal>
                        <View style={styles.buttonContainer}>
                            <PressableItem onPress={loginHandler} style={[appStyles.buttonStyle, appStyles.cancelButton, { width: 150 }]}>
                                <Text style={appStyles.text}>{language === 'zh' ? '登录' : "Log in"} </Text>
                            </PressableItem>
                            <PressableItem onPress={signupHandler} style={[appStyles.buttonStyle, appStyles.saveButton, { width: 150 }]}>
                                <Text style={appStyles.text}>{language === 'zh' ? '注册' : "Sign Up"} </Text>
                            </PressableItem>
                            <PressableItem onPress={() => setModalVisible(true)} style={[appStyles.buttonStyle, appStyles.saveButton, { width: 150 }]}>
                                <Text style={appStyles.text}>{language === 'zh' ? '忘记密码？' : "Forgot Password?"} </Text>
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
    centeredView: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
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
        width: screenWidth * 0.6,
    },
    buttonContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 10
    },
    addTitles: {
        fontWeight: 'bold'
    }
});
