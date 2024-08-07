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
import HouseDetails from './Screens/HouseDetails'; 

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();
const HomeStack = createStackNavigator();

const HomeStackScreen = () => (
  <HomeStack.Navigator>
    <HomeStack.Screen name="Home" component={Home} options={{ headerShown: false }} />
    <HomeStack.Screen name="HouseDetails" component={HouseDetails} options={{ title: 'House Details' }} />
  </HomeStack.Navigator>
);

const Tabs = () => (
  <Tab.Navigator>
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
      component={Profile} 
      options={{
        tabBarIcon: ({ color, size }) => (
          <Icon name="person-outline" color={color} size={size} />
        ),
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
