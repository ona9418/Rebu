import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

// 1. Define the shape of a Holding/Position
export interface AssetHolding {
  symbol: string;
  category: 'crypto' | 'forex' | 'commodities';
  amount: number;
  avgPrice: number;
}

// 2. Define the Context Type
interface TradingContextType {
  balance: number;
  setBalance: (val: number) => void;
  holdings: AssetHolding[]; // Use specific type instead of any[]
  setHoldings: React.Dispatch<React.SetStateAction<AssetHolding[]>>; // Correct setter type
}

const TradingContext = createContext<TradingContextType | undefined>(undefined);

export function TradingProvider({ children }: { children: React.ReactNode }) {
  const [balance, setBalance] = useState(10000);
  
  // FIX: Explicitly type the empty array
  const [holdings, setHoldings] = useState<AssetHolding[]>([]); 

  // Load data on mount
  useEffect(() => {
    const loadData = async () => {
      try {
        const json = await AsyncStorage.getItem('@rebu_paper_sim');
        if (json) {
          const data = JSON.parse(json);
          setBalance(data.balance ?? 10000);
          setHoldings(data.holdings || []);
        }
      } catch (e) {
        console.error("Failed to load trading data", e);
      }
    };
    loadData();
  }, []);

  // Save data on change
  useEffect(() => {
    const saveData = async () => {
      try {
        await AsyncStorage.setItem('@rebu_paper_sim', JSON.stringify({ balance, holdings }));
      } catch (e) {
        console.error("Failed to save trading data", e);
      }
    };
    saveData();
  }, [balance, holdings]);

  return (
    <TradingContext.Provider value={{ balance, setBalance, holdings, setHoldings }}>
      {children}
    </TradingContext.Provider>
  );
}

export const useTrading = () => {
  const context = useContext(TradingContext);
  if (!context) throw new Error('useTrading must be used within a TradingProvider');
  return context;
};