import { Line, LineChart, ResponsiveContainer, XAxis, YAxis, CartesianGrid, Tooltip, Area, AreaChart } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp } from "lucide-react";

interface ModernChartData {
  month: string;
  revenue: number;
}

interface ModernRevenueChartProps {
  data: ModernChartData[];
  title: string;
}

export function ModernRevenueChart({ data, title }: ModernRevenueChartProps) {
  const formatCurrency = (value: number) => {
    return `${(value / 1000).toFixed(0)}ك ﷼`;
  };

  // Handle empty data
  if (!data || data.length === 0) {
    return (
      <Card className="glass-card border-primary/20">
        <CardHeader className="pb-4">
          <CardTitle className="text-xl font-bold flex items-center gap-2">
            <div className="p-2 bg-primary/10 rounded-lg">
              <TrendingUp className="h-5 w-5 text-primary" />
            </div>
            {title}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-[350px]">
            <p className="text-muted-foreground">لا توجد بيانات متاحة</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Calculate statistics from data
  const revenues = data.map(item => item.revenue).filter(revenue => !isNaN(revenue));
  const maxRevenue = revenues.length > 0 ? Math.max(...revenues) : 0;
  const minRevenue = revenues.length > 0 ? Math.min(...revenues) : 0;
  const avgRevenue = revenues.length > 0 ? (revenues.reduce((sum, revenue) => sum + revenue, 0) / revenues.length) : 0;
  
  // Calculate growth (comparing last month to first month)
  const growth = revenues.length > 1 && revenues[0] !== 0
    ? ((revenues[revenues.length - 1] - revenues[0]) / revenues[0] * 100)
    : 0;

  return (
    <Card className="glass-card border-primary/20 group hover:border-primary/40 transition-all duration-500">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl font-bold flex items-center gap-2">
            <div className="p-2 bg-primary/10 rounded-lg group-hover:bg-primary/20 transition-colors">
              <TrendingUp className="h-5 w-5 text-primary" />
            </div>
            {title}
          </CardTitle>
          <div className="text-right">
            <p className="text-2xl font-bold text-foreground">
              {growth > 0 ? '+' : ''}{growth.toFixed(1)}%
            </p>
            <p className="text-xs text-muted-foreground">نمو سنوي</p>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="p-4 lg:p-6">
        <ResponsiveContainer width="100%" height={300} className="lg:!h-[350px]">
          <AreaChart data={data} margin={{ top: 10, right: 15, left: 0, bottom: 0 }} className="lg:!ml-[30px]">
            <defs>
              <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(270, 91%, 65%)" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="hsl(270, 91%, 65%)" stopOpacity={0.1}/>
              </linearGradient>
              <linearGradient id="lineGradient" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="hsl(270, 91%, 65%)" />
                <stop offset="100%" stopColor="hsl(45, 93%, 58%)" />
              </linearGradient>
            </defs>
            
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(240, 15%, 15%)" />
            
            <XAxis 
              dataKey="month" 
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fill: 'hsl(240, 5%, 65%)' }}
            />
            
            <YAxis 
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fill: 'hsl(240, 5%, 65%)' }}
              tickFormatter={formatCurrency}
            />
            
            <Tooltip
              formatter={(value: number) => [formatCurrency(value), "الإيراد"]}
              labelStyle={{ color: 'hsl(0, 0%, 95%)', textAlign: 'right' }}
              contentStyle={{
                backgroundColor: 'hsl(240, 15%, 8%)',
                border: '1px solid hsl(270, 91%, 65%, 0.3)',
                borderRadius: '12px',
                boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
                backdropFilter: 'blur(20px)'
              }}
            />
            
            <Area
              type="monotone"
              dataKey="revenue"
              stroke="url(#lineGradient)"
              strokeWidth={3}
              fill="url(#revenueGradient)"
              dot={{ fill: 'hsl(270, 91%, 65%)', strokeWidth: 2, r: 5 }}
              activeDot={{ 
                r: 8, 
                stroke: 'hsl(270, 91%, 65%)', 
                strokeWidth: 3,
                fill: 'hsl(45, 93%, 58%)',
                filter: 'drop-shadow(0 0 8px hsl(270, 91%, 65%))'
              }}
            />
          </AreaChart>
        </ResponsiveContainer>
        
        {/* Floating stats */}
        <div className="flex justify-between mt-4 pt-4 border-t border-border/40">
          <div className="text-center">
            <p className="text-xs text-muted-foreground">أعلى قيمة</p>
            <p className="font-bold text-accent">{formatCurrency(maxRevenue)}</p>
          </div>
          <div className="text-center">
            <p className="text-xs text-muted-foreground">المتوسط</p>
            <p className="font-bold text-primary">{formatCurrency(avgRevenue)}</p>
          </div>
          <div className="text-center">
            <p className="text-xs text-muted-foreground">أقل قيمة</p>
            <p className="font-bold text-muted-foreground">{formatCurrency(minRevenue)}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}