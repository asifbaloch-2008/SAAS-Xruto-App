import React from "react";

export interface SimpleRouteMapProps {
  routes: Array<{
    driver: string;
    orderDetails: Array<{
      id: string;
      address: string;
      lat: number;
      lng: number;
    }>;
    color?: string;
  }>;
  depot?: { lat: number; lng: number };
  width?: number;
  height?: number;
}

const COLORS = [
  "#14b8a6", // teal
  "#2563eb", // blue
  "#a21caf", // purple
  "#f59e42", // gold
  "#e11d48", // pink
];

// Utility: project lat/lng to 2D (simple normalization)
function projectPoints(
  routes: SimpleRouteMapProps["routes"], 
  depot: { lat: number; lng: number } | undefined,
  width: number, 
  height: number
) {
  // Flatten all points including depot
  const allPoints = routes.flatMap(r => r.orderDetails);
  if (depot) {
    allPoints.push({ id: "depot", address: "Depot", ...depot });
  }
  if (allPoints.length === 0) return { routes: [], depot: null };
  
  const lats = allPoints.map(p => p.lat);
  const lngs = allPoints.map(p => p.lng);
  const minLat = Math.min(...lats);
  const maxLat = Math.max(...lats);
  const minLng = Math.min(...lngs);
  const maxLng = Math.max(...lngs);
  
  // Padding
  const pad = 30;
  const w = width - pad * 2;
  const h = height - pad * 2;
  
  // Helper to project a point
  const project = (lat: number, lng: number) => ({
    x: pad + ((lng - minLng) / (maxLng - minLng || 1)) * w,
    y: pad + h - ((lat - minLat) / (maxLat - minLat || 1)) * h,
  });
  
  // Project depot
  const depotProjected = depot ? {
    ...depot,
    ...project(depot.lat, depot.lng),
  } : null;
  
  // Project routes with depot at start and end
  const projectedRoutes = routes.map(route => {
    const points = route.orderDetails.map(p => ({
      ...p,
      ...project(p.lat, p.lng),
    }));
    
    // Add depot at start and end if it exists
    if (depotProjected) {
      return {
        ...route,
        points: [depotProjected, ...points, depotProjected],
      };
    }
    
    return {
      ...route,
      points,
    };
  });
  
  return { routes: projectedRoutes, depot: depotProjected };
}

export function SimpleRouteMap({ routes, depot, width = 400, height = 320 }: SimpleRouteMapProps) {
  const { routes: projected, depot: depotProjected } = projectPoints(routes, depot, width, height);
  
  return (
    <svg width={width} height={height} style={{ background: "#18181b", borderRadius: 12, width: "100%", height: "320px" }}>
      {/* Draw routes as polylines */}
      {projected.map((route, idx) => (
        <polyline
          key={route.driver}
          fill="none"
          stroke={COLORS[idx % COLORS.length]}
          strokeWidth={3}
          points={route.points.map(p => `${p.x},${p.y}`).join(" ")}
          opacity={0.85}
        />
      ))}
      
      {/* Draw depot marker (larger, distinct) */}
      {depotProjected && (
        <>
          <circle
            cx={depotProjected.x}
            cy={depotProjected.y}
            r={12}
            fill="#ef4444"
            stroke="#fff"
            strokeWidth={3}
          />
          <text
            x={depotProjected.x}
            y={depotProjected.y + 4}
            textAnchor="middle"
            fontSize={12}
            fill="#fff"
            fontWeight="bold"
            style={{ pointerEvents: "none" }}
          >
            D
          </text>
        </>
      )}
      
      {/* Draw stops as dots (skip first and last if they're depot) */}
      {projected.map((route, idx) => (
        route.points.map((p, i) => {
          // Skip depot points (first and last)
          if (depotProjected && (i === 0 || i === route.points.length - 1)) {
            return null;
          }
          
          return (
            <circle
              key={p.id}
              cx={p.x}
              cy={p.y}
              r={8}
              fill="#22223b"
              stroke={COLORS[idx % COLORS.length]}
              strokeWidth={3}
            />
          );
        })
      ))}
      
      {/* Draw stop numbers (skip first and last if they're depot) */}
      {projected.map((route, idx) => (
        route.points.map((p, i) => {
          // Skip depot points (first and last)
          if (depotProjected && (i === 0 || i === route.points.length - 1)) {
            return null;
          }
          
          // Adjust numbering (subtract 1 since depot is at position 0)
          const stopNumber = depotProjected ? i : i + 1;
          
          return (
            <text
              key={p.id + "-label"}
              x={p.x}
              y={p.y + 4}
              textAnchor="middle"
              fontSize={12}
              fill="#fff"
              fontWeight="bold"
              style={{ pointerEvents: "none" }}
            >
              {stopNumber}
            </text>
          );
        })
      ))}
    </svg>
  );
}
