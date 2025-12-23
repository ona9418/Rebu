import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, ScrollView, Alert, Dimensions, Animated } from 'react-native';
import { Stack } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LineChart } from 'react-native-chart-kit';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';

// --- MOCK DATA CONFIGURATION ---
const MARKET_DATA = {
  crypto: [
    { id: 'bitcoin', symbol: 'BTC', name: 'Bitcoin', basePrice: 65000 },
    { id: 'ethereum', symbol: 'ETH', name: 'Ethereum', basePrice: 3500 },
    { id: 'solana', symbol: 'SOL', name: 'Solana', basePrice: 150 },
    { id: 'ripple', symbol: 'XRP', name: 'Ripple', basePrice: 0.60 },
    { id: 'dogecoin', symbol: 'DOGE', name: 'Dogecoin', basePrice: 0.15 },
  ],
  forex: [
    { id: 'eurusd', symbol: 'EUR/USD', name: 'Euro / US Dollar', basePrice: 1.09 },
    { id: 'gbpusd', symbol: 'GBP/USD', name: 'British Pound / USD', basePrice: 1.27 },
    { id: 'usdjpy', symbol: 'USD/JPY', name: 'US Dollar / Yen', basePrice: 151.40 },
    { id: 'audusd', symbol: 'AUD/USD', name: 'Aus Dollar / USD', basePrice: 0.65 },
    { id: 'usdcad', symbol: 'USD/CAD', name: 'US Dollar / Cad', basePrice: 1.35 },
  ],
  commodities: [
    { id: 'gold', symbol: 'XAU', name: 'Gold (Oz)', basePrice: 2160.50 },
    { id: 'silver', symbol: 'XAG', name: 'Silver (Oz)', basePrice: 24.80 },
    { id: 'oil', symbol: 'WTI', name: 'Crude Oil', basePrice: 81.20 },
    { id: 'gas', symbol: 'NG', name: 'Natural Gas', basePrice: 1.70 },
    { id: 'copper', symbol: 'HG', name: 'Copper', basePrice: 4.05 },
  ]
};

// Types
interface AssetHolding {
  symbol: string;
  category: string;
  amount: number;
  avgPrice: number;
}

const SCREEN_WIDTH = Dimensions.get('window').width;

// --- ANIMATED PRICE COMPONENT ---
const AnimatedPriceHeader = ({ price, change }: { price: number | null, change: number }) => {
  const [fadeAnim] = useState(new Animated.Value(0));
  const prevPriceRef = useRef(price);

  useEffect(() => {
    if (price && prevPriceRef.current && price !== prevPriceRef.current) {
      const isUp = price > prevPriceRef.current;
      
      Animated.sequence([
        Animated.timing(fadeAnim, { toValue: isUp ? 1 : -1, duration: 100, useNativeDriver: false }),
        Animated.timing(fadeAnim, { toValue: 0, duration: 800, useNativeDriver: false }),
      ]).start();

      prevPriceRef.current = price;
    }
  }, [price, fadeAnim]);

  const backgroundColor = fadeAnim.interpolate({
    inputRange: [-1, 0, 1],
    outputRange: ['#FFEBEE', '#FFFFFF', '#E8F5E9'] 
  });

  const isUp = change >= 0;

  return (
    <Animated.View style={[styles.chartHeader, { backgroundColor }]}>
      <View>
        <Text style={styles.chartTitle}>Current Price (Simulated)</Text>
        <Text style={styles.chartPrice}>
          {price ? `$${price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : 'Loading...'}
        </Text>
      </View>
      <View style={[styles.badge, { backgroundColor: isUp ? '#E8F5E9' : '#FFEBEE' }]}>
        <Text style={{ color: isUp ? '#2E7D32' : '#C62828', fontWeight: 'bold' }}>
          {isUp ? '▲' : '▼'} {Math.abs(change).toFixed(2)}%
        </Text>
      </View>
    </Animated.View>
  );
};

export default function TradingScreen() {
  // --- STATE ---
  const [category, setCategory] = useState<'crypto' | 'forex' | 'commodities'>('crypto');
  const [selectedAsset, setSelectedAsset] = useState(MARKET_DATA.crypto[0]);
  
  // Simulation State
  const [currentPrice, setCurrentPrice] = useState<number | null>(null);
  const [priceChange24h, setPriceChange24h] = useState<number>(0);
  const [chartData, setChartData] = useState<number[]>([]);
  
  // User Account State
  const [balance, setBalance] = useState(10000); 
  const [holdings, setHoldings] = useState<AssetHolding[]>([]); 
  const [inputAmount, setInputAmount] = useState(''); 
  const [tradeMode, setTradeMode] = useState<'USD' | 'UNIT'>('USD'); 
  const [isReady, setIsReady] = useState(false);

  // --- PERSISTENCE ---
  useEffect(() => {
    const loadData = async () => {
      try {
        const jsonValue = await AsyncStorage.getItem('@rebu_paper_sim');
        if (jsonValue != null) {
          const data = JSON.parse(jsonValue);
          setBalance(data.balance);
          setHoldings(data.holdings || []);
        }
      } catch (e) { console.error("Load Error", e); } finally { setIsReady(true); }
    };
    loadData();
  }, []);

  useEffect(() => {
    if (isReady) {
      const saveData = async () => {
        try {
          const data = { balance, holdings };
          await AsyncStorage.setItem('@rebu_paper_sim', JSON.stringify(data));
        } catch (e) { console.error("Save Error", e); }
      };
      saveData();
    }
  }, [balance, holdings, isReady]);

  // --- SIMULATION ENGINE ---
  useEffect(() => {
    // 1. Reset Chart on Asset Change
    const base = (selectedAsset as any).basePrice;
    setChartData(Array.from({ length: 20 }, () => base)); // Start flat
    setCurrentPrice(base);
    setPriceChange24h(0);

    // 2. Start Ticker
    const interval = setInterval(() => {
      setCurrentPrice((prev) => {
        if (!prev) return base;
        
        // Volatility: Crypto (0.2%), Forex (0.05%), Commodities (0.1%)
        const volatility = category === 'crypto' ? 0.002 : category === 'forex' ? 0.0005 : 0.001;
        const change = prev * (Math.random() * volatility * 2 - volatility); 
        const newPrice = prev + change;

        // Update Chart (Keep last 20 points)
        setChartData(currentChart => {
          const newChart = [...currentChart, newPrice];
          if (newChart.length > 20) newChart.shift();
          return newChart;
        });

        // Randomly drift percentage
        setPriceChange24h(pct => pct + (Math.random() * 0.1 - 0.05));

        return newPrice;
      });
    }, 3000); // ⚡️ 3 Second Updates

    return () => clearInterval(interval);
  }, [selectedAsset, category]);

  // --- TRADING LOGIC ---
  const handleTrade = (action: 'BUY' | 'SELL') => {
    if (!currentPrice) return;
    const val = parseFloat(inputAmount);
    if (isNaN(val) || val <= 0) return Alert.alert("Error", "Enter valid amount");

    let costUSD = 0;
    let quantity = 0;

    if (tradeMode === 'USD') {
        costUSD = val;
        quantity = val / currentPrice;
    } else {
        quantity = val;
        costUSD = val * currentPrice;
    }

    if (action === 'BUY') {
      if (costUSD > balance) return Alert.alert("Insufficient Funds");
      const newHoldings = [...holdings];
      const existing = newHoldings.find(h => h.symbol === selectedAsset.symbol);
      if (existing) { existing.amount += quantity; }
      else { newHoldings.push({ symbol: selectedAsset.symbol, category, amount: quantity, avgPrice: currentPrice }); }
      
      setBalance(b => b - costUSD);
      setHoldings(newHoldings);
      Alert.alert("Success", `Bought ${quantity.toFixed(4)} ${selectedAsset.symbol}`);
    } else {
      const existing = holdings.find(h => h.symbol === selectedAsset.symbol);
      if (!existing || existing.amount < quantity) return Alert.alert("Error", "Not enough assets");
      existing.amount -= quantity;
      if (existing.amount <= 0.00001) {
        setHoldings(h => h.filter(item => item.symbol !== selectedAsset.symbol));
      } else {
        setHoldings([...holdings]);
      }
      setBalance(b => b + costUSD);
      Alert.alert("Success", `Sold for $${costUSD.toFixed(2)}`);
    }
    setInputAmount('');
  };

  const handleReset = () => {
    Alert.alert("Reset Account?", "Start over with $10,000?", [
      { text: "Cancel", style: "cancel" },
      { text: "Reset", style: "destructive", onPress: () => { setBalance(10000); setHoldings([]); } }
    ]);
  };

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />

      {/* HEADER */}
      <View style={styles.header}>
        <View>
          <Text style={styles.headerLabel}>Paper Balance</Text>
          <Text style={styles.headerBalance}>
             ${(balance + holdings.reduce((acc, h) => {
               const price = (h.symbol === selectedAsset.symbol && currentPrice) ? currentPrice : h.avgPrice;
               return acc + (h.amount * price);
             }, 0)).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </Text>
          <Text style={styles.cashLabel}>Cash: ${balance.toLocaleString(undefined, {maximumFractionDigits:0})}</Text>
        </View>
        <TouchableOpacity style={styles.resetBtn} onPress={handleReset}>
          <Ionicons name="refresh" size={18} color="#D50000" />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={{ paddingBottom: 40 }}>
        
        {/* TABS */}
        <View style={styles.tabContainer}>
          {['crypto', 'forex', 'commodities'].map((cat) => (
            <TouchableOpacity 
              key={cat} 
              style={[styles.tab, category === cat && styles.activeTab]}
              onPress={() => { setCategory(cat as any); setSelectedAsset(MARKET_DATA[cat as keyof typeof MARKET_DATA][0]); }}
            >
              <Text style={[styles.tabText, category === cat && styles.activeTabText]}>
                {cat.charAt(0).toUpperCase() + cat.slice(1)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* ASSET LIST */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.assetList}>
          {MARKET_DATA[category].map((asset) => (
            <TouchableOpacity 
              key={asset.id}
              style={[styles.assetCard, selectedAsset.id === asset.id && styles.activeAssetCard]}
              onPress={() => setSelectedAsset(asset)}
            >
              <View style={[styles.iconPlaceholder, { backgroundColor: category === 'crypto' ? '#F7931A' : category === 'forex' ? '#2ECC71' : '#F1C40F' }]}>
                <Text style={{color:'#fff', fontWeight:'bold'}}>{asset.symbol.substring(0,1)}</Text>
              </View>
              <Text style={styles.assetSymbol}>{asset.symbol}</Text>
              <Text style={styles.assetName}>{asset.name}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* CHART (SIMULATED) */}
        <View style={styles.chartCard}>
          <AnimatedPriceHeader price={currentPrice} change={priceChange24h} />
          
          <View style={{ overflow: 'hidden', paddingBottom: 10 }}>
            {chartData.length > 0 && (
              <LineChart
                data={{ labels: [], datasets: [{ data: chartData }] }}
                width={SCREEN_WIDTH + 20} height={220}
                withDots={false} withInnerLines={false} withOuterLines={false}
                withVerticalLabels={false} withHorizontalLabels={false}
                chartConfig={{
                  backgroundColor: '#fff', backgroundGradientFrom: '#fff', backgroundGradientTo: '#fff',
                  decimalPlaces: 2, color: (opacity = 1) => `rgba(0, 122, 255, ${opacity})`,
                  labelColor: () => `rgba(0,0,0,0)`, propsForBackgroundLines: { strokeWidth: 0 },
                }}
                bezier style={{ marginLeft: -20, marginTop: 10 }}
              />
            )}
          </View>
        </View>

        {/* TRADE PANEL */}
        <View style={styles.tradeCard}>
          <View style={{flexDirection:'row', justifyContent:'space-between', marginBottom:15}}>
            <Text style={styles.sectionHeader}>Place Order</Text>
            <View style={styles.toggleContainer}>
              <TouchableOpacity style={[styles.toggleBtn, tradeMode === 'USD' && styles.toggleBtnActive]} onPress={() => setTradeMode('USD')}>
                <Text style={[styles.toggleText, tradeMode === 'USD' && styles.toggleTextActive]}>USD</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.toggleBtn, tradeMode === 'UNIT' && styles.toggleBtnActive]} onPress={() => setTradeMode('UNIT')}>
                <Text style={[styles.toggleText, tradeMode === 'UNIT' && styles.toggleTextActive]}>Unit</Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.inputRow}>
            <Text style={{fontSize: 20, fontWeight:'bold', color:'#333'}}>{tradeMode === 'USD' ? '$' : '#'}</Text>
            <TextInput 
              style={styles.input} 
              value={inputAmount} 
              onChangeText={setInputAmount} 
              placeholder="0.00" 
              keyboardType="numeric" 
            />
          </View>

          <View style={styles.btnRow}>
            <TouchableOpacity style={[styles.btn, { backgroundColor: '#00C853' }]} onPress={() => handleTrade('BUY')}>
              <Text style={styles.btnText}>Buy</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.btn, { backgroundColor: '#FF3B30' }]} onPress={() => handleTrade('SELL')}>
              <Text style={styles.btnText}>Sell</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* HOLDINGS */}
        <Text style={styles.sectionHeaderOuter}>Your Portfolio</Text>
        {holdings.map((h, i) => (
          <View key={i} style={styles.holdingRow}>
            <View style={{flexDirection:'row', alignItems:'center'}}>
              <View style={[styles.dot, { backgroundColor: h.category === 'crypto' ? '#F7931A' : h.category === 'forex' ? '#2ECC71' : '#F1C40F' }]} />
              <View>
                <Text style={styles.hSymbol}>{h.symbol}</Text>
                <Text style={styles.hAmt}>{h.amount.toFixed(4)} Units</Text>
              </View>
            </View>
            <Text style={styles.hVal}>
               ${(currentPrice && h.symbol === selectedAsset.symbol ? (h.amount * currentPrice) : (h.amount * h.avgPrice)).toLocaleString(undefined, {maximumFractionDigits:2})}
            </Text>
          </View>
        ))}
        {holdings.length === 0 && <Text style={styles.emptyText}>No trades yet.</Text>}

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F4F6F8' },
  header: { padding: 20, paddingBottom: 10, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  headerLabel: { fontSize: 12, color: '#888', textTransform: 'uppercase' },
  headerBalance: { fontSize: 28, fontWeight: '800', color: '#1A1A1A' },
  cashLabel: { fontSize: 12, color: '#888', marginTop: 2 },
  resetBtn: { padding: 10, backgroundColor: '#FFEBEE', borderRadius: 20 },

  tabContainer: { flexDirection: 'row', paddingHorizontal: 20, marginBottom: 15, gap: 10 },
  tab: { paddingVertical: 8, paddingHorizontal: 16, borderRadius: 20, backgroundColor: '#FFF', borderWidth: 1, borderColor: '#DDD' },
  activeTab: { backgroundColor: '#1A1A1A', borderColor: '#1A1A1A' },
  tabText: { fontWeight: '600', color: '#666' },
  activeTabText: { color: '#FFF' },

  assetList: { paddingLeft: 20, marginBottom: 20 },
  assetCard: { backgroundColor: '#FFF', width: 100, height: 110, borderRadius: 16, padding: 10, marginRight: 10, justifyContent: 'center', alignItems: 'center', shadowColor: '#000', shadowOpacity: 0.05, elevation: 2 },
  activeAssetCard: { borderWidth: 2, borderColor: '#007AFF' },
  iconPlaceholder: { width: 40, height: 40, borderRadius: 20, justifyContent: 'center', alignItems: 'center', marginBottom: 8 },
  assetSymbol: { fontWeight: 'bold', fontSize: 16 },
  assetName: { fontSize: 10, color: '#888', textAlign: 'center' },

  chartCard: { backgroundColor: '#FFF', marginHorizontal: 20, borderRadius: 20, paddingBottom: 10, marginBottom: 20, shadowColor: '#000', shadowOpacity: 0.05, elevation: 3, overflow: 'hidden' },
  chartHeader: { flexDirection: 'row', justifyContent: 'space-between', padding: 20, borderRadius: 20 },
  chartTitle: { color: '#888', fontWeight: '600' },
  chartPrice: { fontSize: 24, fontWeight: 'bold', color: '#1A1A1A' },
  badge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8, height: 28 },

  tradeCard: { backgroundColor: '#FFF', marginHorizontal: 20, borderRadius: 20, padding: 20, marginBottom: 25 },
  sectionHeader: { fontSize: 16, fontWeight: 'bold', color: '#333' },
  toggleContainer: { flexDirection: 'row', backgroundColor: '#F0F0F0', borderRadius: 10, padding: 2 },
  toggleBtn: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 8 },
  toggleBtnActive: { backgroundColor: '#FFF', shadowColor: '#000', shadowOpacity: 0.1, elevation: 1 },
  toggleText: { fontSize: 12, fontWeight: '600', color: '#888' },
  toggleTextActive: { color: '#000' },

  inputRow: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#F5F5F5', borderRadius: 12, paddingHorizontal: 15, height: 50, marginBottom: 15 },
  input: { flex: 1, fontSize: 18, fontWeight: 'bold', marginLeft: 10 },
  btnRow: { flexDirection: 'row', gap: 10 },
  btn: { flex: 1, height: 45, borderRadius: 12, justifyContent: 'center', alignItems: 'center' },
  btnText: { color: '#FFF', fontWeight: 'bold', fontSize: 16 },

  sectionHeaderOuter: { marginHorizontal: 20, fontSize: 18, fontWeight: 'bold', marginBottom: 10, color: '#333' },
  emptyText: { marginHorizontal: 20, color: '#999', marginTop: 10 },
  holdingRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#FFF', marginHorizontal: 20, padding: 15, borderRadius: 12, marginBottom: 8 },
  dot: { width: 10, height: 10, borderRadius: 5, marginRight: 10 },
  hSymbol: { fontWeight: 'bold', fontSize: 16 },
  hAmt: { color: '#888', fontSize: 12 },
  hVal: { fontWeight: 'bold', fontSize: 16 },
});