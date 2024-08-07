import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { View, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { getFocusedRouteNameFromRoute } from '@react-navigation/native';

import Home from './Screens/Home';
import Message from './Screens/Message';
import Profile from './Screens/Profile';
import PostListing from './Components/PostListing'
import PostedListings from './Screens/PostedListings';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

// Tabs component
const Tabs = () => (
  <Tab.Navigator screenOptions={({ route }) => ({
    tabBarStyle: {
      display:
        route.name === 'PostListing'
          ? 'none'
          : 'flex',
    },
  })}>
    <Tab.Screen
      name="Home"
      component={Home}
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
      component={Profile}
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
        tabBarButton: () => null,  // Hiding this tab
        headerShown: false
      }}
    />
    <Tab.Screen
      name="PostedListings"
      component={PostedListings}
      options={{
        tabBarButton: () => null,  // Hiding this tab
        headerShown: false
      }}
    />
  </Tab.Navigator>
);

// Getting header title based on route name
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
      return 'My Posted Listings'
    default:
      return 'My App';
  }
};

// Main App with Stack Navigator
const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="Root"
          component={Tabs}
          options={({ route }) => ({
            title: getHeaderTitle(route),
            headerRight: () => (
              <View style={{ flexDirection: 'row', marginRight: 10 }}>
                <TouchableOpacity onPress={() => alert('Notification')}>
                  <Icon name="notifications-outline" size={25} style={{ marginRight: 20 }} />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => alert('Settings')}>
                  <Icon name="settings-outline" size={25} />
                </TouchableOpacity>
              </View>
            ),
          })}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
