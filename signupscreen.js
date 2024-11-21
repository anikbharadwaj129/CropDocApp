//Import Packages
import React, { useState } from 'react';
import { Layout, Text, Input, Button } from '@ui-kitten/components';
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import app from './firebaseconfig';
import { TouchableWithoutFeedback, Keyboard, StyleSheet, View, TouchableOpacity, Alert } from 'react-native';
import { Image } from 'expo-image';
import transparentImage from './assets/backvine.png'; // Import the transparent background image

export default function SignUp({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const auth = getAuth(app);

  // Check password requirements individually
  const isLongEnough = password.length >= 6;
  const hasUppercase = /[A-Z]/.test(password);
  const hasLowercase = /[a-z]/.test(password);
  const hasNumber = /\d/.test(password);
  const hasSpecialChar = /[@$!%*?&]/.test(password);

  const isValidEmail = (email) => {
    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@(([^<>()[\]\\.,;:\s@"]+\.)+[^<>()[\]\\.,;:\s@"]{2,})$/i;
    return re.test(String(email).toLowerCase());
  };

  const handleSignUp = () => {
    setError(''); // Reset error message

    if (!isValidEmail(email)) {
      setError('Invalid Email');
      return;
    }

    if (!isLongEnough || !hasUppercase || !hasLowercase || !hasNumber || !hasSpecialChar) {
      setError('Invalid Password');
      return;
    }

    //Sign Up Function
    createUserWithEmailAndPassword(auth, email, password)
      .then(() => {
        setEmail('');
        setPassword('');
        Alert.alert('Sign Up', 'Your account has been created successfully.');
        navigation.navigate('Login');
      })
      .catch((error) => {
        setError(error.message);
      });
  };

  //UI Components
  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <View style={styles.container}>
        
        {/* Transparent Background Image */}
        <Image source={transparentImage} style={styles.backgroundImage} />
        
        {/* Back Arrow Button */}
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Image source={require('./assets/back-arrow.png')} style={styles.backIcon} />
        </TouchableOpacity>
        
        <Layout style={styles.innerContainer}>
          <Text category="h1" style={styles.title}>Sign Up</Text>
          {error !== '' && <Text style={styles.errorText}>{error}</Text>}
          <Input
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
            style={styles.input}
            textStyle={{ color: '#2e7d32' }} // Dark green input text
          />
          <Input
            placeholder="Password"
            secureTextEntry={true}
            value={password}
            onChangeText={setPassword}
            style={styles.input}
            textStyle={{ color: '#2e7d32' }} // Dark green password text
          />
          {/* Password Requirements Text */}
          <View style={styles.requirementsContainer}>
            <Text style={isLongEnough ? styles.requirementMet : styles.requirementNotMet}>
              • At least 6 characters
            </Text>
            <Text style={hasUppercase ? styles.requirementMet : styles.requirementNotMet}>
              • One uppercase letter
            </Text>
            <Text style={hasLowercase ? styles.requirementMet : styles.requirementNotMet}>
              • One lowercase letter
            </Text>
            <Text style={hasNumber ? styles.requirementMet : styles.requirementNotMet}>
              • One number
            </Text>
            <Text style={hasSpecialChar ? styles.requirementMet : styles.requirementNotMet}>
              • One special character (@, $, !, %, *, ?, &)
            </Text>
          </View>
          <Button onPress={handleSignUp} style={styles.button}>
            Sign Up
          </Button>
          <Layout style={styles.newUserContainer}>
            <Text category="s1" style={styles.newUserText}>Already a User?</Text>
            <Button onPress={() => navigation.navigate('Login')} style={styles.loginButton}>
              Login
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
    backgroundColor: '#edf7ec', // Soft, natural green background color
  },
  backgroundImage: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    opacity: 0.5, // Transparency to ensure the image doesn’t overpower content
    resizeMode: 'cover', // Adjust the image to cover the whole screen
  },
  innerContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.01)', // Keep the same background color for inner container
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
  requirementsContainer: {
    marginBottom: 20,
  },
  requirementMet: {
    color: '#388e3c', // Green for satisfied requirement
    fontSize: 12,
  },
  requirementNotMet: {
    color: 'red', // Red for unmet requirement
    fontSize: 12,
  },
  button: {
    backgroundColor: '#388e3c', // Earthy green for sign-up button
    borderColor: 'white',
    borderWidth: 1,
    marginTop: 20,
  },
  newUserContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20,
    backgroundColor: '#edf7ec', // Consistent background color
  },
  newUserText: {
    marginRight: 8,
    color: '#2e7d32', // Dark green text for "Already a User?"
  },
  loginButton: {
    backgroundColor: '#388e3c', // Earthy green for login button
    borderColor: 'white',
    borderWidth: 1,
  },
  backButton: {
    position: 'absolute',
    top: 40, // Adjust this value based on your layout
    left: 15, // Adjust for layout consistency
  },
  backIcon: {
    width: 32,
    height: 32,
  },
});

