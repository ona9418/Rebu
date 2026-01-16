import React from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { useTrading } from '../../../context/TradingContext';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context'; // Import this

export default function CryptoScreen() {
  const { balance, holdings } = useTrading();
  const cryptoHoldings = holdings.filter(h => h.category === 'crypto');

  return (
    // Replaced View with SafeAreaView and set edges to bottom only
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <View style={styles.header}>
        <Text style={styles.label}>Available Cash</Text>
        <Text style={styles.balance}>${balance.toLocaleString(undefined, { minimumFractionDigits: 2 })}</Text>
      </View>

      <Text style={styles.sectionTitle}>Your Crypto Portfolio</Text>

      {cryptoHoldings.length === 0 ? (
        <View style={styles.emptyState}>
          <Ionicons name="wallet-outline" size={48} color="#CCC" />
          <Text style={styles.emptyText}>No crypto assets owned yet.</Text>
        </View>
      ) : (
        <FlatList
          data={cryptoHoldings}
          keyExtractor={(item) => item.symbol}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <View>
                <Text style={styles.symbol}>{item.symbol}</Text>
                <Text style={styles.amount}>{item.amount.toFixed(4)} Units</Text>
              </View>
              <View style={{ alignItems: 'flex-end' }}>
                <Text style={styles.label}>Avg Buy Price</Text>
                <Text style={styles.value}>${item.avgPrice.toLocaleString()}</Text>
              </View>
            </View>
          )}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F4F6F8', paddingHorizontal: 20, paddingTop: 20 },
  header: { marginBottom: 20, padding: 20, backgroundColor: '#FFF', borderRadius: 16, alignItems: 'center' },
  label: { color: '#666', fontSize: 12, textTransform: 'uppercase' },
  balance: { fontSize: 32, fontWeight: '800', color: '#1A1A1A', marginTop: 5 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', color: '#333', marginBottom: 15 },
  card: { flexDirection: 'row', justifyContent: 'space-between', padding: 16, backgroundColor: '#FFF', borderRadius: 12, marginBottom: 10 },
  symbol: { fontSize: 16, fontWeight: 'bold', color: '#1A1A1A' },
  amount: { fontSize: 14, color: '#666', marginTop: 2 },
  value: { fontSize: 16, fontWeight: '600', color: '#333' },
  emptyState: { alignItems: 'center', marginTop: 40 },
  emptyText: { color: '#999', marginTop: 10, fontSize: 16 }
});