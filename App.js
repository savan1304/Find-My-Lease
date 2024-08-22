import React, { useContext } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { View, TouchableOpacity, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { auth } from './Firebase/firebaseSetup';
import Home from './Screens/Home';
import Profile from './Screens/Profile';
import HouseDetails from './Screens/HouseDetails';
import PostListing from './Components/PostListing';
import PostedListings from './Screens/PostedListings';
import Login from './Screens/Login';
import SignUp from './Screens/SignUp';
import { signOut } from 'firebase/auth';
import ScheduleVisit from './Components/ScheduleVisit';
import ScheduledVisits from './Screens/ScheduledVisits';
import Saved from './Screens/Saved';
import * as Notifications from 'expo-notifications';
import { getFocusedRouteNameFromRoute } from '@react-navigation/native';
import { AuthProvider, AuthContext } from './Components/AuthContext';
import VisitRequest from './Components/VisitRequest';
import SettingsScreen from './Screens/SettingsScreen';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();
const MainStack = createStackNavigator();

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

async function cancelAllNotifications() {
  try {
    const notificationIds = await Notifications.getAllScheduledNotificationsAsync();
    console.log("current notifications: ", notificationIds);
    if (notificationIds.length > 0) {
      await Notifications.cancelAllScheduledNotificationsAsync();
    }
  } catch (error) {
    console.error("Failed to cancel all notifications", error);
  }
}

const HomeStackScreen = () => {
  const { language } = useContext(AuthContext);
  return (
    <MainStack.Navigator>
      <MainStack.Screen name="My Home" component={Home} options={{ headerShown: false }} />
      <MainStack.Screen name="HouseDetails" component={HouseDetails} options={{ title: language === 'zh' ? '房屋详情' : 'House Details' }} />
      <MainStack.Screen name="ScheduleVisit" component={ScheduleVisit} options={{ title: language === 'zh' ? '安排访问' : 'Schedule a Visit' }} />
    </MainStack.Navigator>
  );
};

const SavedStackScreen = () => {
  const { language } = useContext(AuthContext);
  return (
    <MainStack.Navigator>
      <MainStack.Screen name="My Save" component={Saved} options={{ headerShown: false }} />
      <MainStack.Screen name="HouseDetails" component={HouseDetails} options={{ title: language === 'zh' ? '房屋详情' : 'House Details' }} />
    </MainStack.Navigator>
  );
};

const ProfileStackScreen = () => {
  const { language } = useContext(AuthContext);
  return (
    <MainStack.Navigator>
      <MainStack.Screen name="My Profile" component={Profile} options={{ headerShown: false }} />
      <MainStack.Screen name="ScheduledVisits" component={ScheduledVisits} options={{ title: language === 'zh' ? '预定的访问' : 'Scheduled Visits' }} />
      <MainStack.Screen name="PostedListings" component={PostedListings} options={{ title: language === 'zh' ? '发布的列表' : 'Posted Listings' }} />
      <MainStack.Screen name="PostListing" component={PostListing} options={{ title: language === 'zh' ? '发布列表' : 'Post a Listing' }} />
      <MainStack.Screen name="VisitRequests" component={VisitRequest} options={{ title: language === 'zh' ? '访问请求' : 'Visit Requests' }} />
    </MainStack.Navigator>
  );
};

const Tabs = () => {
  const { language } = useContext(AuthContext);
  return(
    <Tab.Navigator initialRouteName="Home">
    <Tab.Screen
      name= "Home"
      component={HomeStackScreen}
      options={{
        tabBarIcon: ({ color, size }) => (
          <Icon name="home-outline" color={color} size={size} />
        ),
        headerShown: false,
        tabBarLabel: language === 'zh' ? "首页" : "Home"
      }}
    />
    <Tab.Screen
        name="Saved"
        component={SavedStackScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Icon name="heart-outline" color={color} size={size} />
          ),
          headerShown: false,
          tabBarLabel: language === 'zh' ? "已保存" : "Saved"
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileStackScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Icon name="person-outline" color={color} size={size} />
          ),
          headerShown: false,
          tabBarLabel: language === 'zh' ? "个人中心" : "Profile"
        }}
      />
    <Tab.Screen
        name="Login"
        component={Login}
        options={{
          headerShown: false,
          tabBarButton: () => null,
          tabBarLabel: language === 'zh' ? "登录" : "Login"
        }}
      />
      <Tab.Screen
        name="Signup"
        component={SignUp}
        options={{
          headerShown: false,
          tabBarButton: () => null,
          tabBarLabel: language === 'zh' ? "注册" : "Signup"
        }}
      />
    <Tab.Screen
        name="Settings"
        component={SettingsScreen}
        options={{
          headerShown: false,
          tabBarButton: () => null,
          tabBarLabel: language === 'zh' ? "设置" : "Settings"
        }}
      />
  </Tab.Navigator>
 );
};

const AppContent = () => {
  const { user, language } = useContext(AuthContext);

  const handleLogout = async (navigation) => {
    try {
      navigation.replace('My Home');
      await signOut(auth);
      
    } catch (error) {
      console.error("Logout error: ", error);
    }
  };

  const handleCancelNotifications = async () => {
    Alert.alert(
      language === 'zh' ? "取消所有通知" : "Cancel All Notifications",
      language === 'zh' ? "您确定要取消所有预定的通知吗？" : "Are you sure you want to cancel all scheduled notifications?",
      [
        { text: language === 'zh' ? "否" : "No", style: "cancel" },
        {
          text: language === 'zh' ? "是" : "Yes", onPress: async () => {
            await cancelAllNotifications();
            alert(language === 'zh' ? '所有通知已取消。' : 'All notifications have been cancelled.');
          }
        }
      ]
    );
  };

  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Root"
        component={Tabs}
        options={({ route, navigation }) => ({
          headerRight: () => (
            <View style={{ flexDirection: 'row', marginRight: 10 }}>
              <TouchableOpacity onPress={handleCancelNotifications}>
                <Icon name="notifications-off-outline" size={25} style={{ marginRight: 20 }} />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => navigation.navigate('Settings')}>
                <Icon name="settings-outline" size={25} style={{ marginRight: 20 }} />
              </TouchableOpacity>
              {user ? (
                <TouchableOpacity onPress={() => handleLogout(navigation)}>
                  <Icon name="log-out-outline" size={25} />
                </TouchableOpacity>
              ) : (
                <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                  <Icon name="log-in-outline" size={25} />
                </TouchableOpacity>
              )}
            </View>
          ),
          title: getFocusedRouteNameFromRoute(route) ?? ("Home")
        })}
      />
      <Stack.Screen name="Login" component={Login} />
      <Stack.Screen name="Signup" component={SignUp} />
      <Stack.Screen name="Settings" component={SettingsScreen} />
    </Stack.Navigator>
  );
};

const App = () => (
  <AuthProvider>
    <NavigationContainer>
      <AppContent />
    </NavigationContainer>
  </AuthProvider>
);

export default App;
