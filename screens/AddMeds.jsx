/* eslint-disable prettier/prettier */
/* eslint-disable react/react-in-jsx-scope */
/* eslint-disable react-native/no-inline-styles */
/* eslint-disable react/self-closing-comp */

import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Dimensions,
  ScrollView,
  ActivityIndicator,
  Alert,
} from 'react-native';
import {Checkbox, RadioButton} from 'react-native-paper';
import Icon from 'react-native-vector-icons/Ionicons';
import {useState} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import RNPickerSelect from 'react-native-picker-select';

const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;

const AddMeds = ({navigation}) => {
  const [checked, setChecked] = useState(false);
  const [checkedSpecific, setCheckedSpecific] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [name, setName] = useState('');
  const [selectedForm, setSelectedForm] = useState(null);
  const [reason, setReason] = useState('');
  const [dose, setDose] = useState('');

  const handleAddMedication = async () => {
    setIsLoading(true);
    try {
      if (name.length === 0) {
        Alert.alert('Warning', 'Enter medication name');
      } else if (!selectedForm) {
        Alert.alert('Warning', 'Select medication form');
      } else if (reason.length === 0) {
        Alert.alert('Warning', 'Enter reason for medication');
      } else if (dose.length === 0) {
        Alert.alert('Warning', 'Enter number of dose');
      } else if (!checked && !checkedSpecific) {
        Alert.alert('Warning', 'Select specific medication method');
      } else {
        // If all fields are filled and a medication method is selected
        await AsyncStorage.setItem('medsName', name);
        await AsyncStorage.setItem('form', selectedForm);
        await AsyncStorage.setItem('reason', reason);
        await AsyncStorage.setItem('dose', dose.toString());

        const selectedTimeType = checked ? 'time intervals' : 'specific time';
        await AsyncStorage.setItem('timeType', selectedTimeType);

        // Navigate to the AddReminder screen if everything is completed

        console.log(name, selectedForm, selectedTimeType, reason, dose);
        navigation.navigate('AddReminder');
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <TouchableOpacity onPress={() => navigation.goBack()}>
        <Icon name="arrow-back" color="#000" size={25} />
      </TouchableOpacity>
      {/* medication form */}
      <View style={{marginTop: 20}}>
        <Text style={{fontSize: 20, fontWeight: '600', color: '#1654CC'}}>
          What is the name of the medication?
        </Text>
        <View
          style={{
            backgroundColor: '#F0F0F0',
            paddingHorizontal: 20,
            borderRadius: 10,
            marginTop: 20,
          }}>
          <TextInput
            placeholder="Enter medication name"
            placeholderTextColor="#131313"
            onChangeText={text => setName(text)}
            style={{color: '#131313', fontFamily: 'Inter-Bold', fontSize: 16}}
          />
        </View>
      </View>
      <View style={{marginTop: 20}}>
        <Text style={{fontSize: 20, fontWeight: '600', color: '#1654CC'}}>
          What form is the medication?
        </Text>
        <View
          style={{
            backgroundColor: '#F0F0F0',
            paddingHorizontal: 10,
            borderRadius: 10,
            marginTop: 20,
          }}>
          <RNPickerSelect
            placeholder={{label: 'Select medication form', value: null}}
            onValueChange={value => setSelectedForm(value)}
            placeholderTextColor="#131313"
            items={[
              {label: 'Capsule', value: 'Capsule'},
              {label: 'Cream', value: 'Cream'},
              {label: 'Drops', value: 'Drops'},
              {label: 'Gel', value: 'Gel'},
              {label: 'Injection', value: 'Injection'},
            ]}
            style={{
              inputAndroid: {
                fontSize: 20,
                paddingHorizontal: 10,
                paddingVertical: 30,
                borderWidth: 2,
                borderColor: '#D0FD3E',
                borderRadius: 8,
                color: '#131313',
                paddingRight: 30,
              },
              inputIOS: {
                fontSize: 16,
                paddingHorizontal: 10,
                paddingVertical: 12,
                borderWidth: 1,
                borderColor: '#2C2C2E',
                borderRadius: 8,
                color: '#131313',
                paddingRight: 30,
              },
            }}
          />
        </View>
      </View>
      <View style={{marginTop: 20}}>
        <Text style={{fontSize: 20, fontWeight: '600', color: '#1654CC'}}>
          What are you taking this medication for?
        </Text>
        <View
          style={{
            backgroundColor: '#F0F0F0',
            paddingHorizontal: 20,
            borderRadius: 10,
            marginTop: 20,
          }}>
          <TextInput
            placeholder="Enter reason here..."
            placeholderTextColor="#131313"
            onChangeText={text => setReason(text)}
            style={{color: '#131313', fontFamily: 'Inter-Bold', fontSize: 16}}
          />
        </View>
      </View>
      <View style={{marginTop: 20}}>
        <Text style={{fontSize: 20, fontWeight: '600', color: '#1654CC'}}>
          How many dose are you to take ?
        </Text>
        <View
          style={{
            backgroundColor: '#F0F0F0',
            paddingHorizontal: 20,
            borderRadius: 10,
            marginTop: 20,
          }}>
          <TextInput
            placeholder="Enter value here..."
            keyboardType="numeric"
            placeholderTextColor="#131313"
            onChangeText={text => setDose(text)}
            style={{color: '#131313', fontFamily: 'Inter-Bold', fontSize: 16}}
          />
        </View>
      </View>
      <View style={{marginTop: 20}}>
        <Text style={{fontSize: 20, fontWeight: '600', color: '#1654CC'}}>
          How do you want to take this medication?
        </Text>
        <View
          style={{
            borderRadius: 10,
            marginTop: 20,
            flexDirection: 'row',
            justifyContent: 'flex-start',
            alignItems: 'center',
            gap: 10,
          }}>
          <RadioButton
            status={checked ? 'checked' : 'unchecked'}
            color="#1654CC"
            onPress={() => {
              setChecked(true);
              setCheckedSpecific(false);
            }}
          />
          <Text style={{color: '#000000', fontSize: 14, fontWeight: '400'}}>
            I want to take it at time intervals
          </Text>
        </View>
        <View
          style={{
            borderRadius: 10,
            flexDirection: 'row',
            justifyContent: 'flex-start',
            alignItems: 'center',
            gap: 10,
          }}>
          <RadioButton
            status={checkedSpecific ? 'checked' : 'unchecked'}
            color="#1654CC"
            onPress={() => {
              setCheckedSpecific(true);
              setChecked(false);
            }}
          />
          <Text style={{color: '#000000', fontSize: 14, fontWeight: '400'}}>
            I want take it at a specific time
          </Text>
        </View>
      </View>
      <TouchableOpacity
        onPress={handleAddMedication}
        style={{
          backgroundColor: '#1654CC',
          padding: 15,
          borderRadius: 30,
          marginTop: 40,
          flexDirection: 'row',
          justifyContent: 'space-around',
          alignItems: 'center',
          gap: 10,
          marginBottom: 50,
        }}>
        <Text style={{color: '#fff', textAlign: 'center', fontSize: 20}}>
          Proceed
        </Text>
        {isLoading && (
          <ActivityIndicator
            size="small"
            color="white"
            style={{marginRight: 5}}
          />
        )}
      </TouchableOpacity>
    </ScrollView>
  );
};

export default AddMeds;

const styles = StyleSheet.create({
  container: {
    width: width,
    height: height,
    backgroundColor: '#fff',
    paddingHorizontal: 30,
    paddingVertical: 20,
  },
});
