/* eslint-disable prettier/prettier */
/* eslint-disable react-native/no-inline-styles */
/* eslint-disable react/no-unstable-nested-components */
/* eslint-disable react-hooks/exhaustive-deps */

import {StyleSheet, View, Image} from 'react-native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import Material from 'react-native-vector-icons/MaterialCommunityIcons';
import Icon from 'react-native-vector-icons/Ionicons';
import Profile from './Profile';
import Home from './Home';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {useAvatar} from '../components/AvatarContext';
import React, {useEffect} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import History from './History';
import Chats from './Chats';

const Tab = createBottomTabNavigator();

const Main = () => {
  const {avatarUri, setAvatarUri} = useAvatar();

  const loadSavedAvatar = async () => {
    try {
      const savedAvatarUri = await AsyncStorage.getItem('avatarUri');
      if (savedAvatarUri) {
        setAvatarUri(savedAvatarUri);
      }
    } catch (error) {
      console.log('Error loading saved avatar:', error);
    }
  };

  useEffect(() => {
    loadSavedAvatar();
  }, []);
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarShowLabel: false,
        headerShown: false,
        tabBarStyle: {
          backgroundColor: '#1654CC',
          height: 80,
        },
      }}>
      <Tab.Screen
        name="Home"
        component={Home}
        options={{
          tabBarIcon: ({focused}) => {
            return (
              <View style={styles.nav}>
                <Material
                  name={focused ? 'home-variant' : 'home-variant-outline'}
                  size={focused ? 30 : 30}
                  color={focused ? '#FFF' : '#fff'}
                  style={{borderRadius: 6}}
                />
              </View>
            );
          },
        }}
      />
      <Tab.Screen
        name="History"
        component={History}
        options={{
          tabBarIcon: ({focused}) => {
            return (
              <View style={styles.nav}>
                <MaterialIcons
                  name={focused ? 'history' : 'history'}
                  size={focused ? 30 : 30}
                  color={focused ? '#fff' : '#fff'}
                />
              </View>
            );
          },
        }}
      />
      <Tab.Screen
        name="Chats"
        component={Chats}
        options={{
          tabBarIcon: ({focused}) => {
            return (
              <View style={styles.nav}>
                <Icon
                  name={focused ? 'chatbubbles' : 'chatbubbles-outline'}
                  size={focused ? 30 : 30}
                  color={focused ? '#fff' : '#fff'}
                />
              </View>
            );
          },
        }}
      />
      <Tab.Screen
        name="Profile"
        component={Profile}
        options={{
          tabBarIcon: ({focused}) => {
            return (
              <View
                style={{
                  padding: 5,
                  borderWidth: 1,
                  borderColor: '#F0F0F0',
                  borderRadius: 33,
                }}>
                {avatarUri ? (
                  <Image
                    source={{uri: avatarUri}}
                    style={{width: 33, height: 33, borderRadius: 75}}
                  />
                ) : (
                  <Image
                    source={require('../assets/avatar.png')}
                    style={{width: 33, height: 33}}
                  />
                )}
              </View>
            );
          },
        }}
      />
    </Tab.Navigator>
  );
};

export default Main;

const styles = StyleSheet.create({
  shadow: {
    shadowColor: '#7f5df0',
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.5,
    elevation: 5,
  },
  text: {
    color: '#000',
  },
  nav: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    height: 100,
  },
});
