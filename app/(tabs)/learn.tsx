import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Stack } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Alert, Modal, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTrading } from '../../context/TradingContext';

// --- DATA: CURRICULUM ---
const MODULES = [
  {
    id: 'basics',
    title: 'Market Basics',
    color: '#4A90E2',
    icon: 'school',
    lessons: [
      { id: '101', title: 'What is a Stock?', duration: '2 min', content: 'A stock represents ownership in a company. When you buy a stock, you become a shareholder...' },
      { id: '102', title: 'Bull vs Bear Markets', duration: '3 min', content: 'A Bull Market is when prices are rising. A Bear Market is when prices are falling...' },
      { id: '103', title: 'What is Crypto?', duration: '4 min', content: 'Cryptocurrency is digital money that is secured by blockchain technology...' },
    ]
  },
  {
    id: 'analysis',
    title: 'Technical Analysis',
    color: '#9013FE',
    icon: 'analytics',
    lessons: [
      { id: '201', title: 'Reading a Candlestick', duration: '5 min', content: 'Candlesticks show the Open, High, Low, and Close price for a specific time period...' },
      { id: '202', title: 'Support & Resistance', duration: '4 min', content: 'Support is a price level where a stock has difficulty falling below. Resistance is where it struggles to break above...' },
    ]
  },
  {
    id: 'risk',
    title: 'Risk Management',
    color: '#D0021B',
    icon: 'shield-checkmark',
    lessons: [
      { id: '301', title: 'The 1% Rule', duration: '3 min', content: 'Never risk more than 1% of your total account balance on a single trade...' },
      { id: '302', title: 'Stop Losses Explained', duration: '4 min', content: 'A Stop Loss is an automatic order to sell an asset if it drops to a certain price...' },
    ]
  }
];

export default function LearnScreen() {
  const [completedLessons, setCompletedLessons] = useState<string[]>([]);
  const [selectedLesson, setSelectedLesson] = useState<any>(null); // For Modal
  const [modalVisible, setModalVisible] = useState(false);
  const { rewardUser } = useTrading(); // Use the hook

  // Load Progress
  useEffect(() => {
    loadProgress();
  }, []);

  const loadProgress = async () => {
    try {
      const saved = await AsyncStorage.getItem('@rebu_learn_progress');
      if (saved) setCompletedLessons(JSON.parse(saved));
    } catch (e) { console.error("Failed to load progress", e); }
  };

  const markComplete = async (lessonId: string) => {
    if (!completedLessons.includes(lessonId)) {
      const newProgress = [...completedLessons, lessonId];
      setCompletedLessons(newProgress);
      await AsyncStorage.setItem('@rebu_learn_progress', JSON.stringify(newProgress));
      rewardUser(100); // Give $100 for learning
      Alert.alert("Lesson Complete!", "You earned $100 for your trading account!");

    }
    setModalVisible(false);
  };

  // Calculate Total Progress
  const totalLessons = MODULES.reduce((acc, m) => acc + m.lessons.length, 0);
  const progressPercent = Math.round((completedLessons.length / totalLessons) * 100);

  const openLesson = (lesson: any) => {
    setSelectedLesson(lesson);
    setModalVisible(true);
  };

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />

      {/* HEADER */}
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Welcome, Student</Text>
          <Text style={styles.title}>Rebu Academy</Text>
        </View>
        <View style={styles.progressCircle}>
          <Text style={styles.progressText}>{progressPercent}%</Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={{ paddingBottom: 40 }}>
        
        {/* CONTINUE LEARNING BANNER */}
        <View style={styles.banner}>
          <View>
            <Text style={styles.bannerTitle}>Keep it up!</Text>
            <Text style={styles.bannerSub}>{completedLessons.length} of {totalLessons} lessons completed.</Text>
          </View>
          <Ionicons name="trophy" size={40} color="#FFD700" />
        </View>

        {/* MODULE LIST */}
        {MODULES.map((module) => (
          <View key={module.id} style={styles.moduleContainer}>
            <View style={styles.moduleHeader}>
              <View style={[styles.iconBox, { backgroundColor: module.color }]}>
                <Ionicons name={module.icon as any} size={20} color="#FFF" />
              </View>
              <Text style={styles.moduleTitle}>{module.title}</Text>
            </View>

            {module.lessons.map((lesson) => {
              const isDone = completedLessons.includes(lesson.id);
              return (
                <TouchableOpacity 
                  key={lesson.id} 
                  style={[styles.lessonCard, isDone && styles.lessonDone]} 
                  onPress={() => openLesson(lesson)}
                >
                  <View style={{flexDirection:'row', alignItems:'center'}}>
                    <Ionicons 
                      name={isDone ? "checkmark-circle" : "play-circle"} 
                      size={28} 
                      color={isDone ? "#4CD964" : "#CCC"} 
                      style={{marginRight: 12}}
                    />
                    <View>
                      <Text style={[styles.lessonTitle, isDone && {color:'#888', textDecorationLine:'line-through'}]}>
                        {lesson.title}
                      </Text>
                      <Text style={styles.lessonDuration}>{lesson.duration}</Text>
                    </View>
                  </View>
                  <Ionicons name="chevron-forward" size={20} color="#DDD" />
                </TouchableOpacity>
              );
            })}
          </View>
        ))}

      </ScrollView>

      {/* LESSON MODAL */}
      <Modal visible={modalVisible} animationType="slide" presentationStyle="pageSheet">
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>{selectedLesson?.title}</Text>
            <TouchableOpacity onPress={() => setModalVisible(false)}>
              <Ionicons name="close-circle" size={30} color="#888" />
            </TouchableOpacity>
          </View>
          
          <ScrollView style={styles.modalContent}>
            <Text style={styles.lessonText}>{selectedLesson?.content}</Text>
            <Text style={styles.lessonText}>
              {/* Placeholder for longer content */}
              {"\n"}In this lesson, we explore the core concepts of this topic. Understanding this is crucial for your trading journey. Markets move in cycles, and recognizing these patterns helps you make better decisions.
              {"\n"}{"\n"}Remember: Knowledge is your best asset.
            </Text>
          </ScrollView>

          <TouchableOpacity style={styles.completeBtn} onPress={() => markComplete(selectedLesson?.id)}>
            <Text style={styles.completeText}>Mark as Complete</Text>
          </TouchableOpacity>
        </View>
      </Modal>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F4F6F8' },
  
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 20 },
  greeting: { fontSize: 14, color: '#888', textTransform: 'uppercase' },
  title: { fontSize: 28, fontWeight: '800', color: '#1A1A1A' },
  
  progressCircle: { width: 50, height: 50, borderRadius: 25, borderWidth: 3, borderColor: '#007AFF', justifyContent: 'center', alignItems: 'center' },
  progressText: { fontSize: 14, fontWeight: 'bold', color: '#007AFF' },

  banner: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#333', marginHorizontal: 20, padding: 20, borderRadius: 16, marginBottom: 25 },
  bannerTitle: { color: '#FFF', fontSize: 18, fontWeight: 'bold' },
  bannerSub: { color: '#CCC', fontSize: 12, marginTop: 4 },

  moduleContainer: { marginBottom: 25 },
  moduleHeader: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, marginBottom: 10 },
  iconBox: { width: 32, height: 32, borderRadius: 8, justifyContent: 'center', alignItems: 'center', marginRight: 10 },
  moduleTitle: { fontSize: 18, fontWeight: 'bold', color: '#333' },

  lessonCard: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#FFF', marginHorizontal: 20, padding: 16, borderRadius: 12, marginBottom: 8, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 5, elevation: 1 },
  lessonDone: { backgroundColor: '#F9F9F9' },
  lessonTitle: { fontSize: 16, fontWeight: '600', color: '#333' },
  lessonDuration: { fontSize: 12, color: '#888', marginTop: 2 },

  // Modal
  modalContainer: { flex: 1, backgroundColor: '#FFF', paddingTop: 20 },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingBottom: 20, borderBottomWidth: 1, borderColor: '#EEE' },
  modalTitle: { fontSize: 20, fontWeight: 'bold', flex: 1 },
  modalContent: { padding: 20 },
  lessonText: { fontSize: 18, lineHeight: 28, color: '#444' },
  completeBtn: { backgroundColor: '#007AFF', margin: 20, padding: 16, borderRadius: 12, alignItems: 'center', marginBottom: 40 },
  completeText: { color: '#FFF', fontSize: 18, fontWeight: 'bold' },
});