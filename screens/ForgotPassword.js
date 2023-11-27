/* eslint-disable prettier/prettier */
/* eslint-disable react-native/no-inline-styles */
/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */

import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';
import React, {useState, useEffect} from 'react';
import Icon from 'react-native-vector-icons/Ionicons';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;

const ForgotPassword = ({navigation}) => {
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSendOtp = async () => {
    setIsLoading(true);
    try {
      const response = await axios.post(
        'https://med-adherence-app.vercel.app/api/accounts/password-reset/',
        {
          email: email,
        },
      );
      console.log('ForgotPassword:', response.data);
      await AsyncStorage.setItem('email', email);
      Alert.alert('Success', response.data.message);
    } catch (error) {
      console.log('Error:', error);
      Alert.alert('Error', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotReset = async () => {
    setIsLoading(true);
    try {
      const response = await axios.post(
        'https://med-adherence-app.vercel.app/api/accounts/validate-password-reset-otp/',
        {
          email: email,
          otp: otp,
        },
      );
      console.log('ForgotPassword:', response.data);
      await AsyncStorage.setItem('email', email);
      await AsyncStorage.setItem('otp', otp);
      Alert.alert('Success', response.data.message);
      navigation.navigate('ResetPassword');
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
            marginLeft: '20%',
            color: '#131313',
            fontSize: 16,
            fontWeight: '500',
          }}>
          Forgot Password
        </Text>
      </View>
      <View style={{marginTop: 50}}>
        <Text style={{fontSize: 24, color: '#240F51', fontWeight: '700'}}>
          Enter your email and we’ll send you a link to reset your password.
        </Text>
      </View>
      {/* forms for registration */}
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
            Email
          </Text>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}>
            <TextInput
              placeholder="name@example.com"
              placeholderTextColor="#131313"
              onChangeText={text => setEmail(text)}
              style={{color: '#131313', fontWeight: '600', fontSize: 16}}
            />
            <TouchableOpacity onPress={handleSendOtp}>
              <Text style={{color: 'blue', fontWeight: '500'}}>Get OTP</Text>
            </TouchableOpacity>
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
            OTP Code
          </Text>
          <TextInput
            placeholder="enter otp code"
            placeholderTextColor="#131313"
            keyboardType="numeric"
            onChangeText={text => setOtp(text)}
            style={{color: '#131313', fontWeight: '600', fontSize: 16}}
          />
        </View>
      </View>
      <View
        style={{
          marginTop: 220,
          alignItems: 'center',
        }}>
        <TouchableOpacity
          onPress={handleForgotReset}
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
            Continue
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

export default ForgotPassword;
