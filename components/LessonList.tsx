import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useTrading } from '../context/TradingContext';

export default function LessonList({ moduleData }: { moduleData: any }) {
  const router = useRouter();
  const { completedLessons } = useTrading();

  return (
    <View style={styles.container}>
      <FlatList
        data={moduleData.lessons}
        keyExtractor={(item: any) => item.id}
        contentContainerStyle={{ padding: 20 }}
        renderItem={({ item }) => {
          const isDone = completedLessons.includes(item.id);
          return (
            <TouchableOpacity 
              style={[styles.card, isDone && styles.cardDone]}
              onPress={() => router.push(`/learn/lesson/${item.id}`)}
            >
              <Ionicons 
                name={isDone ? "checkmark-circle" : "play-circle"} 
                size={32} 
                color={isDone ? "#4CD964" : moduleData.color} 
                style={{ marginRight: 15 }}
              />
              <View style={{ flex: 1 }}>
                <Text style={[styles.title, isDone && styles.textDone]}>{item.title}</Text>
                <Text style={styles.duration}>{item.duration}</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#DDD" />
            </TouchableOpacity>
          );
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F4F6F8' },
  card: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFF', padding: 16, borderRadius: 12, marginBottom: 10 },
  cardDone: { backgroundColor: '#FAFAFA' },
  title: { fontSize: 16, fontWeight: '600', color: '#333' },
  textDone: { color: '#AAA', textDecorationLine: 'line-through' },
  duration: { fontSize: 12, color: '#888', marginTop: 2 },
});