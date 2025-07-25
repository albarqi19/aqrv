import { useState, useEffect } from 'react';
import { PinInput } from './PinInput';
import WelcomeScreen from './WelcomeScreen';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [showWelcome, setShowWelcome] = useState(false);

  useEffect(() => {
    // التحقق من وجود مصادقة مسبقة في localStorage
    const authStatus = localStorage.getItem('aqari-authenticated');
    const authTimestamp = localStorage.getItem('aqari-auth-timestamp');
    
    if (authStatus === 'true' && authTimestamp) {
      const now = Date.now();
      const authTime = parseInt(authTimestamp);
      const hoursPassed = (now - authTime) / (1000 * 60 * 60);
      
      // انتهاء صلاحية المصادقة بعد 24 ساعة
      if (hoursPassed < 24) {
        setIsAuthenticated(true);
      } else {
        // إزالة المصادقة المنتهية الصلاحية
        localStorage.removeItem('aqari-authenticated');
        localStorage.removeItem('aqari-auth-timestamp');
      }
    }
    
    setIsLoading(false);
  }, []);

  const handleAuthSuccess = () => {
    setIsAuthenticated(true);
    setShowWelcome(true);
    // حفظ حالة المصادقة مع الوقت الحالي
    localStorage.setItem('aqari-authenticated', 'true');
    localStorage.setItem('aqari-auth-timestamp', Date.now().toString());
  };

  const handleWelcomeComplete = () => {
    setShowWelcome(false);
  };

  // شاشة تحميل بسيطة
  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">جاري التحميل...</p>
        </div>
      </div>
    );
  }

  // إذا لم يتم التصديق، اعرض شاشة الرقم السري
  if (!isAuthenticated) {
    return <PinInput onSuccess={handleAuthSuccess} />;
  }

  // إذا تم التصديق ولكن لم تكتمل شاشة الترحيب بعد
  if (showWelcome) {
    return <WelcomeScreen onComplete={handleWelcomeComplete} />;
  }

  // إذا تم التصديق واكتملت شاشة الترحيب، اعرض المحتوى المحمي
  return <>{children}</>;
}
