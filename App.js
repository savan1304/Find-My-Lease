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
      console.log("current notifications: ",notificationIds); 
      if (notificationIds.length > 0) {
          await Notifications.cancelAllScheduledNotificationsAsync();
      }
  } catch (error) {
      console.error("Failed to cancel all notifications", error);
  }
}


const HomeStackScreen = () => (
  <MainStack.Navigator>
    <MainStack.Screen name="My Home" component={Home} options={{ headerShown: false }} />
    <MainStack.Screen name="HouseDetails" component={HouseDetails} options={{ title: 'House Details' }} />
  </MainStack.Navigator>
);

const SavedStackScreen = () => (
  <MainStack.Navigator>
    <MainStack.Screen name="My Save" component={Saved} options={{ headerShown: false }} />
    <MainStack.Screen name="HouseDetails" component={HouseDetails} options={{ title: 'House Details' }} />
  </MainStack.Navigator>
);

const ProfileStackScreen = () => (
  <MainStack.Navigator>
    <MainStack.Screen name="My Profile" component={Profile} options={{ headerShown: false }} />
    <MainStack.Screen name="ScheduledVisits" component={ScheduledVisits} options={{ title: 'Scheduled Visits' }} />
    <MainStack.Screen name="PostedListings" component={PostedListings} options={{ title: 'Posted Listings' }} />
    <MainStack.Screen name="PostListing" component={PostListing} options={{ title: 'Post a Listing' }} />
    <MainStack.Screen name="ScheduleVisit" component={ScheduleVisit} options={{ title: 'Schedule a Visit' }} />
    <MainStack.Screen name="VisitRequests" component={VisitRequest} options={{ title: 'Visit Requests' }} />
  </MainStack.Navigator>
);

const Tabs = () => (
  <Tab.Navigator initialRouteName="Home">
    <Tab.Screen
      name="Home"
      component={HomeStackScreen}
      options={{
        tabBarIcon: ({ color, size }) => (
          <Icon name="home-outline" color={color} size={size} />
        ),
        headerShown: false
      }}
    />
    <Tab.Screen
      name="Saved"
      component={SavedStackScreen}
      options={{
        tabBarIcon: ({ color, size }) => (
          <Icon name="heart-outline" color={color} size={size} />
        ),
        headerShown: false
      }}
    />
    <Tab.Screen
      name="Profile"
      component={ProfileStackScreen}
      options={{
        tabBarIcon: ({ color, size }) => (
          <Icon name="person-outline" color={color} size={size} />
        ),
        headerShown: false
      }}
    />
    <Tab.Screen
      name="Login"
      component={Login}
      options={{
        headerShown: false,
        tabBarButton: () => null,
      }}
    />
    <Tab.Screen
      name="Signup"
      component={SignUp}
      options={{
        headerShown: false,
        tabBarButton: () => null,
      }}
    />
    <Tab.Screen
      name="ScheduleVisit"
      component={ScheduleVisit}
      options={{
        tabBarButton: () => null,
        headerShown: false
      }}
    />
  </Tab.Navigator>
);

const AppContent = () => {
  const { user } = useContext(AuthContext);

  const handleLogout = async (navigation) => {
    try {
      await signOut(auth);
      navigation.navigate('Login');
    } catch (error) {
      console.error("Logout error: ", error);
    }
  };

  const handleCancelNotifications = async () => {
    Alert.alert(
      "Cancel All Notifications",
      "Are you sure you want to cancel all scheduled notifications?",
      [
        { text: "No", style: "cancel" },
        { text: "Yes", onPress: async () => {
          await cancelAllNotifications();
          alert('All notifications have been cancelled.');
        }}
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
              <TouchableOpacity onPress={() => alert('Settings')}>
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
          title: getFocusedRouteNameFromRoute(route) ?? "Home"
        })}
      />
      <Stack.Screen name="Login" component={Login} />
      <Stack.Screen name="Signup" component={SignUp} />
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
