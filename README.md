# RebuAI 🚀

RebuAI is a comprehensive React Native mobile application built with Expo. It serves as an educational trading platform that combines portfolio management simulation, structured financial curriculum, and an AI-powered trading assistant with real-time market data awareness.

## 📱 Features

### 1. **Smart Dashboard**

- **Portfolio Tracking:** Visual overview of total balance and active holdings.
- **Asset breakdown:** Distinguishes between different asset classes (Crypto vs. Standard Assets) with dynamic iconography.
- **Recent Activity:** Quick view of your top performance and holdings.

### 2. **Rebu Intelligence (AI Bot)** 🤖

- **Live Market Aware:** The AI assistant fetches real-time price data from the CoinGecko API before answering.
- **Llama-3 Powered:** Utilizes the `llama-3.3-70b-versatile` model (via Groq) for high-quality financial reasoning.
- **Contextual Chat:** Maintains conversation history for natural, follow-up Q&A regarding market trends.

### 3. **Interactive Learning Curriculum** 📚

- **Trading Methods:** Modules covering Futures, Options, and Swaps.
- **Asset Classes:** Deep dives into Stocks, Cryptocurrency, and Commodities.
- **Lesson Structure:** Segmented lessons (e.g., "Understanding The Greeks", "Hedging vs Speculation") with estimated duration times.

## 🛠 Tech Stack

- **Framework:** React Native (Expo SDK 52+)
- **Routing:** Expo Router (File-based routing)
- **Language:** TypeScript
- **Styling:** StyleSheet & React Native Elements
- **Networking:** Axios
- **AI/LLM:** Groq API (OpenAI-compatible endpoint)
- **Market Data:** CoinGecko API
- **State Management:** React Context (`TradingContext`)

## 🚀 Getting Started

### Prerequisites

- Node.js (LTS version recommended)
- [Expo Go](https://expo.dev/go) on your mobile device or an iOS/Android Simulator.

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd RebuAI
   ```
