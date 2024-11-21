//Import Packages
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Button, Layout, Text } from '@ui-kitten/components';

export default function LoadingScreen({ navigation }) {
  return (
    <Layout style={styles.container}>
      <View style={styles.textContainer}>
        <Text category="h1" style={styles.title}>
          Crop Diagnosis Detector
        </Text>
      </View>
      <View style={styles.buttonContainer}>
        <Button style={styles.button} onPress={() => navigation.navigate('Login')}>
          Login
        </Button>
        <Button style={styles.button} onPress={() => navigation.navigate('SignUp')}>
          Sign Up
        </Button>
      </View>
    </Layout>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#edf7ec', // Soft, natural green background
  },
  textContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 30,
    color: '#2e7d32', // Dark green text color
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '80%',
  },
  button: {
    backgroundColor: '#388e3c', // Earthy green reset button
    borderColor: 'white',
    marginHorizontal: 10,
    width: '40%',
  },
});
