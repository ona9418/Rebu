import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface AssetHolding {
  symbol: string;
  category: 'crypto' | 'forex' | 'commodities';
  amount: number;
  avgPrice: number;
}

interface TradingContextType {
  balance: number;
  setBalance: (val: number) => void;
  holdings: AssetHolding[];
  setHoldings: React.Dispatch<React.SetStateAction<AssetHolding[]>>;
  rewardUser: (amount: number) => void; // Added this
  completedLessons: string[]; // Added this
  markLessonComplete: (lessonId: string) => void; // Added this
}

const TradingContext = createContext<TradingContextType | undefined>(undefined);

export function TradingProvider({ children }: { children: React.ReactNode }) {
  const [balance, setBalance] = useState(10000);
  const [holdings, setHoldings] = useState<AssetHolding[]>([]);
  const [completedLessons, setCompletedLessons] = useState<string[]>([]); // New State

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
        // Load Lesson Progress
        const progressJson = await AsyncStorage.getItem('@rebu_learn_progress');
        if (progressJson) setCompletedLessons(JSON.parse(progressJson));
      } catch (e) {
        console.error("Failed to load data", e);
      }
    };
    loadData();
  }, []);

  // Save trading data on change
  useEffect(() => {
    const saveData = async () => {
      try {
        await AsyncStorage.setItem('@rebu_paper_sim', JSON.stringify({ balance, holdings }));
      } catch (e) { console.error("Failed to save trading data", e); }
    };
    saveData();
  }, [balance, holdings]);

  // Helper to give money
  const rewardUser = (amount: number) => {
    setBalance(prev => prev + amount);
  };

  // Helper to mark lesson complete
  const markLessonComplete = async (lessonId: string) => {
    if (!completedLessons.includes(lessonId)) {
      const newProgress = [...completedLessons, lessonId];
      setCompletedLessons(newProgress);
      await AsyncStorage.setItem('@rebu_learn_progress', JSON.stringify(newProgress));
      
      rewardUser(100); // Reward $100
      alert("Lesson Complete! You earned $100.");
    }
  };

  return (
    <TradingContext.Provider value={{ balance, setBalance, holdings, setHoldings, rewardUser, completedLessons, markLessonComplete }}>
      {children}
    </TradingContext.Provider>
  );
}

export const useTrading = () => {
  const context = useContext(TradingContext);
  if (!context) throw new Error('useTrading must be used within a TradingProvider');
  return context;
};