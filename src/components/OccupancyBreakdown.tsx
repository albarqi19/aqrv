import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useOccupancy } from '@/hooks/useApi';
import { PieChart, Building, Home, Wrench } from 'lucide-react';

export function OccupancyBreakdown() {
  const { data: occupancyData, isLoading } = useOccupancy();

  if (isLoading) {
    return (
      <Card className="glass-card border-accent/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <PieChart className="h-5 w-5" />
            توزيع حالة المحلات
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-3">
            <div className="h-4 bg-muted rounded w-3/4"></div>
            <div className="h-4 bg-muted rounded w-1/2"></div>
            <div className="h-4 bg-muted rounded w-2/3"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!occupancyData) {
    return (
      <Card className="glass-card border-accent/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <PieChart className="h-5 w-5" />
            توزيع حالة المحلات
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-center">لا توجد بيانات متاحة</p>
        </CardContent>
      </Card>
    );
  }

  const { shops_by_status, total_shops, occupancy_rate } = occupancyData;

  return (
    <Card className="glass-card border-accent/20">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <PieChart className="h-5 w-5" />
          توزيع حالة المحلات
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Overall Progress */}
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium">معدل الإشغال الإجمالي</span>
            <span className="text-sm text-muted-foreground">{occupancy_rate.toFixed(1)}%</span>
          </div>
          <Progress value={occupancy_rate} className="h-2" />
        </div>

        {/* Status Breakdown */}
        <div className="space-y-4">
          <div className="flex items-center justify-between p-3 rounded-lg bg-green-500/10 border border-green-500/20">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-500/20 rounded-lg">
                <Home className="h-4 w-4 text-green-600" />
              </div>
              <div>
                <p className="font-medium text-green-700">مؤجرة</p>
                <p className="text-xs text-green-600">نشطة ومدفوعة</p>
              </div>
            </div>
            <div className="text-left">
              <Badge variant="outline" className="bg-green-500/20 text-green-700 border-green-500/30">
                {shops_by_status.occupied}
              </Badge>
              <p className="text-xs text-green-600 mt-1">
                {((shops_by_status.occupied / total_shops) * 100).toFixed(1)}%
              </p>
            </div>
          </div>

          <div className="flex items-center justify-between p-3 rounded-lg bg-gray-500/10 border border-gray-500/20">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gray-500/20 rounded-lg">
                <Building className="h-4 w-4 text-gray-600" />
              </div>
              <div>
                <p className="font-medium text-gray-700">شاغرة</p>
                <p className="text-xs text-gray-600">متاحة للإيجار</p>
              </div>
            </div>
            <div className="text-left">
              <Badge variant="outline" className="bg-gray-500/20 text-gray-700 border-gray-500/30">
                {shops_by_status.vacant}
              </Badge>
              <p className="text-xs text-gray-600 mt-1">
                {((shops_by_status.vacant / total_shops) * 100).toFixed(1)}%
              </p>
            </div>
          </div>

          <div className="flex items-center justify-between p-3 rounded-lg bg-yellow-500/10 border border-yellow-500/20">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-yellow-500/20 rounded-lg">
                <Wrench className="h-4 w-4 text-yellow-600" />
              </div>
              <div>
                <p className="font-medium text-yellow-700">تحت الصيانة</p>
                <p className="text-xs text-yellow-600">غير متاحة مؤقتاً</p>
              </div>
            </div>
            <div className="text-left">
              <Badge variant="outline" className="bg-yellow-500/20 text-yellow-700 border-yellow-500/30">
                {shops_by_status.maintenance}
              </Badge>
              <p className="text-xs text-yellow-600 mt-1">
                {((shops_by_status.maintenance / total_shops) * 100).toFixed(1)}%
              </p>
            </div>
          </div>
        </div>

        {/* Summary */}
        <div className="pt-4 border-t border-border/40">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">إجمالي المحلات</span>
            <span className="font-medium">{total_shops}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
