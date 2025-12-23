import { useLocalSearchParams, Stack } from 'expo-router';
import { View, Text, StyleSheet } from 'react-native';
import { strategies } from '../../constants/tradingData';

export default function StrategyDetail() {
  const { id } = useLocalSearchParams();
  const strategy = strategies.find(s => s.id === id);

  if (!strategy) return <Text>Not Found</Text>;

  return (
    <View style={{ flex: 1, padding: 20 }}>
      <Stack.Screen options={{ title: strategy.title }} />
      <Text style={styles.title}>{strategy.title}</Text>
      <Text style={styles.text}>{strategy.fullGuide}</Text>
      <View style={styles.tipBox}><Text>💡 {strategy.proTip}</Text></View>
    </View>
  );
}
const styles = StyleSheet.create({
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
  text: { fontSize: 16, lineHeight: 24, marginBottom: 20 },
  tipBox: { backgroundColor: '#FFF8E1', padding: 15, borderRadius: 8 },
});