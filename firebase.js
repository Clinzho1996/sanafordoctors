/* eslint-disable prettier/prettier */
import {firebase} from '@react-native-firebase/messaging';

// Initialize Firebase
if (!firebase.apps.length) {
  const firebaseConfig = {
    apiKey: process.env.FIREBASE_API_KEY,
    authDomain: 'sana-d17d7.firebaseapp.com',
    databaseURL: 'sana-d17d7.firebaseapp.io',
    projectId: 'sana-d17d7',
    storageBucket: 'sana-d17d7.appspot.com',
    messagingSenderId: '752574860314',
    appId: '1:752574860314:web:afe0927dab75915f3895a3',
    measurementId: 'G-SB6JWFS1ZG',
  };
  firebase.initializeApp(firebaseConfig);
} else {
  console.log(firebase.error);
}

export default firebase;
