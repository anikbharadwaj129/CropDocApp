//Import Packages
import React, { useState, useEffect, useContext } from 'react';
import { Layout, Text, Input, Button } from '@ui-kitten/components';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { TouchableWithoutFeedback, Keyboard, Alert, StyleSheet, View } from 'react-native';
import { Image } from 'expo-image';
import UserContext from './usercontext';
import transparentImage from './assets/backvine.png';


export default function LoginScreen({ navigation }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const { setUserID } = useContext(UserContext);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      setUsername('');
      setPassword('');
      setErrorMessage('');
    });

    return unsubscribe;
  }, [navigation]);

  //Login Function
  const handleLogin = () => {
    const auth = getAuth();
    signInWithEmailAndPassword(auth, username, password)
      .then((userCredential) => {
        navigation.navigate('MainScreen');
        setUserID(userCredential.user.uid);
      })
      .catch(error => {
        setErrorMessage('Login details are incorrect. Please try again.');
      });
  };

  //UI Components
  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <View style={styles.container}>
        {/* Transparent Background Image */}
        <Image source={transparentImage} style={styles.backgroundImage} />
        
        <Layout style={styles.innerContainer}>
          <Text category="h1" style={styles.title}>Login</Text>
          {errorMessage !== '' && <Text style={styles.errorText}>{errorMessage}</Text>}
          <Input
            placeholder="Email"
            value={username}
            onChangeText={setUsername}
            style={styles.input}
            textStyle={{ color: '#2e7d32' }} // Dark green input text
          />
          <Input
            placeholder="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry={true}
            style={styles.input}
            textStyle={{ color: '#2e7d32' }} // Dark green password text
          />
          <Button onPress={handleLogin} style={styles.button}>
            Login
          </Button>
          <Layout style={styles.forgotPasswordContainer}>
            <Text category="s1" style={styles.forgotPasswordText}>Forgot Password?</Text>
            <Button onPress={() => navigation.navigate('ForgotPassword')} style={styles.resetButton}>
              Reset
            </Button>
          </Layout>
          <Layout style={styles.newUserContainer}>
            <Text category="s1" style={styles.newUserText}>New User?</Text>
            <Button onPress={() => navigation.navigate('SignUp')} style={styles.signUpButton}>
              Sign Up
            </Button>
          </Layout>
        </Layout>
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#edf7ec', // Soft, natural green background
  },
  backgroundImage: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    opacity: 0.5, // Transparency to ensure the image doesn’t overpower content
    resizeMode: 'contain', // Adjust the image to fit the container
  },
  innerContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.01)', // Ensure inner container has the same background color
  },
  title: {
    color: '#2e7d32', // Dark green for title
    marginBottom: 20,
  },
  errorText: {
    color: 'red',
    marginBottom: 10,
  },
  input: {
    marginVertical: 10,
    borderColor: '#2e7d32', // Dark green border for input
    borderWidth: 1,
    backgroundColor: '#ffffff', // Keep input fields white
  },
  button: {
    backgroundColor: '#388e3c', // Earthy green for login button
    borderColor: 'white',
    borderWidth: 1,
    marginBottom: 20,
  },
  forgotPasswordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    backgroundColor: '#edf7ec', // Ensure background color is consistent
  },
  forgotPasswordText: {
    marginRight: 8,
    color: '#2e7d32', // Dark green text for forgot password
  },
  resetButton: {
    backgroundColor: '#388e3c', // Earthy green reset button
    borderColor: 'white',
    borderWidth: 1,
  },
  newUserContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20,
    backgroundColor: '#edf7ec', // Ensure background color is consistent
  },
  newUserText: {
    marginRight: 8,
    color: '#2e7d32', // Dark green text for new user
  },
  signUpButton: {
    backgroundColor: '#388e3c', // Earthy green sign-up button
    borderColor: 'white',
    borderWidth: 1,
  },
});
