import React, { useContext } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { View, TouchableOpacity } from 'react-native';
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

const HomeStackScreen = () => (
  <MainStack.Navigator>
    <MainStack.Screen name="HomeMain" component={Home} options={{ headerShown: false }} />
    <MainStack.Screen name="HouseDetails" component={HouseDetails} options={{ title: 'House Details' }} />
  </MainStack.Navigator>
);

const ProfileStackScreen = () => (
  <MainStack.Navigator>
    <MainStack.Screen name="ProfileMain" component={Profile} options={{ headerShown: false }} />
    <MainStack.Screen name="HouseDetails" component={HouseDetails} options={{ title: 'House Details' }} />
    <MainStack.Screen name="ScheduledVisits" component={ScheduledVisits} options={{ title: 'Scheduled Visits' }} />
    <MainStack.Screen name="ScheduleVisit" component={ScheduleVisit} options={{ title: 'Schedule a Visit' }} />
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
      component={Saved}
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
      name="PostListing"
      component={PostListing}
      options={{
        tabBarButton: () => null,
        headerShown: false
      }}
    />
    <Tab.Screen
      name="PostedListings"
      component={PostedListings}
      options={{
        tabBarButton: () => null,
        headerShown: false
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

  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Root"
        component={Tabs} 
        options={({ route, navigation }) => ({
          headerRight: () => (
            <View style={{ flexDirection: 'row', marginRight: 10 }}>
              <TouchableOpacity onPress={() => alert('Notifications')}>
                <Icon name="notifications-outline" size={25} style={{ marginRight: 20 }} />
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
