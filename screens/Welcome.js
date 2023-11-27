/* eslint-disable prettier/prettier */
/* eslint-disable react-hooks/exhaustive-deps */

import React, {useEffect} from 'react';
import {View, Image, Dimensions} from 'react-native';
import StatusBarHeader from '../components/StatusBar';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {decode} from 'base-64';
import axios from 'axios';

const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;

const Welcome = ({navigation}) => {
  useEffect(() => {
    checkToken();
  }, []);

  const checkToken = async () => {
    try {
      const userToken = await AsyncStorage.getItem('userToken');
      const refreshToken = await AsyncStorage.getItem('refreshToken');

      if (!userToken || !refreshToken) {
        navigation.navigate('Onboarding');
        return;
      }

      const isTokenExpired = token => {
        const tokenParts = token.split('.');
        if (tokenParts.length < 2) {
          // Invalid token format, handle error or return default expiry
          return true;
        }

        const payload = JSON.parse(decode(tokenParts[1]));
        if (!payload || !payload.exp) {
          return true;
        }

        const currentTimestamp = Math.floor(Date.now() / 1000);
        return payload.exp < currentTimestamp;
      };

      if (isTokenExpired(userToken)) {
        // Token has expired, refresh logic here
        const newAccessToken = await refreshAccessToken(refreshToken);
        if (!newAccessToken) {
          // Handle token refresh failure, navigate to login
          navigation.navigate('Login');
          return;
        }
        // Token refreshed successfully, proceed to Main or necessary screen
        navigation.navigate('Main');
      } else {
        navigation.navigate('Main');
      }
    } catch (error) {
      console.log('Error checking token:', error);
    }
  };

  const refreshAccessToken = async refreshToken => {
    try {
      const response = await axios.post(
        'https://med-adherence-app.vercel.app/api/accounts/token/refresh/',
        {
          refresh: refreshToken,
        },
      );
      const newAccessToken = response.data.access; // Extract new access token from response
      await AsyncStorage.setItem('userToken', newAccessToken); // Save the new access token
      return newAccessToken; // Return the refreshed access token
    } catch (error) {
      console.error('Error refreshing access token:', error);
      return null;
    }
  };

  return (
    <View style={{backgroundColor: '#4C36ED', height, width}}>
      <StatusBarHeader />
      <Image
        source={require('../assets/splashscreen.png')}
        style={{width, height}}
      />
    </View>
  );
};

export default Welcome;
