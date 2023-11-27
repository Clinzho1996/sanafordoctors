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
} from 'react-native';
import React, {useState, useEffect} from 'react';
import Icon from 'react-native-vector-icons/Ionicons';
import {Switch} from 'react-native-paper';

const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;

const Notifications = ({navigation}) => {
  const [isSwitchOn, setIsSwitchOn] = useState(true);
  const [isSwitchOnTwo, setIsSwitchOnTwo] = useState(false);
  const [isSwitchOnThree, setIsSwitchOnThree] = useState(false);

  const onToggleSwitch = () => setIsSwitchOn(!isSwitchOn);
  const onToggleSwitchTwo = () => setIsSwitchOnTwo(!isSwitchOnTwo);
  const onToggleSwitchThree = () => setIsSwitchOnThree(!isSwitchOnThree);
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
            marginLeft: '30%',
            color: '#131313',
            fontSize: 16,
            fontFamily: 'Inter-Bold',
          }}>
          Notifications
        </Text>
      </View>
      {/* forms for registration */}
      <View style={{paddingTop: 30}}>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: 10,
            marginTop: 20,
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
                  color: '#13085E',
                  fontFamily: 'Inter-Bold',
                  fontSize: 16,
                }}>
                Dosage alert
              </Text>
            </View>
          </View>
          <Switch
            value={isSwitchOn}
            onValueChange={onToggleSwitch}
            color="#4263EB"
          />
        </View>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: 10,
            marginTop: 20,
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
                  color: '#13085E',
                  fontFamily: 'Inter-Bold',
                  fontSize: 16,
                }}>
                Appointment alert
              </Text>
            </View>
          </View>
          <Switch
            value={isSwitchOnTwo}
            onValueChange={onToggleSwitchTwo}
            color="#4263EB"
          />
        </View>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: 10,
            marginTop: 20,
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
                  color: '#13085E',
                  fontFamily: 'Inter-Bold',
                  fontSize: 16,
                }}>
                Sort Dosage alert
              </Text>
            </View>
          </View>
          <Switch
            value={isSwitchOnThree}
            onValueChange={onToggleSwitchThree}
            color="#4263EB"
          />
        </View>
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

export default Notifications;
