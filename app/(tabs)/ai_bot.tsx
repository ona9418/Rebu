import React, { useState, useRef } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet, KeyboardAvoidingView, Platform, ActivityIndicator, Alert } from 'react-native';
import { Stack } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import axios from 'axios';

const API_KEY = process.env.EXPO_PUBLIC_API_KEY;interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
}

export default function AIBotScreen() {
  const [message, setMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [chatHistory, setChatHistory] = useState<Message[]>([
    { id: '1', text: 'Hello! I am RebuAI. I can see live prices—ask me anything!', sender: 'bot' }
  ]);
  
  const flatListRef = useRef<FlatList>(null);

  // 1. Fetch Live Data
  const fetchMarketData = async () => {
    try {
      const response = await axios.get(
        'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=15&sparkline=false'
      );
      const marketSummary = response.data.map((coin: any) => 
        `${coin.symbol.toUpperCase()}: $${coin.current_price} (${coin.price_change_percentage_24h.toFixed(2)}%)`
      ).join(', ');
      return `LIVE MARKET PRICES: [ ${marketSummary} ]`;
    } catch (error) {
      console.error("Market Data Error:", error);
      return "LIVE MARKET PRICES: [Data Unavailable]";
    }
  };

  const sendMessage = async () => {
    if (!API_KEY) {
      Alert.alert("Configuration Error", "No API Key found. Please check your .env file.");
      return;
    }
    if (message.trim().length === 0) return;

    // 2. Add User Message
    const userMsg: Message = { id: Date.now().toString(), text: message, sender: 'user' };
    const newHistory = [...chatHistory, userMsg];
    setChatHistory(newHistory);
    setMessage('');
    setIsTyping(true);

    try {
      // 3. Get Context
      const liveMarketContext = await fetchMarketData();

      // 4. Send to GROQ (or OpenAI)
      const response = await axios.post(
        'https://api.groq.com/openai/v1/chat/completions',
        {
          model: "llama-3.3-70b-versatile",
          messages: [
            { 
              role: "system", 
              content: `You are RebuAI, an expert trading assistant. 
              CONTEXT: ${liveMarketContext}
              INSTRUCTIONS: Use the live prices to answer. Keep it short.` 
            },
            ...newHistory.map(m => ({ 
              role: m.sender === 'user' ? 'user' : 'assistant', 
              content: m.text 
            })),
            { role: "user", content: message }
          ],
          temperature: 0.5,
          max_tokens: 500
        },
        {
          headers: {
            'Authorization': `Bearer ${API_KEY}`,
            'Content-Type': 'application/json'
          }
        }
      );

      const aiText = response.data.choices[0].message.content.trim();
      setChatHistory(current => [...current, { id: Date.now().toString(), text: aiText, sender: 'bot' }]);

    } catch (error: any) {
      console.error(error);
      Alert.alert("AI Error", "Check your API Key.");
      setChatHistory(current => [...current, { id: Date.now().toString(), text: "Connection failed.", sender: 'bot' }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'} 
        style={styles.container}
      >
        <Stack.Screen options={{ headerShown: false }} />
        
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Rebu Intelligence</Text>
        </View>

        <FlatList
          ref={flatListRef}
          data={chatHistory}
          keyExtractor={(item) => item.id}
          onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
          renderItem={({ item }) => (
            <View style={[styles.bubble, item.sender === 'user' ? styles.userBubble : styles.botBubble]}>
              <Text style={[styles.bubbleText, item.sender === 'user' ? styles.userText : styles.botText]}>
                {item.text}
              </Text>
            </View>
          )}
          ListFooterComponent={isTyping ? (
            <View style={styles.typingContainer}>
              <ActivityIndicator size="small" color="#888" />
              <Text style={styles.typingText}>RebuAI is thinking...</Text>
            </View>
          ) : null}
          contentContainerStyle={{ padding: 15, paddingBottom: 20 }}
        />

        <View style={styles.inputContainer}>
            <TextInput
                style={styles.input}
                placeholder="Ask RebuAI..."
                value={message}
                onChangeText={setMessage}
                onSubmitEditing={sendMessage}
            />
            {/* The Send Button uses TouchableOpacity here: */}
            <TouchableOpacity 
                onPress={sendMessage} 
                style={[styles.sendButton, { backgroundColor: message ? '#007AFF' : '#E0E0E0' }]} 
                disabled={!message}
            >
                <Ionicons name="arrow-up" size={24} color="white" />
            </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#F2F4F7' },
  container: { flex: 1 },
  header: { padding: 15, alignItems: 'center', borderBottomWidth: 1, borderColor: '#eee', backgroundColor: '#fff' },
  headerTitle: { fontSize: 18, fontWeight: 'bold' },
  bubble: { maxWidth: '85%', padding: 14, borderRadius: 18, marginBottom: 12 },
  userBubble: { alignSelf: 'flex-end', backgroundColor: '#007AFF' },
  botBubble: { alignSelf: 'flex-start', backgroundColor: '#fff' },
  bubbleText: { fontSize: 16 },
  userText: { color: 'white' },
  botText: { color: '#000' },
  typingContainer: { flexDirection: 'row', alignItems: 'center', marginLeft: 15, marginBottom: 15 },
  typingText: { marginLeft: 10, color: '#888', fontStyle: 'italic' },
  inputContainer: { flexDirection: 'row', padding: 12, backgroundColor: 'white', alignItems: 'center' },
  input: { flex: 1, backgroundColor: '#F0F0F0', borderRadius: 24, padding: 12, marginRight: 10 },
  sendButton: { width: 44, height: 44, borderRadius: 22, justifyContent: 'center', alignItems: 'center' },
});