/* eslint-disable prettier/prettier */
/* eslint-disable react-native/no-inline-styles */
/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */

import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  ActivityIndicator,
} from 'react-native';
import React, {useState, useEffect} from 'react';
import Material from 'react-native-vector-icons/MaterialIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useAvatar} from '../components/AvatarContext';
import axios from 'axios';

const height = Dimensions.get('window').height;

const Profile = ({navigation}) => {
  const {avatarUri, setAvatarUri} = useAvatar();
  const [isLoading, setIsLoading] = useState(true); // Initialize loading state
  const [userData, setUserData] = useState(null); // Initialize user data state

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
    const userId = await AsyncStorage.getItem('userId');
    const token = await AsyncStorage.getItem('userToken');
    setIsLoading(true); // Set loading state to true while fetching

    axios
      .get(`https://med-adherence-app.vercel.app/api/accounts/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then(response => {
        // Handle the successful response here
        console.log('User Profile:', response.data);
        console.log('User Profile:', token);
        setUserData(response.data); // Set user data in state
      })
      .catch(error => {
        // Handle any errors that occurred during the request
        console.error('Error:', error);
      })
      .finally(() => {
        setIsLoading(false); // Set loading state to false when request completes
      });
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
          backgroundColor: '#F7F7F7',
        }}>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingHorizontal: 20,
          }}>
          <Text
            style={{
              color: '#1654CC',
              fontFamily: 'Inter-Regular',
              fontSize: 16,
            }}>
            Profile
          </Text>
          <TouchableOpacity onPress={() => navigation.navigate('Account')}>
            <Text
              style={{
                color: '#1654CC',
                fontSize: 16,
                fontFamily: 'Inter-Regular',
                opacity: 0.7,
              }}>
              Edit Profile
            </Text>
          </TouchableOpacity>
        </View>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'flex-start',
            alignItems: 'center',
            gap: 10,
            paddingHorizontal: 20,
            paddingTop: 30,
          }}>
          <View>
            {avatarUri ? (
              <Image
                source={{uri: avatarUri}}
                style={{width: 80, height: 80, borderRadius: 75}}
              />
            ) : (
              <Image
                source={require('../assets/avatar.png')}
                style={{width: 55, height: 55}}
              />
            )}
          </View>
          {isLoading ? (
            <Text
              style={{
                color: '#1654CC',
                fontFamily: 'Inter-Bold',
                textTransform: 'capitalize',
              }}>
              Loading...
            </Text>
          ) : (
            <View>
              <Text
                style={{
                  color: '#1654CC',
                  fontSize: 24,
                  fontFamily: 'Inter-Bold',
                  textTransform: 'capitalize',
                }}>
                {userData && userData.full_name}
              </Text>
              <Text
                style={{
                  color: '#1654CC',
                  fontFamily: 'Inter-Regular',
                  fontSize: 16,
                }}>
                {userData && userData.email}
              </Text>
            </View>
          )}
        </View>
      </View>
      <ScrollView
        style={{
          backgroundColor: '#1654CC',
          paddingTop: 20,
          paddingHorizontal: 20,
          borderTopRightRadius: 20,
          borderTopLeftRadius: 20,
          paddingBottom: 40,
          marginTop: 20,
          height: height,
        }}>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: 10,
            marginTop: 20,
            paddingBottom: 20,
            borderBottomColor: '#F0F0F0',
            borderBottomWidth: 1,
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
                  color: '#fff',
                  fontFamily: 'Inter-Bold',
                  fontSize: 16,
                }}>
                My Profile
              </Text>
            </View>
          </View>
          <TouchableOpacity onPress={() => navigation.navigate('Account')}>
            <Material
              name="arrow-forward-ios"
              color="#DACDFE"
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
            paddingBottom: 20,
            borderBottomColor: '#F0F0F0',
            borderBottomWidth: 1,
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
                  color: '#fff',
                  fontFamily: 'Inter-Bold',
                  fontSize: 16,
                }}>
                Settings
              </Text>
            </View>
          </View>
          <TouchableOpacity onPress={() => navigation.navigate('Settings')}>
            <Material
              name="arrow-forward-ios"
              color="#DACDFE"
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
            paddingBottom: 20,
            borderBottomColor: '#F0F0F0',
            borderBottomWidth: 1,
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
                  color: '#fff',
                  fontFamily: 'Inter-Bold',
                  fontSize: 16,
                }}>
                Privacy Policy
              </Text>
            </View>
          </View>
          <TouchableOpacity onPress={() => navigation.navigate('Privacy')}>
            <Material
              name="arrow-forward-ios"
              color="#DACDFE"
              size={20}
              style={{
                padding: 5,
                borderRadius: 20,
              }}
            />
          </TouchableOpacity>
        </View>
        <TouchableOpacity
          onPress={handleLogout}
          style={{
            paddingVertical: 20,
            borderBottomColor: '#F0F0F0',
            borderBottomWidth: 1,
            borderTopColor: '#F0F0F0',
            borderTopWidth: 1,
            marginTop: 100,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}>
          <Text style={{color: '#FFf', fontSize: 17, fontWeight: '600'}}>
            Sign Out
          </Text>
          {isLoading && <ActivityIndicator size="small" color="white" />}
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

export default Profile;

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#F7F7F7',
    paddingTop: 20,
  },
});
