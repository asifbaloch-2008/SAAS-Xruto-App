import { Truck, UserPlus, Sparkles, Download, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useNavigate, useLocation } from "react-router-dom";

interface DashboardHeaderProps {
  onAssign?: () => void;
  onOptimize?: () => void;
  onExport?: () => void;
  onReset?: () => void;
  isOptimizing?: boolean;
  showActions?: boolean;
}

export const DashboardHeader = ({ 
  onAssign,
  onOptimize, 
  onExport,
  onReset,
  isOptimizing = false, 
  showActions = true 
}: DashboardHeaderProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const currentTab = location.pathname === "/how-it-works" ? "how-it-works" : "dashboard";

  return (
    <header className="flex items-center justify-between py-6 px-8 border-b border-border">
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-primary/10 glow-primary">
            <Truck className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h1 className="text-xl font-semibold text-foreground">Route Load Balancer</h1>
            <p className="text-sm text-muted-foreground">Optimize driver distribution</p>
          </div>
        </div>
        
        <Tabs value={currentTab} className="ml-4">
          <TabsList className="bg-muted/50">
            <TabsTrigger 
              value="dashboard" 
              onClick={() => navigate("/")}
              className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              Dashboard
            </TabsTrigger>
            <TabsTrigger 
              value="how-it-works" 
              onClick={() => navigate("/how-it-works")}
              className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              How It Works
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>
      
      {showActions && (
        <div className="flex items-center gap-2">
          <Button 
            variant="outline"
            onClick={onAssign} 
            className="gap-2"
          >
            <UserPlus className="h-4 w-4" />
            Assign
          </Button>
          <Button 
            onClick={onOptimize} 
            disabled={isOptimizing}
            className="gap-2"
          >
            <Sparkles className={`h-4 w-4 ${isOptimizing ? 'animate-pulse' : ''}`} />
            {isOptimizing ? 'Optimizing...' : 'Optimize'}
          </Button>
          <Button 
            variant="outline"
            onClick={onExport} 
            className="gap-2"
          >
            <Download className="h-4 w-4" />
            Export
          </Button>
          <Button 
            variant="ghost"
            onClick={onReset} 
            className="gap-2"
          >
            <RotateCcw className="h-4 w-4" />
            Reset
          </Button>
        </div>
      )}
    </header>
  );
};