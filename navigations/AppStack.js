/* eslint-disable prettier/prettier */
import React, {useState} from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import Onboarding from '../screens/Onboarding';
import Login from '../screens/Login';
import Register from '../screens/Register';
import Main from '../screens/Main';
import ForgotPassword from '../screens/ForgotPassword';
import OnboardingTwo from '../screens/OnboardingTwo';
import OnboardingThree from '../screens/OnboardingThree';
import GetStarted from '../screens/GetStarted';
import EmailVerify from '../screens/EmailVerify';
import ResetPassword from '../screens/ResetPassword';
import Account from '../screens/Account';
import Password from '../screens/Password';
import Settings from '../screens/Settings';
import Notifications from '../screens/Notifications';
import Welcome from '../screens/Welcome';
import AddMeds from '../screens/AddMeds';
import AddReminder from '../screens/AddReminder';

const AppStack = () => {
  const Stack = createStackNavigator();

  return (
    <Stack.Navigator
      initialRouteName="Welcome"
      screenOptions={{
        headerShown: false,
        DrawerNavigatorBarVisible: false,
      }}>
      <Stack.Screen name="Onboarding" component={Onboarding} />
      <Stack.Screen name="OnboardingTwo" component={OnboardingTwo} />
      <Stack.Screen name="OnboardingThree" component={OnboardingThree} />
      <Stack.Screen name="Login" component={Login} />
      <Stack.Screen name="Register" component={Register} />
      <Stack.Screen name="Main" component={Main} />
      <Stack.Screen name="Forgot" component={ForgotPassword} />
      <Stack.Screen name="GetStarted" component={GetStarted} />
      <Stack.Screen name="EmailVerify" component={EmailVerify} />
      <Stack.Screen name="ResetPassword" component={ResetPassword} />
      <Stack.Screen name="Account" component={Account} />
      <Stack.Screen name="Password" component={Password} />
      <Stack.Screen name="Settings" component={Settings} />
      <Stack.Screen name="Notifications" component={Notifications} />
      <Stack.Screen name="Welcome" component={Welcome} />
      <Stack.Screen name="AddMeds" component={AddMeds} />
      <Stack.Screen name="AddReminder" component={AddReminder} />
    </Stack.Navigator>
  );
};

export default AppStack;
