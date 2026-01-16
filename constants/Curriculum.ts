// 1. Define the Master Content List
export const MODULES = [
  // --- TRADING METHODS (Main Page) ---
  {
    id: 'futures',
    title: 'Futures',
    fullTitle: 'Futures Trading',
    description: 'Contracts to buy/sell at a future date.',
    color: '#FF9500', // Orange
    icon: 'time',
    lessons: [
      { id: 'f101', title: 'What is a Future?', duration: '3 min', content: 'A futures contract is...' },
      { id: 'f102', title: 'Hedging vs Speculation', duration: '5 min', content: 'Traders use futures to...' },
    ]
  },
  {
    id: 'options',
    title: 'Options',
    fullTitle: 'Options Trading',
    description: 'Calls, Puts, and Greeks explained.',
    color: '#5856D6', // Purple
    icon: 'layers',
    lessons: [
      { id: 'o101', title: 'Calls vs Puts', duration: '4 min', content: 'A Call option gives you the right to buy...' },
      { id: 'o102', title: 'Understanding The Greeks', duration: '6 min', content: 'Delta, Gamma, Theta, and Vega...' },
    ]
  },
  {
    id: 'swaps',
    title: 'Swaps',
    fullTitle: 'Swaps & Derivatives',
    description: 'Exchanging cash flows and risk.',
    color: '#FF2D55', // Pink
    icon: 'swap-horizontal',
    lessons: [
      { id: 's101', title: 'Interest Rate Swaps', duration: '5 min', content: 'Exchanging fixed rate for floating rate...' },
    ]
  },

  // --- ASSET CLASSES (Sub-Page) ---
  {
    id: 'stocks',
    title: 'Stocks',
    fullTitle: 'Equities & Stocks',
    description: 'Ownership in public companies.',
    color: '#007AFF', // Blue
    icon: 'business',
    lessons: [
      { id: 'st101', title: 'IPO Process', duration: '4 min', content: 'How a company goes public...' },
    ]
  },
  {
    id: 'crypto',
    title: 'Crypto',
    fullTitle: 'Cryptocurrency',
    description: 'Bitcoin, Ethereum, and DeFi.',
    color: '#F7931A', // Bitcoin Orange
    icon: 'logo-bitcoin',
    lessons: [
      { id: 'c101', title: 'Blockchain Basics', duration: '5 min', content: 'A distributed ledger technology...' },
    ]
  },
  {
    id: 'commodities',
    title: 'Commodities',
    fullTitle: 'Commodities',
    description: 'Gold, Oil, Corn, and raw materials.',
    color: '#FFCC00', // Gold
    icon: 'cube',
    lessons: [
      { id: 'co101', title: 'Spot vs Future Price', duration: '3 min', content: 'The difference between buying physical gold and paper gold...' },
    ]
  }
];

// 2. Helper Arrays for UI Rendering
export const TRADING_METHODS = MODULES.filter(m => ['futures', 'options', 'swaps'].includes(m.id));
export const ASSET_CLASSES = MODULES.filter(m => ['stocks', 'crypto', 'commodities'].includes(m.id));