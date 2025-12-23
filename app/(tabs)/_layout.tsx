import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function TabLayout() {
  return (
    <Tabs screenOptions={{ tabBarActiveTintColor: '#007AFF', headerShown: false }}>
      {/* 1. Home */}
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => <Ionicons name="home" size={24} color={color} />,
        }}
      />
      
      {/* 2. Trading */}
      <Tabs.Screen
        name="trading"
        options={{
          title: 'Paper Trading',
          tabBarIcon: ({ color }) => <Ionicons name="trending-up" size={24} color={color} />,
        }}
      />

      {/* 3. Learn */}
      <Tabs.Screen
        name="learn"
        options={{
          title: 'Learn',
          tabBarIcon: ({ color }) => <Ionicons name="school" size={24} color={color} />,
        }}
      />

      {/* 4. AI Assistant */}
      <Tabs.Screen
        name="ai_bot"
        options={{
          title: 'Assistant',
          tabBarIcon: ({ color }) => <Ionicons name="chatbubble-ellipses" size={24} color={color} />,
        }}
      />

      {/* 5. Analyzer */}
      <Tabs.Screen
        name="analyze"
        options={{
          title: 'Analyzer',
          tabBarIcon: ({ color }) => <Ionicons name="scan-circle" size={28} color={color} />,
        }}
      />

      {/* 6. Settings */}
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Settings',
          tabBarIcon: ({ color }) => <Ionicons name="settings-sharp" size={24} color={color} />,
        }}
      />
    </Tabs>
  );
}