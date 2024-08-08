import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { View, TouchableOpacity, Text } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { getFocusedRouteNameFromRoute } from '@react-navigation/native';
import { auth } from './Firebase/firebaseSetup';
import Home from './Screens/Home';
import Message from './Screens/Message';
import Profile from './Screens/Profile';
import HouseDetails from './Screens/HouseDetails';
import PostListing from './Components/PostListing'
import PostedListings from './Screens/PostedListings';
import Login from './Screens/Login';
import SignUp from './Screens/SignUp';
import { signOut } from 'firebase/auth';
import ScheduleVisit from './Components/ScheduleVisit';
import ScheduledVisits from './Screens/ScheduledVisits';
import Saved from './Screens/Saved';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();
const MainStack = createStackNavigator();

const HomeStackScreen = () => (
  <MainStack.Navigator>
    <MainStack.Screen name="HomeMain" component={Home} options={{ headerShown: false }} />
    <MainStack.Screen name="HouseDetails" component={HouseDetails} options={{ title: 'House Details' }} />
  </MainStack.Navigator>
);

const ProfileStackScreen = () => (
  <MainStack.Navigator>
    <MainStack.Screen name="ProfileMain" component={Profile} options={{ headerShown: false }} />
    <MainStack.Screen name="Saved" component={Saved} options={{ title: 'Saved Listings' }} />
    <MainStack.Screen name="ScheduledVisits" component={ScheduledVisits} options={{ title: 'Scheduled Listings' }} />
  </MainStack.Navigator>
);

const Tabs = () => (
  <Tab.Navigator screenOptions={({ route }) => ({
    tabBarStyle: {
      display: route.name === 'PostListing' ? 'none' : 'flex',
    },
  })}>
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
      name="Message"
      component={Message}
      options={{
        tabBarIcon: ({ color, size }) => (
          <Icon name="chatbubble-outline" color={color} size={size} />
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

const getHeaderTitle = (route) => {
  const routeName = getFocusedRouteNameFromRoute(route) ?? 'Home';

  switch (routeName) {
    case 'Home':
      return 'Home';
    case 'Message':
      return 'Message';
    case 'Profile':
      return 'Profile';
    case 'PostListing':
      return 'Post a Listing';
    case 'PostedListings':
      return 'My Posted Listings';
    case 'ScheduleVisit':
      return 'Schedule a Visit';
    case 'Saved':
      return 'Saved Listings';
    default:
      return 'My App';
  }
};

// Main App with Stack Navigator
const App = () => {
  const [initializing, setInitializing] = useState(true);
  const [user, setUser] = useState(null);

  const onAuthStateChanged = (user) => {
    setUser(user);
    if (initializing) {
      setInitializing(false);
    }
  };

  useEffect(() => {
    const subscriber = onAuthStateChanged(auth, (user) => { 
      setUser(user);
      if (initializing) setInitializing(false);
    });

    
    return subscriber;
  }, [auth]);

  async function handleLogout(navigation) {
    try {
      await signOut(auth)
      setUser(null)
      navigation.replace('Login')
    } catch (err) {
      console.log("handleLogout error: ", err)
    }
  }

  return (
    <NavigationContainer>
      <Stack.Navigator>
        {!user ? (
          <>
            <Stack.Screen
              name="Login"
              component={Login}
            />
            <Stack.Screen
              name="Signup"
              component={SignUp}
            />
          </>
        ) : (
          <>
            <Stack.Screen
              name="Root"
              component={Tabs}
              options={({ route, navigation }) => ({
                title: getHeaderTitle(route),
                headerRight: () => (
                  <View style={{ flexDirection: 'row', marginRight: 10 }}>
                    <TouchableOpacity onPress={() => alert('Notification')}>
                      <Icon name="notifications-outline" size={25} style={{ marginRight: 20 }} />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => alert('Settings')}>
                      <Icon name="settings-outline" size={25} />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => handleLogout(navigation)}
                      style={{ marginLeft: 20 }}
                    >
                      <Icon name="log-out-outline" size={25} color="black" />
                    </TouchableOpacity>
                  </View>
                ),
              })}
            />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
