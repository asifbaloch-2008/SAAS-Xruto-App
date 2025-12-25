import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Settings2 } from "lucide-react";

interface RouteParams {
  maxStopsPerDriver: number;
  maxDistancePerDriver: number;
  timeWindowStart: string;
  timeWindowEnd: string;
  optimizationMode: string;
}

interface RouteParametersProps {
  params: RouteParams;
  onParamsChange: (params: RouteParams) => void;
}

export const RouteParameters = ({ params, onParamsChange }: RouteParametersProps) => {
  const updateParam = <K extends keyof RouteParams>(key: K, value: RouteParams[K]) => {
    onParamsChange({ ...params, [key]: value });
  };

  return (
    <Card className="glass-panel animate-slide-up" style={{ animationDelay: '0.2s' }}>
      <CardHeader className="pb-3">
        <div className="flex items-center gap-2">
          <Settings2 className="h-5 w-5 text-primary" />
          <CardTitle className="text-lg font-medium">Route Parameters</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label className="text-muted-foreground">Max Stops/Driver</Label>
            <Input
              type="number"
              value={params.maxStopsPerDriver}
              onChange={(e) => updateParam('maxStopsPerDriver', parseInt(e.target.value) || 0)}
              className="bg-secondary/50"
            />
          </div>
          <div className="space-y-2">
            <Label className="text-muted-foreground">Max Distance (km)</Label>
            <Input
              type="number"
              value={params.maxDistancePerDriver}
              onChange={(e) => updateParam('maxDistancePerDriver', parseInt(e.target.value) || 0)}
              className="bg-secondary/50"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label className="text-muted-foreground">Window Start</Label>
            <Input
              type="time"
              value={params.timeWindowStart}
              onChange={(e) => updateParam('timeWindowStart', e.target.value)}
              className="bg-secondary/50"
            />
          </div>
          <div className="space-y-2">
            <Label className="text-muted-foreground">Window End</Label>
            <Input
              type="time"
              value={params.timeWindowEnd}
              onChange={(e) => updateParam('timeWindowEnd', e.target.value)}
              className="bg-secondary/50"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label className="text-muted-foreground">Optimization Mode</Label>
          <Select value={params.optimizationMode} onValueChange={(v) => updateParam('optimizationMode', v)}>
            <SelectTrigger className="bg-secondary/50">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="balanced">Balanced Load</SelectItem>
              <SelectItem value="distance">Minimize Distance</SelectItem>
              <SelectItem value="time">Minimize Time</SelectItem>
              <SelectItem value="stops">Equal Stops</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardContent>
    </Card>
  );
};
