import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { withLayoutContext } from 'expo-router';

// Create the custom navigator
const { Navigator } = createMaterialTopTabNavigator();
const MaterialTopTabs = withLayoutContext(Navigator);

export default function TradingLayout() {
  return (
    <MaterialTopTabs
      screenOptions={{
        tabBarActiveTintColor: '#007AFF',
        tabBarLabelStyle: { fontWeight: 'bold' },
        tabBarIndicatorStyle: { backgroundColor: '#007AFF' },
      }}
    >
      <MaterialTopTabs.Screen name="index" options={{ title: 'Crypto' }} />
      <MaterialTopTabs.Screen name="forex" options={{ title: 'Forex' }} />
      <MaterialTopTabs.Screen name="commodities" options={{ title: 'Commodities' }} />
    </MaterialTopTabs>
  );
}