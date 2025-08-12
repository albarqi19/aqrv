import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Building2, TrendingUp, Users, Eye, MoreVertical, DollarSign, PieChart, Calculator } from "lucide-react";
import { useState } from "react";
import { formatCurrency } from "@/lib/utils-data";

interface ModernBuilding {
  id: number;
  name: string;
  revenue: string;
  occupancy: string;
  shops: string;
  status: "ممتاز" | "جيد" | "ضعيف";
  returnRate: string;
  buildingValue: string;
  paidRevenue: number;
  paidReturnRate: number;
}

interface ModernBuildingsListProps {
  buildings: ModernBuilding[];
}

const getStatusConfig = (status: string) => {
  switch (status) {
    case "ممتاز":
      return { 
        color: "bg-success/10 text-success border-success/20",
        glow: "shadow-[0_0_20px_hsl(142,76%,45%,0.3)]"
      };
    case "جيد":
      return { 
        color: "bg-accent/10 text-accent border-accent/20",
        glow: "shadow-[0_0_20px_hsl(45,93%,58%,0.3)]"
      };
    case "ضعيف":
      return { 
        color: "bg-destructive/10 text-destructive border-destructive/20",
        glow: "shadow-[0_0_20px_hsl(0,85%,65%,0.3)]"
      };
    default:
      return { 
        color: "bg-muted/10 text-muted-foreground border-muted/20",
        glow: ""
      };
  }
};

export function ModernBuildingsList({ buildings }: ModernBuildingsListProps) {
  const [selectedBuilding, setSelectedBuilding] = useState<ModernBuilding | null>(null);
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  const handleBuildingClick = (building: ModernBuilding) => {
    setSelectedBuilding(building);
    setIsSheetOpen(true);
  };

  return (
    <>
      <Card className="glass-card border-primary/20">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg lg:text-xl font-bold flex items-center gap-2 lg:gap-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Building2 className="h-5 w-5 lg:h-6 lg:w-6 text-primary" />
            </div>
            <span className="hidden sm:inline">المباني العقارية</span>
            <span className="sm:hidden">المباني</span>
          </CardTitle>
          <Button variant="outline" size="sm" className="gap-2 text-xs lg:text-sm px-2 lg:px-3">
            <Eye className="h-3 w-3 lg:h-4 lg:w-4" />
            <span className="hidden sm:inline">عرض الكل</span>
            <span className="sm:hidden">الكل</span>
          </Button>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {buildings.map((building, index) => {
          const statusConfig = getStatusConfig(building.status);
          
          return (
            <div
              key={building.id}
              className="group relative glass-card rounded-xl p-4 lg:p-6 border border-border/40 hover:border-primary/40 transition-all duration-500 hover:-translate-y-1 cursor-pointer"
              style={{ animationDelay: `${index * 100}ms` }}
              onClick={() => handleBuildingClick(building)}
            >
              {/* Background glow effect */}
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              
              <div className="relative z-10">
                {/* Header */}
                <div className="flex items-start justify-between mb-3 lg:mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 lg:gap-3 mb-2">
                      <h3 className="text-base lg:text-lg font-bold">{building.name}</h3>
                      <div className="flex items-center gap-2">
                        <Badge className={`${statusConfig.color} ${statusConfig.glow} text-xs px-2 py-1`}>
                          {building.status}
                        </Badge>
                        <Badge className="bg-primary/10 text-primary border-primary/20 text-xs px-2 py-1">
                          العائد السنوي: {building.returnRate}
                        </Badge>
                      </div>
                    </div>
                    <p className="text-xs lg:text-sm text-muted-foreground">المبنى رقم {building.id}</p>
                  </div>
                  
                  <Button variant="ghost" size="icon" className="opacity-0 group-hover:opacity-100 transition-opacity h-8 w-8 lg:h-10 lg:w-10">
                    <MoreVertical className="h-3 w-3 lg:h-4 lg:w-4" />
                  </Button>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-3 gap-2 lg:gap-4">
                  <div className="text-center p-2 lg:p-4 glass-card rounded-lg border border-success/20 group-hover:border-success/40 transition-colors">
                    <TrendingUp className="h-4 w-4 lg:h-5 lg:w-5 text-success mx-auto mb-1 lg:mb-2" />
                    <p className="text-xs text-muted-foreground mb-1">الإيراد السنوي</p>
                    <p className="font-bold text-xs lg:text-sm text-foreground/90">{building.revenue}</p>
                  </div>
                  
                  <div className="text-center p-2 lg:p-4 glass-card rounded-lg border border-accent/20 group-hover:border-accent/40 transition-colors">
                    <Users className="h-4 w-4 lg:h-5 lg:w-5 text-accent mx-auto mb-1 lg:mb-2" />
                    <p className="text-xs text-muted-foreground mb-1">الإشغال</p>
                    <p className="font-bold text-xs lg:text-sm text-foreground">{building.occupancy}</p>
                  </div>
                  
                  <div className="text-center p-2 lg:p-4 glass-card rounded-lg border border-primary/20 group-hover:border-primary/40 transition-colors">
                    <Building2 className="h-4 w-4 lg:h-5 lg:w-5 text-primary mx-auto mb-1 lg:mb-2" />
                    <p className="text-xs text-muted-foreground mb-1">المحلات</p>
                    <p className="font-bold text-xs lg:text-sm text-foreground">{building.shops}</p>
                  </div>
                </div>

                {/* Progress bar */}
                <div className="mt-3 lg:mt-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-xs text-muted-foreground">معدل الأداء</span>
                    <span className="text-xs font-semibold">{building.occupancy}</span>
                  </div>
                  <div className="w-full bg-muted/50 rounded-full h-1.5 lg:h-2">
                    <div 
                      className="bg-gradient-to-r from-primary to-accent h-1.5 lg:h-2 rounded-full transition-all duration-1000 ease-out"
                      style={{ width: building.occupancy }}
                    />
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>

    {/* Bottom Sheet للمعلومات التفصيلية */}
    <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
      <SheetContent side="bottom" className="h-[80vh] rounded-t-3xl border-t-primary/20" dir="rtl">
        <SheetHeader className="text-center">
          <SheetTitle className="text-xl font-bold">
            {selectedBuilding?.name}
          </SheetTitle>
        </SheetHeader>
        
        {selectedBuilding && (
          <div className="mt-6 space-y-6">
            {/* معلومات أساسية */}
            <div className="grid grid-cols-2 gap-4">
              <Card className="glass-card p-4">
                <div className="flex items-center gap-3 mb-2">
                  <DollarSign className="h-5 w-5 text-success" />
                  <span className="text-sm text-muted-foreground">الإيراد السنوي</span>
                </div>
                <p className="text-lg font-bold text-foreground/90">{selectedBuilding.revenue}</p>
              </Card>

              <Card className="glass-card p-4">
                <div className="flex items-center gap-3 mb-2">
                  <Calculator className="h-5 w-5 text-primary" />
                  <span className="text-sm text-muted-foreground">قيمة المبنى</span>
                </div>
                <p className="text-lg font-bold text-foreground/90">{formatCurrency(selectedBuilding.buildingValue)}</p>
              </Card>
            </div>

            {/* معلومات العائد */}
            <div className="grid grid-cols-2 gap-4">
              <Card className="glass-card p-4">
                <div className="flex items-center gap-3 mb-2">
                  <TrendingUp className="h-5 w-5 text-accent" />
                  <span className="text-sm text-muted-foreground">معدل العائد السنوي</span>
                </div>
                <p className="text-lg font-bold text-foreground/90">{selectedBuilding.returnRate}</p>
              </Card>

              <Card className="glass-card p-4">
                <div className="flex items-center gap-3 mb-2">
                  <PieChart className="h-5 w-5 text-warning" />
                  <span className="text-sm text-muted-foreground">الإيراد المدفوع</span>
                </div>
                <p className="text-lg font-bold text-foreground/90">{formatCurrency(selectedBuilding.paidRevenue.toString())}</p>
              </Card>
            </div>

            {/* معلومات الإشغال */}
            <Card className="glass-card p-4">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <Users className="h-5 w-5 text-primary" />
                  <span className="text-sm text-muted-foreground">معلومات الإشغال</span>
                </div>
                <Badge className={`${getStatusConfig(selectedBuilding.status).color}`}>
                  {selectedBuilding.status}
                </Badge>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm">المحلات المشغولة</span>
                  <span className="font-semibold">{selectedBuilding.shops}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">نسبة الإشغال</span>
                  <span className="font-semibold">{selectedBuilding.occupancy}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">معدل العائد المدفوع</span>
                  <span className="font-semibold">{selectedBuilding.paidReturnRate.toFixed(2)}%</span>
                </div>
              </div>
            </Card>
          </div>
        )}
      </SheetContent>
    </Sheet>
    </>
  );
}