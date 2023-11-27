/* eslint-disable react/no-unstable-nested-components */
/* eslint-disable prettier/prettier */
/* eslint-disable react-native/no-inline-styles */
/* eslint-disable react/self-closing-comp */

import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  Dimensions,
} from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {TouchableOpacity} from 'react-native-gesture-handler';

const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;

const PatientRecord = ({route, navigation}) => {
  const {patientId} = route.params;
  const [medicationHistory, setMedicationHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const formatReminderTime = time => {
    const date = new Date(time);
    const formattedDate = date.toLocaleString();
    return formattedDate;
  };

  useEffect(() => {
    const fetchMedicationHistory = async () => {
      try {
        const token = await AsyncStorage.getItem('userToken');
        const response = await axios.get(
          `https://med-adherence-app.vercel.app/api/med/patient-report/${patientId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );

        const {medications} = response.data;
        setMedicationHistory(medications);
        setIsLoading(false);
      } catch (error) {
        console.error(
          'Error fetching medication history:',
          error.response.data,
        );
        setIsLoading(false);
      }
    };

    fetchMedicationHistory();
  }, [patientId]);

  return (
    <View style={styles.container}>
      {isLoading ? (
        <View
          style={{
            height: height,
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <ActivityIndicator size="large" color="#1654CC" />
        </View>
      ) : (
        <FlatList
          data={medicationHistory}
          keyExtractor={item => item.pk.toString()}
          renderItem={({item}) => (
            <View style={styles.medicationItem}>
              <Text style={styles.drugName}>{item.drug_name}</Text>
              <Text>Number of doses: {item.num_of_dose}</Text>
              {item.medication_doses.map((dose, index) => (
                <View
                  key={index}
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    marginBottom: 5,
                  }}>
                  <Text>
                    <Text style={{fontWeight: 'bold'}}>Time:</Text>{' '}
                    {formatReminderTime(dose.set_time)}
                  </Text>
                  <Text>
                    {dose.taken ? (
                      <Text style={{color: 'blue'}}>Taken</Text>
                    ) : (
                      <Text style={{color: 'red'}}>Not Taken</Text>
                    )}
                  </Text>
                </View>
              ))}
            </View>
          )}
          ListEmptyComponent={() => (
            <View style={styles.emptyState}>
              <Text style={{color: '#000'}}>
                No medication history available for this patient.
              </Text>
              <TouchableOpacity
                onPress={() => navigation.goBack()}
                style={{
                  backgroundColor: '#1654CC',
                  padding: 10,
                  marginTop: 20,
                  borderRadius: 10,
                }}>
                <Text style={{color: '#fff'}}>Go Back</Text>
              </TouchableOpacity>
            </View>
          )}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 30,
    backgroundColor: '#FBFBFB',
  },
  medicationItem: {
    padding: 15,
    marginVertical: 10,
    borderRadius: 10,
    backgroundColor: '#fff',
    elevation: 5,
    width: width - 90,
    marginHorizontal: 10,
  },
  drugName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  emptyState: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
    height: height,
  },
});

export default PatientRecord;
