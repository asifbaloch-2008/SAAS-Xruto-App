import { useState, useMemo } from "react";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { DriverLoadChart } from "@/components/dashboard/DriverLoadChart";
import { RouteSettings } from "@/components/dashboard/RouteSettings";
import { RouteSummary } from "@/components/dashboard/RouteSummary";
import { AssignmentResults } from "@/components/dashboard/AssignmentResults";
import { useToast } from "@/hooks/use-toast";
import { geocodeAddresses, clusterOrders, optimizeRoutes, type Order, type OptimizationResponse } from "@/lib/api";

const Index = () => {
  const { toast } = useToast();
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [addresses, setAddresses] = useState<string[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [driverCount, setDriverCount] = useState(4);
  const [showResults, setShowResults] = useState(false);
  const [activeResultsTab, setActiveResultsTab] = useState("assigned");
  const [showOptimizationData, setShowOptimizationData] = useState(false);
  const [optimizationResult, setOptimizationResult] = useState<OptimizationResponse | null>(null);
  
  const [routeParams, setRouteParams] = useState({
    serviceTime: 5,
    maxWorkingHours: 8,
    maxStopsPerRoute: 25,
    maxTries: 100,
  });

  const [weights, setWeights] = useState({
    distance: 40,
    time: 35,
    difficulty: 25,
  });

  // Get assignment and optimization data from API results
  const assignmentData = optimizationResult || {
    workloadBalance: {
      avgWorkingHours: "0h",
      maxWorkingHours: "0h",
      overloadedRoutes: 0,
      balanceScore: "0%",
    },
    driverSummary: [],
    driverAnalysis: [],
  };

  const optimizationData = optimizationResult?.optimizationData;
  const summaryData = optimizationResult?.summaryData || [];

  // Simulate driver load distribution based on addresses and settings
  const driverLoads = useMemo(() => {
    if (addresses.length === 0) return [];
    
    const baseStops = Math.floor(addresses.length / driverCount);
    const remainder = addresses.length % driverCount;
    
    return Array.from({ length: driverCount }, (_, i) => {
      const stops = baseStops + (i < remainder ? 1 : 0);
      const variance = (Math.random() - 0.5) * (100 - weights.distance) / 10;
      const adjustedStops = Math.max(0, Math.round(stops + variance));
      
      return {
        driver: `Driver ${i + 1}`,
        stops: adjustedStops,
        distance: adjustedStops * (3 + Math.random() * 2),
        time: adjustedStops * (0.15 + Math.random() * 0.1),
      };
    });
  }, [addresses.length, driverCount, weights.distance]);

  const handleAssign = async () => {
    if (addresses.length === 0) {
      toast({
        title: "No Addresses",
        description: "Please upload addresses first.",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsOptimizing(true);
      
      // Check if we already have orders with coordinates
      let ordersToCluster = orders;
      
      if (orders.length === 0 || orders.some(o => o.lat === 0 && o.lng === 0)) {
        // Need to geocode
        toast({
          title: "Geocoding Addresses",
          description: "Converting addresses to coordinates...",
        });
        ordersToCluster = await geocodeAddresses(addresses);
        setOrders(ordersToCluster);
      }

      // Run K-means clustering only
      toast({
        title: "Clustering Orders",
        description: "Grouping orders into clusters...",
      });

      const { routes } = await clusterOrders(ordersToCluster, driverCount);

      // Show clusters as routes (unordered)
      setOptimizationResult({
        workloadBalance: { avgWorkingHours: "-", maxWorkingHours: "-", overloadedRoutes: 0, balanceScore: "-" },
        driverSummary: [],
        driverAnalysis: [],
        optimizationData: undefined,
        summaryData: [],
        routes,
      } as any);
      setShowResults(true);
      setActiveResultsTab("assigned");
      setShowOptimizationData(false);

      toast({
        title: "Assignment Complete",
        description: `Orders clustered into ${driverCount} groups.`,
      });
    } catch (error) {
      toast({
        title: "Assignment Failed",
        description: "Could not assign routes. Make sure the backend server is running.",
        variant: "destructive",
      });
      console.error("Assignment error:", error);
    } finally {
      setIsOptimizing(false);
    }
  };

  const handleOptimize = async () => {
    if (addresses.length === 0) {
      toast({
        title: "No Addresses",
        description: "Please upload addresses first.",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsOptimizing(true);
      
      // Use existing orders if available, otherwise geocode first
      let ordersToOptimize = orders;
      
      console.log("Current orders state:", orders);
      console.log("Current addresses state:", addresses);
      
      if (ordersToOptimize.length === 0 || ordersToOptimize.some(o => o.lat === 0 && o.lng === 0)) {
        // Need to geocode - addresses don't have coordinates yet
        toast({
          title: "Geocoding Addresses",
          description: "Converting addresses to coordinates...",
        });
        ordersToOptimize = await geocodeAddresses(addresses);
        setOrders(ordersToOptimize);
      }

      if (ordersToOptimize.length === 0) {
        throw new Error("No valid orders to optimize");
      }

      toast({
        title: "Optimizing Routes",
        description: "Running K-means clustering, workload balancing, and 2-opt optimization...",
      });

      const result = await optimizeRoutes(
        ordersToOptimize,
        driverCount,
        routeParams,
        weights
      );

      setOptimizationResult(result);
      setShowResults(true);
      setShowOptimizationData(true);
      setActiveResultsTab("optimized");

      toast({
        title: "Optimization Complete",
        description: `Routes optimized for ${driverCount} drivers using advanced algorithms.`,
      });
    } catch (error) {
      toast({
        title: "Optimization Failed",
        description: "Could not optimize routes. Make sure the backend server is running.",
        variant: "destructive",
      });
      console.error("Optimization error:", error);
    } finally {
      setIsOptimizing(false);
    }
  };

  const handleExport = () => {
    toast({
      title: "Export",
      description: "Exporting route data...",
    });
  };

  const handleReset = () => {
    setAddresses([]);
    setOrders([]);
    setDriverCount(4);
    setShowResults(false);
    setShowOptimizationData(false);
    setActiveResultsTab("assigned");
    setOptimizationResult(null);
    setRouteParams({
      serviceTime: 5,
      maxWorkingHours: 8,
      maxStopsPerRoute: 25,
      maxTries: 100,
    });
    setWeights({
      distance: 40,
      time: 35,
      difficulty: 25,
    });
    toast({
      title: "Reset",
      description: "All settings have been reset to defaults.",
    });
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <DashboardHeader 
        onAssign={handleAssign}
        onOptimize={handleOptimize} 
        onExport={handleExport}
        onReset={handleReset}
        isOptimizing={isOptimizing} 
      />
      
      <main className="flex-1 p-4 lg:p-6 flex flex-col gap-4">
        {/* Top row - fixed height cards */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 h-[480px] shrink-0">
          {/* Balanced Driver Routes - 6 columns */}
          <div className="lg:col-span-6 h-full">
            <DriverLoadChart 
              data={driverLoads} 
              totalOrders={addresses.length}
              routeSettings={{
                timePerStop: routeParams.serviceTime,
                maxHours: routeParams.maxWorkingHours,
                maxStops: routeParams.maxStopsPerRoute,
                driverCount: driverCount,
              }}
              routes={optimizationResult?.routes || []}
              depot={{ lat: 51.5074, lng: -0.1278 }}
            />
          </div>
          
          {/* Summary - 3 columns */}
          <div className="lg:col-span-3 h-full">
            <RouteSummary data={summaryData} />
          </div>
          
          {/* Route Settings - 3 columns */}
          <div className="lg:col-span-3 h-full">
            <RouteSettings
              driverCount={driverCount}
              onDriverCountChange={setDriverCount}
              routeParams={routeParams}
              onRouteParamsChange={setRouteParams}
              weights={weights}
              onWeightsChange={setWeights}
              addresses={addresses}
              onAddressesChange={setAddresses}
              onOrdersChange={setOrders}
            />
          </div>
        </div>

        {/* Assignment Results */}
        {showResults && (
          <AssignmentResults
            workloadBalance={assignmentData.workloadBalance}
            driverSummary={assignmentData.driverSummary}
            driverAnalysis={assignmentData.driverAnalysis}
            activeTab={activeResultsTab}
            onTabChange={setActiveResultsTab}
            optimizationData={showOptimizationData ? optimizationData : undefined}
          />
        )}
      </main>
    </div>
  );
};

export default Index;
