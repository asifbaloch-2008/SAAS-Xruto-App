
import express, { Request, Response } from 'express';
import cors from 'cors';
import fetch from 'node-fetch';
import {
  haversineKm,
  kMeans,
  balanceClusters,
  twoOptRoute,
  calculateRouteStats,
} from './algorithms';

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Types
interface Order {
  id: string;
  address: string;
  lat: number;
  lng: number;
  value?: number;
  weight?: number;
  serviceTime?: number;
}

interface RouteParams {
  serviceTime: number;
  maxWorkingHours: number;
  maxStopsPerRoute: number;
  maxTries: number;
}

interface OptimizeRequest {
  orders: Order[];
  driverCount: number;
  depot: { lat: number; lng: number };
  routeParams: RouteParams;
  weights: {
    distance: number;
    time: number;
    difficulty: number;
  };
}


// Geocoding is now disabled. Backend expects lat/lng to be provided in the uploaded data.

// POST /api/optimize - Main route optimization endpoint
app.post('/api/optimize', async (req: Request, res: Response) => {
  try {
    const { orders, driverCount, depot, routeParams, weights }: OptimizeRequest = req.body;

    // Validate input
    if (!orders || orders.length === 0) {
      return res.status(400).json({ error: 'No orders provided' });
    }

    if (!driverCount || driverCount < 1) {
      return res.status(400).json({ error: 'Invalid driver count' });
    }

    // Default depot (if not provided)
    const depotLocation = depot || { lat: 51.5074, lng: -0.1278 };

    // Step 1: K-means clustering to group orders by geographic location
    console.log(`Starting K-means clustering for ${orders.length} orders into ${driverCount} clusters...`);
    let clusters = kMeans(orders, driverCount);

    // Step 2: Balance workload across clusters
    console.log('Balancing workload across clusters...');
    clusters = balanceClusters(clusters);

    // Step 3: Apply 2-opt optimization to each cluster
    console.log('Optimizing routes with 2-opt algorithm...');
    const optimizedRoutes = clusters.map((cluster, index) => {
      const optimizedOrders = twoOptRoute(cluster.orders, depotLocation);
      const stats = calculateRouteStats(optimizedOrders, depotLocation, routeParams.serviceTime);
      
      return {
        driver: `driver_${index + 1}`,
        orders: optimizedOrders,
        stats,
        centroid: cluster.centroid,
      };
    });

    // Step 4: Calculate aggregate statistics
    const totalDistance = optimizedRoutes.reduce((sum, route) => sum + route.stats.distance, 0);
    const totalTime = optimizedRoutes.reduce((sum, route) => sum + route.stats.totalTime, 0);
    const avgWorkloadScore = Math.round(
      (optimizedRoutes.reduce((sum, route) => {
        const targetOrders = orders.length / driverCount;
        const deviation = Math.abs(route.orders.length - targetOrders) / targetOrders;
        return sum + (100 - deviation * 100);
      }, 0) / driverCount)
    );

    // Calculate costs
    const fuelCostPerKm = 0.12; // £0.12 per km
    const driverHourlyRate = 15; // £15 per hour
    const fuelCost = totalDistance * fuelCostPerKm;
    const driverCost = (totalTime / 60) * driverHourlyRate;
    const totalCost = fuelCost + driverCost;

    // Count routes within time limits
    const maxMinutes = routeParams.maxWorkingHours * 60;
    const routesInTime = optimizedRoutes.filter(r => r.stats.totalTime <= maxMinutes).length;

    // Format response data
    const driverAnalysis = optimizedRoutes.map(route => {
      const totalValue = route.orders.reduce((sum, order) => sum + (order.value || 50 + Math.random() * 100), 0);
      const totalWeight = route.orders.reduce((sum, order) => sum + (order.weight || 2 + Math.random() * 5), 0);
      const workloadScore = Math.round(100 - (Math.abs(route.orders.length - (orders.length / driverCount)) / (orders.length / driverCount)) * 100);
      const isOverloaded = route.stats.totalTimeHours > routeParams.maxWorkingHours;

      return {
        driver: route.driver,
        orders: route.orders.length,
        value: `£${totalValue.toFixed(2)}`,
        weight: `${totalWeight.toFixed(1)}kg`,
        workingHours: `${route.stats.totalTimeHours.toFixed(2)}h`,
        workloadScore: Math.max(0, workloadScore),
        status: isOverloaded ? 'Overloaded' : 'Optimal',
      };
    });

    const routeDetails = optimizedRoutes.map(route => {
      const efficiency = Math.round((route.orders.length / route.stats.totalTimeHours) * 10);
      const workloadScore = Math.round(100 - (Math.abs(route.orders.length - (orders.length / driverCount)) / (orders.length / driverCount)) * 100);
      const isOvertime = route.stats.totalTimeHours > routeParams.maxWorkingHours;

      return {
        driver: route.driver,
        stops: route.orders.length,
        distance: `${route.stats.distance.toFixed(1)}km`,
        travelTime: `${route.stats.travelTime}min`,
        serviceTime: `${route.stats.serviceTime}min`,
        totalTime: `${route.stats.totalTimeHours.toFixed(1)}h`,
        efficiency,
        workloadScore: Math.max(0, workloadScore),
        status: isOvertime ? 'Overtime' : 'On Time',
      };
    });

    const driverSummary = optimizedRoutes.map((route, index) => ({
      driver: `Driver ${index + 1}`,
      orders: route.orders.length,
      hours: route.stats.totalTimeHours,
      score: Math.max(0, Math.round(100 - (Math.abs(route.orders.length - (orders.length / driverCount)) / (orders.length / driverCount)) * 100)),
    }));

    const summaryData = optimizedRoutes.map((route, index) => {
      const drivingMinutes = route.stats.travelTime;
      const servicingMinutes = route.stats.serviceTime;
      const totalMinutes = route.stats.totalTime;

      return {
        driver: index + 1,
        stops: route.orders.length,
        driving: formatTime(drivingMinutes),
        servicing: formatTime(servicingMinutes),
        total: formatTime(totalMinutes),
      };
    });

    // Calculate balance score
    const avgOrders = orders.length / driverCount;
    const maxDeviation = Math.max(...optimizedRoutes.map(r => Math.abs(r.orders.length - avgOrders)));
    const balanceScore = Math.max(0, Math.round(100 - (maxDeviation / avgOrders) * 100));

    const overloadedCount = optimizedRoutes.filter(r => r.stats.totalTimeHours > routeParams.maxWorkingHours).length;

    const response = {
      workloadBalance: {
        avgWorkingHours: `${(totalTime / driverCount / 60).toFixed(1)}h`,
        maxWorkingHours: `${Math.max(...optimizedRoutes.map(r => r.stats.totalTimeHours)).toFixed(2)}h`,
        overloadedRoutes: overloadedCount,
        balanceScore: `${balanceScore}%`,
      },
      driverSummary,
      driverAnalysis,
      optimizationData: {
        summary: {
          totalDistance: `${totalDistance.toFixed(2)}km`,
          totalTime: `${(totalTime / 60).toFixed(1)}h`,
          avgScore: avgWorkloadScore,
          routesInTime: `${routesInTime}/${driverCount}`,
          fuelCost: `£${fuelCost.toFixed(2)}`,
          driverCost: `£${driverCost.toFixed(2)}`,
          totalCost: `£${totalCost.toFixed(2)}`,
        },
        driverAnalysis,
        routeDetails,
      },
      summaryData,
      routes: optimizedRoutes.map(route => ({
        driver: route.driver,
        orders: route.orders.map(o => o.id),
        orderDetails: route.orders,
      })),
    };

    console.log('Optimization complete!');
    res.json(response);
  } catch (error) {
    console.error('Optimization error:', error);
    res.status(500).json({ error: 'Internal server error during optimization' });
  }
});


// POST /api/geocode - Geocode addresses to lat/lng (mock implementation)
app.post('/api/geocode', async (req: Request, res: Response) => {
  try {
    const { addresses }: { addresses: string[] } = req.body;

    if (!addresses || addresses.length === 0) {
      return res.status(400).json({ error: 'No addresses provided' });
    }

    // Mock geocoding: Generate random coordinates around London
    // In production, you would use a real geocoding service like Google Maps, Mapbox, or Nominatim
    const baseLatLondon = 51.5074;
    const baseLngLondon = -0.1278;
    
    const orders: Order[] = addresses.map((address, index) => ({
      id: `order_${index + 1}`,
      address: address.trim(),
      // Generate coordinates within ~5km of London center
      lat: baseLatLondon + (Math.random() - 0.5) * 0.1,
      lng: baseLngLondon + (Math.random() - 0.5) * 0.1,
    }));

    res.json({ orders });
  } catch (error) {
    console.error('Geocoding error:', error);
    res.status(500).json({ error: 'Internal server error during geocoding' });
  }
});

// POST /api/cluster - K-means clustering only (for Assign button)
app.post('/api/cluster', async (req: Request, res: Response) => {
  try {
    const { orders, driverCount }: { orders: Order[]; driverCount: number } = req.body;

    if (!orders || orders.length === 0) {
      return res.status(400).json({ error: 'No orders provided' });
    }
    if (!driverCount || driverCount < 1) {
      return res.status(400).json({ error: 'Invalid driver count' });
    }

    // Run K-means clustering
    const clusters = kMeans(orders, driverCount);

    // Format response: each cluster is a route (unordered)
    const routes = clusters.map((cluster, index) => ({
      driver: `driver_${index + 1}`,
      orders: cluster.orders.map(o => o.id),
      orderDetails: cluster.orders,
      centroid: cluster.centroid,
    }));

    res.json({ routes });
  } catch (error) {
    console.error('Clustering error:', error);
    res.status(500).json({ error: 'Internal server error during clustering' });
  }
});

// GET /api/health - Health check
app.get('/api/health', (req: Request, res: Response) => {
  res.json({ status: 'ok', message: 'Route optimization service is running' });
});

// Helper function to format minutes to hours and minutes
function formatTime(minutes: number): string {
  const hours = Math.floor(minutes / 60);
  const mins = Math.round(minutes % 60);
  return `${hours}h${mins.toString().padStart(2, '0')}m`;
}

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Route Optimization API running on http://localhost:${PORT}`);
  console.log(`📍 Endpoints:`);
  console.log(`   POST http://localhost:${PORT}/api/optimize - Optimize routes`);
  console.log(`   POST http://localhost:${PORT}/api/geocode - Geocode addresses`);
  console.log(`   GET  http://localhost:${PORT}/api/health - Health check`);
});

export default app;
