import { useState, useRef, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Lock } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useTheme } from '@/components/theme-provider';

interface PinInputProps {
  onSuccess: () => void;
}

export function PinInput({ onSuccess }: PinInputProps) {
  const [pin, setPin] = useState(['', '', '', '']);
  const [isError, setIsError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const { theme } = useTheme();

  const correctPin = '1234'; // يمكنك تغيير الرقم السري هنا

  // تحديد الشعار المناسب حسب الثيم
  const logoSrc = theme === 'dark' ? '/logo-dark.gif' : '/logo-light.gif';

  useEffect(() => {
    // التركيز على أول خانة عند التحميل
    inputRefs.current[0]?.focus();
  }, []);

  const handleInputChange = (index: number, value: string) => {
    if (value.length > 1) return; // السماح برقم واحد فقط
    if (!/^\d*$/.test(value)) return; // السماح بالأرقام فقط

    const newPin = [...pin];
    newPin[index] = value;
    setPin(newPin);
    setIsError(false);

    // الانتقال للخانة التالية
    if (value && index < 3) {
      inputRefs.current[index + 1]?.focus();
    }

    // التحقق من الرقم السري عند إكمال 4 أرقام
    if (index === 3 && value) {
      const fullPin = newPin.join('');
      checkPin(fullPin);
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !pin[index] && index > 0) {
      // الانتقال للخانة السابقة عند الحذف
      inputRefs.current[index - 1]?.focus();
    }
  };

  const checkPin = async (enteredPin: string) => {
    setIsLoading(true);
    
    // محاكاة تأخير للتحقق
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    if (enteredPin === correctPin) {
      onSuccess();
    } else {
      setIsError(true);
      clearPin();
      setTimeout(() => setIsError(false), 2000);
    }
    
    setIsLoading(false);
  };

  const clearPin = () => {
    setPin(['', '', '', '']);
    inputRefs.current[0]?.focus();
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4" dir="rtl">
      <div className="w-full max-w-md">
        {/* Logo والترحيب */}
        <div className="text-center mb-8">
          <div className="mx-auto mb-6 w-48 h-48">
            {/* الشعار المتحرك فقط */}
            <img 
              src={logoSrc}
              alt="شعار عقاري"
              className="h-48 w-48 mx-auto object-contain"
              onError={(e) => {
                // في حالة فشل تحميل الصورة، إخفاؤها
                e.currentTarget.style.display = 'none';
              }}
            />
          </div>
          <p className="text-lg text-muted-foreground font-medium">نظام إدارة العقارات</p>
        </div>

        {/* بطاقة إدخال الرقم السري */}
        <Card className="glass-card border-primary/20">
          <CardContent className="p-8">
            <div className="text-center mb-6">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-4">
                <Lock className="h-8 w-8 text-primary" />
              </div>
              <h2 className="text-xl font-bold mb-2">أدخل الرقم السري</h2>
              <p className="text-sm text-muted-foreground">
                يرجى إدخال الرقم السري المكون من 4 أرقام باستخدام الكيبورد
              </p>
            </div>

            {/* خانات إدخال الرقم السري */}
            <div className="flex justify-center gap-4 mb-6">
              {pin.map((digit, index) => (
                <input
                  key={index}
                  ref={(el) => (inputRefs.current[index] = el)}
                  type="text"
                  value={digit}
                  onChange={(e) => handleInputChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  className={cn(
                    "w-14 h-14 text-center text-2xl font-bold rounded-xl border-2 transition-all duration-300",
                    "focus:outline-none focus:ring-2 focus:ring-primary/50",
                    isError 
                      ? "border-destructive bg-destructive/10 animate-pulse" 
                      : "border-border bg-background hover:border-primary/40",
                    isLoading && "opacity-50 cursor-not-allowed"
                  )}
                  maxLength={1}
                  disabled={isLoading}
                />
              ))}
            </div>

            {/* رسالة الخطأ */}
            {isError && (
              <div className="text-center mb-4">
                <p className="text-destructive text-sm font-medium">
                  ❌ الرقم السري غير صحيح. حاول مرة أخرى
                </p>
              </div>
            )}

            {/* مؤشر التحميل */}
            {isLoading && (
              <div className="flex items-center justify-center gap-2 text-primary">
                <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
                <span className="text-sm font-medium">جاري التحقق...</span>
              </div>
            )}
          </CardContent>
        </Card>

        {/* تلميح */}
        <div className="text-center mt-6">
          <p className="text-xs text-muted-foreground">
            💡 تلميح: الرقم السري الافتراضي هو 1234
          </p>
        </div>
      </div>
    </div>
  );
}
