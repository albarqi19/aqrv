import { 
  Home, 
  Building2, 
  Users, 
  FileText, 
  TrendingUp, 
  Settings,
  BarChart3,
  Calendar,
  Bell,
  Menu,
  X
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useOverview } from "@/hooks/useApi";
import { formatCurrency } from "@/lib/utils-data";
import { useState } from "react";

const sidebarItems = [
  { icon: Home, label: "الرئيسية", active: true },
  { icon: Building2, label: "المباني", active: false },
  { icon: Users, label: "المستأجرين", active: false },
  { icon: FileText, label: "العقود", active: false },
  { icon: TrendingUp, label: "التقارير", active: false },
  { icon: BarChart3, label: "الإحصائيات", active: false },
  { icon: Calendar, label: "المواعيد", active: false },
  { icon: Bell, label: "التنبيهات", active: false },
  { icon: Settings, label: "الإعدادات", active: false },
];

interface ModernSidebarProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function ModernSidebar({ open, onOpenChange }: ModernSidebarProps) {
  const { data: overviewData } = useOverview();
  const [internalOpen, setInternalOpen] = useState(false);
  
  // Use external state if provided, otherwise use internal state
  const isOpen = open !== undefined ? open : internalOpen;
  const setIsOpen = onOpenChange || setInternalOpen;
  
  // Calculate monthly revenue growth (simplified - you might want to use dashboard API for real growth data)
  const currentRevenue = parseFloat(overviewData?.total_revenue || "0");

  return (
    <>
      {/* Mobile Menu Button - Hidden when using external control */}
      {open === undefined && (
        <Button
          variant="ghost"
          size="icon"
          className="fixed top-4 right-4 z-50 lg:hidden bg-background/80 backdrop-blur-sm border border-border/40"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </Button>
      )}

      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={cn(
        "w-80 h-screen bg-gradient-to-br from-background/95 to-background glass-card border-l border-border/40 transition-transform duration-300 z-40",
        // Desktop: always visible on the right
        "hidden lg:block lg:relative lg:border-r lg:border-l-0",
        // Mobile: slide in from right when open
        "lg:translate-x-0",
        isOpen ? "fixed left-0 top-0 translate-x-0" : "fixed -left-80 top-0"
      )}>
        <div className="p-8 h-full flex flex-col">
          {/* Header */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold gradient-text">عقاري</h2>
            <p className="text-sm text-muted-foreground">لوحة التحكم الذكية</p>
          </div>

          {/* Navigation */}
          <nav className="space-y-2 flex-1">
            {sidebarItems.map((item, index) => (
              <Button
                key={index}
                variant={item.active ? "default" : "ghost"}
                className={cn(
                  "w-full justify-start gap-3 h-12 text-right",
                  item.active && "bg-primary/10 text-primary border border-primary/20"
                )}
                onClick={() => setIsOpen(false)} // Close mobile menu on item click
              >
                <item.icon className="h-5 w-5" />
                {item.label}
              </Button>
            ))}
          </nav>

          {/* Bottom section */}
          <div className="mt-8 p-4 glass-card rounded-xl border border-accent/20">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-gradient-to-br from-accent to-warning rounded-full flex items-center justify-center">
                <TrendingUp className="h-5 w-5 text-accent-foreground" />
              </div>
              <div>
                <p className="font-semibold text-sm">الإيرادات الإجمالية</p>
                <p className="text-xs text-muted-foreground">
                  {formatCurrency(overviewData?.total_revenue || "0")}
                </p>
              </div>
            </div>
            
            <div className="w-full bg-muted rounded-full h-2">
              <div className="bg-gradient-to-r from-accent to-warning h-2 rounded-full w-3/4 pulse-glow" />
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}