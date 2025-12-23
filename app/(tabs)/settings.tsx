import React, { useState } from 'react';
import { View, Text, StyleSheet, Switch, ScrollView } from 'react-native';
import { Stack } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context'; // <--- Import

export default function SettingsScreen() {
  const [isDarkMode, setIsDarkMode] = useState(false);

  return (
    <SafeAreaView style={[styles.container, isDarkMode && styles.darkContainer]}>
      <Stack.Screen options={{ headerShown: false }} />
      
      <ScrollView contentContainerStyle={{ padding: 20 }}>
        <Text style={[styles.headerTitle, isDarkMode && styles.darkText]}>Settings</Text>

        {/* Profile Section */}
        <View style={styles.profileSection}>
          <View style={styles.avatarPlaceholder}>
            <Text style={styles.avatarText}>JD</Text>
          </View>
          <View>
            <Text style={[styles.name, isDarkMode && styles.darkText]}>John Doe</Text>
            <Text style={styles.email}>john@rebuai.com</Text>
          </View>
        </View>

        {/* ... The rest of your settings code ... */}
        
        <View style={styles.section}>
          <Text style={styles.sectionHeader}>PREFERENCES</Text>
          <View style={styles.row}>
            <Text style={[styles.rowLabel, isDarkMode && styles.darkText]}>Dark Mode</Text>
            <Switch value={isDarkMode} onValueChange={setIsDarkMode} />
          </View>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F2F2F7' },
  darkContainer: { backgroundColor: '#000' },
  headerTitle: { fontSize: 32, fontWeight: 'bold', marginBottom: 20 },
  profileSection: { flexDirection: 'row', alignItems: 'center', marginBottom: 30 },
  avatarPlaceholder: { width: 60, height: 60, borderRadius: 30, backgroundColor: '#007AFF', justifyContent: 'center', alignItems: 'center', marginRight: 15 },
  avatarText: { color: '#fff', fontSize: 24, fontWeight: 'bold' },
  name: { fontSize: 20, fontWeight: 'bold' },
  email: { fontSize: 14, color: '#888' },
  section: { marginBottom: 25, backgroundColor: '#fff', borderRadius: 10, padding: 15 },
  sectionHeader: { fontSize: 13, fontWeight: '600', color: '#888', marginBottom: 10 },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 10 },
  rowLabel: { fontSize: 16 },
  darkText: { color: '#fff' },
});