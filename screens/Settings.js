/* eslint-disable prettier/prettier */
/* eslint-disable react-native/no-inline-styles */
/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */

import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  Image,
  ActivityIndicator,
} from 'react-native';
import React, {useState, useEffect} from 'react';
import Icon from 'react-native-vector-icons/Ionicons';
import Material from 'react-native-vector-icons/MaterialIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Switch} from 'react-native-paper';

const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;

const Settings = ({navigation}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [biometricEnabled, setBiometricEnabled] = useState(false);

  useEffect(() => {
    // Load the biometric preference from storage
    AsyncStorage.getItem('biometricEnabled').then(value => {
      if (value === 'true') {
        setBiometricEnabled(true);
      }
    });
  }, []);

  const handleBiometricToggle = value => {
    // Store the biometric preference in storage
    setBiometricEnabled(value);
    AsyncStorage.setItem('biometricEnabled', value.toString());
  };

  const handleLogout = async () => {
    setIsLoading(true);
    try {
      await AsyncStorage.removeItem('userToken');
      navigation.navigate('Login');
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <View style={styles.container}>
      <View
        style={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'flex-start',
          alignItems: 'center',
        }}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon
            name="arrow-back"
            color="#000"
            size={20}
            style={{backgroundColor: '#fff', padding: 10, borderRadius: 30}}
          />
        </TouchableOpacity>
        <Text
          style={{
            textAlign: 'center',
            marginLeft: '30%',
            color: '#131313',
            fontSize: 16,
            fontFamily: 'Inter-Bold',
          }}>
          Settings
        </Text>
      </View>
      {/* forms for registration */}
      <View style={{paddingTop: 30}}>
        <Text
          style={{color: '#6C727F', fontFamily: 'Inter-Medium', marginTop: 0}}>
          General
        </Text>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: 10,
            marginTop: 20,
          }}>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'flex-start',
              alignItems: 'center',
              gap: 15,
            }}>
            <View>
              <Text
                style={{
                  color: '#13085E',
                  fontFamily: 'Inter-Bold',
                  fontSize: 16,
                }}>
                Reset Password
              </Text>
            </View>
          </View>
          <TouchableOpacity onPress={() => navigation.navigate('Password')}>
            <Material
              name="arrow-forward-ios"
              color="#121826"
              size={20}
              style={{
                padding: 5,
                borderRadius: 20,
              }}
            />
          </TouchableOpacity>
        </View>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: 10,
            marginTop: 20,
          }}>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'flex-start',
              alignItems: 'center',
              gap: 15,
            }}>
            <View>
              <Text
                style={{
                  color: '#13085E',
                  fontFamily: 'Inter-Bold',
                  fontSize: 16,
                }}>
                Notifications
              </Text>
            </View>
          </View>
          <TouchableOpacity
            onPress={() => navigation.navigate('Notifications')}>
            <Material
              name="arrow-forward-ios"
              color="#121826"
              size={20}
              style={{
                padding: 5,
                borderRadius: 20,
              }}
            />
          </TouchableOpacity>
        </View>
      </View>
      <View
        style={{
          marginTop: 350,
          alignItems: 'center',
        }}>
        <TouchableOpacity
          onPress={handleLogout}
          style={{
            backgroundColor: '#2C14DD',
            paddingVertical: 20,
            borderRadius: 30,
            width: '100%',
            gap: 5,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <Text
            style={{
              color: '#fff',
              fontSize: 18,
              fontFamily: 'Inter-Bold',
              textAlign: 'center',
            }}>
            Log Out
          </Text>
          {isLoading && <ActivityIndicator size="small" color="white" />}
        </TouchableOpacity>
        <Text
          style={{color: '#9EA3AE', fontFamily: 'Inter-Medium', marginTop: 30}}>
          Sana &copy; 2023 v1.0
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#F5F7FF',
    height: height,
    flex: 1,
    width: width,
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
});

export default Settings;
