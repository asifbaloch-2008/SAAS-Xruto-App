import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Package, Route, MapPin, Hash, AlertTriangle, Box, Palette, Clock, Timer, Flag } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { SimpleRouteMap } from "./SimpleRouteMap";

interface DriverLoad {
  driver: string;
  stops: number;
  distance: number;
  time: number;
}

interface RouteSettings {
  timePerStop: number;
  maxHours: number;
  maxStops: number;
  driverCount: number;
}

interface DriverLoadChartProps {
  data: DriverLoad[];
  totalOrders: number;
  routeSettings?: RouteSettings;
}

const COLORS = [
  "hsl(174, 72%, 56%)",
  "hsl(199, 89%, 48%)",
  "hsl(262, 83%, 58%)",
  "hsl(43, 96%, 56%)",
  "hsl(339, 90%, 51%)",
];

const legendItems = [
  { icon: MapPin, label: "Depot", color: "hsl(0, 84%, 60%)", description: "Red circle" },
  { icon: Hash, label: "Stop order", color: "hsl(215, 20%, 65%)", description: "Numbers" },
  { icon: AlertTriangle, label: "High priority", color: "hsl(43, 96%, 56%)", description: "Gold" },
  { icon: Box, label: "Fragile", color: "hsl(339, 90%, 70%)", description: "Pink" },
  { icon: Palette, label: "Driver routes", color: "hsl(199, 89%, 48%)", description: "Colors" },
];

export const DriverLoadChart = ({ data, totalOrders, routeSettings, routes, depot }: DriverLoadChartProps & { routes?: any[]; depot?: { lat: number; lng: number } }) => {
  const routeCount = data.length;
  const settings = routeSettings || { timePerStop: 5, maxHours: 8, maxStops: 25, driverCount: 4 };

  return (
    <Card className="glass-panel animate-slide-up h-full flex flex-col overflow-hidden">
      <CardHeader className="pb-2 shrink-0">
        <div className="flex flex-col gap-2">
          {/* Title Row */}
          <div className="flex flex-row items-center justify-between">
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-primary" />
              <CardTitle className="text-base font-medium">Balanced Driver Routes</CardTitle>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Badge variant="secondary" className="flex items-center gap-1 px-2 py-1 bg-primary/10 hover:bg-primary/10 text-foreground border-0">
                <Package className="h-3 w-3 text-primary" />
                <span className="font-semibold text-xs">{totalOrders}</span>
                <span className="text-muted-foreground text-[10px]">orders</span>
              </Badge>
              <Badge variant="secondary" className="flex items-center gap-1 px-2 py-1 bg-chart-2/10 hover:bg-chart-2/10 text-foreground border-0">
                <Route className="h-3 w-3 text-chart-2" />
                <span className="font-semibold text-xs">{routeCount || "-"}</span>
                <span className="text-muted-foreground text-[10px]">routes</span>
              </Badge>
            </div>
          </div>

          {/* Legend */}
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
            <span className="text-[10px] font-medium text-muted-foreground uppercase tracking-wide">Legend:</span>
            {legendItems.map((item) => (
              <div key={item.label} className="flex items-center gap-1 text-[10px]">
                <item.icon className="h-3 w-3" style={{ color: item.color }} />
                <span className="text-muted-foreground">{item.label}</span>
              </div>
            ))}
          </div>
        </div>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col gap-2 pt-0 pb-3 overflow-hidden">
        {routes && routes.length > 0 ? (
          <div className="flex-1 min-h-0">
            <SimpleRouteMap routes={routes} depot={depot} />
          </div>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center space-y-1">
              <Users className="h-8 w-8 text-muted-foreground/40 mx-auto" />
              <p className="text-xs text-muted-foreground">
                Add drivers and addresses to view load distribution
              </p>
            </div>
          </div>
        )}

        {/* Summary Message */}
        <div className="bg-muted/50 rounded-md p-2 border border-border/50 shrink-0">
          <p className="text-xs text-muted-foreground leading-relaxed">
            <span className="text-foreground font-medium">
              {routeCount > 0 
                ? `Deliveries split across ${routeCount} drivers.` 
                : "Deliveries will be split fairly."}
            </span>
            {" "}Rules:{" "}
            <span className="inline-flex items-center gap-0.5">
              <Timer className="h-3 w-3 text-primary" />
              <span className="font-medium text-foreground">{settings.timePerStop}min</span>/stop,
            </span>{" "}
            <span className="inline-flex items-center gap-0.5">
              <Clock className="h-3 w-3 text-primary" />
              max <span className="font-medium text-foreground">{settings.maxHours}h</span>,
            </span>{" "}
            <span className="inline-flex items-center gap-0.5">
              <Flag className="h-3 w-3 text-primary" />
              max <span className="font-medium text-foreground">{settings.maxStops}</span> stops.
            </span>
          </p>
        </div>
      </CardContent>
    </Card>
  );
};
