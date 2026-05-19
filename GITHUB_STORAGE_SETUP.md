# GitHub Storage Setup Guide

Your Rent App now uses **GitHub as a database** - a clever, free way to sync data across all your devices!

## How It Works

```
Laptop → Saves to GitHub repo → Mobile loads from GitHub
Mobile → Updates GitHub repo → Laptop sees changes
```

Your data is stored as a JSON file in your repository at `data/rentapp-data.json`.

## Quick Setup (2 minutes)

### Step 1: Create a GitHub Personal Access Token

1. Go to: https://github.com/settings/tokens/new
2. Or navigate: GitHub → Settings → Developer settings → Personal access tokens → Tokens (classic) → Generate new token

### Step 2: Configure the Token

**Description:** `RentApp Cross-Device Sync`

**Scopes:** Check these boxes:
- ✅ **repo** (Full control of private repositories)
  - ✅ repo:status
  - ✅ repo_deployment
  - ✅ public_repo
  - ✅ repo:invite
  - ✅ security_events

**Expiration:** Choose your preference
- `No expiration` (easiest, but less secure)
- `90 days` (recommended - you can renew it)

### Step 3: Generate and Copy Token

1. Click **"Generate token"** at the bottom
2. **IMPORTANT:** Copy the token immediately - you can't see it again!
3. It will look like: `ghp_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`

### Step 4: Connect in the App

1. Open your Rent App: https://pankaushik.github.io/rentapp/
2. Click **"🔗 Connect to GitHub for Cross-Device Sync"**
3. Paste your token in the input field
4. Click **"Connect"**
5. You should see: ✅ "GitHub storage connected successfully!"

## That's It! 🎉

Now your data automatically syncs:
- ✓ Changes save to GitHub every 30 seconds
- ✓ All devices pull from the same GitHub repository
- ✓ Works on laptop, phone, tablet - anywhere you open the app

## How to Use

### On Your Laptop
1. Open https://pankaushik.github.io/rentapp/
2. Click "Connect to GitHub" (first time only)
3. Enter your token
4. Enter meter readings
5. Data automatically saves to GitHub

### On Your Mobile
1. Open same URL on your phone
2. Click "Connect to GitHub" (first time only)  
3. Enter the **same token**
4. You'll see all the data from your laptop!
5. Any changes sync back

## Important Notes

### ⚠️ Security
- **Keep your token private!** Don't share it
- The token gives full access to your GitHub repositories
- Store it in a password manager
- You can revoke it anytime at: https://github.com/settings/tokens

### 📱 Multiple Devices
- Use the **same token** on all devices
- First device to connect uploads local data
- Other devices download that data
- All changes sync automatically

### 💾 Data Location
Your data is stored at:
```
https://github.com/pankaushik/rentapp/blob/main/data/rentapp-data.json
```

You can view/edit it directly on GitHub if needed!

### 🔄 Sync Frequency
- **Auto-save:** Every 30 seconds (to avoid GitHub rate limits)
- **Manual save:** Click "💾 Save Data" anytime
- **On change:** When you modify any input field

### 📊 GitHub Rate Limits
**Authenticated requests:** 5,000 per hour (you'll never hit this)

With a token, you get generous limits that are more than enough for this app.

## Troubleshooting

### "Invalid GitHub token or repository access denied"

**Solutions:**
1. Check token has `repo` scope
2. Verify token hasn't expired
3. Make sure you copied the entire token (starts with `ghp_`)
4. Try generating a new token

### "⚠️ Sync error - check connection"

**Solutions:**
1. Check your internet connection
2. Verify GitHub is accessible
3. Check if token has been revoked
4. Try disconnecting and reconnecting

### Data not syncing between devices

**Solutions:**
1. Ensure all devices use the **same token**
2. Wait 30 seconds for auto-sync, or click "Save Data"
3. Refresh the page on the second device
4. Check that both devices show "✓ Synced to GitHub"

### Want to disconnect?

Click **"🔌 Disconnect GitHub"** in the app. Your data will:
- ✓ Remain in GitHub (safe!)
- ✓ Continue working locally on each device
- ✓ Stop syncing between devices

You can reconnect anytime with your token.

## Advantages Over Firebase

✅ **Zero setup** - No project creation, no database config
✅ **Already using GitHub** - No new service
✅ **Version history** - GitHub tracks all changes
✅ **Direct access** - View/edit data on GitHub
✅ **Free forever** - No quotas or limits
✅ **Privacy** - Your data, your repo
✅ **Portable** - Just a JSON file

## What's Stored?

The data file looks like:

```json
{
  "apartments": [
    {
      "name": "Top Floor",
      "fixedRent": 15000,
      "motorCharges": 0,
      "previousReading": 12500,
      "currentReading": 12800
    },
    ...
  ],
  "unitPrice": 8,
  "lastUpdated": "2024-01-15T10:30:00.000Z"
}
```

Simple, human-readable JSON!

## Token Management

### Where is the token stored?
- In browser's localStorage (encrypted by browser)
- Not in the code or GitHub repository
- Each device stores its own copy

### Lost your token?
Generate a new one:
1. https://github.com/settings/tokens/new
2. Same settings as before
3. Update in app on all devices

### Renewing expired tokens
1. Generate new token with same settings
2. Click "🔌 Disconnect GitHub" in app
3. Click "🔗 Connect to GitHub"
4. Enter new token

## FAQ

**Q: Is my data private?**
A: Yes! Only you have the token. GitHub requires authentication to access your repository.

**Q: What if GitHub is down?**
A: App works offline with localStorage. Syncs when GitHub is back up.

**Q: Can I use this with a private repo?**
A: Yes! It works with both public and private repositories.

**Q: How much data can I store?**
A: GitHub files up to 100 MB. Your rent data is < 1 KB!

**Q: Can multiple people use the same data?**
A: Yes, share your token with them (but be careful - they get full repo access!)

**Q: Does this work offline?**
A: Data loads/saves locally. Syncs to GitHub when online.

## Advanced: Manual Data Access

You can view/edit your data directly:

1. Go to: https://github.com/pankaushik/rentapp
2. Navigate to: `data/rentapp-data.json`
3. Click "Edit" (pencil icon)
4. Make changes
5. Commit

The app will pick up changes on next sync!

---

**Need help?** Open an issue on GitHub: https://github.com/pankaushik/rentapp/issues

Happy syncing! 🎉
