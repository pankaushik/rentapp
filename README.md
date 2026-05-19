# Rent Calculation App

A modern Angular application for calculating apartment rents with electricity consumption tracking. Supports both local storage and **cross-device cloud synchronization** via Firebase.

## Features

- 📊 Calculate rent for multiple apartments
- ⚡ Track electricity consumption with customizable unit prices
- 💾 Auto-save to local browser storage
- ☁️ **Optional**: Cloud sync across all your devices using Firebase
- 📱 Responsive design - works on desktop, tablet, and mobile
- 🔄 Real-time synchronization when using cloud storage

## Apartment Types

1. **Top Floor** - Fixed Rent: ₹15,000 (No motor charges)
2. **Second Floor Front** - Fixed Rent: ₹23,000 + ₹500 motor charges
3. **Second Floor Back** - Fixed Rent: ₹24,000 + ₹500 motor charges
4. **Parking Floor** - Fixed Rent: ₹23,000 + ₹500 motor charges

## How to Use

### Basic Operations

1. **Enter Readings**: Input previous and current meter readings for each apartment
2. **Set Unit Price**: Adjust the electricity unit price (₹/unit) - default is ₹8
3. **View Calculations**: See real-time rent calculations including:
   - Units consumed
   - Electricity bill
   - Total rent (Fixed Rent + Motor Charges + Electricity Bill)
4. **Save Data**: Click "💾 Save Data" or wait for auto-save (every 5 seconds)
5. **Move to Previous**: Click "↻ Move to Previous" when starting a new billing cycle
6. **Reset**: Clear all data with the "🗑️ Reset All" button

### Local Development

```bash
npm install
npm start
```

Navigate to `http://localhost:4200/`

### Build for Production

```bash
npm run build:prod
```

## Firebase Setup (Optional - for Cross-Device Sync)

To sync data across multiple devices, you'll need to set up Firebase:

### Step 1: Create a Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Add project" or select an existing project
3. Follow the setup wizard

### Step 2: Enable Firestore Database

1. In your Firebase project, go to **Build > Firestore Database**
2. Click "Create database"
3. Choose "Start in test mode" for development
4. Select your preferred location

### Step 3: Set up Firestore Security Rules

Go to the **Rules** tab in Firestore and use:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /rentAppData/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

### Step 4: Enable Anonymous Authentication

1. Go to **Build > Authentication**
2. Click "Get started"
3. Click on the "Sign-in method" tab
4. Enable "Anonymous" authentication

### Step 5: Get Your Firebase Config

1. In Firebase Console, go to **Project settings** (gear icon)
2. Scroll down to "Your apps"
3. Click the web icon `</>`
4. Register your app
5. Copy the Firebase configuration

### Step 6: Update Environment Files

Replace placeholder values in `src/environments/environment.ts` and `src/environments/environment.prod.ts`:

```typescript
export const environment = {
  production: false, // true for prod
  firebase: {
    apiKey: "YOUR_API_KEY",
    authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_PROJECT_ID.appspot.com",
    messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
    appId: "YOUR_APP_ID"
  }
};
```

⚠️ **Important**: Don't commit your Firebase credentials to Git!

## Cloud Sync Features

When Firebase is configured:
- ✓ Data automatically syncs to the cloud
- ✓ Access your data from any device
- ✓ See sync status indicator (Synced/Syncing/Offline)
- ✓ Real-time updates across all devices
- ✓ Automatic fallback to local storage if offline

### Without Firebase

The app works perfectly fine without Firebase:
- Data is saved locally in your browser
- Works offline
- Data persists between sessions on the same device
- Shows "💾 Using local storage only" status

## Technology Stack

- **Angular 21** - Frontend framework
- **Firebase** - Cloud database and authentication (optional)
- **TypeScript** - Programming language
- **LocalStorage** - Browser storage fallback
- **GitHub Actions** - CI/CD for automatic deployment

## Deployment

The app is automatically deployed to GitHub Pages when you push to the main branch.

Live URL: https://pankaushik.github.io/rentapp/

## License

MIT

The build artifacts will be stored in the dist/rentapp directory.
