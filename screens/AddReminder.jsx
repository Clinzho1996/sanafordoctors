/* eslint-disable prettier/prettier */
/* eslint-disable react/react-in-jsx-scope */
/* eslint-disable react-native/no-inline-styles */
/* eslint-disable react/self-closing-comp */

import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Dimensions,
  ScrollView,
  Alert,
  ActivityIndicator,
  Platform,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import {useCallback, useEffect, useState} from 'react';
import {DatePickerModal, TimePickerModal} from 'react-native-paper-dates';
import AsyncStorage from '@react-native-async-storage/async-storage';
import PushNotification, {Importance} from 'react-native-push-notification';
import BackgroundFetch from 'react-native-background-fetch';
import firebase from '../firebase';
import axios from 'axios';

const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;

const AddReminder = ({navigation}) => {
  const isTimesEmpty = !selectedTimes || selectedTimes.length === 0;
  const [isLoading, setIsLoading] = useState(false);
  const [range, setRange] = useState({
    startDate: undefined,
    endDate: undefined,
  });

  const [visible, setVisible] = useState(false);
  const [visibleDate, setVisibleDate] = useState(false);
  const [selectedTimes, setSelectedTimes] = useState([]);
  const [selectedDate, setSelectedDate] = useState([]);
  const [selectedTime, setSelectedTime] = useState([{hours: 12, minutes: 0}]);

  useEffect(() => {
    // Configure notification channel
    PushNotification.createChannel(
      {
        channelId: 'sana',
        channelName: 'Sana Medical Adherence',
        channelDescription: 'Klusterthon Medical Adherence',
        soundName: 'default',
        importance: 4,
        vibrate: true,
      },
      created => console.log(`createChannel returned '${created}'`),
    );

    // Request permission for push notifications
    const requestNotificationPermission = async () => {
      try {
        const messaging = firebase.messaging();
        await messaging.requestPermission();
        const token = await messaging.getToken();
        console.log('FCM Token:', token);

        // Handle incoming FCM messages
        messaging.onMessage(message => {
          console.log('FCM Message:', message);
          // Extract necessary data and trigger local notification
          const {medsName} = message.data; // Adjust based on your FCM payload
          if (medsName) {
            PushNotification.localNotification({
              channelId: 'sana', // Use the channel you created
              title: 'Medication Reminder',
              message: `Don't forget to take ${medsName}`,
              importance: 'high',
            });
          }
        });
      } catch (error) {
        console.error(
          'Failed to request permission for push notifications:',
          error,
        );
      }
    };

    requestNotificationPermission();

    return () => {
      // Clean up notification channel and background fetch
      PushNotification.cancelAllLocalNotifications();
      PushNotification.deleteChannel('sana');
    };
  }, []);
  const onConfirmDate = useCallback(
    ({startDate, endDate}) => {
      // Add one day to the start date
      const adjustedStartDate = new Date(startDate);
      adjustedStartDate.setDate(adjustedStartDate.getDate() + 1);

      setVisibleDate(false);
      setRange({startDate, endDate});

      setSelectedDate([
        adjustedStartDate.toISOString().split('T')[0],
        endDate.toISOString().split('T')[0],
      ]);
    },
    [setVisibleDate, setRange, setSelectedDate],
  );

  const onDismissDate = useCallback(() => {
    setVisibleDate(false);
  }, [setVisibleDate]);

  const onDismiss = useCallback(() => {
    setVisible(false);
  }, [setVisible]);

  const onConfirm = ({hours, minutes}) => {
    setVisible(false);
    const newTime = {hours, minutes};
    const updatedTimes = [...selectedTime, newTime]; // or selectedTime.concat(newTime);
    setSelectedTime(updatedTimes);

    // Save the updated reminder data to AsyncStorage
    AsyncStorage.setItem('reminderData', JSON.stringify(updatedTimes))
      .then(() => console.log('Reminder data saved successfully'))
      .catch(error => console.error('Error saving reminder data:', error));
  };

  const handleDeleteTime = index => {
    const updatedTimes = [...selectedTime];
    updatedTimes.splice(index, 1);
    setSelectedTime(updatedTimes);

    // Update AsyncStorage with the updated times array
    AsyncStorage.setItem('reminderData', JSON.stringify(updatedTimes))
      .then(() => console.log('Reminder data updated successfully'))
      .catch(error => console.error('Error updating reminder data:', error));
  };

  const handleDeleteDate = index => {
    const updatedDates = [...selectedDate];
    updatedDates.splice(index, 1);
    setSelectedDate(updatedDates);

    // Update AsyncStorage with the updated dates array
    AsyncStorage.setItem('selectedDate', JSON.stringify(updatedDates))
      .then(() => console.log('Selected dates updated successfully'))
      .catch(error => console.error('Error updating selected dates:', error));
  };

  const handleAddReminder = async () => {
    setIsLoading(true);
    try {
      const name = await AsyncStorage.getItem('medsName');
      const form = await AsyncStorage.getItem('form');
      const reason = await AsyncStorage.getItem('reason');
      const dose = await AsyncStorage.getItem('dose');
      const selectedTimes = JSON.parse(
        await AsyncStorage.getItem('reminderData'),
      );

      const selectedDates = selectedDate
        .map(date => {
          return selectedTimes.map(time => {
            const formattedDateTime = `${date}T${time.hours
              .toString()
              .padStart(2, '0')}:${time.minutes
              .toString()
              .padStart(2, '0')}:00Z`;
            return formattedDateTime;
          });
        })
        .flat();

      for (const date of selectedDate) {
        for (const time of selectedTimes) {
          const scheduledDateTime = new Date(date);
          scheduledDateTime.setHours(time.hours, time.minutes, 0, 0);

          // Check if the scheduled time is in the future
          if (scheduledDateTime > new Date()) {
            // Schedule a notification for each selected date and time in the future
            PushNotification.localNotificationSchedule({
              channelId: 'sana',
              title: 'Medication Reminder',
              message: `Don't forget to take ${name}`, // Use the medication name here
              date: scheduledDateTime, // Set the date and time for the notification
              importance: Importance.HIGH,
            });
          }
        }
      }

      const payload = {
        drug_name: name,
        drug_form: form,
        medication_reason: reason,
        num_of_dose: parseInt(dose),
        set_times: selectedDates,
      };

      const token = await AsyncStorage.getItem('userToken');
      const response = await axios.post(
        'https://med-adherence-app.vercel.app/api/med/register-medication/',
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      console.log('Response:', response.data);
      await AsyncStorage.setItem('medId', String(response.data.medication.pk));

      // Handle success and navigation here
      Alert.alert('Success', response.data.message);
      navigation.navigate('Main');
    } catch (error) {
      console.error('Error:', error.response.data);
      // Handle error and display an alert if needed
      Alert.alert('Error', error.response.data.message);
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
          At what time would you like a reminder?
        </Text>
        {/* Display selected times */}
        {selectedTime.length > 0 && (
          <View style={{marginTop: 20}}>
            <Text style={{fontSize: 18, fontWeight: '600', color: '#1654CC'}}>
              Selected Times:
            </Text>
            {selectedTime.map((time, index) => (
              <View
                key={index}
                style={{
                  flexDirection: 'row',
                  marginTop: 10,
                  justifyContent: 'space-between',
                }}>
                <Text style={{fontSize: 16, color: '#000'}}>
                  Reminder set at
                  <Text style={{fontWeight: '600', color: '#1654CC'}}>
                    {' '}
                    {`${time.hours.toString().padStart(2, '0')}:${time.minutes
                      .toString()
                      .padStart(2, '0')}`}
                  </Text>
                </Text>
                <TouchableOpacity onPress={() => handleDeleteTime(index)}>
                  <Icon name="trash" size={20} color="#E11D3A" />
                </TouchableOpacity>
              </View>
            ))}
          </View>
        )}
        <View
          style={{
            borderRadius: 10,
            marginTop: 20,
          }}>
          <TouchableOpacity
            onPress={() => setVisible(true)}
            uppercase={false}
            mode="outlined"
            style={{
              flexDirection: 'row',
              justifyContent: 'flex-start',
              gap: 10,
            }}>
            <Icon
              name="add"
              size={15}
              color="#313131"
              style={{fontWeight: '600'}}
            />
            <Text
              style={{
                color: '#313131',
                fontSize: 14,
                fontWeight: '600',
              }}>
              {isTimesEmpty ? 'Add reminder time' : 'Add another time today'}
            </Text>
          </TouchableOpacity>
          <TimePickerModal
            visible={visible}
            onDismiss={onDismiss}
            onConfirm={onConfirm}
            hours={selectedTime.hours}
            minutes={selectedTime.minutes}
          />
        </View>
      </View>
      <View style={{marginTop: 20}}>
        <Text style={{fontSize: 20, fontWeight: '600', color: '#1654CC'}}>
          At what dates would you like a reminder?
        </Text>
        {/* Display selected times */}
        {selectedDate && selectedDate.length > 0 && (
          <View style={{marginTop: 20}}>
            <Text style={{fontSize: 18, fontWeight: '600', color: '#1654CC'}}>
              Selected Dates:
            </Text>
            {selectedDate.map((date, index) => (
              <View
                key={index}
                style={{
                  flexDirection: 'row',
                  marginTop: 10,
                  justifyContent: 'space-between',
                }}>
                <Text style={{fontSize: 16, color: '#000'}}>
                  Reminder date at{' '}
                  <Text style={{fontWeight: '600', color: '#1654CC'}}>
                    {date}
                  </Text>
                </Text>
                <TouchableOpacity onPress={() => handleDeleteDate(index)}>
                  <Icon name="trash" size={20} color="#E11D3A" />
                </TouchableOpacity>
              </View>
            ))}
          </View>
        )}
        <View
          style={{
            borderRadius: 10,
            marginTop: 20,
          }}>
          <TouchableOpacity
            onPress={() => setVisibleDate(true)}
            uppercase={false}
            mode="outlined"
            style={{
              flexDirection: 'row',
              justifyContent: 'flex-start',
              gap: 10,
            }}>
            <Icon
              name="add"
              size={15}
              color="#313131"
              style={{fontWeight: '600'}}
            />
            <Text
              style={{
                color: '#313131',
                fontSize: 14,
                fontWeight: '600',
              }}>
              Add reminder dates
            </Text>
          </TouchableOpacity>
          <DatePickerModal
            visible={visibleDate}
            onDismiss={onDismissDate}
            onConfirm={onConfirmDate}
            mode="range"
            startDate={range.startDate}
            endDate={range.endDate}
            locale="en-GB"
          />
        </View>
      </View>
      <TouchableOpacity
        onPress={handleAddReminder}
        style={{
          backgroundColor: '#1654CC',
          padding: 15,
          borderRadius: 30,
          marginTop: 50,
          flexDirection: 'row',
          justifyContent: 'space-around',
          alignItems: 'center',
          gap: 10,
        }}>
        <Text style={{color: '#fff', textAlign: 'center', fontSize: 20}}>
          Save reminder
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

export default AddReminder;

const styles = StyleSheet.create({
  container: {
    width: width,
    height: height,
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
});
