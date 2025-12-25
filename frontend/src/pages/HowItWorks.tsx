import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { 
  Scale, 
  Truck, 
  Clock, 
  BarChart3, 
  Target, 
  DollarSign, 
  Brain, 
  TrendingUp 
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface SectionProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  details: string[];
  example: string;
}

const Section = ({ icon, title, description, details, example }: SectionProps) => (
  <Card className="glass-panel animate-slide-up">
    <CardContent className="p-6">
      <div className="flex items-start gap-4">
        <div className="p-3 rounded-xl bg-primary/10 shrink-0">
          {icon}
        </div>
        <div className="space-y-4">
          <div>
            <h3 className="text-xl font-semibold text-foreground mb-2">{title}</h3>
            <p className="text-muted-foreground">{description}</p>
          </div>
          
          {details.length > 0 && (
            <ul className="space-y-2">
              {details.map((detail, index) => (
                <li key={index} className="flex items-center gap-2 text-sm text-foreground">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                  {detail}
                </li>
              ))}
            </ul>
          )}
          
          <div className="p-4 rounded-lg bg-muted/50 border border-border">
            <p className="text-sm text-muted-foreground">
              <span className="font-medium text-foreground">Example: </span>
              {example}
            </p>
          </div>
        </div>
      </div>
    </CardContent>
  </Card>
);

const HowItWorks = () => {
  const sections: SectionProps[] = [
    {
      icon: <Scale className="h-6 w-6 text-primary" />,
      title: "Equal Workload (So Everyone Gets a Fair Share)",
      description: "We make sure every driver has a fair amount of work. Not too little. Not too much. Just right.",
      details: [
        "How long it takes",
        "How far it is",
        "How tricky each delivery is"
      ],
      example: "If John gets 5 big, heavy boxes, and Mike gets 10 small ones — we count that as even work. Everyone's happy."
    },
    {
      icon: <Truck className="h-6 w-6 text-chart-2" />,
      title: "Personalized Routes (Each Driver Gets Their Own Plan)",
      description: "Every driver gets their own map with the best order to visit places. We also tell them when they'll likely get to each stop.",
      details: [],
      example: "\"Mike, leave at 9 AM. You'll finish by 1:30 PM. Go to A → B → C in this order. Easy.\""
    },
    {
      icon: <Clock className="h-6 w-6 text-chart-3" />,
      title: "Smart Time Estimation (Not All Orders Are Equal)",
      description: "We guess how long each stop takes based on:",
      details: [
        "How heavy the item is",
        "How expensive or fragile it is",
        "How important it is"
      ],
      example: "A fancy glass vase? Takes longer to deliver carefully. A box of socks? Quick drop-off."
    },
    {
      icon: <BarChart3 className="h-6 w-6 text-chart-4" />,
      title: "Real-Time Work Check (So We Don't Overwork Anyone)",
      description: "We track driver workload in real-time to ensure fair distribution.",
      details: [
        "How many hours each driver works",
        "How many stops they have",
        "If they're getting too much work"
      ],
      example: "If Sarah's been working for 8 hours and still has 6 stops — we flag it. That's too much."
    },
    {
      icon: <Target className="h-6 w-6 text-chart-5" />,
      title: "Smart Stop Ordering (Fastest Route Wins)",
      description: "We plan stops using the shortest, smartest path. And we improve the path by checking again with a clever trick.",
      details: [],
      example: "Instead of A → C → B → D, we say: \"Hey, A → B → C → D is way faster. Let's do that.\""
    },
    {
      icon: <DollarSign className="h-6 w-6 text-success" />,
      title: "Full Cost Breakdown (Know Where Money Goes)",
      description: "We calculate the complete cost of each route to help cut waste.",
      details: [
        "Fuel cost",
        "Driver pay",
        "Total cost for the full route"
      ],
      example: "\"Route for Mike costs $27 in gas + $60 in wages = $87 total.\" This helps cut waste."
    }
  ];

  const behindTheScenes = [
    "We score each order (heavy? fragile? important?)",
    "Then we give the best orders to the best drivers",
    "We balance work across all drivers",
    "Then we plan each route",
    "We make it faster with a tweak (called 2-opt)",
    "Finally, we show arrival times and service times"
  ];

  const measurements = [
    "How fair the work is between drivers",
    "If drivers are working longer than they should",
    "If we picked the shortest total route",
    "If time matches the difficulty of each delivery",
    "How much we're spending on fuel and wages"
  ];

  return (
    <div className="min-h-screen bg-background text-foreground">
      <DashboardHeader showActions={false} />
      
      <main className="p-6 lg:p-8 max-w-5xl mx-auto">
        <div className="text-center mb-12 animate-fade-in">
          <h1 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
            How Our System Works
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            This system isn't just smart — it's fair, fast, and cost-saving.
          </p>
        </div>

        <div className="space-y-6">
          {sections.map((section, index) => (
            <div key={index} style={{ animationDelay: `${index * 0.1}s` }}>
              <Section {...section} />
            </div>
          ))}

          {/* Behind the Scenes */}
          <Card className="glass-panel animate-slide-up">
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-xl bg-primary/10 shrink-0">
                  <Brain className="h-6 w-6 text-primary" />
                </div>
                <div className="space-y-4">
                  <div>
                    <h3 className="text-xl font-semibold text-foreground mb-2">
                      Behind-the-Scenes: How It All Works
                    </h3>
                    <p className="text-muted-foreground">
                      Our optimization engine follows a sophisticated process:
                    </p>
                  </div>
                  <ol className="space-y-2">
                    {behindTheScenes.map((step, index) => (
                      <li key={index} className="flex items-center gap-3 text-sm text-foreground">
                        <span className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center text-xs font-semibold text-primary">
                          {index + 1}
                        </span>
                        {step}
                      </li>
                    ))}
                  </ol>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* What We Measure */}
          <Card className="glass-panel animate-slide-up">
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-xl bg-success/10 shrink-0">
                  <TrendingUp className="h-6 w-6 text-success" />
                </div>
                <div className="space-y-4">
                  <div>
                    <h3 className="text-xl font-semibold text-foreground mb-2">
                      What We Measure (And Why It Matters)
                    </h3>
                    <p className="text-muted-foreground">
                      Key metrics we track to ensure optimal performance:
                    </p>
                  </div>
                  <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {measurements.map((metric, index) => (
                      <li key={index} className="flex items-center gap-2 text-sm text-foreground p-3 rounded-lg bg-muted/30">
                        <div className="w-2 h-2 rounded-full bg-success" />
                        {metric}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default HowItWorks;
