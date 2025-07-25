import { Bell, User, Settings, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ThemeToggle } from "@/components/theme-toggle";
import { useTheme } from "@/components/theme-provider";

export function ModernHeader() {
  const { theme } = useTheme();
  
  // تحديد صورة اسم الموقع المناسبة حسب الثيم
  const siteNameSrc = theme === 'dark' ? '/site-name-dark.png' : '/site-name-light.png';

  const handleLogout = () => {
    // إزالة بيانات المصادقة
    localStorage.removeItem('aqari-authenticated');
    localStorage.removeItem('aqari-auth-timestamp');
    // إعادة تحميل الصفحة للعودة إلى شاشة الرقم السري
    window.location.reload();
  };

  return (
    <header className="glass-card border-b border-border/40 sticky top-0 z-50 backdrop-blur-xl">
      <div className="flex items-center justify-between px-4 lg:px-6 py-3 lg:py-4">
        {/* Logo & Title */}
        <div className="flex items-center gap-2 lg:gap-4">
          <img 
            src={siteNameSrc}
            alt="اسم الموقع"
            className="h-10 lg:h-12 object-contain"
            onError={(e) => {
              e.currentTarget.style.display = 'none';
            }}
          />
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 lg:gap-3">
          {/* Theme Toggle */}
          <ThemeToggle />
          
          {/* Notifications */}
          <Button variant="ghost" size="icon" className="hover:bg-primary/10">
            <Bell className="h-4 w-4 lg:h-5 lg:w-5" />
          </Button>
          
          {/* Settings */}
          <Button variant="ghost" size="icon" className="hover:bg-primary/10 hidden sm:flex">
            <Settings className="h-4 w-4 lg:h-5 lg:w-5" />
          </Button>
          
          {/* User Profile */}
          <Button variant="ghost" className="gap-2 hover:bg-primary/10 p-2 lg:px-3">
            <User className="h-4 w-4 lg:h-5 lg:w-5" />
            <span className="hidden md:block text-sm">أحمد محمد</span>
          </Button>

          {/* Logout */}
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={handleLogout}
            className="hover:bg-destructive/10 hover:text-destructive transition-colors"
            title="تسجيل الخروج"
          >
            <LogOut className="h-4 w-4 lg:h-5 lg:w-5" />
          </Button>
        </div>
      </div>
    </header>
  );
}