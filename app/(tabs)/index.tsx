import React from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
// FIXED: Changed from '../../../' to '../../'
import { useTrading } from '../../context/TradingContext';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function HomeScreen() {
  const { balance, holdings } = useTrading();
  
  // Example: Show top 3 holdings on Home
  const topHoldings = holdings.slice(0, 3);

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <View style={styles.header}>
        <Text style={styles.greeting}>Welcome Back</Text>
        <Text style={styles.title}>Dashboard</Text>
      </View>

      <View style={styles.balanceCard}>
        <Text style={styles.label}>Total Balance</Text>
        <Text style={styles.balance}>
          ${balance.toLocaleString(undefined, { minimumFractionDigits: 2 })}
        </Text>
      </View>

      <Text style={styles.sectionTitle}>Recent Activity</Text>
      
      {topHoldings.length === 0 ? (
        <View style={styles.emptyState}>
          <Ionicons name="stats-chart" size={48} color="#CCC" />
          <Text style={styles.emptyText}>Start trading to see activity here.</Text>
        </View>
      ) : (
        <FlatList
          data={topHoldings}
          keyExtractor={(item) => item.symbol}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <View style={[styles.icon, { backgroundColor: item.category === 'crypto' ? '#F7931A' : '#007AFF' }]}>
                  <Ionicons name={item.category === 'crypto' ? 'logo-bitcoin' : 'cash'} size={20} color="#FFF" />
                </View>
                <View>
                  <Text style={styles.symbol}>{item.symbol}</Text>
                  <Text style={styles.amount}>{item.amount.toFixed(4)} Units</Text>
                </View>
              </View>
              <Text style={styles.value}>
                 ${(item.amount * item.avgPrice).toLocaleString(undefined, { maximumFractionDigits: 2 })}
              </Text>
            </View>
          )}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F4F6F8', paddingHorizontal: 20 },
  header: { marginTop: 10, marginBottom: 20 },
  greeting: { fontSize: 14, color: '#666', textTransform: 'uppercase' },
  title: { fontSize: 28, fontWeight: '800', color: '#1A1A1A' },
  
  balanceCard: { padding: 25, backgroundColor: '#007AFF', borderRadius: 20, marginBottom: 25, shadowColor: '#007AFF', shadowOpacity: 0.3, shadowRadius: 10, shadowOffset: { width: 0, height: 5 }, elevation: 5 },
  label: { color: 'rgba(255,255,255,0.8)', fontSize: 14, fontWeight: '600', marginBottom: 5 },
  balance: { fontSize: 36, fontWeight: 'bold', color: '#FFF' },

  sectionTitle: { fontSize: 18, fontWeight: 'bold', color: '#333', marginBottom: 15 },
  card: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 16, backgroundColor: '#FFF', borderRadius: 16, marginBottom: 10, shadowColor: '#000', shadowOpacity: 0.03, elevation: 1 },
  icon: { width: 40, height: 40, borderRadius: 12, justifyContent: 'center', alignItems: 'center', marginRight: 15 },
  symbol: { fontSize: 16, fontWeight: 'bold', color: '#1A1A1A' },
  amount: { fontSize: 12, color: '#888', marginTop: 2 },
  value: { fontSize: 16, fontWeight: '700', color: '#333' },
  
  emptyState: { alignItems: 'center', marginTop: 20, padding: 20 },
  emptyText: { color: '#999', marginTop: 10, fontSize: 14 }
});