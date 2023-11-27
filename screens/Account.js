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
  Image,
  ActivityIndicator,
  Alert,
  ScrollView,
} from 'react-native';
import React, {useState, useEffect} from 'react';
import Icon from 'react-native-vector-icons/Ionicons';
import ImagePicker from 'react-native-image-crop-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import {androidCameraPermission} from './permission';
import {useAvatar} from '../components/AvatarContext';

const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;

const Account = ({navigation}) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [userData, setUserData] = useState(null); // Initialize user data state

  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const fetchUserId = async () => {
      const token = await AsyncStorage.getItem('userToken');
      setIsLoading(true);

      axios
        .get(`https://med-adherence-app.vercel.app/api/accounts/`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then(response => {
          console.log('User Profile:', response.data.pk);
          console.log('User Profile:', token);
          setUserId(response.data.pk);
        })
        .catch(error => {
          console.error('Error:', error);
        })
        .finally(() => {
          setIsLoading(false);
        });
    };

    fetchUserId();
  }, []);

  const handlePermissionRequest = async () => {
    const permissionGranted = await androidCameraPermission();
    if (permissionGranted) {
      console.log('Permissions granted');
    } else {
      console.log('Permissions denied');
    }
  };

  useEffect(() => {
    handlePermissionRequest();
  }, []);

  const {avatarUri, setAvatarUri} = useAvatar();

  const openImagePicker = async () => {
    try {
      const image = await ImagePicker.openPicker({
        width: 300,
        height: 300,
        cropping: true,
      });

      if (image && image.path) {
        setAvatarUri(image.path);
        await AsyncStorage.setItem('avatarUri', image.path);
      }
    } catch (error) {
      console.log('Error picking image:', error);
    }
  };

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

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    const token = await AsyncStorage.getItem('userToken');
    setIsLoading(true);

    axios
      .get(`https://med-adherence-app.vercel.app/api/accounts/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then(response => {
        // Handle the successful response here
        console.log('User Profile:', response.data);
        setUserData(response.data);
      })
      .catch(error => {
        console.error('Error:', error);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const handleProfileUpdate = async () => {
    setIsLoading(true);
    try {
      const response = await axios.patch(
        `https://med-adherence-app.vercel.app/api/accounts/${userId}/update/`,
        {
          full_name: name,
          email: email,
          phone: '',
        },
      );
      console.log('Register: ', response.data);
      Alert.alert('Success', response.data.message);
    } catch (error) {
      console.log('Error:', error.response.data);
      Alert.alert('Error', error);
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <ScrollView style={styles.container}>
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
            color="#1654CC"
            size={20}
            style={{backgroundColor: '#F0F0F0', padding: 10, borderRadius: 30}}
          />
        </TouchableOpacity>
        <Text
          style={{
            textAlign: 'center',
            marginLeft: '20%',
            color: '#fff',
            fontSize: 20,
            fontFamily: 'integralcf-bold',
          }}>
          edit profile
        </Text>
      </View>
      <View
        style={{
          marginTop: 50,
          alignItems: 'center',
          position: 'relative',
        }}>
        {avatarUri ? (
          <Image
            source={{uri: avatarUri}}
            style={{
              width: 100,
              height: 100,
              borderRadius: 75,
            }}
          />
        ) : (
          <Image
            source={require('../assets/avatar.png')}
            style={{width: 100, height: 100}}
          />
        )}

        <TouchableOpacity
          onPress={openImagePicker}
          style={{marginTop: 20, position: 'absolute', bottom: 0, right: 120}}>
          <Image
            source={require('../assets/camera.png')}
            style={{width: 40, height: 40}}
          />
        </TouchableOpacity>
      </View>
      {/* forms for registration */}
      <View style={{paddingTop: 30}}>
        <View
          style={{
            paddingHorizontal: 20,
            borderRadius: 30,
            marginTop: 10,
            borderBottomColor: '#F0F0F0',
            borderBottomWidth: 1,
          }}>
          <Text
            style={{
              color: '#F0F0F0',
              fontSize: 12,
              fontFamily: 'Inter-Medium',
              paddingTop: 10,
            }}>
            Name
          </Text>
          {isLoading ? (
            <Text
              style={{
                color: '#fff',
                fontFamily: 'Inter-Bold',
                textTransform: 'capitalize',
              }}>
              Loading...
            </Text>
          ) : (
            <TextInput
              placeholder={userData && userData.full_name}
              placeholderTextColor="#fff"
              onChangeText={text => setName(text)}
              style={{
                color: '#fff',
                fontFamily: 'Inter-Medium',
                fontSize: 17,
                textTransform: 'capitalize',
              }}
            />
          )}
        </View>
        <View
          style={{
            paddingHorizontal: 20,
            borderRadius: 30,
            marginTop: 10,
            borderBottomColor: '#F0F0F0',
            borderBottomWidth: 1,
          }}>
          <Text
            style={{
              color: '#F0F0F0',
              fontSize: 12,
              fontFamily: 'Inter-Medium',
              paddingTop: 10,
            }}>
            Email
          </Text>
          {isLoading ? (
            <Text
              style={{
                color: '#fff',
                fontFamily: 'Inter-Bold',
                textTransform: 'capitalize',
              }}>
              Loading...
            </Text>
          ) : (
            <TextInput
              placeholder={userData && userData.email}
              placeholderTextColor="#fff"
              onChangeText={text => setEmail(text)}
              style={{
                color: '#fff',
                fontFamily: 'Inter-Medium',
                fontSize: 17,
                textTransform: 'capitalize',
              }}
            />
          )}
        </View>
      </View>
      <View
        style={{
          marginTop: 220,
          alignItems: 'center',
        }}>
        <TouchableOpacity
          style={{
            backgroundColor: '#fff',
            paddingHorizontal: 120,
            paddingVertical: 20,
            borderRadius: 40,
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: 10,
          }}>
          <Text
            style={{
              color: '#1654CC',
              fontSize: 18,
              fontFamily: 'Inter-Bold',
              textAlign: 'center',
              fontWeight: '600',
            }}>
            Save
          </Text>
          {isLoading && <ActivityIndicator size="large" color="blue" />}
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#1654CC',
    height: height,
    flex: 1,
    width: width,
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
});

export default Account;
