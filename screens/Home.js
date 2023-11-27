/* eslint-disable prettier/prettier */
import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TextInput,
  ActivityIndicator,
  Button,
  Modal,
} from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {TouchableOpacity} from 'react-native-gesture-handler';

const Home = ({navigation}) => {
  const [patients, setPatients] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [medicalReport, setMedicalReport] = useState('');
  const [modalVisible, setModalVisible] = useState(false);

  const fetchPatients = async () => {
    if (searchQuery.trim() === '') {
      return;
    }
    setLoading(true);
    try {
      const response = await axios.get(
        `https://med-adherence-app.vercel.app/api/accounts/patient-search/${searchQuery}`,
      );
      setPatients(response.data);
    } catch (error) {
      console.error(error.response.data);
    } finally {
      setLoading(false);
    }
  };

  const fetchAllPatients = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        'https://med-adherence-app.vercel.app/api/accounts/list/',
      );
      setPatients(response.data);
    } catch (error) {
      console.error(error.response.data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllPatients();
  }, []);

  const fetchMedicalReport = async id => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      const response = await axios.get(
        `https://med-adherence-app.vercel.app/api/med/patient-report/${id}/`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      setMedicalReport(response.data.report);
      setModalVisible(true);
    } catch (error) {
      console.error(error.response.data);
    }
  };

  const handleCheckRecord = patientId => {
    navigation.navigate('PatientRecord', {patientId}); // Navigate to new page with patientId
  };

  const renderItem = ({item}) => (
    <View style={styles.item}>
      <View>
        <Text
          style={{color: '#000'}}
          onPress={() => fetchMedicalReport(item.pk)}>
          {item.full_name}
        </Text>
        <Text style={{color: '#0c0c0c'}}>{item.email}</Text>
      </View>
      <View>
        <TouchableOpacity onPress={() => handleCheckRecord(item.pk)}>
          <Text style={{color: '#1654CC', fontWeight: '600'}}>
            Check Record
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.input}
          placeholder="Search patients by name"
          value={searchQuery}
          onChangeText={text => setSearchQuery(text)}
        />
        <TouchableOpacity
          style={{
            backgroundColor: '#1654CC',
            paddingHorizontal: 10,
            paddingVertical: 15,
          }}
          onPress={fetchPatients}>
          <Text style={{color: '#fff'}}>Search</Text>
        </TouchableOpacity>
      </View>
      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" style={styles.loader} />
      ) : (
        <FlatList
          data={patients}
          renderItem={renderItem}
          keyExtractor={item => item.pk.toString()}
        />
      )}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}>
        <View style={styles.modalContainer}>
          <Text>{medicalReport}</Text>
          <Button title="Close" onPress={() => setModalVisible(false)} />
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  searchContainer: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ccc',
    paddingHorizontal: 10,
    marginRight: 10,
    color: '#000',
  },
  item: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    backgroundColor: '#fff',
    marginVertical: 10,
    elevation: 5,
    marginHorizontal: 10,
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  loader: {
    marginTop: 20,
  },
  modalContainer: {
    backgroundColor: '#fff',
    margin: 50,
    padding: 20,
    borderRadius: 10,
    elevation: 5,
  },
});

export default Home;
