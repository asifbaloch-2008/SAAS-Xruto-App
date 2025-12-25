// Route Optimization Algorithms

interface Coordinate {
  lat: number;
  lng: number;
}

interface Order {
  id: string;
  address: string;
  lat: number;
  lng: number;
  value?: number;
  weight?: number;
  serviceTime?: number;
}

interface Cluster {
  centroid: Coordinate;
  orders: Order[];
}

/**
 * Haversine Distance Formula
 * Calculates accurate geographic distance between coordinates on Earth's surface
 * Uses spherical geometry (Earth radius = 6371 km)
 */
export function haversineKm(coord1: Coordinate, coord2: Coordinate): number {
  const R = 6371; // Earth's radius in kilometers
  const dLat = toRadians(coord2.lat - coord1.lat);
  const dLng = toRadians(coord2.lng - coord1.lng);
  
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRadians(coord1.lat)) *
      Math.cos(toRadians(coord2.lat)) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);
  
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function toRadians(degrees: number): number {
  return degrees * (Math.PI / 180);
}

/**
 * K-means Clustering Algorithm
 * Groups delivery orders into geographic zones/clusters
 * 
 * - Deterministic Initialization: Uses evenly-spaced data points
 * - Assignment Step: Orders assigned to nearest centroid (Euclidean distance)
 * - Update Step: Centroids recalculated as mean position
 * - Convergence: Iterates until centroids move < 0.0001 km or max 50 iterations
 */
export function kMeans(orders: Order[], k: number): Cluster[] {
  const maxIterations = 50;
  const tolerance = 0.0001; // km
  
  // Deterministic initialization: use evenly-spaced orders as initial centroids
  const clusters: Cluster[] = [];
  const step = Math.floor(orders.length / k);
  
  for (let i = 0; i < k; i++) {
    const index = Math.min(i * step, orders.length - 1);
    clusters.push({
      centroid: { lat: orders[index].lat, lng: orders[index].lng },
      orders: [],
    });
  }
  
  for (let iteration = 0; iteration < maxIterations; iteration++) {
    // Clear previous assignments
    clusters.forEach(cluster => cluster.orders = []);
    
    // Assignment step: assign each order to nearest centroid
    orders.forEach(order => {
      let minDistance = Infinity;
      let closestCluster = 0;
      
      clusters.forEach((cluster, index) => {
        // Use squared Euclidean distance for performance
        const dlat = order.lat - cluster.centroid.lat;
        const dlng = order.lng - cluster.centroid.lng;
        const distance = dlat * dlat + dlng * dlng;
        
        if (distance < minDistance) {
          minDistance = distance;
          closestCluster = index;
        }
      });
      
      clusters[closestCluster].orders.push(order);
    });
    
    // Update step: recalculate centroids
    let maxCentroidMovement = 0;
    
    clusters.forEach(cluster => {
      if (cluster.orders.length === 0) return;
      
      const oldCentroid = { ...cluster.centroid };
      
      const sumLat = cluster.orders.reduce((sum, order) => sum + order.lat, 0);
      const sumLng = cluster.orders.reduce((sum, order) => sum + order.lng, 0);
      
      cluster.centroid = {
        lat: sumLat / cluster.orders.length,
        lng: sumLng / cluster.orders.length,
      };
      
      const movement = haversineKm(oldCentroid, cluster.centroid);
      maxCentroidMovement = Math.max(maxCentroidMovement, movement);
    });
    
    // Check for convergence
    if (maxCentroidMovement < tolerance) {
      break;
    }
  }
  
  return clusters;
}

/**
 * Workload Balancing Algorithm
 * Redistributes orders between clusters to avoid overloaded/underloaded routes
 * 
 * - Calculates target orders per cluster (total ÷ number of clusters)
 * - Sets tolerance bounds (70%-130% of target)
 * - Moves orders from overloaded to underloaded clusters
 * - Uses greedy approach with max 10 iterations
 */
export function balanceClusters(clusters: Cluster[]): Cluster[] {
  const maxIterations = 10;
  const totalOrders = clusters.reduce((sum, c) => sum + c.orders.length, 0);
  const targetPerCluster = totalOrders / clusters.length;
  const lowerBound = targetPerCluster * 0.7;
  const upperBound = targetPerCluster * 1.3;
  
  for (let iteration = 0; iteration < maxIterations; iteration++) {
    let balanced = true;
    
    // Find overloaded and underloaded clusters
    const overloaded = clusters.filter(c => c.orders.length > upperBound);
    const underloaded = clusters.filter(c => c.orders.length < lowerBound);
    
    if (overloaded.length === 0 || underloaded.length === 0) {
      break;
    }
    
    balanced = false;
    
    // Move orders from overloaded to underloaded
    overloaded.forEach(overCluster => {
      while (overCluster.orders.length > upperBound && underloaded.length > 0) {
        // Find the underloaded cluster closest to this overloaded cluster
        let closestUnderloaded: Cluster | null = null;
        let minDistance = Infinity;
        
        underloaded.forEach(underCluster => {
          if (underCluster.orders.length >= upperBound) return;
          
          const distance = haversineKm(overCluster.centroid, underCluster.centroid);
          if (distance < minDistance) {
            minDistance = distance;
            closestUnderloaded = underCluster;
          }
        });
        
        if (!closestUnderloaded) break;
        
        // Find order in overloaded cluster closest to underloaded cluster
        let closestOrder: Order | null = null;
        let closestOrderIndex = -1;
        let minOrderDistance = Infinity;
        
        overCluster.orders.forEach((order, index) => {
          const distance = haversineKm(
            { lat: order.lat, lng: order.lng },
            closestUnderloaded!.centroid
          );
          if (distance < minOrderDistance) {
            minOrderDistance = distance;
            closestOrder = order;
            closestOrderIndex = index;
          }
        });
        
        if (closestOrder && closestOrderIndex >= 0) {
          // Move the order
          overCluster.orders.splice(closestOrderIndex, 1);
          closestUnderloaded.orders.push(closestOrder);
        }
      }
    });
    
    if (balanced) break;
  }
  
  return clusters;
}

/**
 * 2-opt Route Optimization Algorithm
 * Optimizes the sequence of stops within each cluster to minimize travel distance
 * 
 * - Classic 2-opt local search heuristic for TSP
 * - Tests all possible edge swaps: reverses route segments between positions i and k
 * - Accepts swap if it reduces total route distance
 * - Uses Haversine distance for calculations
 * - Includes depot as start/end point
 * - Max 100 iterations with early stopping
 */
export function twoOptRoute(orders: Order[], depot: Coordinate): Order[] {
  if (orders.length <= 2) return orders;
  
  const maxIterations = 100;
  let route = [...orders];
  let improved = true;
  let iterations = 0;
  
  while (improved && iterations < maxIterations) {
    improved = false;
    iterations++;
    
    for (let i = 0; i < route.length - 1; i++) {
      for (let k = i + 1; k < route.length; k++) {
        const newRoute = twoOptSwap(route, i, k);
        
        const currentDistance = calculateRouteDistance(route, depot);
        const newDistance = calculateRouteDistance(newRoute, depot);
        
        if (newDistance < currentDistance) {
          route = newRoute;
          improved = true;
        }
      }
    }
  }
  
  return route;
}

function twoOptSwap(route: Order[], i: number, k: number): Order[] {
  const newRoute = [...route.slice(0, i), ...route.slice(i, k + 1).reverse(), ...route.slice(k + 1)];
  return newRoute;
}

function calculateRouteDistance(route: Order[], depot: Coordinate): number {
  let distance = 0;
  
  // Distance from depot to first stop
  if (route.length > 0) {
    distance += haversineKm(depot, { lat: route[0].lat, lng: route[0].lng });
  }
  
  // Distance between stops
  for (let i = 0; i < route.length - 1; i++) {
    distance += haversineKm(
      { lat: route[i].lat, lng: route[i].lng },
      { lat: route[i + 1].lat, lng: route[i + 1].lng }
    );
  }
  
  // Distance from last stop back to depot
  if (route.length > 0) {
    distance += haversineKm({ lat: route[route.length - 1].lat, lng: route[route.length - 1].lng }, depot);
  }
  
  return distance;
}

/**
 * Calculate total route statistics
 */
export function calculateRouteStats(
  route: Order[],
  depot: Coordinate,
  serviceTimePerStop: number = 5 // minutes
) {
  const distance = calculateRouteDistance(route, depot);
  const avgSpeed = 50; // km/h - average driving speed
  const travelTimeMinutes = (distance / avgSpeed) * 60;
  const serviceTimeMinutes = route.length * serviceTimePerStop;
  const totalTimeMinutes = travelTimeMinutes + serviceTimeMinutes;
  
  return {
    distance: parseFloat(distance.toFixed(2)),
    travelTime: Math.round(travelTimeMinutes),
    serviceTime: serviceTimeMinutes,
    totalTime: Math.round(totalTimeMinutes),
    totalTimeHours: parseFloat((totalTimeMinutes / 60).toFixed(2)),
  };
}
