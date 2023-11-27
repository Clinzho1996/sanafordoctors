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
  TextInput,
  Alert,
} from 'react-native';
import React, {useState, useEffect} from 'react';
import Icon from 'react-native-vector-icons/Ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import {ActivityIndicator} from 'react-native';

const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;

const Password = ({navigation}) => {
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleChangePassword = async () => {
    const userId = await AsyncStorage.getItem('userId');
    const token = await AsyncStorage.getItem('userToken');

    setIsLoading(true);

    try {
      const response = await axios.post(
        'https://med-adherence-app.vercel.app/api/accounts/change-password/',
        {
          old_password: oldPassword,
          new_password: newPassword,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      console.log('Response: ', response.data);
      Alert.alert('Success', response.data.message);
      navigation.navigate('Login');
    } catch (error) {
      console.log('Error:', error.response.data); // Log the error response
      Alert.alert('Error', error.response.data.message); // Show the error message to the user
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
          justifyContent: 'space-between',
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
          Password
        </Text>
      </View>
      {/* forms for registration */}
      <View style={{paddingTop: 30}}>
        <View
          style={{
            backgroundColor: '#fff',
            paddingHorizontal: 20,
            borderRadius: 35,
            marginTop: 20,
          }}>
          <Text
            style={{
              color: '#8F94A3',
              fontSize: 12,
              fontFamily: 'Inter-Bold',
              paddingTop: 10,
            }}>
            Old Password
          </Text>
          <TextInput
            placeholder="Enter old password"
            placeholderTextColor="#040C22"
            style={{
              color: '#131313',
              fontFamily: 'Inter-Medium',
              fontSize: 16,
              opacity: 0.35,
            }}
            secureTextEntry={true}
            onChangeText={text => setOldPassword(text)}
          />
        </View>
        <View
          style={{
            backgroundColor: '#fff',
            paddingHorizontal: 20,
            borderRadius: 35,
            marginTop: 20,
          }}>
          <Text
            style={{
              color: '#8F94A3',
              fontSize: 12,
              fontFamily: 'Inter-Bold',
              paddingTop: 10,
            }}>
            New Password
          </Text>
          <TextInput
            placeholder="Confirm new password"
            placeholderTextColor="#040C22"
            style={{
              color: '#131313',
              fontFamily: 'Inter-Medium',
              fontSize: 16,
              opacity: 0.35,
            }}
            secureTextEntry={true}
            onChangeText={text => setNewPassword(text)}
          />
        </View>
      </View>
      <View
        style={{
          marginTop: 280,
          alignItems: 'center',
        }}>
        <TouchableOpacity
          onPress={handleChangePassword}
          style={{
            backgroundColor: '#2C14DD',
            paddingHorizontal: 80,
            paddingVertical: 20,
            borderRadius: 30,
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: 10,
          }}>
          <Text style={{color: '#fff', fontSize: 18, fontFamily: 'Inter-Bold'}}>
            Update Password
          </Text>
          {isLoading && (
            <ActivityIndicator
              size="small"
              color="white"
              style={{marginRight: 5}}
            />
          )}
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

export default Password;
