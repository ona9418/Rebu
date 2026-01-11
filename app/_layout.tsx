import { Stack } from 'expo-router';
import { TradingProvider } from '../context/TradingContext'; // Import the provider

export default function RootLayout() {
  return (
    <TradingProvider>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        {/* other screens */}
      </Stack>
    </TradingProvider>
  );
}