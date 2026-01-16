import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { withLayoutContext } from 'expo-router';

const { Navigator } = createMaterialTopTabNavigator();
const MaterialTopTabs = withLayoutContext(Navigator);

export default function ModulesLayout() {
  return (
    <MaterialTopTabs
      screenOptions={{
        tabBarActiveTintColor: '#007AFF',
        tabBarInactiveTintColor: '#888',
        tabBarLabelStyle: { fontWeight: 'bold', fontSize: 12 },
        tabBarIndicatorStyle: { backgroundColor: '#007AFF', height: 3 },
        tabBarStyle: { backgroundColor: '#FFF' },
      }}
    >
      <MaterialTopTabs.Screen name="basics" options={{ title: 'Basics' }} />
      <MaterialTopTabs.Screen name="analysis" options={{ title: 'Analysis' }} />
      <MaterialTopTabs.Screen name="risk" options={{ title: 'Risk' }} />
    </MaterialTopTabs>
  );
}