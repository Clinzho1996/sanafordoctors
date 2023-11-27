/* eslint-disable prettier/prettier */
/* eslint-disable react-native/no-inline-styles */
/* eslint-disable react-hooks/exhaustive-deps */

import React, {useState, useEffect} from 'react';
import {View, TouchableOpacity, Text, Image, Dimensions} from 'react-native';
import {Agenda} from 'react-native-calendars';
import Icon from 'react-native-vector-icons/Ionicons';
import StatusBarHeader from '../components/StatusBar';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {ActivityIndicator} from 'react-native';
import {Modal, Portal} from 'react-native-paper';
import axios from 'axios';

const width = Dimensions.get('window').width;

const Home = ({navigation}) => {
  const [reminderData, setReminderData] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [disabledStates, setDisabledStates] = useState({});
  const [selectedItemId, setSelectedItemId] = useState(null);

  const showModal = itemId => {
    setSelectedItemId(itemId);
    setButtonDisabled(true);
  };

  const hideModal = () => {
    setSelectedItemId(null);
  };

  const containerStyle = {
    backgroundColor: 'white',
    padding: 20,
    marginHorizontal: 30,
    borderRadius: 25,
  };
  const [buttonDisabled, setButtonDisabled] = useState(false);
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
          // Set the obtained user ID in state
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

  useEffect(() => {
    const fetchMedicationData = async () => {
      const token = await AsyncStorage.getItem('userToken');

      // Check if userId is available before making the API call
      if (!userId || !token) {
        console.error('User ID or token not found in AsyncStorage');
        navigation.navigate('Login');
        return;
      }

      try {
        const response = await axios.get(
          `https://med-adherence-app.vercel.app/api/med/patient-report/${userId}/`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );
        const {medications} = response.data;

        const formattedData = {};

        medications.forEach(medication => {
          const {medication_doses, drug_name} = medication;

          medication_doses.forEach(dose => {
            const date = dose.set_time.split('T')[0];

            if (!formattedData[date]) {
              formattedData[date] = [];
            }

            formattedData[date].push({
              id: dose.pk,
              time: dose.set_time.split('T')[1].slice(0, -1),
              medsName: drug_name,
              taken: dose.taken,
              disabled: false,
            });
          });
        });

        setReminderData(formattedData);
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching medication data:', error);
        setIsLoading(false);
      }
    };

    // Fetch data whenever the component mounts or when there's a navigation event
    const unsubscribe = navigation.addListener('focus', () => {
      setIsLoading(true);
      fetchMedicationData();
    });

    return unsubscribe;
  }, [navigation, userId]);

  const handleMedicationTaken = async itemId => {
    setIsLoading(true);
    try {
      const token = await AsyncStorage.getItem('userToken');

      const response = await axios.patch(
        `https://med-adherence-app.vercel.app/api/med/medication-dose/${itemId}/update/`,
        {
          taken: true,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      console.log('Medication marked as taken:', response.data);
      setReminderData(prevData => {
        const updatedData = {...prevData};
        const dateKeys = Object.keys(updatedData);
        dateKeys.forEach(date => {
          updatedData[date] = updatedData[date].map(item => {
            if (item.id === itemId) {
              return {
                ...item,
                taken: true,
              };
            }
            return item;
          });
        });
        return updatedData;
      });

      setIsLoading(false);
    } catch (error) {
      console.error('Error marking medication as taken:', error.response.data);
      setIsLoading(false);
    }
  };
  const renderEmptyData = () => (
    <View
      style={{
        alignItems: 'center',
        marginTop: 20,
        flex: 1,
        justifyContent: 'center',
        paddingHorizontal: 40,
      }}>
      <Text style={{color: '#000', fontSize: 16, textAlign: 'center'}}>
        First you have to add your medication reminder by tapping the '+'
        button.
      </Text>
    </View>
  );

  return (
    <View style={{flex: 1, backgroundColor: '#fff'}}>
      <StatusBarHeader />
      {isLoading ? (
        <View
          style={{
            alignItems: 'center',
            marginTop: 20,
            flex: 1,
            justifyContent: 'center',
          }}>
          <ActivityIndicator size="large" color="#1654CC" />
        </View>
      ) : (
        <Agenda
          items={reminderData}
          renderEmptyData={
            reminderData && Object.keys(reminderData).length === 0
              ? renderEmptyData
              : null
          }
          indicatorStyle={{color: '#1654CC'}}
          stickyHeaderHiddenOnScroll={true}
          contentContainerStyle={{backgroundColor: '#fff', color: '#1654CC'}}
          renderItem={(item, firstItemInDay) => {
            const convertToAMPM = time => {
              const hour = parseInt(time.split(':')[0], 10);
              const minute = parseInt(time.split(':')[1], 10);
              const period = hour >= 12 ? 'PM' : 'AM';
              const displayHour = hour % 12 === 0 ? 12 : hour % 12;
              return `${displayHour.toString().padStart(2, '0')}:${minute
                .toString()
                .padStart(2, '0')} ${period}`;
            };

            const formattedTime = convertToAMPM(item.time);
            return (
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  backgroundColor: '#fff',
                  padding: 20,
                  borderRadius: 10,
                  marginTop: 20,
                  gap: 10,
                  width: width - 90,
                }}
                key={item.id.toString()}>
                <Portal>
                  <Modal
                    visible={selectedItemId === item.id}
                    onDismiss={hideModal}
                    contentContainerStyle={containerStyle}>
                    <View style={{backgroundColor: 'white', padding: 20}}>
                      <Text
                        style={{
                          color: '#313131',
                          fontWeight: '600',
                          fontSize: 16,
                          textAlign: 'center',
                        }}>
                        Are you sure you want to take medication now?
                      </Text>
                      <View
                        style={{
                          flexDirection: 'row',
                          justifyContent: 'center',
                          alignItems: 'center',
                          gap: 10,
                          marginTop: 10,
                        }}>
                        <TouchableOpacity
                          onPress={() => {
                            hideModal();
                            const updatedDisabledStates = {
                              ...disabledStates,
                              [item.id]: true, // Update the disabled state for the specific item
                            };
                            setDisabledStates(updatedDisabledStates);
                            handleMedicationTaken(item.id);
                          }}
                          style={{
                            backgroundColor: '#1654CC',
                            paddingHorizontal: 20,
                            color: '#fff',
                            borderRadius: 6,
                            paddingVertical: 5,
                          }}>
                          <Text style={{color: '#fff'}}>Yes</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                          onPress={hideModal}
                          style={{color: '#1654CC'}}>
                          <Text style={{color: '#1654CC'}}>No</Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  </Modal>
                </Portal>
                <View style={{flexDirection: 'row', gap: 10}}>
                  <View
                    style={{
                      flexDirection: 'row',
                      gap: 10,
                      justifyContent: 'space-between',
                      width: width - 120,
                    }}>
                    <View>
                      <Text
                        style={{
                          color: '#000',
                          fontSize: 16,
                          fontWeight: '700',
                        }}>
                        {formattedTime}
                      </Text>
                      <Text
                        style={{
                          color: '#000',
                          fontSize: 14,
                          fontWeight: '400',
                        }}>
                        {item.medsName}
                      </Text>
                    </View>

                    <View
                      style={{
                        flexDirection: 'column',
                        justifyContent: 'flex-start',
                        alignItems: 'flex-end',
                      }}>
                      <TouchableOpacity
                        onPress={() => {
                          showModal(item.id);
                        }}
                        style={{
                          backgroundColor: item.taken ? 'grey' : '#1654CC',
                          padding: 5,
                          borderRadius: 20,
                          opacity: item.taken ? 0.6 : 1,
                        }}
                        disabled={item.taken}>
                        <Text style={{color: '#fff', fontSize: 12}}>
                          {item.taken ? 'Taken' : 'Take now'}
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              </View>
            );
          }}
        />
      )}
      <View style={{position: 'absolute', bottom: 20, right: 20}}>
        <TouchableOpacity
          onPress={() => navigation.navigate('AddMeds')}
          style={{backgroundColor: '#1654CC', padding: 20, borderRadius: 30}}>
          <Icon name="add" color="#fff" size={20} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Home;
