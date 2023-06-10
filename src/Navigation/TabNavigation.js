import * as React from 'react';
import {Image, Platform, Text} from 'react-native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';

const Tab = createBottomTabNavigator();

import Home from '../Screens/Dashbord/Home';
import Event from '../Screens/Dashbord/Event';
import Setting from '../Screens/Dashbord/Setting';

import {Colors} from '../Utils/Colors';
import Icon from 'react-native-vector-icons/Ionicons';

function TabNavigation({route: pRoute, visible, ...props}) {
  return (
    <Tab.Navigator
      initialRouteName="Feed"
      screenOptions={{
        tabBarActiveTintColor: '#00262F',
        headerShown: false,
        headerShadowVisible: true,
        tabBarHideOnKeyboard: true,
      }}>
      <Tab.Screen
        name="Home"
        component={Home}
        options={{
          tabBarLabel: 'Home',
          tabBarIcon: ({color, size}) => (
            <Icon name="book" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="Event"
        component={Event}
        options={{
          tabBarLabel: 'Events',
          tabBarIcon: ({color, size}) => (
            <Icon name="today" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="Setting"
        component={Setting}
        options={{
          tabBarLabel: 'Settings',
          tabBarIcon: ({color, size}) => (
            <Icon name="settings" color={color} size={size} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

export default TabNavigation;
