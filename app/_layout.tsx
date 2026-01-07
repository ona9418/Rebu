// app/_layout.tsx
import { Stack } from 'expo-router';
import { TradingProvider } from '../context/TradingContext'; // Import the provider

export default function RootLayout() {
  return (
    <TradingProvider>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="strategy/[id]" options={{ title: 'Strategy Details' }} />
      </Stack>
    </TradingProvider>
  );
}