// Import Packages 
import React, { useState, useContext } from 'react';
import {
  View, StyleSheet, Text, ScrollView, KeyboardAvoidingView,
  Platform, TouchableWithoutFeedback, Keyboard, ActivityIndicator, TouchableOpacity
} from 'react-native';
import { Image } from 'expo-image';
import { Button, Input } from '@ui-kitten/components';
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import app from './firebaseconfig';
import UserContext from './usercontext';
import DropDownPicker from 'react-native-dropdown-picker'; // Replacing @react-native-picker/picker
import BackIcon from './assets/back-arrow.png';

const ImageSubmission = ({ navigation, route }) => {
  const { imageUri } = route.params;
  const { userID } = useContext(UserContext);
  const [imageName, setImageName] = useState('');
  const [plantType, setPlantType] = useState(null); // Updated for DropdownPicker
  const [openDropdown, setOpenDropdown] = useState(false); // State for opening/closing dropdown
  const [dropdownItems, setDropdownItems] = useState([ //Dropdown Picker
    { label: 'Select plant type', value: null },
    { label: 'Cassava', value: 'Cassava' },
    { label: 'Cashew', value: 'Cashew' },
    { label: 'Potato', value: 'Potato' },
    { label: 'Rice', value: 'Rice' },
    { label: 'Wheat', value: 'Wheat' },
    { label: 'Apple', value: 'Apple' },
    { label: 'Bell Pepper', value: 'Bell Pepper' },
    { label: 'Cherry', value: 'Cherry' },
    { label: 'Grape', value: 'Grape' },
    { label: 'Peach', value: 'Peach' },
    { label: 'Strawberry', value: 'Strawberry' },
    { label: 'Invalid', value: 'Invalid' },
  ]);
  const [showError, setShowError] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [plantTypeError, setPlantTypeError] = useState(false);

  if (!imageUri) {
    return <Text>No image selected</Text>;
  }

  //Image Submission Function
  const handleSubmitImage = async () => {
    if (!imageName.trim() || !plantType) {
      setShowError(!imageName.trim());
      setPlantTypeError(!plantType);
      return;
    }

    setShowError(false);
    setPlantTypeError(false);
    setIsUploading(true);

    try {
      const response = await fetch(imageUri);
      const blob = await response.blob();
      const storage = getStorage(app);
      const currentDate = new Date();
      const dateString = currentDate.toISOString();

      const metadata = {
        contentType: 'image/jpeg',
        customMetadata: {
          'name': imageName,
          'plantType': plantType,
        },
      };

      const imageFullName = `${userID}/images/${dateString}.jpg`;
      const imageRef = ref(storage, imageFullName);
      await uploadBytes(imageRef, blob, metadata);

      const downloadURL = await getDownloadURL(imageRef);
      console.log(`Download URL: ${downloadURL}`);

      setTimeout(() => {
        setIsUploading(false);
        navigation.navigate('MainScreen');
      }, 3500);

    } catch (error) {
      console.error('An unexpected error occurred:', error);
      setIsUploading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScrollView contentContainerStyle={styles.container}>
          <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
            <Image source={BackIcon} style={styles.backIcon} />
          </TouchableOpacity>

          <Text style={styles.toptext}>Image Submission Review</Text>
          <Image source={{ uri: imageUri }} style={styles.image} />

          {showError && <Text style={styles.errorText}>Image Name Required</Text>}
          <Input
            placeholder="Enter image name"
            value={imageName}
            onChangeText={(text) => {
              setImageName(text);
              if (text.trim()) setShowError(false);
            }}
            style={styles.input}
            textStyle={{ color: '#2e7d32' }}
          />

          {plantTypeError && <Text style={styles.errorText}>Please select a plant type</Text>}
          <View style={styles.pickerContainer}>
            <DropDownPicker
              open={openDropdown}
              value={plantType}
              items={dropdownItems}
              setOpen={setOpenDropdown}
              setValue={setPlantType}
              setItems={setDropdownItems}
              placeholder="Select plant type"
              style={styles.dropdown}
              dropDownContainerStyle={styles.dropdownContainer}
              textStyle={styles.dropdownText}
              placeholderStyle={styles.dropdownPlaceholder}
              onChangeValue={(value) => {
                setPlantType(value);
                if (value) setPlantTypeError(false);
              }}
            />
          </View>

          <View style={styles.buttonContainer}>
            <Button style={styles.button} onPress={() => navigation.navigate('TakeImage')}>Retake Image</Button>
            <Button style={styles.button} onPress={handleSubmitImage}>Submit Image</Button>
          </View>

          {isUploading && (
            <View style={styles.uploadingContainer}>
              <Text style={styles.uploadingText}>Please Wait...Image is uploading</Text>
              <ActivityIndicator size="large" color="#2e7d32" />
            </View>
          )}
        </ScrollView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#edf7ec',
  },
  image: {
    width: 600,
    height: 600,
    resizeMode: 'contain',
    borderColor: '#388e3c',
    borderWidth: 2,
  },
  input: {
    width: '80%',
    marginVertical: 10,
    borderColor: '#2e7d32',
    borderWidth: 1,
  },
  pickerContainer: {
    width: '80%',
    marginVertical: 10,
    zIndex: 1000, // Ensures the dropdown appears above other components
  },
  dropdown: {
    backgroundColor: 'white',
    borderColor: '#2e7d32',
    borderWidth: 1,
    borderRadius: 5,
  },
  dropdownContainer: {
    backgroundColor: '#f1f8e9',
    borderColor: '#2e7d32',
  },
  dropdownText: {
    fontSize: 16,
    color: '#2e7d32',
  },
  dropdownPlaceholder: {
    color: '#888888',
    fontSize: 16,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '80%',
    marginTop: 20,
  },
  button: {
    marginHorizontal: 10,
    backgroundColor: '#388e3c',
    borderColor: 'white',
    borderWidth: 1,
  },
  toptext: {
    marginBottom: 20,
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 35,
    color: '#2e7d32',
  },
  errorText: {
    color: 'red',
    fontSize: 16,
    marginBottom: 5,
  },
  uploadingContainer: {
    position: 'absolute',
    bottom: 400,
    left: 0,
    right: 0,
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
    padding: 20,
    borderRadius: 10,
  },
  uploadingText: {
    color: 'white',
    fontSize: 18,
    marginBottom: 10,
  },
  backButton: {
    position: 'absolute',
    top: 40,
    left: 15,
  },
  backIcon: {
    width: 32,
    height: 32,
  },
});

export default ImageSubmission;
