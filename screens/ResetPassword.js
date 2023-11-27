/* eslint-disable prettier/prettier */
/* eslint-disable react-native/no-inline-styles */
/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */

import {
  View,
  Text,
  TextInput,
  ScrollView,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  Image,
  Alert,
  ActivityIndicator,
} from 'react-native';
import React, {useState, useEffect} from 'react';
import Icon from 'react-native-vector-icons/Ionicons';
import {Checkbox} from 'react-native-paper';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;

const ResetPassword = ({navigation}) => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleChangePassword = async () => {
    const email = await AsyncStorage.getItem('email');
    const otp = await AsyncStorage.getItem('otp');
    setIsLoading(true);
    try {
      const response = await axios.post(
        'https://med-adherence-app.vercel.app/api/accounts/confirm-password-reset/',
        {
          email: email,
          otp: otp,
          password_1: password,
          password_2: confirmPassword,
        },
      );
      console.log('Login: ', response.data);
      Alert.alert('Success', response.data.message);
      navigation.navigate('Login');
    } catch (error) {
      console.log('Error:', error);
      Alert.alert('Error', error);
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
            marginLeft: '20%',
            color: '#131313',
            fontSize: 16,
            fontWeight: '500',
          }}>
          Change Password
        </Text>
      </View>
      <View style={{marginTop: 50}}>
        <Text style={{fontSize: 24, color: '#240F51', fontWeight: '700'}}>
          Proceed to change your password
        </Text>
      </View>
      <View style={{paddingTop: 30}}>
        <View
          style={{
            backgroundColor: '#fff',
            paddingHorizontal: 20,
            borderRadius: 30,
            marginTop: 20,
          }}>
          <Text
            style={{
              color: '#8F94A3',
              fontSize: 12,
              fontWeight: '600',
              paddingTop: 10,
            }}>
            New Password
          </Text>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}>
            <TextInput
              placeholder="Your New Password"
              placeholderTextColor="#131313"
              secureTextEntry={true}
              onChangeText={text => setPassword(text)}
              style={{color: '#131313', fontFamily: 'Inter-Bold', fontSize: 16}}
            />
          </View>
        </View>
        <View
          style={{
            backgroundColor: '#fff',
            paddingHorizontal: 20,
            borderRadius: 30,
            marginTop: 20,
          }}>
          <Text
            style={{
              color: '#8F94A3',
              fontSize: 12,
              fontWeight: '600',
              paddingTop: 10,
            }}>
            Confirm Password
          </Text>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}>
            <TextInput
              placeholder="Confirm Password"
              placeholderTextColor="#131313"
              secureTextEntry={true}
              onChangeText={text => setConfirmPassword(text)}
              style={{color: '#131313', fontFamily: 'Inter-Bold', fontSize: 16}}
            />
          </View>
        </View>
      </View>
      <View
        style={{
          marginTop: 250,
          alignItems: 'center',
        }}>
        <TouchableOpacity
          onPress={handleChangePassword}
          style={{
            backgroundColor: '#2C14DD',
            paddingHorizontal: 80,
            paddingVertical: 20,
            borderRadius: 30,
            width: '100%',
            flexDirection: 'row',
            justifyContent: 'space-around',
            alignItems: 'center',
            gap: 10,
          }}>
          <Text
            style={{
              color: '#fff',
              fontSize: 18,
              fontWeight: '600',
              textAlign: 'center',
            }}>
            Change Password
          </Text>
          {isLoading && (
            <ActivityIndicator
              size="small"
              color="white"
              style={{marginRight: 5}}
            />
          )}
        </TouchableOpacity>
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

export default ResetPassword;
