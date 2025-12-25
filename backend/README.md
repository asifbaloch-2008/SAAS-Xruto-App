# LoadBright - Route Optimization Backend

This backend service implements advanced route optimization algorithms for delivery route planning.

## Algorithms Implemented

### 1. K-means Clustering Algorithm
**Purpose:** Groups delivery orders into geographic zones/clusters

**Implementation:**
- Deterministic Initialization: Uses evenly-spaced data points for consistent results
- Assignment Step: Each order is assigned to the nearest centroid using Euclidean distance (squared distance for performance)
- Update Step: Centroids are recalculated as the mean position of all assigned orders
- Convergence: Iterates until centroids move less than 0.0001 km or max 50 iterations reached

### 2. Workload Balancing Algorithm
**Purpose:** Redistributes orders between clusters to avoid overloaded/underloaded routes

**Implementation:**
- Calculates target orders per cluster (total ÷ number of clusters)
- Sets tolerance bounds (70%-130% of target)
- Moves orders from overloaded clusters to underloaded ones
- Uses greedy approach with max 10 iterations

### 3. 2-opt Route Optimization Algorithm
**Purpose:** Optimizes the sequence of stops within each cluster to minimize travel distance

**Implementation:**
- Classic 2-opt local search heuristic for TSP (Traveling Salesman Problem)
- Tests all possible edge swaps: reverses route segments between positions i and k
- Accepts swap if it reduces total route distance
- Uses Haversine distance for great-circle distance calculations
- Includes depot as start/end point
- Max 100 iterations with early stopping when no improvement found

### 4. Haversine Distance Formula
**Purpose:** Calculates accurate geographic distance between coordinates on Earth's surface

**Implementation:**
- Uses spherical geometry (Earth radius = 6371 km)
- Accounts for Earth's curvature
- Returns distance in kilometers

## Installation

```bash
cd server
npm install
```

## Running the Server

### Development Mode
```bash
npm run dev
```

### Production Mode
```bash
npm run build
npm start
```

The server will start on port 3001 by default.

## API Endpoints

### POST /api/optimize
Optimize routes using K-means, workload balancing, and 2-opt algorithms.

**Request Body:**
```json
{
  "orders": [
    {
      "id": "order_1",
      "address": "123 Main St",
      "lat": 51.5074,
      "lng": -0.1278,
      "value": 100.50,
      "weight": 5.2,
      "serviceTime": 5
    }
  ],
  "driverCount": 4,
  "depot": {
    "lat": 51.5074,
    "lng": -0.1278
  },
  "routeParams": {
    "serviceTime": 5,
    "maxWorkingHours": 8,
    "maxStopsPerRoute": 25,
    "maxTries": 100
  },
  "weights": {
    "distance": 40,
    "time": 35,
    "difficulty": 25
  }
}
```

**Response:**
```json
{
  "workloadBalance": {
    "avgWorkingHours": "6.5h",
    "maxWorkingHours": "7.2h",
    "overloadedRoutes": 0,
    "balanceScore": "95%"
  },
  "driverSummary": [...],
  "driverAnalysis": [...],
  "optimizationData": {...},
  "summaryData": [...],
  "routes": [...]
}
```

### POST /api/geocode
Convert addresses to coordinates.

**Request Body:**
```json
{
  "addresses": [
    "123 Main St, London",
    "456 Oak Ave, London"
  ]
}
```

### GET /api/health
Health check endpoint.

## Technology Stack

- **Node.js** - Runtime environment
- **Express** - Web framework
- **TypeScript** - Type safety
- **CORS** - Cross-origin resource sharing

## Algorithm Performance

- **K-means:** O(n * k * i) where n = orders, k = clusters, i = iterations
- **Workload Balancing:** O(k * n * i) where k = clusters, n = orders, i = iterations  
- **2-opt:** O(n² * i) where n = stops per route, i = iterations
- **Haversine:** O(1) constant time

## License

MIT
