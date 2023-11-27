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
  ActivityIndicator,
  Alert,
  ImageBackground,
  Image,
} from 'react-native';
import React, {useState, useEffect} from 'react';
import Icon from 'react-native-vector-icons/Ionicons';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {ScrollView} from 'react-native';

const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;

const Login = ({navigation}) => {
  const [showPassword, setShowPassword] = useState(false);
  const [checked, setChecked] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      console.log('Name and password are required.');
      Alert.alert('Error', 'Name and email are required.');
      return;
    }
    setIsLoading(true);
    try {
      const response = await axios.post(
        'https://med-adherence-app.vercel.app/api/accounts/token/',
        {
          email: email,
          password: password,
        },
      );
      console.log('Login: ', response.data);
      await AsyncStorage.setItem('userToken', response.data.access);
      console.log('User Token:', response.data.access);
      await AsyncStorage.setItem('refreshToken', response.data.refresh);
      navigation.navigate('Main');
    } catch (error) {
      console.log('Error:', error);
      Alert.alert('Error', error.response.data.detail);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View>
        <ImageBackground source={require('../assets/bg2.png')}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Icon
              name="arrow-back"
              color="#000"
              size={20}
              style={{
                backgroundColor: '#fff',
                padding: 10,
                borderRadius: 30,
                width: 40,
              }}
            />
          </TouchableOpacity>
          <View
            style={{
              display: 'flex',
              alignItems: 'center',
              paddingTop: 100,
              flexDirection: 'row',
              justifyContent: 'center',
              paddingBottom: 30,
            }}>
            <Image
              source={require('../assets/logo2.png')}
              style={{width: 150, height: 50, objectFit: 'contain'}}
            />
          </View>
        </ImageBackground>
      </View>
      <View style={{marginTop: 50}}>
        <Text style={{fontSize: 24, color: '#240F51', fontWeight: '700'}}>
          Welcome back
        </Text>
        <Text
          style={{
            color: '#131313',
            fontSize: 16,
            fontWeight: '500',
            paddingTop: 10,
          }}>
          Hey you're back, fill in your details to get back in
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
          <TextInput
            placeholder="Email address"
            placeholderTextColor="#131313"
            onChangeText={text => setEmail(text)}
            style={{color: '#131313', fontFamily: 'Inter-Bold', fontSize: 16}}
          />
        </View>
        <View
          style={{
            backgroundColor: '#fff',
            paddingHorizontal: 20,
            borderRadius: 30,
            marginTop: 20,
          }}>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}>
            <TextInput
              placeholder="Your Password"
              placeholderTextColor="#131313"
              secureTextEntry={!showPassword}
              onChangeText={text => setPassword(text)}
              style={{color: '#131313', fontFamily: 'Inter-Bold', fontSize: 16}}
            />
            <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
              <Icon
                name={showPassword ? 'eye-off' : 'eye'}
                color="#2C14DD"
                size={20}
              />
            </TouchableOpacity>
          </View>
        </View>
        <View
          style={{
            marginTop: 20,
            flexDirection: 'row',
            justifyContent: 'flex-end',
            alignItems: 'flex-start',
          }}>
          <Text
            style={{
              color: '#131313',
              fontSize: 16,
              fontWeight: '600',
              marginTop: 5,
            }}>
            <TouchableOpacity onPress={() => navigation.navigate('Forgot')}>
              <Text style={{color: '#2c14dd', fontSize: 16, fontWeight: '600'}}>
                Forgot Password ?
              </Text>
            </TouchableOpacity>
          </Text>
        </View>
      </View>
      <View
        style={{
          marginTop: 80,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>
        <TouchableOpacity
          onPress={() => navigation.navigate('Register')}
          style={{
            backgroundColor: '#2C14DD1A',
            paddingHorizontal: 20,
            paddingVertical: 10,
            borderRadius: 20,
          }}>
          <Text style={{color: '#2C14DD', fontWeight: '500'}}>Register</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={handleLogin}
          style={{
            backgroundColor: '#2C14DD',
            paddingHorizontal: 60,
            paddingVertical: 20,
            borderRadius: 30,
            flexDirection: 'row',
            justifyContent: 'space-around',
            alignItems: 'center',
            gap: 10,
          }}>
          <Text style={{color: '#fff', fontSize: 18, fontFamily: 'Inter-Bold'}}>
            Login
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
    </ScrollView>
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

export default Login;
