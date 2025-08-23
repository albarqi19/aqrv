import { ModernStatCard } from "@/components/ModernStatCard";
import { ModernHeader } from "@/components/ModernHeader";
import { ModernRevenueChart } from "@/components/ModernRevenueChart";
import { ModernBuildingsList } from "@/components/ModernBuildingsList";
import { MobileErrorFallback } from "@/components/MobileErrorFallback";
import { useWidgetVisibility } from "@/hooks/useWidgetVisibility";
import { 
  Building2, 
  PieChart, 
  Banknote, 
  AlertTriangle,
  TrendingUp,
  Users,
  FileText,
  Target,
  Loader2
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { useOverview, useMonthlyRevenue, useBuildingPerformance, useOccupancy } from "@/hooks/useApi";
import { formatCurrency, formatNumber, formatPercentage, getStatusText } from "@/lib/utils-data";
import { OccupancyBreakdown } from "@/components/OccupancyBreakdown";

export default function ModernDashboard() {
  // Widget visibility control
  const { isVisible, loading: widgetLoading } = useWidgetVisibility();
  
  // Get real data from API
  const { data: overviewData, isLoading: overviewLoading, error: overviewError } = useOverview();
  const { data: revenueData, isLoading: revenueLoading } = useMonthlyRevenue();
  const { data: buildingData, isLoading: buildingLoading } = useBuildingPerformance();
  const { data: occupancyData, isLoading: occupancyLoading } = useOccupancy();

  // Show loading state
  if (overviewLoading || revenueLoading || buildingLoading || occupancyLoading || widgetLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center" dir="rtl">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin mx-auto mb-4 text-primary" />
          <h2 className="text-xl font-semibold mb-2">جاري تحميل البيانات...</h2>
          <p className="text-muted-foreground">يرجى الانتظار بينما نجمع أحدث المعلومات</p>
        </div>
      </div>
    );
  }

  // Show error state
  if (overviewError) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4" dir="rtl">
        <div className="w-full max-w-md">
          <MobileErrorFallback 
            error={overviewError}
            onRetry={() => window.location.reload()}
            title="فشل في تحميل البيانات"
            description="تعذر الاتصال بالخادم. قد تكون المشكلة في الشبكة أو الخادم."
          />
        </div>
      </div>
    );
  }

  // Format revenue data for chart
  const formattedRevenueData = revenueData ? revenueData.labels.map((label, index) => ({
    month: label,
    revenue: revenueData.revenues[index] || 0
  })) : [];

  // Format buildings data
  const formattedBuildingsData = buildingData?.buildings ? buildingData.buildings.map(building => ({
    id: building.id,
    name: building.name || 'مبنى غير محدد',
    revenue: formatCurrency(building.revenue.toString()), // الإيراد السنوي الكلي
    occupancy: formatPercentage(building.occupancy_rate),
    shops: `${building.occupied_shops || 0}/${building.total_shops || 0}`,
    status: getStatusText(building.occupancy_rate || 0) as "ممتاز" | "جيد" | "ضعيف",
    returnRate: `${(building.return_rate || 0).toFixed(2)}%`,
    // بيانات إضافية للـ Bottom Sheet
    buildingValue: building.building_value,
    paidRevenue: building.paid_revenue,
    paidReturnRate: building.paid_return_rate
  })) : [];

  // حساب إجمالي الإيراد السنوي
  const totalAnnualRevenue = buildingData?.buildings ? 
    buildingData.buildings.reduce((total, building) => total + (building.revenue || 0), 0) : 0;

  return (
    <div className="min-h-screen bg-background" dir="rtl">
      <ModernHeader />
      
      <main className="w-full p-4 lg:p-8 space-y-6 lg:space-y-8">
        {/* Welcome Section */}
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-accent/10 to-transparent rounded-3xl blur-3xl" />
          <Card className="relative glass-card border-primary/20 overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-accent/20 to-transparent rounded-full -translate-y-16 translate-x-16" />
            <CardContent className="p-4 lg:p-8">
              <div className="flex flex-col items-start justify-between gap-4">
                <div>
                  <h2 className="text-2xl lg:text-3xl font-bold mb-2 text-muted-foreground">
                    مرحباً بك في لوحة العرض
                  </h2>
                  <p className="text-base lg:text-lg text-muted-foreground">
                    إليك نظرة شاملة على أداء عقاراتك اليوم
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

          {/* Main Stats Grid - Overview Statistics */}
          {isVisible('overview') && (
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
              <ModernStatCard
                title="إجمالي المباني"
                value={overviewData?.total_buildings?.toString() || "0"}
                icon={Building2}
                variant="primary"
              />
              <ModernStatCard
                title="معدل الإشغال"
                value={formatPercentage(occupancyData?.occupancy_rate || 0)}
                icon={PieChart}
                variant="accent"
              />
              {/* <ModernStatCard
                title="الإيرادات الشهرية"
                value={formatCurrency(overviewData?.total_revenue || "0")}
                icon={Banknote}
                variant="success"
              /> */}
              <ModernStatCard
                title="المدفوعات المتأخرة"
                value={overviewData?.overdue_payments?.toString() || "0"}
                icon={AlertTriangle}
                variant="warning"
              />
            </div>
          )}

          {/* Secondary Stats - Collection Rates */}
          {isVisible('collection_rates') && (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
              <ModernStatCard
                title="إجمالي المحلات"
                value={overviewData?.total_shops?.toString() || "0"}
                icon={Target}
                variant="primary"
              />
              <ModernStatCard
                title="المستأجرين النشطين"
                value={overviewData?.total_tenants?.toString() || "0"}
                icon={Users}
                variant="accent"
              />
              <ModernStatCard
                title="العقود السارية"
                value={overviewData?.active_contracts?.toString() || "0"}
                icon={FileText}
                variant="success"
              />
              <ModernStatCard
                title="إجمالي الإيرادات السنوية"
                value={formatCurrency(totalAnnualRevenue.toString())}
                icon={TrendingUp}
                variant="warning"
              />
            </div>
          )}

          {/* Occupancy Breakdown */}
          {isVisible('occupancy') && (
            <OccupancyBreakdown />
          )}

          {/* Buildings List - Building Performance */}
          {isVisible('building_performance') && (
            <ModernBuildingsList buildings={formattedBuildingsData} />
          )}

          {/* Performance Overview - Annual Financial */}
          {isVisible('annual_financial') && (
            <Card className="glass-card border-accent/20">
              <CardContent className="p-4 lg:p-6">
                <h3 className="text-lg lg:text-xl font-bold mb-4 lg:mb-6 flex items-center gap-2">
                  <div className="p-2 bg-accent/10 rounded-lg">
                    <TrendingUp className="h-5 w-5 text-accent" />
                  </div>
                  نظرة عامة على الأداء
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-6">
                  <div className="flex items-center justify-between p-3 lg:p-4 glass-card rounded-lg border border-success/20">
                    <div>
                      <p className="font-semibold text-success text-sm lg:text-base">الإيرادات المحققة</p>
                      <p className="text-xs text-muted-foreground">إجمالي</p>
                    </div>
                    <div className="text-right">
                      <p className="text-lg lg:text-xl font-bold text-foreground">
                        {formatNumber(overviewData?.total_revenue || "0")}
                      </p>
                      <p className="text-xs text-success">﷼</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 lg:p-4 glass-card rounded-lg border border-accent/20">
                    <div>
                      <p className="font-semibold text-accent text-sm lg:text-base">معدل الإشغال</p>
                      <p className="text-xs text-muted-foreground">متوسط المباني</p>
                    </div>
                    <div className="text-right">
                      <p className="text-lg lg:text-xl font-bold text-foreground">
                        {formatPercentage(occupancyData?.occupancy_rate || 0)}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 lg:p-4 glass-card rounded-lg border border-primary/20">
                    <div>
                      <p className="font-semibold text-primary text-sm lg:text-base">المحلات النشطة</p>
                      <p className="text-xs text-muted-foreground">من أصل {occupancyData?.total_shops || 0}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-lg lg:text-xl font-bold text-foreground">
                        {occupancyData?.occupied_shops || 0}
                      </p>
                      <p className="text-xs text-primary">مؤجرة</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Charts Section */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 lg:gap-8">
            {/* Monthly Revenue Chart - Hidden */}
            {/* {isVisible('monthly_revenue') && (
              <div className="xl:col-span-3">
                <ModernRevenueChart 
                  data={formattedRevenueData}
                  title="تطور الإيرادات"
                />
              </div>
            )} */}
          </div>
        </main>
    </div>
  );
}