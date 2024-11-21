//Import Packages
import React, { useState, useContext, useCallback } from 'react';
import { StyleSheet, View, TouchableOpacity, Text, ScrollView, RefreshControl, Modal } from 'react-native';
import { Image } from 'expo-image';
import { Layout, Button } from '@ui-kitten/components';
import { getAuth, signOut } from 'firebase/auth';
import UserContext from './usercontext';
import { getStorage, ref, listAll, getDownloadURL, getMetadata } from "firebase/storage";
import app from './firebaseconfig';
import { useFocusEffect } from '@react-navigation/native';
import DropDownPicker from 'react-native-dropdown-picker';
import profile from './assets/profile.png';
import transparentImage from './assets/backvine.png';
import uploadphoto from './assets/camera.png';
import chatwithai from './assets/chatwithai.png';
import contactusimg from './assets/contactus.png';

export default function MainScreen({ navigation }) {
  const [imageUris, setImageUris] = useState([]);
  const [filteredImages, setFilteredImages] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const { userID, setUserID } = useContext(UserContext);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedPlantType, setSelectedPlantType] = useState(null);
  const [openDropdown, setOpenDropdown] = useState(false);
  const [dropdownItems, setDropdownItems] = useState([ //Dropdown Picker
    { label: 'All', value: '' },
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
  const auth = getAuth();

  //Fetches Images from Firebase Storage
  const fetchImages = async () => {
    if (!userID) return;

    setRefreshing(true);
    const storage = getStorage(app);
    const imagesRef = ref(storage, `${userID}/images/`);
    try {
      const result = await listAll(imagesRef);
      const imageDetails = await Promise.all(
        result.items.map(async item => {
          const url = await getDownloadURL(item);
          const metadata = await getMetadata(item);
          const name = metadata.customMetadata?.name || 'No Name';
          const plantType = metadata.customMetadata?.plantType || '';
          return { url, name, plantType };
        })
      );
      setImageUris(imageDetails);
      applyFilter(selectedPlantType, imageDetails.reverse());
    } catch (error) {
      console.error("Error fetching image URLs:", error);
    } finally {
      setRefreshing(false);
    }
  };

  //Plant Type Filter Function
  const applyFilter = (type, images) => {
    if (!type) {
      setFilteredImages(images);
    } else {
      setFilteredImages(images.filter(image => image.plantType === type));
    }
  };

  useFocusEffect(
    useCallback(() => {
      setSelectedPlantType(null);
      setFilteredImages(imageUris);
      fetchImages();
    }, [userID])
  );

  const onRefresh = () => {
    fetchImages();
  };

  //Sign Out Function
  const handleSignOut = async () => {
    try {
      await signOut(auth);
      setUserID(null);
      setImageUris([]);
      navigation.navigate('Login');
    } catch (error) {
      console.error('Error signing out: ', error);
    }
  };

  //UI Components
  return (
    <Layout style={styles.container}>
      <Image source={transparentImage} style={styles.backgroundImage} />
      
      <Text style={styles.title}>CropDoc - Disease Diagnosis</Text>

      <TouchableOpacity style={styles.profileButton} onPress={() => setModalVisible(true)}>
        <Image source={profile} style={styles.profileIcon} />
      </TouchableOpacity>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalView}>
            <Text style={styles.modalText}>Email: {auth.currentUser?.email}</Text>
            <Button onPress={handleSignOut} style={styles.signOutButton}>Sign Out</Button>
            <Button onPress={() => setModalVisible(false)} style={styles.closeButton}>Close</Button>
          </View>
        </View>
      </Modal>

      <View style={styles.pickerWrapper}>
        <DropDownPicker
          open={openDropdown}
          value={selectedPlantType}
          items={dropdownItems}
          setOpen={setOpenDropdown}
          setValue={setSelectedPlantType}
          setItems={setDropdownItems}
          onChangeValue={(value) => applyFilter(value, imageUris)}
          placeholder="Filter by Plant Type - All"
          style={styles.dropdown}
          dropDownContainerStyle={styles.dropdownContainer}
          textStyle={styles.dropdownText}
          placeholderStyle={styles.dropdownPlaceholder}
        />
      </View>

      <ScrollView
        style={styles.scrollView}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        {filteredImages.length > 0 ? (
          filteredImages.map((detail, index) => (
            <TouchableOpacity 
              key={index} 
              style={styles.rectangleTouchable} 
              onPress={() => navigation.navigate('PastUploadView', { imageUri: detail.url })}
            >
              <View style={styles.rectangle}>
                <Image source={{ uri: detail.url }} style={styles.rectangleImage} />
                <Text style={styles.imageText}>{detail.name}</Text> 
              </View>
            </TouchableOpacity>
          ))
        ) : (
          <View style={styles.centeredView}>
            <Text style={styles.centeredText}>No images found for the selected plant type</Text>
          </View>
        )}
      </ScrollView>

      <View style={styles.bottomButtonsContainer}>
        <TouchableOpacity style={styles.chatButton} onPress={() => navigation.navigate('AIBotScreen')}>
          <Image source={chatwithai} style={styles.chatButtonIcon} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.uploadPhotoButton} onPress={() => navigation.navigate('TakeImage')}>
          <Image source={uploadphoto} style={styles.uploadPhotoIcon} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.contactButton} onPress={() => navigation.navigate('ContactUs')}>
          <Image source={contactusimg} style={styles.contactButtonIcon} />
        </TouchableOpacity>
      </View>
    </Layout>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#edf7ec',
  },
  backgroundImage: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    opacity: 0.5,
    resizeMode: 'contain',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginTop: 50,
    color: '#2e7d32',
  },
  profileButton: {
    position: 'absolute',
    top: 65,
    right: 25,
    alignItems: 'center',
  },
  profileIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalView: {
    width: 300,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalText: {
    fontSize: 18,
    color: '#2e7d32',
    marginBottom: 20,
  },
  signOutButton: {
    marginBottom: 10,
    backgroundColor: '#d32f2f',
    borderColor: 'white',
    borderWidth: 1,
  },
  closeButton: {
    backgroundColor: '#388e3c',
    borderColor: 'white',
    borderWidth: 1,
  },
  pickerWrapper: {
    width: '100%',
    paddingHorizontal: 20,
    marginBottom: 20,
    zIndex: 1000, // Ensures dropdown appears above other components
    marginTop: 20, // Adjust this value to move the picker lower
  },
  dropdown: {
    backgroundColor: 'white',
    borderColor: '#2e7d32',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    height: 50,
  },
  dropdownContainer: {
    backgroundColor: '#f1f8e9',
    borderColor: '#2e7d32',
    borderWidth: 1,
  },
  dropdownText: {
    fontSize: 16,
    color: '#2e7d32',
  },
  dropdownPlaceholder: {
    color: '#888888',
    fontSize: 16,
  },
  scrollView: {
    width: '100%',
    marginTop: 0,
    marginBottom: 100,
  },
  rectangleTouchable: {
    flexDirection: 'row',
    margin: 10,
    backgroundColor: '#a5d6a7',
    borderRadius: 10,
    borderColor: '#2e7d32',
    borderWidth: 1,
    overflow: 'hidden',
  },
  rectangle: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
  },
  rectangleImage: {
    width: 50,
    height: 50,
    resizeMode: 'cover',
    borderColor: '#388e3c',
    borderWidth: 1,
    borderRadius: 5,
  },
  imageText: {
    fontSize: 20,
    textAlign: 'center',
    marginLeft: 10,
    marginRight: 10,
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 50,
  },
  centeredText: {
    fontSize: 20,
    color: '#2e7d32',
  },
  bottomButtonsContainer: {
    position: 'absolute',
    bottom: 50,
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    width: '100%',
    paddingHorizontal: 20,
  },
  chatButton: {
    width: 70,
    height: 70,
    justifyContent: 'center',
    alignItems: 'center',
  },
  chatButtonIcon: {
    width: 60,
    height: 60,
    resizeMode: 'contain',
  },
  uploadPhotoButton: {
    width: 70,
    height: 70,
    justifyContent: 'center',
    alignItems: 'center',
  },
  uploadPhotoIcon: {
    width: 60,
    height: 60,
    resizeMode: 'contain',
  },
  contactButton: {
    width: 70,
    height: 70,
    justifyContent: 'center',
    alignItems: 'center',
  },
  contactButtonIcon: {
    width: 60,
    height: 60,
    resizeMode: 'contain',
  },
});
