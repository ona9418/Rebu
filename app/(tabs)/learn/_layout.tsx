import { Stack } from 'expo-router';

export default function LearnStackLayout() {
  return (
    <Stack>
      {/* 1. Main Tiles Screen */}
      <Stack.Screen name="index" options={{ headerShown: false }} />

      {/* 2. NEW: Assets Sub-Menu Screen */}
      <Stack.Screen name="assets" options={{ title: 'Asset Classes', headerBackTitle: 'Learn' }} />

      {/* 3. Modules Tab View */}
      <Stack.Screen name="modules" options={{ title: 'Curriculum', headerBackTitle: 'Back' }} />

      {/* 4. Lesson Detail */}
      <Stack.Screen name="lesson/[id]" options={{ title: 'Lesson', headerBackTitle: 'Back' }} />
    </Stack>
  );
}