import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Wifi, WifiOff, RefreshCw } from 'lucide-react';
import { apiClient } from '@/lib/api';

export function ApiStatus() {
  const [status, setStatus] = useState<'connecting' | 'connected' | 'disconnected'>('connecting');
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);

  const checkApiStatus = async () => {
    try {
      setStatus('connecting');
      await apiClient.getOverview();
      setStatus('connected');
      setLastUpdate(new Date());
    } catch (error) {
      setStatus('disconnected');
      console.error('API connection failed:', error);
    }
  };

  useEffect(() => {
    checkApiStatus();
    const interval = setInterval(checkApiStatus, 30000); // Check every 30 seconds
    return () => clearInterval(interval);
  }, []);

  const getStatusColor = () => {
    switch (status) {
      case 'connected': return 'bg-green-500';
      case 'disconnected': return 'bg-red-500';
      case 'connecting': return 'bg-yellow-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusText = () => {
    switch (status) {
      case 'connected': return 'متصل';
      case 'disconnected': return 'غير متصل';
      case 'connecting': return 'جاري الاتصال...';
      default: return 'غير معروف';
    }
  };

  const getStatusIcon = () => {
    switch (status) {
      case 'connected': return <Wifi className="h-4 w-4" />;
      case 'disconnected': return <WifiOff className="h-4 w-4" />;
      case 'connecting': return <RefreshCw className="h-4 w-4 animate-spin" />;
      default: return <WifiOff className="h-4 w-4" />;
    }
  };

  return (
    <Card className="glass-card border-primary/20">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-medium flex items-center gap-2">
          {getStatusIcon()}
          حالة الاتصال بالخادم
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between">
          <Badge variant="outline" className={`${getStatusColor()} text-white border-none`}>
            {getStatusText()}
          </Badge>
          {lastUpdate && (
            <span className="text-xs text-muted-foreground">
              آخر تحديث: {lastUpdate.toLocaleTimeString('ar-SA')}
            </span>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
