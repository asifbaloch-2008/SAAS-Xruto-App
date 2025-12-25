// API Service for Route Optimization Backend

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

export interface Order {
  id: string;
  address: string;
  lat: number;
  lng: number;
  value?: number;
  weight?: number;
  serviceTime?: number;
}

export interface RouteParams {
  serviceTime: number;
  maxWorkingHours: number;
  maxStopsPerRoute: number;
  maxTries: number;
}

export interface Weights {
  distance: number;
  time: number;
  difficulty: number;
}

export interface OptimizationResponse {
  workloadBalance: {
    avgWorkingHours: string;
    maxWorkingHours: string;
    overloadedRoutes: number;
    balanceScore: string;
  };
  driverSummary: Array<{
    driver: string;
    orders: number;
    hours: number;
    score: number;
  }>;
  driverAnalysis: Array<{
    driver: string;
    orders: number;
    value: string;
    weight: string;
    workingHours: string;
    workloadScore: number;
    status: string;
  }>;
  optimizationData: {
    summary: {
      totalDistance: string;
      totalTime: string;
      avgScore: number;
      routesInTime: string;
      fuelCost: string;
      driverCost: string;
      totalCost: string;
    };
    driverAnalysis: Array<any>;
    routeDetails: Array<{
      driver: string;
      stops: number;
      distance: string;
      travelTime: string;
      serviceTime: string;
      totalTime: string;
      efficiency: number;
      workloadScore: number;
      status: string;
    }>;
  };
  summaryData: Array<{
    driver: number;
    stops: number;
    driving: string;
    servicing: string;
    total: string;
  }>;
  routes: Array<{
    driver: string;
    orders: string[];
    orderDetails: Order[];
  }>;
}

export interface GeocodeResponse {
  orders: Order[];
}

/**
 * Geocode addresses to get coordinates
 */
export async function geocodeAddresses(addresses: string[]): Promise<Order[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/geocode`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ addresses }),
    });

    if (!response.ok) {
      throw new Error(`Geocoding failed: ${response.statusText}`);
    }

    const data: GeocodeResponse = await response.json();
    return data.orders;
  } catch (error) {
    console.error('Geocoding error:', error);
    throw error;
  }
}

/**
 * Optimize routes using K-means, workload balancing, and 2-opt algorithms
 */
export async function optimizeRoutes(
  orders: Order[],
  driverCount: number,
  routeParams: RouteParams,
  weights: Weights,
  depot: { lat: number; lng: number } = { lat: 51.5074, lng: -0.1278 }
): Promise<OptimizationResponse> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/optimize`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        orders,
        driverCount,
        depot,
        routeParams,
        weights,
      }),
    });

    if (!response.ok) {
      throw new Error(`Optimization failed: ${response.statusText}`);
    }

    const data: OptimizationResponse = await response.json();
    return data;
  } catch (error) {
    console.error('Optimization error:', error);
    throw error;
  }
}

/**
 * Cluster orders using K-means (for Assign button)
 */
export async function clusterOrders(
  orders: Order[],
  driverCount: number
): Promise<{ routes: { driver: string; orders: string[]; orderDetails: Order[]; centroid: { lat: number; lng: number } }[] }> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/cluster`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ orders, driverCount }),
    });
    if (!response.ok) {
      throw new Error(`Clustering failed: ${response.statusText}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Clustering error:', error);
    throw error;
  }
}

/**
 * Check API health
 */
export async function checkHealth(): Promise<boolean> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/health`);
    return response.ok;
  } catch (error) {
    console.error('Health check failed:', error);
    return false;
  }
}
