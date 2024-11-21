//Import Packages
import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, Text, TouchableOpacity, View, Dimensions } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { manipulateAsync, SaveFormat } from 'expo-image-manipulator';
import { Image } from 'react-native';
import ImageClick from './assets/cameraclick.png';
import BackIcon from './assets/back-arrow.png';

export default function TakeImage({ navigation }) {
  const [permission, requestPermission] = useCameraPermissions();
  const {facing, setFacing} = useState<CameraType>('back');
  const cameraRef = useRef(null);

  // Guidebox dimensions and positioning
  const screenWidth = Dimensions.get('window').width;
  const screenHeight = Dimensions.get('window').height;
  const guideBoxWidth = screenWidth * 0.8;
  const guideBoxHeight = screenHeight * 0.5;
  const guideBoxX = (screenWidth - guideBoxWidth) / 2;
  const guideBoxY = screenHeight * 0.25;

  useEffect(() => {
    (async () => {
      await requestPermission();
    })();
  }, []);

  if (!permission) {
    return <View />;
  }

  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <Text style={styles.message}>We need your permission to show the camera</Text>
        <TouchableOpacity onPress={requestPermission}>
          <Text style={styles.permissionButton}>Grant Permission</Text>
        </TouchableOpacity>
      </View>
    );
  }

  //Crops Full image to within guide box
  const cropImageToGuideBox = async (photoUri) => {
    // Get the image dimensions
    const { width: imageWidth, height: imageHeight } = await new Promise((resolve, reject) => {
      Image.getSize(photoUri, (width, height) => resolve({ width, height }), reject);
    });

    // Calculate the crop rectangle
    const widthScale = imageWidth / screenWidth;
    const heightScale = imageHeight / screenHeight;

    const cropRect = {
      originX: guideBoxX * widthScale,
      originY: guideBoxY * heightScale,
      width: guideBoxWidth * widthScale,
      height: guideBoxHeight * heightScale,
    };

    // Use ImageManipulator to crop the image
    const croppedImage = await manipulateAsync(
      photoUri,
      [{ crop: cropRect }],
      { compress: 1, format: SaveFormat.JPEG }
    );

    return croppedImage.uri;
  };

  //Captures Picture Function
  const takePicture = async () => {
    if (cameraRef.current) {
      try {
        const photo = await cameraRef.current.takePictureAsync({
          quality: 1,
        });
        const croppedUri = await cropImageToGuideBox(photo.uri);
        navigation.navigate('ImageSubmission', { imageUri: croppedUri });
      } catch (error) {
        console.error('Error taking photo:', error);
      }
    }
  };

  //UI Components
  return (
    <View style={styles.container}>
      <CameraView
        ref={cameraRef}
        style={styles.camera}
        type={facing}
      >
        {/* Guide box for cropping */}
        <View style={styles.guideBoxContainer}>
          <View style={styles.guideBox} />
        </View>

        {/* Camera button */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.button} onPress={takePicture}>
            <Image source={ImageClick} style={styles.icon} />
          </TouchableOpacity>
        </View>

        {/* Back button */}
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Image source={BackIcon} style={styles.backIcon} />
        </TouchableOpacity>
      </CameraView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  message: {
    textAlign: 'center',
    paddingBottom: 10,
  },
  permissionButton: {
    textAlign: 'center',
    color: '#007BFF',
    fontSize: 18,
  },
  camera: {
    flex: 1,
  },
  guideBoxContainer: {
    position: 'absolute',
    top: '25%',
    left: '10%',
    right: '10%',
    bottom: '25%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  guideBox: {
    width: '100%',
    height: '100%',
    borderWidth: 3,
    borderColor: 'white',
    backgroundColor: 'transparent',
    borderRadius: 10,
  },
  buttonContainer: {
    flex: 1,
    backgroundColor: 'transparent',
    flexDirection: 'column',
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginBottom: 36,
  },
  icon: {
    width: 70,
    height: 70,
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
