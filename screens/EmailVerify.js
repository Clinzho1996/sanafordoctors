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
} from 'react-native';
import React, {useState, useEffect} from 'react';
import axios from 'axios';
import {ActivityIndicator} from 'react-native';

const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;

const EmailVerify = ({navigation}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [token, setToken] = useState('');

  const handleVerify = async () => {
    setIsLoading(true);
    try {
      const response = await axios.post(
        'https://spendtrack.wtglaundrymanagement.com/api/auth/verify',
        {
          token: token,
        },
      );
      console.log('Login: ', response.data);
      Alert.alert('Success', response.data);
      navigation.navigate('Login');
    } catch (error) {
      console.log('Error:', error);
      Alert.alert('Error', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View
        style={{
          justifyContent: 'center',
          textAlign: 'center',
          alignItems: 'center',
          paddingTop: 20,
        }}>
        <Image
          source={require('../assets/mail.png')}
          style={{resizeMode: 'contain', height: 350, width: 350}}
        />
        <Text
          style={{
            fontSize: 24,
            color: '#240F51',
            fontWeight: 700,
            textAlign: 'center',
          }}>
          We have sent an email verification code to your email
        </Text>
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
          Verification code
        </Text>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}>
          <TextInput
            placeholder="Enter OTP here"
            placeholderTextColor="#131313"
            onChangeText={text => setToken(text)}
            style={{color: '#131313', fontFamily: 'Inter-Bold', fontSize: 16}}
          />
        </View>
      </View>
      <View
        style={{
          marginTop: 80,
          alignItems: 'center',
        }}>
        <TouchableOpacity
          onPress={handleVerify}
          style={{
            backgroundColor: '#2C14DD',
            paddingHorizontal: 80,
            paddingVertical: 20,
            borderRadius: 30,
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
            Verify my account
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

export default EmailVerify;
