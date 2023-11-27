/* eslint-disable prettier/prettier */
/* eslint-disable react-native/no-inline-styles */
/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */

import {
  StyleSheet,
  Text,
  View,
  Image,
  ActivityIndicator,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import React, {useState, useEffect} from 'react';
import StatusBarHeader from '../components/StatusBar';
import AsyncStorage from '@react-native-async-storage/async-storage';

const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;

const Onboarding = ({navigation}) => {
  const handlePress = () => {
    navigation.navigate('OnboardingTwo');
  };
  return (
    <View style={styles.container}>
      <StatusBarHeader />
      <View style={styles.skip}>
        <TouchableOpacity
          style={styles.btnSkip}
          onPress={() => navigation.navigate('Login')}>
          <Text
            style={{color: '#fff', fontSize: 14, fontFamily: 'Inter-Regular'}}>
            Skip
          </Text>
        </TouchableOpacity>
      </View>
      <View
        style={{
          padding: 20,
          justifyContent: 'center',
          flexDirection: 'row',
          marginTop: 50,
        }}>
        <Image source={require('../assets/patient.png')} style={styles.image} />
      </View>

      <View
        style={{
          backgroundColor: '#fff',
          paddingHorizontal: 10,
          paddingVertical: 30,
          borderRadius: 20,
          alignItems: 'center',
          marginTop: 70,
        }}>
        <Text
          style={{
            color: '#13085E',
            fontSize: 24,
            textAlign: 'center',
            fontFamily: 'Inter-Bold',
            fontWeight: '700',
          }}>
          Personalized Schedules
        </Text>
        <Text
          style={{
            color: '#13095ECC',
            fontSize: 14,
            textAlign: 'center',
            paddingHorizontal: 20,
            paddingTop: 20,
            fontFamily: 'Inter-Regular',
          }}>
          Tailored medication schedules to fit your hospitals routine and needs.
        </Text>
        <TouchableOpacity
          onPress={handlePress}
          style={{
            backgroundColor: '#2C14DD',
            paddingHorizontal: 70,
            paddingVertical: 20,
            borderRadius: 30,
            marginTop: 20,
            elevation: 5,
          }}>
          <Text
            style={{color: '#fff', fontSize: 16, fontFamily: 'Inter-Regular'}}>
            Next
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Onboarding;

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#4C36ED',
    height: height,
    width: width,
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  skip: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  btnSkip: {
    backgroundColor: '#FFFFFF26',
    paddingHorizontal: 15,
    paddingVertical: 5,
    borderRadius: 25,
  },
  image: {
    resizeMode: 'contain',
    justifyContent: 'center',
    height: 250,
    alignItems: 'center',
  },
});
