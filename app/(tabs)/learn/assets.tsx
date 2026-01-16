import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { ASSET_CLASSES } from '../../../constants/Curriculum'; // Import the other subset

export default function AssetsScreen() {
  const router = useRouter();

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
      <Text style={styles.headerDescription}>
        Select an asset class to learn about its specific market mechanics and trading hours.
      </Text>

      {ASSET_CLASSES.map((module) => (
        <TouchableOpacity 
          key={module.id} 
          style={[styles.tile, { borderLeftColor: module.color }]}
          onPress={() => router.push(`/learn/modules/${module.id}`)}
        >
          <View style={[styles.iconBox, { backgroundColor: module.color }]}>
            <Ionicons name={module.icon as any} size={28} color="#FFF" />
          </View>
          <View style={styles.textContainer}>
            <Text style={styles.tileTitle}>{module.fullTitle}</Text>
            <Text style={styles.tileDesc}>{module.description}</Text>
            <Text style={styles.lessonCount}>{module.lessons.length} Lessons</Text>
          </View>
          <Ionicons name="chevron-forward" size={24} color="#DDD" />
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F4F6F8' },
  scrollContent: { padding: 20 },
  headerDescription: { fontSize: 16, color: '#666', marginBottom: 20, lineHeight: 22 },
  
  tile: { 
    flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFF', 
    padding: 20, marginBottom: 15, borderRadius: 16, 
    borderLeftWidth: 5, 
    shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 5, elevation: 2 
  },
  iconBox: { width: 50, height: 50, borderRadius: 12, justifyContent: 'center', alignItems: 'center', marginRight: 15 },
  textContainer: { flex: 1 },
  tileTitle: { fontSize: 18, fontWeight: 'bold', color: '#333' },
  tileDesc: { fontSize: 13, color: '#666', marginTop: 2 },
  lessonCount: { fontSize: 12, color: '#999', marginTop: 5, fontWeight: '600' },
});