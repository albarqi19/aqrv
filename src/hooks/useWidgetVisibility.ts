import { useState, useEffect } from 'react';

// Hook مخصص لإدارة إعدادات الإحصائيات
export const useWidgetVisibility = () => {
  const [settings, setSettings] = useState([]);
  const [enabledStats, setEnabledStats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const API_BASE = 'http://localhost:8001/api';

  // جلب جميع الإعدادات
  const fetchAllSettings = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE}/statistics-settings`);
      const data = await response.json();
      
      if (data.success) {
        setSettings(data.data);
      } else {
        setError('فشل في جلب الإعدادات');
      }
    } catch (err) {
      setError('خطأ في الاتصال: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  // جلب الإحصائيات المفعلة فقط
  const fetchEnabledStats = async () => {
    try {
      const response = await fetch(`${API_BASE}/statistics-settings/enabled`);
      const data = await response.json();
      
      if (data.success) {
        setEnabledStats(data.data);
      }
    } catch (err) {
      console.error('خطأ في جلب الإحصائيات المفعلة:', err);
    }
  };

  // تفعيل/إلغاء تفعيل إحصائية
  const toggleStatistic = async (statisticKey, isEnabled) => {
    try {
      const response = await fetch(`${API_BASE}/statistics-settings/toggle`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          statistic_key: statisticKey,
          is_enabled: isEnabled
        })
      });

      const data = await response.json();
      
      if (data.success) {
        // تحديث الحالة المحلية
        setSettings(prev => 
          prev.map(setting => 
            setting.statistic_key === statisticKey 
              ? { ...setting, is_enabled: isEnabled }
              : setting
          )
        );
        
        // إعادة جلب الإحصائيات المفعلة
        await fetchEnabledStats();
        
        return { success: true, message: data.message };
      } else {
        return { success: false, message: data.message };
      }
    } catch (err) {
      return { success: false, message: 'خطأ في الاتصال: ' + err.message };
    }
  };

  // التحقق من تفعيل إحصائية معينة
  const isVisible = (statisticKey) => {
    return enabledStats.includes(statisticKey);
  };

  // التحقق من تفعيل إحصائية معينة (نفس الفنكشن بأسماء مختلفة للتوافق)
  const isStatisticEnabled = (statisticKey) => {
    return enabledStats.includes(statisticKey);
  };

  useEffect(() => {
    fetchAllSettings();
    fetchEnabledStats();
  }, []);

  return {
    settings,
    enabledStats,
    loading,
    error,
    toggleStatistic,
    isVisible,
    isStatisticEnabled,
    fetchAllSettings,
    fetchEnabledStats,
    visibility: enabledStats.reduce((acc, key) => ({ ...acc, [key]: true }), {})
  };
};
