/* eslint-disable prettier/prettier */
/* eslint-disable react-native/no-inline-styles */
/* eslint-disable react/react-in-jsx-scope */

import {Linking} from 'react-native';
import {Image, StyleSheet, Text, View, TouchableOpacity} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

const Chats = ({navigation}) => {
  const handleCall = () => {
    // Assuming a phone number is to be called
    const phoneNumber = '08125306092'; // Replace with your desired phone number
    const url = `tel:${phoneNumber}`;
    Linking.openURL(url);
  };
  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 30,
        backgroundColor: '#FBFBFB',
      }}>
      <Image
        source={require('../assets/chat.png')}
        style={{width: 100, height: 100}}
      />
      <Text style={{textAlign: 'center', marginTop: 40, color: '#585858'}}>
        Chat functionalities are coming soon. {'\n'} In the meantime, feel free
        to reach us by tapping the call icon below.
      </Text>
      <View style={{position: 'absolute', bottom: 20, right: 20}}>
        <TouchableOpacity
          onPress={handleCall}
          style={{backgroundColor: '#1654CC', padding: 20, borderRadius: 30}}>
          <Icon name="call" color="#fff" size={20} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Chats;

const styles = StyleSheet.create({});
