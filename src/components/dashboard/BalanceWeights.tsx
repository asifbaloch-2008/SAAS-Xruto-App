import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Scale } from "lucide-react";

interface Weights {
  stopWeight: number;
  distanceWeight: number;
  timeWeight: number;
  priorityWeight: number;
}

interface BalanceWeightsProps {
  weights: Weights;
  onWeightsChange: (weights: Weights) => void;
}

export const BalanceWeights = ({ weights, onWeightsChange }: BalanceWeightsProps) => {
  const updateWeight = <K extends keyof Weights>(key: K, value: number) => {
    onWeightsChange({ ...weights, [key]: value });
  };

  const weightItems = [
    { key: 'stopWeight' as const, label: 'Stop Count', color: 'bg-chart-1' },
    { key: 'distanceWeight' as const, label: 'Distance', color: 'bg-chart-2' },
    { key: 'timeWeight' as const, label: 'Drive Time', color: 'bg-chart-3' },
    { key: 'priorityWeight' as const, label: 'Priority Orders', color: 'bg-chart-4' },
  ];

  return (
    <Card className="glass-panel animate-slide-up" style={{ animationDelay: '0.25s' }}>
      <CardHeader className="pb-3">
        <div className="flex items-center gap-2">
          <Scale className="h-5 w-5 text-primary" />
          <CardTitle className="text-lg font-medium">Balance Weights</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="space-y-5">
        {weightItems.map(({ key, label, color }) => (
          <div key={key} className="space-y-2">
            <div className="flex items-center justify-between">
              <Label className="text-muted-foreground flex items-center gap-2">
                <span className={`w-2 h-2 rounded-full ${color}`} />
                {label}
              </Label>
              <span className="text-sm font-medium text-foreground">{weights[key]}%</span>
            </div>
            <Slider
              value={[weights[key]]}
              onValueChange={([value]) => updateWeight(key, value)}
              max={100}
              step={5}
              className="cursor-pointer"
            />
          </div>
        ))}
        
        <div className="pt-2 border-t border-border">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Total Weight</span>
            <span className={`font-semibold ${
              Object.values(weights).reduce((a, b) => a + b, 0) === 100 
                ? 'text-success' 
                : 'text-warning'
            }`}>
              {Object.values(weights).reduce((a, b) => a + b, 0)}%
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
