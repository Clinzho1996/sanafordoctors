import {NavigationContainer} from '@react-navigation/native';
import {Provider as PaperProvider} from 'react-native-paper';
import React from 'react';
import AppStack from './navigations/AppStack';
import Main from './screens/Main';
import {AvatarProvider} from './components/AvatarContext';

const App = () => {
  const isLoggedIn = true;
  return (
    <PaperProvider>
      <AvatarProvider>
        <NavigationContainer>
          {isLoggedIn ? <AppStack /> : <Main />}
        </NavigationContainer>
      </AvatarProvider>
    </PaperProvider>
  );
};

export default App;
