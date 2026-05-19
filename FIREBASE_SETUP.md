# Firebase Setup Guide for Cross-Device Sync

Follow these steps to enable cloud synchronization across all your devices.

## Why Firebase?

- ✅ **Free tier** - Generous free quota for small apps
- ✅ **Real-time sync** - Changes appear instantly on all devices
- ✅ **No backend needed** - Works with static GitHub Pages hosting
- ✅ **Secure** - Built-in authentication and security rules
- ✅ **Reliable** - Google's infrastructure

## Quick Setup (5 minutes)

### 1. Create Firebase Project

1. Visit [Firebase Console](https://console.firebase.google.com/)
2. Click **"Add project"**
3. Enter project name: `rent-app` (or your preferred name)
4. Disable Google Analytics (optional for this app)
5. Click **"Create project"**

### 2. Enable Firestore Database

1. In the left sidebar, click **Build > Firestore Database**
2. Click **"Create database"**
3. Choose **"Start in test mode"** (we'll secure it later)
4. Select a location closest to you (e.g., `asia-south1` for India)
5. Click **"Enable"**

### 3. Configure Security Rules

1. Go to the **Rules** tab
2. Replace the content with:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Each user can only read/write their own data
    match /rentAppData/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

3. Click **"Publish"**

### 4. Enable Anonymous Authentication

1. In the left sidebar, click **Build > Authentication**
2. Click **"Get started"**
3. Go to **"Sign-in method"** tab
4. Click on **"Anonymous"**
5. Toggle **"Enable"**
6. Click **"Save"**

### 5. Register Your Web App

1. Go to **Project settings** (gear icon in left sidebar)
2. Scroll to **"Your apps"** section
3. Click the **Web icon** (`</>`)
4. App nickname: `Rent App Web`
5. **Don't** check "Also set up Firebase Hosting"
6. Click **"Register app"**
7. You'll see your Firebase config - **COPY THIS**

It will look like:

```javascript
const firebaseConfig = {
  apiKey: "AIzaSy...",
  authDomain: "rent-app-xxxxx.firebaseapp.com",
  projectId: "rent-app-xxxxx",
  storageBucket: "rent-app-xxxxx.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abc123..."
};
```

### 6. Update Your Local Environment Files

**File: `src/environments/environment.ts`**

```typescript
export const environment = {
  production: false,
  firebase: {
    apiKey: "AIzaSy...",                              // 👈 Your values here
    authDomain: "rent-app-xxxxx.firebaseapp.com",
    projectId: "rent-app-xxxxx",
    storageBucket: "rent-app-xxxxx.appspot.com",
    messagingSenderId: "123456789",
    appId: "1:123456789:web:abc123..."
  }
};
```

**File: `src/environments/environment.prod.ts`**

```typescript
export const environment = {
  production: true,
  firebase: {
    apiKey: "AIzaSy...",                              // 👈 Same values
    authDomain: "rent-app-xxxxx.firebaseapp.com",
    projectId: "rent-app-xxxxx",
    storageBucket: "rent-app-xxxxx.appspot.com",
    messagingSenderId: "123456789",
    appId: "1:123456789:web:abc123..."
  }
};
```

### 7. Test Locally

```bash
npm start
```

Open `http://localhost:4200/` - you should see:
- ✅ **"✓ Synced"** status at the top (instead of "Using local storage only")
- Any changes you make will sync to the cloud

### 8. Test Cross-Device Sync

1. Open the app on your computer
2. Enter some meter readings
3. Open the same URL on your phone/tablet
4. You should see the same data!
5. Make a change on one device
6. Watch it appear on the other device in real-time 🎉

## Deploy to GitHub Pages with Firebase

Since we don't want to commit Firebase credentials to GitHub, we have two options:

### Option A: Commit the Config (Easier)

Firebase client config is **safe to commit** because:
- It's meant to be public (appears in your deployed app anyway)
- Security is handled by Firestore rules, not hiding the config
- Google says it's okay: [Is it safe?](https://firebase.google.com/docs/projects/api-keys)

If you're comfortable with this:

```bash
git add src/environments/
git commit -m "Add Firebase configuration"
git push
```

### Option B: Use GitHub Secrets (More Secure)

If you prefer not to commit credentials:

1. **Keep files gitignored** - Uncomment these lines in `.gitignore`:
   ```
   src/environments/environment.ts
   src/environments/environment.prod.ts
   ```

2. **Add GitHub Secrets**:
   - Go to your repo: Settings > Secrets and variables > Actions
   - Add these secrets:
     - `FIREBASE_API_KEY`
     - `FIREBASE_AUTH_DOMAIN`
     - `FIREBASE_PROJECT_ID`
     - `FIREBASE_STORAGE_BUCKET`
     - `FIREBASE_MESSAGING_SENDER_ID`
     - `FIREBASE_APP_ID`

3. **Update `.github/workflows/deploy.yml`** to inject these during build

## Troubleshooting

### "Using local storage only" shows

- Check that environment files have correct values (not placeholders)
- Check browser console for errors
- Verify Firebase project is active

### "⚠️ Cloud sync unavailable"

- Firebase might be unreachable
- Check your internet connection
- Check Firestore rules are set correctly

### Data not syncing between devices

- Ensure both devices are online
- Check that you're using the same Firebase project
- Clear browser cache and reload

### Firestore quota exceeded

The free tier includes:
- 50K reads/day
- 20K writes/day
- 1 GB storage

For this app, you'll likely never hit these limits unless you have many users.

## Next Steps

Once setup:
- Data automatically syncs every 5 seconds
- Changes sync in real-time across devices
- Works offline with automatic sync when back online
- All your meter readings are safely backed up in the cloud

## Security Notes

- Each device gets a unique anonymous user ID
- Only that user can access their own data
- Data is encrypted in transit (HTTPS)
- Firestore rules prevent unauthorized access

## Cost

Firebase free tier is sufficient for personal use:
- **Firestore**: 1 GB storage, 50K/day reads, 20K/day writes
- **Auth**: Unlimited anonymous auth
- **Cost**: $0 for typical personal use

Happy syncing! 🎉
