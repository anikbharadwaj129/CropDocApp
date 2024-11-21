//Import Packages
import React, { useState, useEffect, useContext } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Image } from 'expo-image';
import { Layout, Button } from '@ui-kitten/components';
import { getStorage, ref, getDownloadURL, deleteObject, getMetadata } from 'firebase/storage';
import { useNavigation } from '@react-navigation/native';
import UserContext from './usercontext'; 

const PastUploadView = ({ route }) => {
  const { imageUri } = route.params;  // This is the full path of the image in Firebase Storage
  const [imageName, setImageName] = useState('');
  const [dateStampText, setdateStampText] = useState('');
  const [diagnosisResult, setDiagnosisResult] = useState(null);
  const { userID } = useContext(UserContext);
  const navigation = useNavigation(); // Hook for navigation

  useEffect(() => {
    const fetchDiagnosis = async () => {
      try {
        const storage = getStorage();
        const imageRef = ref(storage, imageUri); // Assuming imageUri is the path in Firebase Storage
        const metadata = await getMetadata(imageRef);
        setImageName(metadata.customMetadata['name']); // Or another metadata field if needed

        const decodedUri = decodeURIComponent(imageUri);

        // Step 2: Extract the filename portion by splitting on '/' and '?'
        const fileNameWithQuery = decodedUri.split('/').pop(); // Get the last segment of the path
        const fileNameWithExtension = fileNameWithQuery.split('?')[0]; // Remove the query string
        const fileName = fileNameWithExtension.replace('.jpg', ''); // Remove the .jpg extension
        console.log("Decoded URI:", decodedUri);
        console.log('Image file name w query:', fileNameWithQuery);
        console.log('Image file name w extension:', fileNameWithExtension);
        console.log('Image file name:', fileName);

        // Step 1: Parse the date from the fileName (assuming the fileName is in ISO format)
        const dateFromFileName = new Date(fileName); // Converts ISO string to Date object

        // Step 2: Format the date as needed
        const options = { year: 'numeric', month: 'numeric', day: 'numeric', hour: '2-digit', minute: '2-digit' };
        const formattedDate = dateFromFileName.toLocaleDateString('en-US', options);

        // Step 3: Display the text with the formatted date
        setdateStampText(`${formattedDate}`);
        
        

        // Fetch the diagnosis from Firebase Storage using the full imageStorageName
        const diagnosisRef = ref(storage, `${userID}/diagnoses/${fileName}_diagnosis.txt`);
        const diagnosisUrl = await getDownloadURL(diagnosisRef); // Get the download URL for the diagnosis file
        const response = await fetch(diagnosisUrl); // Fetch the content of the diagnosis file
        const diagnosisText = await response.text(); // Read the file content as text
        setDiagnosisResult(diagnosisText); // Set the diagnosis result
      } catch (error) {
        console.error('Failed to fetch diagnosis:', error);
        setDiagnosisResult('No diagnosis available'); // Fallback if there is an issue
      }
    };

    fetchDiagnosis();
  }, [imageUri]);

  // Delete Image Function
  const deleteImage = async () => {
    try {
      const storage = getStorage();
      const imageRef = ref(storage, imageUri);
      await deleteObject(imageRef);
      navigation.navigate('MainScreen'); // Replace 'MainScreen' with the actual name of your main screen
    } catch (error) {
      console.error('Failed to delete image:', error);
    }
  };

  // UI Components
  return (
    <Layout style={styles.container}>
      {/* Back Arrow */}
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.navigate('MainScreen')}>
        <Image source={require('./assets/back-arrow.png')} style={styles.backIcon} />
      </TouchableOpacity>

      <View style={styles.header}>
      <Text style={styles.imageName}>{imageName} - {dateStampText}</Text>
        <Button style={styles.deleteButton} onPress={deleteImage} status="danger">
          Delete
        </Button>
      </View>
      <Image source={{ uri: imageUri }} style={styles.image} />
      <Text style={styles.diagnosisText}>{diagnosisResult}</Text>
      <Text style={styles.warningText}>{"Warning: CropDoc can make mistakes."}</Text>
    </Layout>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#edf7ec', // Soft, natural green background
  },
  backButton: {
    position: 'absolute',
    top: 40, // Adjust this value based on your layout
    left: 10, // Adjust for layout consistency
    zIndex: 1, // Ensure the back button is above other elements
  },
  backIcon: {
    width: 32,
    height: 32,
  },
  header: {
    width: '100%', // Ensure the header takes full width
    flexDirection: 'row', // Arrange items in a row
    justifyContent: 'space-between', // Space between the text and the button
    alignItems: 'center', // Align items vertically
    padding: 10, // Add some padding
    marginTop: 20,
  },
  imageName: {
    fontSize: 18, // Adjust as needed
    marginLeft: 20, // Adjust for layout consistency
    color: '#2e7d32', // Dark green for image name text
  },
  deleteButton: {
    backgroundColor: '#d32f2f', // A deeper red for the delete button
    borderColor: 'white',
    marginRight: 20,
  },
  image: {
    width: '100%', // Adjust as needed
    height: '75%', // Adjust as needed
    resizeMode: 'contain',
    borderColor: '#2e7d32', // Dark green border around the image
    borderWidth: 2,
  },
  diagnosisText: {
    marginTop: 18, // Spacing after the image
    fontSize: 20, // Match the font size of other text elements or adjust as needed
    color: '#2e7d32', // Dark green for diagnosis text
  },
  warningText: {
    marginTop: -5, // Spacing after the image
    fontSize: 15, // Match the font size of other text elements or adjust as needed
    color: '#2e7d32', // Dark green for diagnosis text
  },
});

export default PastUploadView;
