import { LucideIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface ModernStatCardProps {
  title: string;
  value: string;
  icon: LucideIcon;
  variant?: "primary" | "accent" | "success" | "warning";
  change?: {
    value: number;
    type: "increase" | "decrease";
  };
}

const cardVariants = {
  primary: "glass-card border-primary/20 hover:border-primary/40",
  accent: "glass-card border-accent/20 hover:border-accent/40", 
  success: "glass-card border-success/20 hover:border-success/40",
  warning: "glass-card border-warning/20 hover:border-warning/40",
};

const iconVariants = {
  primary: "text-primary bg-primary/10",
  accent: "text-accent bg-accent/10",
  success: "text-success bg-success/10", 
  warning: "text-warning bg-warning/10",
};

const iconBackgroundVariants = {
  primary: "text-primary/20",
  accent: "text-accent/20",
  success: "text-success/20", 
  warning: "text-warning/20",
};

export function ModernStatCard({ 
  title, 
  value, 
  icon: Icon, 
  variant = "primary",
  change 
}: ModernStatCardProps) {
  return (
    <Card className={cn(
      "card-hover group relative overflow-hidden",
      cardVariants[variant]
    )}>
      {/* Animated background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-transparent via-primary/5 to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      
      {/* Background Icon */}
      <div className="absolute -top-4 -right-4 opacity-50">
        <Icon className={cn(
          "h-24 w-24 lg:h-32 lg:w-32 transition-all duration-500 group-hover:scale-110 group-hover:rotate-12",
          iconBackgroundVariants[variant]
        )} />
      </div>
      
      <CardContent className="p-3 lg:p-6 relative z-10">
        <div className="flex items-start justify-between mb-3 lg:mb-6">
          <div className="flex-1">
            {change && (
              <div className={cn(
                "inline-flex px-2 lg:px-3 py-1 rounded-full text-xs lg:text-sm font-semibold mb-2",
                change.type === "increase" 
                  ? "bg-success/10 text-success" 
                  : "bg-destructive/10 text-destructive"
              )}>
                {change.type === "increase" ? "+" : "-"}{Math.abs(change.value)}%
              </div>
            )}
          </div>
        </div>
        
        <div className="space-y-1 lg:space-y-3">
          <h3 className="text-base lg:text-lg font-medium text-foreground/90 dark:text-muted-foreground/80 leading-tight">
            {title}
          </h3>
          <p className="text-2xl lg:text-3xl xl:text-4xl font-bold bg-gradient-to-br from-foreground to-foreground/70 bg-clip-text text-transparent leading-tight">
            {value}
          </p>
        </div>
        
        {/* Glowing bottom border on hover */}
        <div className={cn(
          "absolute bottom-0 left-0 h-1 w-0 transition-all duration-500 group-hover:w-full",
          variant === "primary" && "bg-gradient-to-r from-primary to-primary/60",
          variant === "accent" && "bg-gradient-to-r from-accent to-accent/60",
          variant === "success" && "bg-gradient-to-r from-success to-success/60",
          variant === "warning" && "bg-gradient-to-r from-warning to-warning/60"
        )} />
      </CardContent>
    </Card>
  );
}