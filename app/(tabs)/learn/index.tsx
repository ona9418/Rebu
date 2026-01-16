import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { TRADING_METHODS, MODULES } from '../../../constants/Curriculum'; 
import { useTrading } from '../../../context/TradingContext'; 

export default function LearnTilesScreen() {
  const router = useRouter();
  const { completedLessons } = useTrading();

  // Calculate Progress
  const totalLessons = MODULES.reduce((acc, m) => acc + m.lessons.length, 0);
  const completedCount = completedLessons.length;
  const progressPercent = totalLessons > 0 ? Math.round((completedCount / totalLessons) * 100) : 0;

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      
      {/* Header */}
      <View style={styles.headerRow}>
        <View>
          <Text style={styles.greeting}>Rebu Academy</Text>
          <Text style={styles.title}>Trading Methods</Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        {/* Progress Bar */}
        <View style={styles.progressContainer}>
          <View style={styles.progressLabelRow}>
            <Text style={styles.progressLabel}>Total Progress</Text>
            <Text style={styles.progressValue}>{completedCount}/{totalLessons} Lessons</Text>
          </View>
          <View style={styles.track}>
            <View style={[styles.fill, { width: `${progressPercent}%` }]} />
          </View>
        </View>

        {/* 1. ASSETS TILE (Updated to Match Standard Style) */}
        <TouchableOpacity 
          style={[styles.tile, { borderLeftColor: '#2ECC71' }]} 
          onPress={() => router.push('/learn/assets')}
        >
          <View style={[styles.iconBox, { backgroundColor: '#2ECC71' }]}> 
            <Ionicons name="briefcase" size={28} color="#FFF" />
          </View>
          <View style={styles.textContainer}>
            <Text style={styles.tileTitle}>Asset Classes</Text>
            <Text style={styles.tileDesc}>Stocks, Crypto, Commodities</Text>
            <Text style={styles.lessonCount}>Explore Assets</Text>
          </View>
          <Ionicons name="chevron-forward" size={24} color="#DDD" />
        </TouchableOpacity>

        <Text style={styles.sectionHeader}>Ways to Trade</Text>

        {/* 2. TRADING METHODS TILES */}
        {TRADING_METHODS.map((module) => (
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

        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F4F6F8' },
  headerRow: { paddingHorizontal: 20, paddingTop: 10, paddingBottom: 10, backgroundColor: '#F4F6F8' },
  greeting: { fontSize: 14, color: '#888', textTransform: 'uppercase' },
  title: { fontSize: 28, fontWeight: '800', color: '#1A1A1A' },
  
  scrollContent: { paddingHorizontal: 20 },
  sectionHeader: { fontSize: 18, fontWeight: 'bold', color: '#666', marginTop: 20, marginBottom: 10 },

  // Progress Bar
  progressContainer: { marginBottom: 20, marginTop: 5 },
  progressLabelRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 },
  progressLabel: { fontSize: 12, fontWeight: '600', color: '#555' },
  progressValue: { fontSize: 12, fontWeight: 'bold', color: '#007AFF' },
  track: { height: 8, backgroundColor: '#E0E0E0', borderRadius: 4, overflow: 'hidden' },
  fill: { height: '100%', backgroundColor: '#007AFF', borderRadius: 4 },

  // Standard Tile Style (Unified)
  tile: { 
    flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFF', 
    padding: 20, marginBottom: 15, borderRadius: 16, 
    borderLeftWidth: 5, // Consistent Accent Bar
    shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 5, elevation: 2 
  },

  iconBox: { width: 50, height: 50, borderRadius: 12, justifyContent: 'center', alignItems: 'center', marginRight: 15 },
  textContainer: { flex: 1 },
  tileTitle: { fontSize: 18, fontWeight: 'bold', color: '#333' },
  tileDesc: { fontSize: 13, color: '#666', marginTop: 2 },
  lessonCount: { fontSize: 12, color: '#999', marginTop: 5, fontWeight: '600' },
});