import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useTrading } from '../../../../context/TradingContext';
import { MODULES } from '../../../../constants/Curriculum';

export default function LessonDetailScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { markLessonComplete, completedLessons } = useTrading();

  // Find the lesson
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
      <ScrollView contentContainerStyle={{ padding: 20 }}>
        <Text style={styles.title}>{lesson.title}</Text>
        <Text style={styles.duration}>Duration: {lesson.duration}</Text>
        <View style={styles.divider} />
        <Text style={styles.body}>{lesson.content}</Text>
      </ScrollView>
      <View style={styles.footer}>
        <TouchableOpacity 
          style={[styles.btn, isComplete && styles.btnDisabled]} 
          onPress={handleComplete}
          disabled={isComplete}
        >
          <Text style={styles.btnText}>{isComplete ? "Completed" : "Complete Lesson"}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFF' },
  title: { fontSize: 24, fontWeight: 'bold', color: '#1A1A1A' },
  duration: { color: '#666', marginTop: 4 },
  divider: { height: 1, backgroundColor: '#EEE', marginVertical: 20 },
  body: { fontSize: 16, lineHeight: 24, color: '#333' },
  footer: { padding: 20, borderTopWidth: 1, borderColor: '#EEE' },
  btn: { backgroundColor: '#007AFF', padding: 15, borderRadius: 10, alignItems: 'center' },
  btnDisabled: { backgroundColor: '#CCC' },
  btnText: { color: '#FFF', fontWeight: 'bold' },
});