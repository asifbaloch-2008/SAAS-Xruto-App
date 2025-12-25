import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Upload, Users, Route, Scale, Info } from "lucide-react";
import type { Order } from "@/lib/api";

interface RouteSettingsProps {
  driverCount: number;
  onDriverCountChange: (count: number) => void;
  routeParams: {
    serviceTime: number;
    maxWorkingHours: number;
    maxStopsPerRoute: number;
    maxTries: number;
  };
  onRouteParamsChange: (params: RouteSettingsProps["routeParams"]) => void;
  weights: {
    distance: number;
    time: number;
    difficulty: number;
  };
  onWeightsChange: (weights: RouteSettingsProps["weights"]) => void;
  addresses: string[];
  onAddressesChange: (addresses: string[]) => void;
  onOrdersChange?: (orders: Order[]) => void;
}

export function RouteSettings({
  driverCount,
  onDriverCountChange,
  routeParams,
  onRouteParamsChange,
  weights,
  onWeightsChange,
  addresses,
  onAddressesChange,
  onOrdersChange,
}: RouteSettingsProps) {
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const text = e.target?.result as string;
        const lines = text.split('\n').filter(line => line.trim());
        
        if (lines.length === 0) return;

        // Check if first line is a CSV header
        const firstLine = lines[0];
        const isCSV = firstLine.includes(',');
        
        if (isCSV) {
          // Parse CSV with headers
          const headers = firstLine.split(',').map(h => h.trim().toLowerCase());
          const hasCoordinates = headers.includes('lat') && headers.includes('lng');
          
          const parsedOrders: Order[] = lines.slice(1).map((line, idx) => {
            const values = line.split(',').map(v => v.trim());
            const record: Record<string, string> = {};
            headers.forEach((header, i) => {
              record[header] = values[i] || '';
            });
            
            return {
              id: record['id'] || `order_${idx + 1}`,
              address: record['address'] || '',
              lat: hasCoordinates ? parseFloat(record['lat']) : 0,
              lng: hasCoordinates ? parseFloat(record['lng']) : 0,
            };
          }).filter(o => o.address); // Filter out empty rows
          
          if (hasCoordinates && parsedOrders.length > 0) {
            // CSV has coordinates - use Orders directly
            onOrdersChange?.(parsedOrders);
            onAddressesChange(parsedOrders.map(o => o.address));
          } else {
            // CSV is just addresses - add as strings
            onAddressesChange(lines.slice(1));
          }
        } else {
          // Plain text addresses
          onAddressesChange(lines);
        }
      };
      reader.readAsText(file);
    }
  };

  return (
    <Card className="h-full flex flex-col overflow-hidden">
      <CardHeader className="pb-2 shrink-0">
        <CardTitle className="text-base font-semibold flex items-center gap-2">
          <Scale className="h-4 w-4 text-primary" />
          Route Settings
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-1 overflow-y-auto">
        <Tabs defaultValue="data" className="w-full">
          <TabsList className="grid w-full grid-cols-4 mb-4">
            <TabsTrigger value="data" className="text-xs px-2">
              <Upload className="h-3 w-3 mr-1" />
              Data
            </TabsTrigger>
            <TabsTrigger value="driver" className="text-xs px-2">
              <Users className="h-3 w-3 mr-1" />
              Driver
            </TabsTrigger>
            <TabsTrigger value="route" className="text-xs px-2">
              <Route className="h-3 w-3 mr-1" />
              Route
            </TabsTrigger>
            <TabsTrigger value="fairness" className="text-xs px-2">
              <Scale className="h-3 w-3 mr-1" />
              Fairness
            </TabsTrigger>
          </TabsList>

          {/* Data Tab */}
          <TabsContent value="data" className="space-y-4">
            <div className="space-y-3">
              <Label htmlFor="file-upload" className="text-sm font-medium">
                Upload Delivery Data
              </Label>
              <div className="border-2 border-dashed border-border rounded-lg p-6 text-center hover:border-primary/50 transition-colors">
                <input
                  id="file-upload"
                  type="file"
                  accept=".csv,.txt"
                  onChange={handleFileUpload}
                  className="hidden"
                />
                <label htmlFor="file-upload" className="cursor-pointer">
                  <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">
                    Click to upload CSV or TXT file
                  </p>
                </label>
              </div>
              {addresses.length > 0 && (
                <div className="flex items-center gap-2 text-sm text-primary">
                  <Info className="h-4 w-4" />
                  {addresses.length} addresses loaded
                </div>
              )}
            </div>
          </TabsContent>

          {/* Driver Tab */}
          <TabsContent value="driver" className="space-y-4">
            <div className="space-y-3">
              <Label htmlFor="driver-count" className="text-sm font-medium">
                Number of Drivers
              </Label>
              <Input
                id="driver-count"
                type="number"
                min={1}
                max={50}
                value={driverCount}
                onChange={(e) => onDriverCountChange(parseInt(e.target.value) || 1)}
                className="w-full"
              />
              <p className="text-xs text-muted-foreground flex items-start gap-2">
                <Info className="h-4 w-4 shrink-0 mt-0.5" />
                Each driver gets their own fair route with an equal amount of work
              </p>
            </div>
          </TabsContent>

          {/* Route Tab */}
          <TabsContent value="route" className="space-y-4">
            <div className="space-y-3">
              <Label htmlFor="service-time" className="text-sm font-medium">
                Service Time (minutes per stop)
              </Label>
              <Input
                id="service-time"
                type="number"
                min={1}
                max={60}
                value={routeParams.serviceTime}
                onChange={(e) => onRouteParamsChange({
                  ...routeParams,
                  serviceTime: parseInt(e.target.value) || 5
                })}
              />
              <p className="text-xs text-muted-foreground flex items-start gap-2">
                <Info className="h-4 w-4 shrink-0 mt-0.5" />
                Each route is balanced, factoring in how tough each order is
              </p>
            </div>

            <div className="space-y-3">
              <Label htmlFor="max-hours" className="text-sm font-medium">
                Max Working Hours per Driver
              </Label>
              <Input
                id="max-hours"
                type="number"
                min={1}
                max={24}
                value={routeParams.maxWorkingHours}
                onChange={(e) => onRouteParamsChange({
                  ...routeParams,
                  maxWorkingHours: parseInt(e.target.value) || 8
                })}
              />
            </div>

            <div className="space-y-3">
              <Label htmlFor="max-stops" className="text-sm font-medium">
                Max Stops per Route
              </Label>
              <Input
                id="max-stops"
                type="number"
                min={1}
                max={100}
                value={routeParams.maxStopsPerRoute}
                onChange={(e) => onRouteParamsChange({
                  ...routeParams,
                  maxStopsPerRoute: parseInt(e.target.value) || 25
                })}
              />
            </div>
          </TabsContent>

          {/* Fairness Tab */}
          <TabsContent value="fairness" className="space-y-4">
            <p className="text-sm font-medium text-foreground mb-3">
              Balance routes using:
            </p>

            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <Label className="text-sm">Distance</Label>
                  <span className="text-sm font-medium text-primary">{weights.distance}%</span>
                </div>
                <Slider
                  value={[weights.distance]}
                  onValueChange={([value]) => onWeightsChange({ ...weights, distance: value })}
                  max={100}
                  step={5}
                  className="w-full"
                />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <Label className="text-sm">Time</Label>
                  <span className="text-sm font-medium text-primary">{weights.time}%</span>
                </div>
                <Slider
                  value={[weights.time]}
                  onValueChange={([value]) => onWeightsChange({ ...weights, time: value })}
                  max={100}
                  step={5}
                  className="w-full"
                />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <Label className="text-sm">Delivery Difficulty</Label>
                  <span className="text-sm font-medium text-primary">{weights.difficulty}%</span>
                </div>
                <Slider
                  value={[weights.difficulty]}
                  onValueChange={([value]) => onWeightsChange({ ...weights, difficulty: value })}
                  max={100}
                  step={5}
                  className="w-full"
                />
              </div>

              <div className="space-y-2 pt-2 border-t border-border">
                <Label htmlFor="max-tries" className="text-sm font-medium">
                  Tries up to
                </Label>
                <Input
                  id="max-tries"
                  type="number"
                  min={1}
                  max={1000}
                  value={routeParams.maxTries}
                  onChange={(e) => onRouteParamsChange({
                    ...routeParams,
                    maxTries: parseInt(e.target.value) || 100
                  })}
                  className="w-full"
                />
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
