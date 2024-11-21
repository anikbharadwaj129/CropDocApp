import React, { useState } from 'react';
import { View, TextInput, StyleSheet, Button, ScrollView, Text, KeyboardAvoidingView, TouchableOpacity } from 'react-native';
import { Image } from 'expo-image';
import { Layout } from '@ui-kitten/components';
import { GoogleGenerativeAI } from "@google/generative-ai";
import transparentImage from './assets/backvine.png'; // Import transparent background image

// Google Gemini API setup
const genAI = new GoogleGenerativeAI('AIzaSyB2D9SRFvJDNUYfdFEgRLlvJG8w_S7ef7Y'); // Replace with your actual environment variable
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

export default function AIBotScreen({ navigation }) {
  const [messages, setMessages] = useState([]); // Stores chat history
  const [inputText, setInputText] = useState(''); // Tracks the user's input
  const [isLoading, setIsLoading] = useState(false); // Loading state when waiting for AI response

  const sendMessageToAI = async () => {
    if (!inputText.trim()) return; // Prevents empty messages
    setIsLoading(true);

    // Add the user's message to the chat
    const newMessage = { text: inputText, isUser: true };
    setMessages([...messages, newMessage]);
    setInputText('');

    try {
        // Contextual Prompt - Crop Disease Focused
        const contextualPrompt = `
            You are an expert in crop disease diagnosis. Your job is to answer questions specifically related to identifying crop diseases, 
            their symptoms, causes, and how to treat or prevent them. You should not answer any questions that are unrelated to crops 
            or plant care. Please respond to the following question:
            "${inputText}"
            If the question is not related to crops, kindly inform the user that you can only assist with crop-related issues. If they greet you, don't be rude about it
`       ;

        // Contextual Prompt + User Input -> AI Response
        const result = await model.generateContent([contextualPrompt]);

        // Add the AI's response to the chat
        const aiMessage = { text: result.response.text(), isUser: false };
        setMessages((prevMessages) => [...prevMessages, aiMessage]);
    } catch (error) {
        console.error('Error fetching AI response:', error);
        const errorMessage = { text: 'Sorry, an error occurred while fetching the response.', isUser: false };
        setMessages((prevMessages) => [...prevMessages, errorMessage]);
    } finally {
        setIsLoading(false);
    }
};


  return ( //UI Components
    <Layout style={styles.container}>
      {/* Transparent Background Image */}
      <Image source={transparentImage} style={styles.backgroundImage} />

      {/* Back Arrow Button */}
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Image source={require('./assets/back-arrow.png')} style={styles.backIcon} />
        </TouchableOpacity>

      <Text style={styles.title}>Ask the AI</Text>

      <KeyboardAvoidingView style={styles.chatContainer} behavior="padding">
        <ScrollView style={styles.chatScrollView}>
          {messages.map((message, index) => (
            <View
              key={index}
              style={[
                styles.messageBubble,
                message.isUser ? styles.userMessage : styles.aiMessage,
              ]}
            >
              <Text style={styles.messageText}>{message.text}</Text>
            </View>
          ))}
        </ScrollView>

        <View style={styles.inputContainer}>
          <TextInput
            style={styles.textInput}
            value={inputText}
            onChangeText={setInputText}
            placeholder="Ask something..."
            editable={!isLoading}
          />
          <Button
            title={isLoading ? 'Loading...' : 'Send'}
            onPress={sendMessageToAI}
            disabled={isLoading}
          />
        </View>
      </KeyboardAvoidingView>
    </Layout>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#edf7ec', // Soft, natural green background
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  backgroundImage: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    opacity: 0.5, // Ensure transparency of the image
    resizeMode: 'contain',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginTop: 50,
    marginBottom: 20,
    color: '#2e7d32', // Dark green for contrast
  },
  chatContainer: {
    flex: 1,
    width: '100%',
    paddingTop: 10,
    justifyContent: 'center',
  },
  chatScrollView: {
    flex: 1,
    width: '100%',
    marginBottom: 10,
  },
  messageBubble: {
    marginVertical: 10,
    padding: 15,
    borderRadius: 10,
    maxWidth: '80%',
  },
  userMessage: {
    alignSelf: 'flex-end',
    backgroundColor: '#007AFF',
  },
  aiMessage: {
    alignSelf: 'flex-start',
    backgroundColor: '#e5e5ea',
  },
  messageText: {
    color: 'black',
    fontSize: 16,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: '#d3d3d3',
    backgroundColor: 'white',
    position: 'relative',
    marginBottom: 60, // Move input higher up the screen
  },
  textInput: {
    flex: 1,
    height: 40,
    borderColor: '#d3d3d3',
    borderWidth: 1,
    borderRadius: 20,
    paddingHorizontal: 10,
    marginRight: 10,
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
