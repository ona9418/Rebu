import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useTrading } from '../../../context/TradingContext';
import { MODULES } from '../../../constants/Curriculum';

export default function LessonDetailScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { markLessonComplete, completedLessons } = useTrading();

  // Find the lesson data
  let lesson = null;
  for (const module of MODULES) {
    const found = module.lessons.find(l => l.id === id);
    if (found) {
      lesson = found;
      break;
    }
  }

  if (!lesson) return <View style={styles.container}><Text>Lesson not found</Text></View>;

  const isComplete = completedLessons.includes(lesson.id);

  const handleComplete = () => {
    markLessonComplete(lesson.id);
    router.back();
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>{lesson.title}</Text>
        <Text style={styles.duration}>Duration: {lesson.duration}</Text>
        
        <View style={styles.divider} />
        
        <Text style={styles.body}>
          {lesson.content}
          {"\n"}{"\n"}
          In this lesson, we explore the core concepts of this topic. Understanding this is crucial for your trading journey. Markets move in cycles, and recognizing these patterns helps you make better decisions.
          {"\n"}{"\n"}
          Key Takeaways:
          {"\n"}• Understand the market mechanics.
          {"\n"}• Manage your risk effectively.
          {"\n"}• Stay disciplined in your strategy.
        </Text>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity 
          style={[styles.btn, isComplete && styles.btnDisabled]} 
          onPress={handleComplete}
          disabled={isComplete}
        >
          <Text style={styles.btnText}>
            {isComplete ? "Lesson Completed" : "Complete Lesson"}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFF' },
  content: { padding: 20, paddingBottom: 100 },
  title: { fontSize: 24, fontWeight: 'bold', color: '#1A1A1A', marginBottom: 5 },
  duration: { fontSize: 14, color: '#888' },
  divider: { height: 1, backgroundColor: '#EEE', marginVertical: 20 },
  body: { fontSize: 18, lineHeight: 28, color: '#444' },
  footer: { position: 'absolute', bottom: 0, left: 0, right: 0, padding: 20, backgroundColor: '#FFF', borderTopWidth: 1, borderColor: '#EEE' },
  btn: { backgroundColor: '#007AFF', padding: 16, borderRadius: 12, alignItems: 'center' },
  btnDisabled: { backgroundColor: '#CCC' },
  btnText: { color: '#FFF', fontSize: 18, fontWeight: 'bold' },
});