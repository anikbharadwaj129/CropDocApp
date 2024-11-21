// Import Packages
import React, { useState } from 'react';
import { Layout, Text, Input, Button } from '@ui-kitten/components';
import { getAuth, sendPasswordResetEmail } from 'firebase/auth';
import { TouchableWithoutFeedback, Keyboard, Alert, StyleSheet, View, TouchableOpacity } from 'react-native';
import { Image } from 'expo-image';
import transparentImage from './assets/backvine.png';

export default function ForgotPassword({ navigation }) {
  const [email, setEmail] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handlePasswordReset = () => {
    const auth = getAuth();
    sendPasswordResetEmail(auth, email)
      .then(() => {
        Alert.alert('Password Reset', 'Check your email to reset your password.');
        navigation.navigate('Login');
      })
      .catch((error) => {
        setErrorMessage('Failed to send reset email. Please check the email provided.');
      });
  };

  // UI Components
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
          <Text category="h1" style={styles.title}>Forgot Password</Text>
          <Text style={styles.infoText}>Please enter the email associated with your account</Text>
          {errorMessage !== '' && <Text style={styles.errorText}>{errorMessage}</Text>}
          <Input
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
            style={styles.input}
            textStyle={{ color: '#2e7d32' }} // Dark green input text
          />
          <Button onPress={handlePasswordReset} style={styles.button}>
            Reset Password
          </Button>
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
    backgroundColor: '#edf7ec',
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
    backgroundColor: 'rgba(255, 255, 255, 0.01)', // Semi-transparent background to ensure readability
    borderRadius: 10, // Optional: subtle rounding for a cleaner look
  },
  title: {
    color: '#2e7d32', // Dark green for title
    marginBottom: 10,
  },
  infoText: {
    color: '#2e7d32', // Dark green for information text
    marginBottom: 20,
    textAlign: 'center',
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
    backgroundColor: '#388e3c', // Earthy green for reset password button
    borderColor: 'white',
    borderWidth: 1,
    marginTop: 20,
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
