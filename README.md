# Rent Calculation App

A modern Angular application for calculating apartment rents with electricity consumption tracking. Supports both local storage and **cross-device cloud synchronization** using GitHub as a database!

## Features

- 📊 Calculate rent for multiple apartments
- ⚡ Track electricity consumption with customizable unit prices
- 💾 Auto-save to local browser storage
- ☁️ **GitHub as Database**: Sync across all devices using your GitHub repo
- 📱 Responsive design - works on desktop, tablet, and mobile
- 🔄 Real-time synchronization across devices
- 🆓 **Completely free** - no external services needed!

## Why GitHub as Database?

- ✅ **Zero setup** - Just need a GitHub Personal Access Token
- ✅ **Free forever** - No quotas or limits
- ✅ **Your data, your repo** - Complete control
- ✅ **Version history** - Track all changes
- ✅ **Direct access** - View/edit data on GitHub
- ✅ **Simple** - Just a JSON file
- ✅ **Already using GitHub** - No new service to learn

## Quick Start

### 1. Use the App (Works Immediately!)

Visit: **https://pankaushik.github.io/rentapp/**

The app works right away with local storage. Enter your data and it's saved in your browser.

### 2. Enable Cross-Device Sync (Optional - 2 minutes)

To access your data on multiple devices:

1. **Create a GitHub Personal Access Token**
   - Go to: https://github.com/settings/tokens/new
   - Description: `RentApp`
   - Scope: Check `repo`
   - Generate token and copy it

2. **Connect in the App**
   - Click "🔗 Connect to GitHub for Cross-Device Sync"
   - Paste your token
   - Click "Connect"

3. **Done!** Your data now syncs across all devices

**Full setup guide:** See [GITHUB_STORAGE_SETUP.md](GITHUB_STORAGE_SETUP.md)

## How to Use

### Basic Operations

1. **Enter Readings**: Input previous and current meter readings for each apartment
2. **Set Unit Price**: Adjust the electricity unit price (₹/unit) - default is ₹8
3. **View Calculations**: See real-time rent calculations
4. **Save Data**: Click "💾 Save Data" or wait for auto-save (every 30 seconds)
5. **Move to Previous**: Click "↻ Move to Previous" when starting a new billing cycle
6. **Reset**: Clear all data with "🗑️ Reset All"

### Cross-Device Sync

**With GitHub connected:**
- ✓ Enter data on laptop → See it on mobile
- ✓ Update on phone → Syncs to tablet
- ✓ Changes sync every 30 seconds
- ✓ Works offline, syncs when back online

**Without GitHub:**
- Data saves locally in browser only
- Each device has separate data
- Works perfectly fine for single-device use

## Apartment Types

1. **Top Floor** - Fixed Rent: ₹15,000 (No motor charges)
2. **Second Floor Front** - Fixed Rent: ₹23,000 + ₹500 motor charges
3. **Second Floor Back** - Fixed Rent: ₹24,000 + ₹500 motor charges
4. **Parking Floor** - Fixed Rent: ₹23,000 + ₹500 motor charges

## Local Development

```bash
npm install
npm start
```

Navigate to `http://localhost:4200/`

## Build for Production

```bash
npm run build:prod
```

## Where is Data Stored?

### Local Storage (Always)
- Browser's localStorage
- Survives page refresh
- Device-specific

### GitHub Storage (When Connected)
- File: `data/rentapp-data.json` in your GitHub repo
- View it at: https://github.com/pankaushik/rentapp/blob/main/data/rentapp-data.json
- Accessible from all devices with your token

## Technology Stack

- **Angular 21** - Frontend framework
- **GitHub API** - Cloud storage and sync
- **TypeScript** - Programming language
- **LocalStorage** - Browser storage fallback
- **GitHub Actions** - CI/CD for automatic deployment

## Security

### GitHub Token
- Stored securely in browser localStorage
- Not committed to code
- Required for GitHub sync
- Can be revoked anytime: https://github.com/settings/tokens

### Data Privacy
- Your data stored in YOUR GitHub repository
- Only accessible with your token
- Full control over who has access

## Deployment

The app is automatically deployed to GitHub Pages when you push to the main branch.

Live URL: https://pankaushik.github.io/rentapp/

## FAQ

**Q: Do I need GitHub to use this app?**
A: No! It works locally without any setup. GitHub is only needed for cross-device sync.

**Q: Is my data safe?**
A: Yes! Your data is in your GitHub repository, accessible only with your token.

**Q: What if I lose my GitHub token?**
A: Generate a new one and reconnect. Your data is safe in GitHub.

**Q: Does this cost money?**
A: No! Completely free. GitHub provides generous API limits.

**Q: Can I share my data with family?**
A: Share your GitHub token with them, but they'll have full access to your repository.

## License

MIT

The build artifacts will be stored in the dist/rentapp directory.
