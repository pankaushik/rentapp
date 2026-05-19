# Rent Calculation App

This Angular application calculates rent for 4 different apartment types with automatic electricity bill calculation.

## Apartment Types

1. **Top Floor** - Fixed Rent: 15,000 (No motor charges)
2. **Second Floor Front** - Fixed Rent: 23,000 + 500 motor charges
3. **Second Floor Back** - Fixed Rent: 24,000 + 500 motor charges
4. **Parking Floor** - Fixed Rent: 23,000 + 500 motor charges

## Electricity Calculation

- Unit Price: 8 per unit
- Formula: (Current Reading - Previous Reading) × 8

## How to Use

1. **Start the development server:**
   ```
   npm start
   ```
   Or:
   ```
   ng serve
   ```

2. **Open the application:**
   Navigate to http://localhost:4200 in your browser

3. **Enter meter readings:**
   - Input the previous reading for each apartment
   - Input the current reading for each apartment
   - The app will automatically calculate:
     - Units consumed
     - Electricity bill
     - Total rent (Fixed Rent + Motor Charges + Electricity Bill)

## Features

- Real-time calculation as you type
- Responsive design works on mobile and desktop
- Clean, modern UI with gradient headers
- Individual cards for each apartment type
- All calculations are automated

## Build for Production

```
npm run build
```

The build artifacts will be stored in the dist/rentapp directory.
