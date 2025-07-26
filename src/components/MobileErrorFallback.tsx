import React from 'react';
import { AlertTriangle, RefreshCw, Wifi } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface MobileErrorFallbackProps {
  error?: Error;
  onRetry?: () => void;
  title?: string;
  description?: string;
}

export function MobileErrorFallback({ 
  error, 
  onRetry, 
  title = "مشكلة في الاتصال",
  description = "يبدو أن هناك مشكلة في تحميل البيانات. قد تكون هذه مشكلة شبكة أو خادم."
}: MobileErrorFallbackProps) {
  
  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  
  return (
    <Card className="border-destructive/50 bg-destructive/5" dir="rtl">
      <CardHeader className="text-center">
        <div className="mx-auto mb-2">
          {isMobile ? (
            <Wifi className="h-12 w-12 text-destructive" />
          ) : (
            <AlertTriangle className="h-12 w-12 text-destructive" />
          )}
        </div>
        <CardTitle className="text-destructive">{title}</CardTitle>
      </CardHeader>
      <CardContent className="text-center space-y-4">
        <p className="text-muted-foreground text-sm">
          {description}
        </p>
        
        {isMobile && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 text-sm">
            <p className="text-yellow-800 font-medium mb-1">نصائح للجوال:</p>
            <ul className="text-yellow-700 text-xs space-y-1 text-right">
              <li>• تأكد من اتصالك بالإنترنت</li>
              <li>• جرب إعادة تحديث الصفحة</li>
              <li>• تأكد من تمكين JavaScript</li>
              <li>• قد تحتاج إلى تفعيل HTTPS</li>
            </ul>
          </div>
        )}
        
        {error && (
          <details className="text-left">
            <summary className="cursor-pointer text-xs text-muted-foreground hover:text-foreground">
              تفاصيل الخطأ التقنية
            </summary>
            <pre className="mt-2 text-xs bg-muted p-2 rounded overflow-auto">
              {error.message}
            </pre>
          </details>
        )}
        
        {onRetry && (
          <Button 
            onClick={onRetry} 
            variant="outline" 
            size="sm"
            className="gap-2"
          >
            <RefreshCw className="h-4 w-4" />
            إعادة المحاولة
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
