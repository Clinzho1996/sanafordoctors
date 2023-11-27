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

const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;

const GetStarted = ({navigation}) => {
  const handlePress = () => {
    navigation.navigate('OnboardingTwo');
  };
  return (
    <View style={styles.container}>
      <StatusBarHeader />
      <View style={styles.skip}>
        <TouchableOpacity
          style={styles.btnSkip}
          onPress={() => navigation.navigate('Main')}>
          <Text style={{color: '#fff', fontSize: 14}}>Skip</Text>
        </TouchableOpacity>
      </View>
      <View>
        <Text
          style={{color: '#EAE7FD', fontSize: 24, fontFamily: 'Inter-Bold'}}>
          Get started
        </Text>
        <Text
          style={{
            color: '#EAE7FD',
            fontSize: 14,
            paddingTop: 10,
            fontFamily: 'Inter-Regular',
          }}>
          Get most out of your KudiTrak account
        </Text>
      </View>
      <View style={{marginTop: 10}}>
        <TouchableOpacity
          style={styles.btnCard}
          onPress={() => navigation.navigate('EmailVerify')}>
          <View
            style={{paddingHorizontal: 10, paddingVertical: 20, width: '75%'}}>
            <Text
              style={{color: '#fff', fontSize: 17, fontFamily: 'Inter-Bold'}}>
              Verify your email address
            </Text>
            <Text
              style={{
                color: '#eae7fd',
                fontSize: 12,
                fontFamily: 'Inter-Regular',
                marginTop: 10,
              }}>
              This is the bank account we would track and manage your spendings
            </Text>
          </View>
          <View style={{position: 'absolute', right: 0, bottom: 0}}>
            <Image
              source={require('../assets/mailhalf.png')}
              style={{
                width: 100,
                height: 100,
                borderRadius: 20,
                marginLeft: -20,
              }}
            />
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.btnCard}
          onPress={() => navigation.navigate('ConnectBank')}>
          <View
            style={{paddingHorizontal: 10, paddingVertical: 20, width: '75%'}}>
            <Text
              style={{color: '#fff', fontSize: 17, fontFamily: 'Inter-Bold'}}>
              Connect your bank account
            </Text>
            <Text
              style={{
                color: '#eae7fd',
                fontSize: 12,
                fontFamily: 'Inter-Regular',
                marginTop: 10,
              }}>
              This is the bank account we would track and manage your spendings
            </Text>
          </View>
          <View style={{position: 'absolute', right: 0, bottom: 0}}>
            <Image
              source={require('../assets/bank.png')}
              style={{
                width: 100,
                height: 100,
                borderRadius: 20,
                marginLeft: -20,
              }}
            />
          </View>
        </TouchableOpacity>
        <TouchableOpacity style={styles.btnCard}>
          <View
            style={{paddingHorizontal: 10, paddingVertical: 20, width: '75%'}}>
            <Text
              style={{color: '#fff', fontSize: 17, fontFamily: 'Inter-Bold'}}>
              Tell us more about you
            </Text>
            <Text
              style={{
                color: '#eae7fd',
                fontSize: 12,
                fontFamily: 'Inter-Regular',
                marginTop: 10,
              }}>
              This is the bank account we would track and manage your spendings
            </Text>
          </View>
          <View style={{position: 'absolute', right: 0, bottom: 0}}>
            <Image
              source={require('../assets/user.png')}
              style={{
                width: 100,
                height: 100,
                borderRadius: 20,
                marginLeft: -20,
              }}
            />
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default GetStarted;

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#4C36ED',
    height: height,
    width: width,
    paddingHorizontal: 20,
    paddingVertical: 20,
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
    height: 350,
    alignItems: 'center',
  },
  btnCard: {
    backgroundColor: '#FFFFFF26',
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderRadius: 20,
    marginTop: 30,
  },
});
