# Live Auction App

A real-time mobile auction application built with React Native, Expo, and Firebase. Users can place bids on items with live countdown timers and see real-time updates across all devices.

## Features

- Real-time bidding with instant updates
- 30-second countdown timer per auction
- Automatic auction cycling
- Winner announcements
- Live bid history
- Firebase Authentication
- Redux state management

## Technology Stack

- **React Native** with **Expo**
- **TypeScript**
- **Firebase** (Firestore + Authentication)
- **Redux Toolkit**
- **React Navigation**

## Installation & Setup

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Expo Go app on your phone (optional, for testing on device)

### Steps

1. **Install dependencies**

   ```bash
   npm install
   ```

2. **Firebase Configuration**

   Firebase credentials will be provided separately. Place them in `src/config/firebase-config.ts`:

   ```typescript
   import { initializeApp } from "firebase/app";
   import { getAuth } from "firebase/auth";
   import { getFirestore } from "firebase/firestore";

   const firebaseConfig = {
     apiKey: "PROVIDED_API_KEY",
     authDomain: "PROVIDED_AUTH_DOMAIN",
     projectId: "PROVIDED_PROJECT_ID",
     storageBucket: "PROVIDED_STORAGE_BUCKET",
     messagingSenderId: "PROVIDED_MESSAGING_SENDER_ID",
     appId: "PROVIDED_APP_ID",
   };

   const app = initializeApp(firebaseConfig);
   export const auth = getAuth(app);
   export const db = getFirestore(app);
   ```

3. **Start the development server**

   ```bash
   npm start
   ```

   or

   ```bash
   expo start
   ```

4. **Run the app**
   - Press `i` for iOS Simulator
   - Press `a` for Android Emulator
   - Scan QR code with Expo Go app for physical device

## Project Structure

```
src/
├── screens/
│   ├── AuctionScreen/      # Main auction interface
│   ├── LandingScreen/      # Home screen with auction status
│   └── LoginScreen/        # Authentication
├── hooks/
│   └── useAuctionDataHook.tsx  # Core auction logic & real-time sync
├── redux/                  # State management
├── config/                 # Firebase configuration
├── constant/               # App constants (timer duration, bid increments)
└── utils/                  # Helper functions
```

## How It Works

1. User logs in with Firebase Authentication
2. Landing screen shows current auction status
3. Auction runs for 30 seconds with live countdown
4. Users place bids with predefined increments ($100, $500, $1000)
5. Timer resets when new bid is placed
6. When timer reaches 0, winner is announced
7. New auction automatically starts after 3 seconds

## Configuration

To modify auction settings, edit `src/constant/auctionData.ts`:

```typescript
export const COOLDOWN_SECONDS = 30; // Auction duration
export const BID_INCREMENTS = [100, 500, 1000]; // Bid options
```

## Testing

The app is configured to work with the provided Firebase project. Multiple users can connect simultaneously to test real-time bidding.

**Test user credentials will be provided separately.**

## Troubleshooting

**Metro bundler issues:**

```bash
expo start -c
```

**Dependencies not installing:**

```bash
rm -rf node_modules package-lock.json
npm install
```

**Build errors:**
Ensure you're using Node.js v16 or higher

## Developer

Ahmed Kotp  
LinkedIn: [linkedin.com/in/ahmedkotp](https://www.linkedin.com/in/ahmedkotp)
