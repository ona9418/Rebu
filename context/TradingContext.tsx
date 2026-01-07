import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useContext, useEffect, useState } from 'react';

// 1. Initial Mock Data (Seed)
const INITIAL_ASSETS: Asset[] = [
  { 
    id: 'bitcoin', symbol: 'BTC', name: 'Bitcoin', current_price: 65000, 
    price_change_percentage_24h: 0.5, image: 'https://assets.coingecko.com/coins/images/1/large/bitcoin.png', 
    sparkline_in_7d: { price: Array(30).fill(65000) } 
  },
  { 
    id: 'ethereum', symbol: 'ETH', name: 'Ethereum', current_price: 3400, 
    price_change_percentage_24h: -1.2, image: 'https://assets.coingecko.com/coins/images/279/large/ethereum.png', 
    sparkline_in_7d: { price: Array(30).fill(3400) } 
  },
  { 
    id: 'solana', symbol: 'SOL', name: 'Solana', current_price: 145, 
    price_change_percentage_24h: 3.4, image: 'https://assets.coingecko.com/coins/images/4128/large/solana.png', 
    sparkline_in_7d: { price: Array(30).fill(145) } 
  },
  { 
    id: 'dogecoin', symbol: 'DOGE', name: 'Dogecoin', current_price: 0.15, 
    price_change_percentage_24h: 5.1, image: 'https://assets.coingecko.com/coins/images/5/large/dogecoin.png', 
    sparkline_in_7d: { price: Array(30).fill(0.15) } 
  },
  { 
    id: 'nvidia', symbol: 'NVDA', name: 'Nvidia Corp', current_price: 900, 
    price_change_percentage_24h: 1.1, image: 'https://upload.wikimedia.org/wikipedia/commons/2/21/Nvidia_logo.svg', // Placeholder
    sparkline_in_7d: { price: Array(30).fill(900) } 
  },
];

export interface Asset {
  id: string;
  symbol: string;
  name: string;
  current_price: number;
  price_change_percentage_24h: number;
  image: string;
  sparkline_in_7d: {
    price: number[];
  };
}

export interface Position {
  id: string;
  symbol: string;
  amount: number;
  avgPrice: number;
}

interface TradingContextType {
  marketData: Asset[];
  balance: number;
  positions: Position[];
  buyAsset: (asset: Asset, amountUSD: number) => void;
  sellAsset: (asset: Asset, amountUSD: number) => void;
  resetSimulation: () => void;
  isLoading: boolean;
}

const TradingContext = createContext<TradingContextType | undefined>(undefined);

export const TradingProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [marketData, setMarketData] = useState<Asset[]>(INITIAL_ASSETS);
  const [balance, setBalance] = useState(10000);
  const [positions, setPositions] = useState<Position[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // 2. Load Persistence
  useEffect(() => {
    const loadState = async () => {
      try {
        const saved = await AsyncStorage.getItem('@rebu_sim_v2');
        if (saved) {
          const { balance, positions, marketData } = JSON.parse(saved);
          setBalance(balance);
          setPositions(positions);
          // Only restore market data if valid, else use initial
          if (marketData && marketData.length > 0) setMarketData(marketData);
        }
      } catch (e) { console.error("Load Error", e); } 
      finally { setIsLoading(false); }
    };
    loadState();
  }, []);

  // 3. Save Persistence (Debounced slightly by React updates)
  useEffect(() => {
    if (isLoading) return; // Don't save while loading
    const saveData = async () => {
      try {
        const data = { balance, positions, marketData };
        await AsyncStorage.setItem('@rebu_sim_v2', JSON.stringify(data));
      } catch (e) { console.error("Save Error", e); }
    };
    saveData();
  }, [balance, positions, marketData, isLoading]);

  // 4. SIMULATION LOOP
  useEffect(() => {
    const interval = setInterval(() => {
      setMarketData(currentAssets => {
        return currentAssets.map(asset => {
          // Volatility Logic: Random movement between -1% and +1%
          const volatility = 0.01; 
          const move = 1 + (Math.random() * volatility * 2 - volatility);
          
          let newPrice = asset.current_price * move;
          
          // Prevent hitting 0
          if (newPrice < 0.00001) newPrice = 0.00001;

          // Update Chart History (Keep last 30 points)
          const newHistory = [...asset.sparkline_in_7d.price, newPrice];
          if (newHistory.length > 30) newHistory.shift();

          // Recalculate Change % (Comparison against the start of the chart window)
          const startPrice = newHistory[0];
          const changePct = ((newPrice - startPrice) / startPrice) * 100;

          return {
            ...asset,
            current_price: newPrice,
            price_change_percentage_24h: changePct,
            sparkline_in_7d: { price: newHistory }
          };
        });
      });
    }, 2000); // Update every 2 seconds

    return () => clearInterval(interval);
  }, []);

  const buyAsset = (asset: Asset, amountUSD: number) => {
    if (balance < amountUSD) return alert("Insufficient funds");
    const quantity = amountUSD / asset.current_price;
    
    setPositions(prev => {
      const existing = prev.find(p => p.id === asset.id);
      if (existing) {
        const newTotalCost = (existing.avgPrice * existing.amount) + amountUSD;
        const newTotalAmount = existing.amount + quantity;
        return prev.map(p => p.id === asset.id 
          ? { ...p, amount: newTotalAmount, avgPrice: newTotalCost / newTotalAmount } 
          : p);
      }
      return [...prev, { id: asset.id, symbol: asset.symbol, amount: quantity, avgPrice: asset.current_price }];
    });
    setBalance(prev => prev - amountUSD);
  };

  const sellAsset = (asset: Asset, amountUSD: number) => {
    const quantityToSell = amountUSD / asset.current_price;
    const existing = positions.find(p => p.id === asset.id);
    if (!existing || existing.amount < quantityToSell) return alert("Insufficient assets");
    
    setPositions(prev => {
      const updated = prev.map(p => p.id === asset.id ? { ...p, amount: p.amount - quantityToSell } : p);
      return updated.filter(p => p.amount > 0.000001);
    });
    setBalance(prev => prev + amountUSD);
  };

  // 5. Reset Function
  const resetSimulation = async () => {
    setBalance(10000);
    setPositions([]);
    setMarketData(INITIAL_ASSETS);
    await AsyncStorage.removeItem('@rebu_sim_v2');
    alert("Simulation Reset!");
  };

  return (
    <TradingContext.Provider value={{ marketData, balance, positions, buyAsset, sellAsset, resetSimulation, isLoading }}>
      {children}
    </TradingContext.Provider>
  );
};

export const useTrading = () => {
  const context = useContext(TradingContext);
  if (!context) throw new Error('useTrading must be used within a TradingProvider');
  return context;
};