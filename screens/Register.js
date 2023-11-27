/* eslint-disable prettier/prettier */
/* eslint-disable react-native/no-inline-styles */
/* eslint-disable no-unused-vars */
import {
  View,
  Text,
  TextInput,
  ScrollView,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  Alert,
  ImageBackground,
} from 'react-native';
import React, {useState, useEffect} from 'react';
import Icon from 'react-native-vector-icons/Ionicons';
import {Checkbox} from 'react-native-paper';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;

const Register = ({navigation}) => {
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordTwo, setShowPasswordTwo] = useState(false);
  const [checked, setChecked] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleRegister = async () => {
    if (!email || !password) {
      console.log('Name and password are required.');
      Alert.alert('Error', 'Name and email are required.');
      return;
    }
    setIsLoading(true);
    try {
      const response = await axios.post(
        'https://med-adherence-app.vercel.app/api/accounts/doctor-register/',
        {
          full_name: name,
          email: email,
          password: password,
          phone: phone,
        },
      );
      // Check if response.data.id exists before setting it in AsyncStorage

      await AsyncStorage.setItem('userId', String(response.data.user.pk));
      await AsyncStorage.setItem(
        'userName',
        String(response.data.user.full_name),
      );
      await AsyncStorage.setItem('userToken', response.data.token.access);
      await AsyncStorage.setItem('refreshToken', response.data.token.refresh);
      navigation.navigate('Main');

      console.log('Register: ', response.data);
    } catch (error) {
      console.log('Error:', error);
      Alert.alert('Error', error.response.data.email[0]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
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
      <View style={{marginTop: 0}}>
        <Text
          style={{
            color: '#131313',
            fontSize: 16,
            fontFamily: 'Inter-Regular',
            paddingTop: 10,
          }}>
          Complete the sign up to get started
        </Text>
      </View>
      {/* forms for registration */}
      <View style={{paddingTop: 30}}>
        <View
          style={{
            backgroundColor: '#fff',
            paddingHorizontal: 20,
            borderRadius: 30,
          }}>
          <TextInput
            placeholder="Enter Your Name"
            placeholderTextColor="#131313"
            onChangeText={text => setName(text)}
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
          <TextInput
            placeholder="Email Address"
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
          <TextInput
            placeholder="Phone Number"
            placeholderTextColor="#131313"
            onChangeText={text => setPhone(text)}
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
              style={{
                color: '#131313',
                fontFamily: 'Inter-Bold',
                fontSize: 16,
              }}
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
            justifyContent: 'flex-start',
            alignItems: 'flex-start',
          }}>
          <Checkbox
            status={checked ? 'checked' : 'unchecked'}
            color="#2C14DD"
            onPress={() => {
              setChecked(!checked);
            }}
          />
          <Text
            style={{
              color: '#131313',
              fontSize: 16,
              fontFamily: 'Inter-Bold',
              marginTop: 5,
            }}>
            By signing up, you agree to the
            <TouchableOpacity>
              <Text
                style={{
                  color: '#2c14dd',
                  fontSize: 16,
                  fontFamily: 'Inter-Bold',
                }}>
                Terms of Service and Privacy Policy
              </Text>
            </TouchableOpacity>
          </Text>
        </View>
      </View>
      <View
        style={{
          marginTop: 30,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingBottom: 50,
        }}>
        <TouchableOpacity
          onPress={() => navigation.navigate('Login')}
          style={{
            backgroundColor: '#2C14DD1A',
            paddingHorizontal: 20,
            paddingVertical: 10,
            borderRadius: 20,
          }}>
          <Text style={{color: '#2C14DD', fontFamily: 'Inter-Regular'}}>
            Login
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={handleRegister}
          style={{
            backgroundColor: '#2C14DD',
            paddingHorizontal: 60,
            paddingVertical: 20,
            borderRadius: 30,
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: 10,
          }}>
          <Text style={{color: '#fff', fontSize: 18, fontFamily: 'Inter-Bold'}}>
            Register
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

export default Register;
