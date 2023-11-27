/* eslint-disable prettier/prettier */
/* eslint-disable react-native/no-inline-styles */
/* eslint-disable react/self-closing-comp */

import {
  FlatList,
  Image,
  StyleSheet,
  Text,
  View,
  Dimensions,
  ActivityIndicator,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {TouchableOpacity} from 'react-native';

const width = Dimensions.get('window').width;

const History = ({navigation}) => {
  const [userId, setUserId] = useState(null);
  const [medicationHistory, setMedicationHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const formatReminderTime = time => {
    const date = new Date(time); // Convert the time string to a Date object
    const formattedDate = date.toLocaleString(); // Format the date to a localized string
    return formattedDate; // Return the formatted date string
  };

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
    const fetchMedicationHistory = async () => {
      try {
        if (!userId) {
          // If userId is not available yet, return from this function
          return;
        }
        // Fetch data from the API
        const token = await AsyncStorage.getItem('userToken');
        const response = await axios.get(
          `https://med-adherence-app.vercel.app/api/med/patient-report/${userId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );

        // Extract medications data from the response
        const {medications} = response.data;

        // Set the medication history data in the state
        setMedicationHistory(medications);
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching medication history:', error);
        setIsLoading(false);
      }
    };

    const unsubscribe = navigation.addListener('focus', () => {
      setIsLoading(true);
      fetchMedicationHistory();
    });

    return unsubscribe;
  }, [navigation, userId]);

  return (
    <View style={styles.container}>
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
      ) : medicationHistory.length === 0 ? (
        <View style={styles.noHistoryContainer}>
          <Image source={require('../assets/copy.png')} style={styles.image} />
          <Text style={styles.noHistoryText}>
            You haven't recorded any reminders yet. Your reminder history will
            be displayed here once you start tracking your medication.
          </Text>
        </View>
      ) : (
        <>
          <View>
            <Text
              style={{
                fontSize: 20,
                fontWeight: '600',
                color: 'black',
                paddingVertical: 20,
              }}>
              Medication History
            </Text>
          </View>
          <FlatList
            data={medicationHistory}
            keyExtractor={item => item.pk.toString()}
            renderItem={({item}) => (
              <View style={styles.medicationItem}>
                <Text style={{color: '#000', fontSize: 16, fontWeight: '700'}}>
                  {item.drug_name}
                </Text>
                <Text style={{color: '#000', fontSize: 14, fontWeight: '400'}}>
                  Number of doses: {item.num_of_dose}
                </Text>
                {item.medication_doses.map((dose, index) => (
                  <View
                    key={index}
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      gap: 5,
                    }}>
                    <Text style={{color: 'blue', fontSize: 12}}>
                      <Text style={{color: 'black', fontSize: 12}}>Time:</Text>{' '}
                      {formatReminderTime(dose.set_time)}
                    </Text>
                    <Text style={{fontSize: 12}}>
                      {dose.taken === true ? (
                        <Text style={{color: 'blue'}}>Taken</Text>
                      ) : (
                        <Text style={{color: 'red'}}>Not Taken</Text>
                      )}
                    </Text>
                  </View>
                ))}
              </View>
            )}
          />
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 30,
    backgroundColor: '#FBFBFB',
  },
  noHistoryContainer: {
    alignItems: 'center',
    marginTop: 40,
  },
  image: {
    width: 100,
    height: 100,
  },
  noHistoryText: {
    textAlign: 'center',
    marginTop: 20,
    color: '#585858',
  },
  medicationItem: {
    paddingVertical: 15,
    width: width - 90,
    backgroundColor: '#fff',
    marginVertical: 10,
    borderRadius: 10,
    paddingHorizontal: 20,
    elevation: 5,
    marginHorizontal: 10,
  },
  drugName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  // Add styles for other medication details if needed
});

export default History;
