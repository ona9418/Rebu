import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, Dimensions, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, Stack, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import axios from 'axios';
import { LineChart } from 'react-native-chart-kit';
import { Ionicons } from '@expo/vector-icons';

const SCREEN_WIDTH = Dimensions.get('window').width;

export default function CoinDetailScreen() {
  const { id } = useLocalSearchParams(); // Get the coin ID (e.g., 'bitcoin')
  const router = useRouter();

  const [coin, setCoin] = useState<any>(null);
  const [chartData, setChartData] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);
  const [chartDays, setChartDays] = useState('1'); // 1 Day default

  const fetchCoinDetails = useCallback(async () => {
    try {
      setLoading(true);
      // 1. Get Coin Metadata (Description, Market Cap, etc.)
      const detailsRes = await axios.get(
        `https://api.coingecko.com/api/v3/coins/${id}?localization=false&tickers=false&community_data=false&developer_data=false&sparkline=false`
      );
      
      // 2. Get Chart Data
      const chartRes = await axios.get(
        `https://api.coingecko.com/api/v3/coins/${id}/market_chart?vs_currency=usd&days=${chartDays}`
      );
      
      // Optimize Chart: Take every 10th point to keep it smooth
      const prices = chartRes.data.prices.map((item: any) => item[1]);
      const smoothPrices = prices.filter((_: any, i: number) => i % 10 === 0);

      setCoin(detailsRes.data);
      setChartData(smoothPrices);
    } catch (error) {
      console.error("Error fetching coin details", error);
    } finally {
      setLoading(false);
    }
  }, [id, chartDays]);

  useEffect(() => {
    fetchCoinDetails();
  }, [fetchCoinDetails]);

  // Chart Logic
  const isUp = coin?.market_data?.price_change_percentage_24h >= 0;
  const chartColor = isUp ? (opacity = 1) => `rgba(0, 200, 83, ${opacity})` : (opacity = 1) => `rgba(213, 0, 0, ${opacity})`;

  if (loading || !coin) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />
      
      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{coin.name}</Text>
        <View style={{width: 24}} /> 
      </View>

      <ScrollView contentContainerStyle={{ paddingBottom: 40 }}>
        
        {/* PRICE HEADER */}
        <View style={styles.priceContainer}>
          <Text style={styles.symbol}>{coin.symbol.toUpperCase()}</Text>
          <Text style={styles.currentPrice}>${coin.market_data.current_price.usd.toLocaleString()}</Text>
          <View style={[styles.badge, { backgroundColor: isUp ? '#E8F5E9' : '#FFEBEE' }]}>
             <Text style={{ color: isUp ? '#2E7D32' : '#C62828', fontWeight: 'bold' }}>
               {isUp ? '▲' : '▼'} {coin.market_data.price_change_percentage_24h.toFixed(2)}%
             </Text>
          </View>
        </View>

        {/* CHART */}
        <View style={styles.chartContainer}>
           <LineChart
            data={{
              labels: [],
              datasets: [{ data: chartData }]
            }}
            width={SCREEN_WIDTH} 
            height={220}
            withDots={false} withInnerLines={false} withOuterLines={false}
            withVerticalLabels={false} withHorizontalLabels={false}
            chartConfig={{
              backgroundColor: '#fff', backgroundGradientFrom: '#fff', backgroundGradientTo: '#fff',
              decimalPlaces: 2, color: chartColor, labelColor: () => `rgba(0,0,0,0)`,
              propsForBackgroundLines: { strokeWidth: 0 },
            }}
            bezier
            style={{ marginTop: 10 }}
          />
          <View style={styles.timeframeRow}>
            {['1', '7', '30'].map((day) => (
              <TouchableOpacity 
                key={day} 
                onPress={() => setChartDays(day)} 
                style={[styles.tfBtn, chartDays === day && styles.tfBtnActive]}
              >
                <Text style={[styles.tfText, chartDays === day && styles.tfTextActive]}>
                  {day === '1' ? '24H' : day === '7' ? '1W' : '1M'}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* STATS GRID */}
        <View style={styles.statsGrid}>
          <View style={styles.statBox}>
            <Text style={styles.statLabel}>Market Cap</Text>
            <Text style={styles.statValue}>${(coin.market_data.market_cap.usd / 1e9).toFixed(2)}B</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statLabel}>24h Vol</Text>
            <Text style={styles.statValue}>${(coin.market_data.total_volume.usd / 1e6).toFixed(0)}M</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statLabel}>High 24h</Text>
            <Text style={styles.statValue}>${coin.market_data.high_24h.usd.toLocaleString()}</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statLabel}>Low 24h</Text>
            <Text style={styles.statValue}>${coin.market_data.low_24h.usd.toLocaleString()}</Text>
          </View>
        </View>

        {/* DESCRIPTION */}
        <View style={styles.descContainer}>
          <Text style={styles.sectionTitle}>About {coin.name}</Text>
          <Text style={styles.descText} numberOfLines={8}>
            {coin.description.en.replace(/<[^>]+>/g, '')} {/* Removes HTML tags */}
          </Text>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  container: { flex: 1, backgroundColor: '#FFF' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 15 },
  backBtn: { padding: 5 },
  headerTitle: { fontSize: 18, fontWeight: 'bold' },
  
  priceContainer: { alignItems: 'center', marginTop: 10 },
  symbol: { color: '#888', fontWeight: 'bold', fontSize: 14 },
  currentPrice: { fontSize: 36, fontWeight: '800', color: '#000', marginVertical: 5 },
  badge: { paddingHorizontal: 10, paddingVertical: 5, borderRadius: 20 },

  chartContainer: { marginTop: 20, marginBottom: 20 },
  timeframeRow: { flexDirection: 'row', justifyContent: 'center', marginTop: 10, gap: 10 },
  tfBtn: { paddingHorizontal: 15, paddingVertical: 6, borderRadius: 15, backgroundColor: '#F0F0F0' },
  tfBtnActive: { backgroundColor: '#000' },
  tfText: { fontSize: 12, fontWeight: '600', color: '#888' },
  tfTextActive: { color: '#FFF' },

  statsGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', paddingHorizontal: 20 },
  statBox: { width: '48%', backgroundColor: '#F9F9F9', padding: 15, borderRadius: 12, marginBottom: 10 },
  statLabel: { color: '#888', fontSize: 12, marginBottom: 5 },
  statValue: { fontSize: 16, fontWeight: 'bold', color: '#333' },

  descContainer: { padding: 20 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 10 },
  descText: { lineHeight: 22, color: '#666' },
});