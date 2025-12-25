# Quick Start Guide - LoadBright Route Optimization

## Overview
LoadBright uses advanced algorithms to optimize delivery routes:
- **K-means Clustering** - Groups orders by location
- **Workload Balancing** - Distributes orders fairly
- **2-opt Optimization** - Minimizes travel distance
- **Haversine Distance** - Accurate distance calculations

## Getting Started

### 1. Start the Application

**Option A: Start Everything (Recommended)**
```powershell
npm run dev:all
```

**Option B: Use PowerShell Script**
```powershell
.\start.ps1
```

**Option C: Start Separately**
```powershell
# Terminal 1 - Backend
npm run dev:server

# Terminal 2 - Frontend  
npm run dev
```

### 2. Access the Application
- Open browser to: http://localhost:8080
- Backend API runs at: http://localhost:3001

### 3. Upload Addresses

**Method 1: Use Sample CSV**
1. Click "Upload CSV" button
2. Select `sample-addresses.csv`
3. Addresses will be loaded automatically

**Method 2: Manual Entry**
1. Click "Add Address" 
2. Enter addresses one by one
3. Click "Save"

### 4. Configure Settings

**Driver Count**
- Set number of drivers (default: 4)
- More drivers = smaller routes

**Route Parameters**
- **Service Time**: Minutes per delivery (default: 5 min)
- **Max Working Hours**: Maximum hours per driver (default: 8 hrs)
- **Max Stops Per Route**: Maximum deliveries per driver (default: 25)

**Optimization Weights** (Total = 100%)
- **Distance**: Minimize travel distance (default: 40%)
- **Time**: Minimize travel time (default: 35%)
- **Difficulty**: Balance workload (default: 25%)

### 5. Run Optimization

**Assign Routes** (Basic)
1. Click "Assign" button
2. Orders distributed to drivers
3. View initial assignment

**Optimize Routes** (Advanced)
1. Click "Optimize" button
2. Algorithms run:
   - K-means clustering groups orders
   - Workload balancing distributes fairly
   - 2-opt minimizes travel distance
3. View optimized results with metrics

### 6. Review Results

**Assigned Tab**
- Initial assignment results
- Workload balance metrics
- Driver summaries

**Optimized Tab**
- Optimized route details
- Total distance and time
- Cost calculations
- Efficiency scores
- Route status (On Time / Overtime)

**Summary Tab**
- Driver-by-driver breakdown
- Driving vs servicing time
- Total time per driver

### 7. Export Results
Click "Export" to download:
- Route assignments
- Driver schedules
- Optimization metrics

## Understanding the Results

### Workload Balance
- **Avg Working Hours**: Average across all drivers
- **Max Working Hours**: Longest driver shift
- **Overloaded Routes**: Drivers exceeding max hours
- **Balance Score**: How evenly work is distributed (0-100%)

### Driver Analysis
- **Orders**: Number of deliveries assigned
- **Value**: Total monetary value of deliveries
- **Weight**: Total weight carried
- **Working Hours**: Total time (driving + service)
- **Workload Score**: How close to target (100 = perfect)
- **Status**: Optimal / Overloaded

### Route Details
- **Stops**: Number of delivery points
- **Distance**: Total kilometers traveled
- **Travel Time**: Driving time only
- **Service Time**: Time at delivery locations
- **Total Time**: Complete shift duration
- **Efficiency**: Deliveries per hour metric
- **Status**: On Time / Overtime

### Cost Calculations
- **Fuel Cost**: Based on £0.12/km
- **Driver Cost**: Based on £15/hour
- **Total Cost**: Combined operational cost

## Algorithm Details

### K-means Clustering
**Purpose**: Group nearby deliveries together
- Initializes with evenly-spaced orders
- Assigns each order to nearest cluster center
- Recalculates centers based on assignments
- Iterates until stable (max 50 iterations)

### Workload Balancing
**Purpose**: Ensure fair distribution
- Calculates target orders per driver
- Allows 70-130% tolerance range
- Moves orders between overloaded/underloaded
- Prioritizes moving closest orders (max 10 iterations)

### 2-opt Optimization
**Purpose**: Find shortest route sequence
- Tests all possible route segment reversals
- Keeps changes that reduce total distance
- Uses Haversine distance for accuracy
- Runs until no improvements found (max 100 iterations)

### Haversine Distance
**Purpose**: Calculate real-world distances
- Accounts for Earth's curvature
- More accurate than straight-line distance
- Returns kilometers

## Troubleshooting

### "Could not optimize routes"
**Solution**: Check backend is running
```powershell
# In separate terminal
cd server
npm run dev
```

### "No addresses provided"
**Solution**: Upload CSV or add addresses first

### Backend not starting
**Solution**: Check port 3001 is available
```powershell
# Kill process on port 3001 if needed
netstat -ano | findstr :3001
taskkill /PID <PID> /F
```

### Frontend not loading
**Solution**: Check port 8080 is available

### API connection issues
**Solution**: Verify `.env` file exists with:
```
VITE_API_URL=http://localhost:3001
```

## Tips for Best Results

1. **Use Real Addresses**: More accurate geocoding = better routes
2. **Adjust Weights**: Prioritize what matters most for your business
3. **Reasonable Driver Count**: More drivers = more overhead
4. **Set Realistic Hours**: Account for breaks and traffic
5. **Use Service Time**: Different delivery types take different times
6. **Review Balance Score**: Aim for 80%+ balance
7. **Check Overtime**: Adjust parameters if too many overloaded routes

## Advanced Usage

### Custom Depot Location
Edit `src/lib/api.ts` and modify depot coordinates:
```typescript
depot: { lat: YOUR_LAT, lng: YOUR_LNG }
```

### Adjust Algorithm Parameters
Edit `server/algorithms.ts`:
- K-means tolerance: `0.0001` (line ~56)
- K-means max iterations: `50` (line ~55)
- Balance tolerance: `0.7` and `1.3` (lines ~142-143)
- Balance max iterations: `10` (line ~139)
- 2-opt max iterations: `100` (line ~207)

### Cost Calculations
Edit `server/index.ts`:
- Fuel cost per km: `0.12` (line ~108)
- Driver hourly rate: `15` (line ~109)

## API Testing

Test the backend directly:

```powershell
# Health check
Invoke-RestMethod -Uri "http://localhost:3001/api/health"

# Geocode addresses
Invoke-RestMethod -Uri "http://localhost:3001/api/geocode" `
  -Method POST `
  -ContentType "application/json" `
  -Body '{"addresses":["123 Main St"]}'
```

## Performance Notes

- **Small datasets** (<50 orders): Instant results
- **Medium datasets** (50-200 orders): 1-3 seconds
- **Large datasets** (200-500 orders): 5-10 seconds
- **Very large** (500+ orders): Consider increasing driver count

## Support

For issues:
1. Check this guide first
2. Review console logs (F12 in browser)
3. Check server terminal output
4. Verify all dependencies installed

## Next Steps

1. Try the sample CSV file
2. Experiment with different driver counts
3. Adjust optimization weights
4. Compare Assign vs Optimize results
5. Export and analyze the data

Happy optimizing! 🚀
