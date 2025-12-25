import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { UserPlus, Minus, Plus } from "lucide-react";

interface DriverCountProps {
  count: number;
  onCountChange: (count: number) => void;
}

export const DriverCount = ({ count, onCountChange }: DriverCountProps) => {
  const handleIncrement = () => onCountChange(Math.min(count + 1, 20));
  const handleDecrement = () => onCountChange(Math.max(count - 1, 1));

  return (
    <Card className="glass-panel animate-slide-up" style={{ animationDelay: '0.15s' }}>
      <CardHeader className="pb-3">
        <div className="flex items-center gap-2">
          <UserPlus className="h-5 w-5 text-primary" />
          <CardTitle className="text-lg font-medium">Number of Drivers</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-3">
          <Button 
            variant="outline" 
            size="icon" 
            onClick={handleDecrement}
            disabled={count <= 1}
          >
            <Minus className="h-4 w-4" />
          </Button>
          <Input
            type="number"
            value={count}
            onChange={(e) => onCountChange(Math.max(1, Math.min(20, parseInt(e.target.value) || 1)))}
            className="text-center text-2xl font-semibold bg-secondary/50 h-14"
            min={1}
            max={20}
          />
          <Button 
            variant="outline" 
            size="icon" 
            onClick={handleIncrement}
            disabled={count >= 20}
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>
        <p className="text-sm text-muted-foreground mt-3 text-center">
          Active drivers for route assignment
        </p>
      </CardContent>
    </Card>
  );
};
