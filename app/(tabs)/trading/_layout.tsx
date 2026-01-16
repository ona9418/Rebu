import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { withLayoutContext } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';

const { Navigator } = createMaterialTopTabNavigator();
const MaterialTopTabs = withLayoutContext(Navigator);

export default function TradingLayout() {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }} edges={['top']}>
      <MaterialTopTabs
        screenOptions={{
          tabBarActiveTintColor: '#007AFF',
          tabBarLabelStyle: { fontWeight: 'bold' },
          tabBarIndicatorStyle: { backgroundColor: '#007AFF' },
          tabBarStyle: { backgroundColor: '#fff' },
        }}
      >
        <MaterialTopTabs.Screen name="index" options={{ title: 'Crypto' }} />
        <MaterialTopTabs.Screen name="forex" options={{ title: 'Forex' }} />
        <MaterialTopTabs.Screen name="commodities" options={{ title: 'Commodities' }} />
      </MaterialTopTabs>
    </SafeAreaView>
  );
}