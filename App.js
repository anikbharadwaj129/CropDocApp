// Import Packages
import React, { useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator, TransitionSpecs, CardStyleInterpolators } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { ApplicationProvider } from '@ui-kitten/components';
import * as eva from '@eva-design/eva';
import { LogBox } from 'react-native';
import UserContext from './usercontext';

// Import screens
import LoadingScreen from './loadingscreen';
import LoginScreen from './loginscreen';
import MainScreen from './mainscreen';
import SignUpScreen from './signupscreen';
import TakeImage from './takeimage';
import ImageSubmission from './imagesubmission';
import PastUploadView from './pastuploadview';
import ForgotPassword from './forgotpassword';
import AIBotScreen from './aibotscreen';
import ContactUs from './contactus';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

LogBox.ignoreAllLogs();

const fadeTransition = {
  gestureDirection: 'horizontal',
  transitionSpec: {
    open: TransitionSpecs.FadeInFromBottomAndroidSpec,
    close: TransitionSpecs.FadeOutToBottomAndroidSpec,
  },
  cardStyleInterpolator: CardStyleInterpolators.forFadeFromBottomAndroid,
};

//Screen Navigation for the app
export default function App() {
  const [userID, setUserID] = useState(null);
  const [firstName_global, setFirstName_global] = useState(null);
  const [lastName_global, setLastName_global] = useState(null);

  return (
    <UserContext.Provider value={{ userID, setUserID, firstName_global, setFirstName_global, lastName_global, setLastName_global}}>
      <ApplicationProvider {...eva} theme={eva.light}>
        <NavigationContainer>
          <Stack.Navigator initialRouteName="Loading">
            <Stack.Screen 
              name="Loading" 
              component={LoadingScreen} 
              options={{ headerShown: false, gestureEnabled: false, ...fadeTransition }} 
            />
            <Stack.Screen 
              name="Login" 
              component={LoginScreen} 
              options={{ headerShown: false, gestureEnabled: false, ...fadeTransition }} 
            />
            <Stack.Screen 
              name="SignUp" 
              component={SignUpScreen} 
              options={{ headerShown: false, gestureEnabled: false, ...fadeTransition }} 
            />
            <Stack.Screen 
              name="ForgotPassword" 
              component={ForgotPassword} 
              options={{ headerShown: false, gestureEnabled: false, ...fadeTransition }} 
            />
            <Stack.Screen 
              name="MainScreen" 
              component={MainScreen} 
              options={{ headerShown: false, gestureEnabled: false }} 
            />
            <Stack.Screen 
              name="ContactUs" 
              component={ContactUs} 
              options={{ headerShown: false, gestureEnabled: false }} 
            />
            <Stack.Screen 
              name="AIBotScreen" 
              component={AIBotScreen} 
              options={{ headerShown: false, gestureEnabled: false }} 
            />
            <Stack.Screen 
              name="PastUploadView" 
              component={PastUploadView} 
              options={{ headerShown: false, gestureEnabled: false }} 
            />
            <Stack.Screen 
              name="TakeImage" 
              component={TakeImage} 
              options={{ headerShown: false, gestureEnabled: false }} 
            />
            <Stack.Screen 
              name="ImageSubmission" 
              component={ImageSubmission} 
              options={{ headerShown: false, gestureEnabled: false }} 
            />
          </Stack.Navigator>
        </NavigationContainer>
      </ApplicationProvider>
    </UserContext.Provider>
  );
}
