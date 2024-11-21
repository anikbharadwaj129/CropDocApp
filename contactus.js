// Import Packages
import React from 'react';
import { Layout, Text } from '@ui-kitten/components';
import { TouchableWithoutFeedback, Keyboard, StyleSheet, View, ScrollView, TouchableOpacity } from 'react-native';
import { Image } from 'react-native';
import transparentImage from './assets/backvine.png'; 

export default function ContactUs({ navigation }) {
  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <View style={styles.container}>
        
        {/* Transparent Background Image */}
        <Image source={transparentImage} style={styles.backgroundImage} />

        {/* Back Arrow Button */}
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Image source={require('./assets/back-arrow.png')} style={styles.backIcon} />
        </TouchableOpacity>
        
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          <Layout style={styles.innerContainer}>
            <Text style={styles.title}>Contact Us</Text>

            <Text style={styles.sectionTitle}>Crop D.O.C. Info:</Text>
            <Text style={styles.description}>
              Crop D.O.C. is a cutting-edge platform designed to diagnose crop diseases using AI technology. The website allows users to upload images of their crops for disease detection and offers actionable insights to protect your harvest. Developed using React JS, it integrates Google Gemini for a crop-focused chatbot that answers agricultural queries. Remember, the diagnosis might not always be perfect; consult a professional for confirmation when necessary.
            </Text>

            <Text style={styles.description}>
              If you have any feedback, suggestions, or encounter any issues while using Crop D.O.C., we'd love to hear from you!
            </Text>

            <Text style={styles.sectionTitle}>Created By</Text>
            <Text style={styles.description}>Joe Reese</Text>
            <Text style={styles.description}>Aniketh Bharadwaj</Text>
            <Text style={styles.description}>Gustavo De Levante</Text>
            <Text style={styles.description}>Joshua Musonera</Text>

            <Text style={styles.sectionTitle}>Sponsored By</Text>
            <Text style={styles.description}>Mohamed Massaoudi</Text>

            <Text style={styles.emailText}>Contact us at:</Text>
            <Text style={styles.email}>cropdochelp@gmail.com</Text>

            {/* FAQ Section */}
            <Text style={styles.sectionTitle}>F.A.Q.</Text>

            <Text style={styles.faqQuestion}>Q: How accurate are the crop diagnoses?</Text>
            <Text style={styles.faqAnswer}>
              A: Our model's tests show an accuracy of about 97%; however, always consult an expert for a definitive diagnosis.
            </Text>

            <Text style={styles.faqQuestion}>
              Q: Can new plants or diseases be added to receive diagnoses?
            </Text>
            <Text style={styles.faqAnswer}>
              A: Absolutely! Per user demand, via our Crop DOC email, we can temporarily pause our services and update the system to include new plants and/or diseases.
            </Text>

            <Text style={styles.faqQuestion}>Q: How may I use the Gemini chatbot?</Text>
            <Text style={styles.faqAnswer}>
              A: Our Gemini Chatbot does contain general knowledge; however, it can only answer questions and help with plant-related topics.
            </Text>
          </Layout>
        </ScrollView>
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  backgroundImage: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    opacity: 0.5, // Transparent background image
    resizeMode: 'cover',
  },
  container: {
    flex: 1,
    backgroundColor: '#edf7ec', // Soft natural green background matching theme
  },
  scrollView: {
    flex: 1,
    width: '100%',
    marginTop: 40, // Adjusted to make it smaller
  },
  scrollContent: {
    alignItems: 'center',
    paddingVertical: 10, // Reduced padding
    paddingHorizontal: 15, // Reduced padding
  },
  title: {
    fontSize: 20, // Reduced font size
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#2e7d32', // Dark green for contrast
    marginBottom: 15, // Reduced margin
  },
  description: {
    fontSize: 14, // Reduced font size
    textAlign: 'center',
    color: '#2e7d32', // Matching dark green
    marginBottom: 10, // Reduced margin
  },
  emailText: {
    fontSize: 16, // Reduced font size
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#2e7d32',
  },
  email: {
    fontSize: 14, // Reduced font size
    textAlign: 'center',
    color: '#388e3c', // Different green shade for emphasis
    marginBottom: 15, // Reduced margin
  },
  sectionTitle: {
    fontSize: 18, // Reduced font size
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#2e7d32', // Dark green for section titles
    marginBottom: 8, // Reduced margin
    marginTop: 15, // Reduced margin
  },
  backButton: {
    position: 'absolute',
    top: 40, // Adjusted for better layout positioning
    left: 15,
    zIndex: 10, // Ensures the button stays on top of other elements
  },
  backIcon: {
    width: 32,
    height: 32,
  },
  innerContainer: {
    alignItems: 'center',
    width: '100%',
    backgroundColor: 'rgba(255, 255, 255, 0.01)', // Ensure inner container has the same background color
  },
  faqQuestion: {
    fontSize: 14, // Reduced font size
    fontWeight: 'bold',
    color: '#2e7d32',
    marginTop: 8, // Reduced margin
  },
  faqAnswer: {
    fontSize: 14, // Reduced font size
    color: '#2e7d32',
    marginBottom: 10, // Reduced margin
  },
});
