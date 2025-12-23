import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView, ActivityIndicator, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import axios from 'axios';

// 1. Get Key from Environment Variables
const GOOGLE_API_KEY = process.env.EXPO_PUBLIC_GEMINI_KEY; 

export default function AnalyzeScreen() {
  const [image, setImage] = useState<string | null>(null);
  const [analysis, setAnalysis] = useState<string>('');
  const [loading, setLoading] = useState(false);

  const pickImage = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (permissionResult.granted === false) {
      Alert.alert("Permission Required", "You need to allow access to photos.");
      return;
    }

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      quality: 0.5,
      base64: true,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      setImage(result.assets[0].uri);
      analyzeChart(result.assets[0].base64); 
    }
  };

  const analyzeChart = async (base64Image: string | null | undefined) => {
    if (!base64Image) return;
    
    if (!GOOGLE_API_KEY) {
      Alert.alert("Configuration Error", "No API Key found. Check your .env file.");
      return;
    }

    setLoading(true);
    setAnalysis('');

    try {
      console.log("🚀 Sending request to Gemini...");
      
      // ⚠️ FIXED: Removed "-latest" from the URL
      const response = await axios.post(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-001:generateContent?key=${GOOGLE_API_KEY}`,
        {
          contents: [{
            parts: [
              { text: "You are a technical analyst. Analyze this chart image. Identify the trend, key support/resistance levels, and suggest a trade setup (Entry, Stop Loss, Take Profit)." },
              {
                inline_data: {
                  mime_type: "image/jpeg",
                  data: base64Image
                }
              }
            ]
          }]
        }
      );

      console.log("✅ Gemini Success!");
      // Gemini response structure
      if (response.data.candidates && response.data.candidates.length > 0) {
        const resultText = response.data.candidates[0].content.parts[0].text;
        setAnalysis(resultText);
      } else {
        setAnalysis("No analysis returned. The image might be unclear.");
      }

    } catch (error: any) {
      console.error("❌ Gemini API Error:", error.response ? error.response.data : error.message);
      Alert.alert("Analysis Failed", "Could not analyze chart. Check console for details.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={styles.header}>Chart Analyzer</Text>
        <Text style={styles.subHeader}>Powered by Gemini 1.5 Flash</Text>

        <TouchableOpacity style={styles.uploadBox} onPress={pickImage}>
          {image ? (
            <Image source={{ uri: image }} style={styles.previewImage} />
          ) : (
            <View style={styles.uploadPlaceholder}>
              <Ionicons name="cloud-upload-outline" size={50} color="#007AFF" />
              <Text style={styles.uploadText}>Tap to Upload Chart</Text>
            </View>
          )}
        </TouchableOpacity>

        {loading && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#007AFF" />
            <Text style={styles.loadingText}>Gemini is analyzing patterns...</Text>
          </View>
        )}

        {analysis ? (
          <View style={styles.resultBox}>
            <View style={styles.resultHeader}>
              <Ionicons name="analytics" size={24} color="#007AFF" />
              <Text style={styles.resultTitle}>Analysis Result</Text>
            </View>
            <Text style={styles.resultText}>{analysis}</Text>
          </View>
        ) : null}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F4F6F8' },
  scroll: { padding: 20 },
  header: { fontSize: 28, fontWeight: '800', color: '#1A1A1A', marginBottom: 5 },
  subHeader: { fontSize: 14, color: '#666', marginBottom: 20 },
  uploadBox: { backgroundColor: '#FFF', borderRadius: 20, borderStyle: 'dashed', borderWidth: 2, borderColor: '#D1D1D6', height: 300, justifyContent: 'center', alignItems: 'center', marginBottom: 20, overflow: 'hidden' },
  uploadPlaceholder: { alignItems: 'center' },
  uploadText: { marginTop: 10, color: '#007AFF', fontWeight: '600', fontSize: 16 },
  previewImage: { width: '100%', height: '100%', resizeMode: 'contain' },
  loadingContainer: { alignItems: 'center', marginVertical: 20 },
  loadingText: { marginTop: 10, color: '#888', fontStyle: 'italic' },
  resultBox: { backgroundColor: '#FFF', padding: 20, borderRadius: 16, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 10, elevation: 3 },
  resultHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
  resultTitle: { fontSize: 18, fontWeight: 'bold', color: '#333', marginLeft: 10 },
  resultText: { fontSize: 16, lineHeight: 24, color: '#444' },
});