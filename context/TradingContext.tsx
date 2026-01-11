import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Define the shape of your data
interface TradingContextType {
  balance: number;
  setBalance: (val: number) => void;
  holdings: any[];
  setHoldings: (val: any[]) => void;
  // Add other shared state here (market data, etc.)
}

const TradingContext = createContext<TradingContextType | undefined>(undefined);

export function TradingProvider({ children }: { children: React.ReactNode }) {
  const [balance, setBalance] = useState(10000);
  const [holdings, setHoldings] = useState([]);

  // Load data on mount
  useEffect(() => {
    AsyncStorage.getItem('@rebu_paper_sim').then((json) => {
      if (json) {
        const data = JSON.parse(json);
        setBalance(data.balance);
        setHoldings(data.holdings || []);
      }
    });
  }, []);

  // Save data on change
  useEffect(() => {
    AsyncStorage.setItem('@rebu_paper_sim', JSON.stringify({ balance, holdings }));
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