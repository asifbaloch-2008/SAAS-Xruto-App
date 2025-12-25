import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

interface DriverSummary {
  driver: string;
  orders: number;
  hours: number;
  score: number;
}

interface DriverAnalysis {
  driver: string;
  orders: number;
  value: string;
  weight: string;
  workingHours: string;
  workloadScore: number;
  status: string;
}

interface WorkloadBalance {
  avgWorkingHours: string;
  maxWorkingHours: string;
  overloadedRoutes: number;
  balanceScore: string;
}

interface OptimizationSummary {
  totalDistance: string;
  totalTime: string;
  avgScore: number;
  routesInTime: string;
  fuelCost: string;
  driverCost: string;
  totalCost: string;
}

interface OptimizedRouteDetail {
  driver: string;
  stops: number;
  distance: string;
  travelTime: string;
  serviceTime: string;
  totalTime: string;
  efficiency: number;
  workloadScore: number;
  status: string;
}

interface AssignmentResultsProps {
  workloadBalance: WorkloadBalance;
  driverSummary: DriverSummary[];
  driverAnalysis: DriverAnalysis[];
  activeTab: string;
  onTabChange: (tab: string) => void;
  optimizationData?: {
    summary: OptimizationSummary;
    driverAnalysis: DriverAnalysis[];
    routeDetails: OptimizedRouteDetail[];
  };
}

export const AssignmentResults = ({
  workloadBalance,
  driverSummary,
  driverAnalysis,
  activeTab,
  onTabChange,
  optimizationData,
}: AssignmentResultsProps) => {
  return (
    <Card className="mt-6">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-semibold">Route Results</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={onTabChange} className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-4">
            <TabsTrigger value="assigned">Assigned</TabsTrigger>
            <TabsTrigger value="optimized">Optimized</TabsTrigger>
          </TabsList>
          
          <TabsContent value="assigned" className="space-y-6">
            {/* Workload Balance Stats */}
            <div>
              <h3 className="text-sm font-semibold mb-3">Driver Workload Balance</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-muted/50 rounded-lg p-3">
                  <p className="text-xs text-muted-foreground">Avg Working Hours</p>
                  <p className="text-lg font-semibold">{workloadBalance.avgWorkingHours}</p>
                </div>
                <div className="bg-muted/50 rounded-lg p-3">
                  <p className="text-xs text-muted-foreground">Max Working Hours</p>
                  <p className="text-lg font-semibold">{workloadBalance.maxWorkingHours}</p>
                </div>
                <div className="bg-muted/50 rounded-lg p-3">
                  <p className="text-xs text-muted-foreground">Overloaded Routes</p>
                  <p className="text-lg font-semibold text-destructive">{workloadBalance.overloadedRoutes}</p>
                </div>
                <div className="bg-muted/50 rounded-lg p-3">
                  <p className="text-xs text-muted-foreground">Balance Score</p>
                  <p className="text-lg font-semibold">{workloadBalance.balanceScore}</p>
                </div>
              </div>
            </div>

            {/* Driver Summary Table */}
            <div>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Driver</TableHead>
                    <TableHead>Orders</TableHead>
                    <TableHead>Hours</TableHead>
                    <TableHead>Score</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {driverSummary.map((driver) => (
                    <TableRow key={driver.driver}>
                      <TableCell className="font-medium">{driver.driver}</TableCell>
                      <TableCell>{driver.orders}</TableCell>
                      <TableCell>{driver.hours}</TableCell>
                      <TableCell>{driver.score}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {/* Driver Route Analysis */}
            <div>
              <h3 className="text-sm font-semibold mb-3">Driver Route Analysis</h3>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Driver</TableHead>
                      <TableHead>Orders</TableHead>
                      <TableHead>Value</TableHead>
                      <TableHead>Weight</TableHead>
                      <TableHead>Working Hours</TableHead>
                      <TableHead>Workload %</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {driverAnalysis.map((driver) => (
                      <TableRow key={driver.driver}>
                        <TableCell className="font-medium">{driver.driver}</TableCell>
                        <TableCell>{driver.orders}</TableCell>
                        <TableCell>{driver.value}</TableCell>
                        <TableCell>{driver.weight}</TableCell>
                        <TableCell>{driver.workingHours}</TableCell>
                        <TableCell>{driver.workloadScore}</TableCell>
                        <TableCell>
                          <Badge variant={driver.status === "Overloaded" ? "destructive" : "secondary"}>
                            {driver.status}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="optimized" className="space-y-6">
            {optimizationData ? (
              <>
                {/* Optimization Results Summary */}
                <div>
                  <h3 className="text-sm font-semibold mb-3">Optimization Results</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
                    <div className="bg-muted/50 rounded-lg p-3">
                      <p className="text-xs text-muted-foreground">Total Distance</p>
                      <p className="text-lg font-semibold">{optimizationData.summary.totalDistance}</p>
                    </div>
                    <div className="bg-muted/50 rounded-lg p-3">
                      <p className="text-xs text-muted-foreground">Total Time</p>
                      <p className="text-lg font-semibold">{optimizationData.summary.totalTime}</p>
                    </div>
                    <div className="bg-muted/50 rounded-lg p-3">
                      <p className="text-xs text-muted-foreground">Avg Score</p>
                      <p className="text-lg font-semibold">{optimizationData.summary.avgScore}</p>
                    </div>
                    <div className="bg-muted/50 rounded-lg p-3">
                      <p className="text-xs text-muted-foreground">Routes in Time</p>
                      <p className="text-lg font-semibold">{optimizationData.summary.routesInTime}</p>
                    </div>
                    <div className="bg-muted/50 rounded-lg p-3">
                      <p className="text-xs text-muted-foreground">Fuel Cost</p>
                      <p className="text-lg font-semibold">{optimizationData.summary.fuelCost}</p>
                    </div>
                    <div className="bg-muted/50 rounded-lg p-3">
                      <p className="text-xs text-muted-foreground">Driver Cost</p>
                      <p className="text-lg font-semibold">{optimizationData.summary.driverCost}</p>
                    </div>
                    <div className="bg-muted/50 rounded-lg p-3">
                      <p className="text-xs text-muted-foreground">Total Cost</p>
                      <p className="text-lg font-semibold text-primary">{optimizationData.summary.totalCost}</p>
                    </div>
                  </div>
                </div>

                {/* Driver Route Analysis */}
                <div>
                  <h3 className="text-sm font-semibold mb-3">Driver Route Analysis</h3>
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Driver</TableHead>
                          <TableHead>Orders</TableHead>
                          <TableHead>Value</TableHead>
                          <TableHead>Weight</TableHead>
                          <TableHead>Working Hours</TableHead>
                          <TableHead>Workload %</TableHead>
                          <TableHead>Status</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {optimizationData.driverAnalysis.map((driver) => (
                          <TableRow key={driver.driver}>
                            <TableCell className="font-medium">{driver.driver}</TableCell>
                            <TableCell>{driver.orders}</TableCell>
                            <TableCell>{driver.value}</TableCell>
                            <TableCell>{driver.weight}</TableCell>
                            <TableCell>{driver.workingHours}</TableCell>
                            <TableCell>{driver.workloadScore}</TableCell>
                            <TableCell>
                              <Badge variant={driver.status === "Overloaded" || driver.status === "Overtime" ? "destructive" : "secondary"}>
                                {driver.status}
                              </Badge>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </div>

                {/* Optimized Route Details */}
                <div>
                  <h3 className="text-sm font-semibold mb-3">Optimized Route Details</h3>
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Driver</TableHead>
                          <TableHead>Stops</TableHead>
                          <TableHead>Distance</TableHead>
                          <TableHead>Travel Time</TableHead>
                          <TableHead>Service Time</TableHead>
                          <TableHead>Total Time</TableHead>
                          <TableHead>Workload %</TableHead>
                          <TableHead>Status</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {optimizationData.routeDetails.map((route) => (
                          <TableRow key={route.driver}>
                            <TableCell className="font-medium">{route.driver}</TableCell>
                            <TableCell>{route.stops}</TableCell>
                            <TableCell>{route.distance}</TableCell>
                            <TableCell>{route.travelTime}</TableCell>
                            <TableCell>{route.serviceTime}</TableCell>
                            <TableCell>{route.totalTime}</TableCell>
                            <TableCell>{route.workloadScore}</TableCell>
                            <TableCell>
                              <Badge variant={route.status === "Overtime" ? "destructive" : "secondary"}>
                                {route.status}
                              </Badge>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex items-center justify-center h-32 text-muted-foreground">
                Run optimization to see optimized routes
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};
