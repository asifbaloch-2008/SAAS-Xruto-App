import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart3, Package, MapPin, Clock, TrendingUp } from "lucide-react";

interface Statistics {
  totalOrders: number;
  avgStopsPerDriver: number;
  avgDistancePerDriver: number;
  estimatedTotalTime: number;
  efficiencyScore: number;
}

interface OrderStatisticsProps {
  stats: Statistics;
}

export const OrderStatistics = ({ stats }: OrderStatisticsProps) => {
  const statItems = [
    { 
      icon: Package, 
      label: 'Total Orders', 
      value: stats.totalOrders,
      suffix: '',
      color: 'text-chart-1'
    },
    { 
      icon: MapPin, 
      label: 'Avg Stops/Driver', 
      value: stats.avgStopsPerDriver.toFixed(1),
      suffix: '',
      color: 'text-chart-2'
    },
    { 
      icon: TrendingUp, 
      label: 'Avg Distance', 
      value: stats.avgDistancePerDriver.toFixed(1),
      suffix: 'km',
      color: 'text-chart-3'
    },
    { 
      icon: Clock, 
      label: 'Est. Total Time', 
      value: stats.estimatedTotalTime.toFixed(1),
      suffix: 'hrs',
      color: 'text-chart-4'
    },
  ];

  return (
    <Card className="glass-panel animate-slide-up" style={{ animationDelay: '0.3s' }}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-primary" />
            <CardTitle className="text-lg font-medium">Order Statistics</CardTitle>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Efficiency</span>
            <span className={`text-lg font-bold ${
              stats.efficiencyScore >= 80 ? 'text-success' : 
              stats.efficiencyScore >= 60 ? 'text-warning' : 'text-destructive'
            }`}>
              {stats.efficiencyScore}%
            </span>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4">
          {statItems.map(({ icon: Icon, label, value, suffix, color }) => (
            <div key={label} className="p-3 rounded-lg bg-secondary/30">
              <div className="flex items-center gap-2 mb-1">
                <Icon className={`h-4 w-4 ${color}`} />
                <span className="text-xs text-muted-foreground">{label}</span>
              </div>
              <p className="text-xl font-semibold text-foreground">
                {value}
                {suffix && <span className="text-sm text-muted-foreground ml-1">{suffix}</span>}
              </p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
