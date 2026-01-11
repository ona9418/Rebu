import { View, Text, StyleSheet } from 'react-native';
import { useTrading } from '../../../context/TradingContext';

export default function CryptoScreen() {
  const { balance, holdings } = useTrading();

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Crypto Trading</Text>
      <Text>Balance: ${balance}</Text>
      {/* Implement your Crypto specific UI here */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', padding: 20 },
  text: { fontSize: 20, fontWeight: 'bold' }
});