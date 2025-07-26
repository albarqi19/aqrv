import React, { useState, useEffect } from 'react';

// Hook مخصص لإدارة إعدادات الإحصائيات
const useStatisticsSettings = () => {
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
    isStatisticEnabled,
    fetchAllSettings,
    fetchEnabledStats
  };
};

// مكون لوحة تحكم الإعدادات (للمديرين)
const StatisticsSettingsPanel = () => {
  const { 
    settings, 
    loading, 
    error, 
    toggleStatistic 
  } = useStatisticsSettings();

  const [message, setMessage] = useState('');

  const handleToggle = async (statisticKey, currentStatus) => {
    const result = await toggleStatistic(statisticKey, !currentStatus);
    setMessage(result.message);
    
    // إخفاء الرسالة بعد 3 ثوان
    setTimeout(() => setMessage(''), 3000);
  };

  if (loading) return <div className="loading">جاري التحميل...</div>;
  if (error) return <div className="error">خطأ: {error}</div>;

  return (
    <div className="statistics-settings-panel">
      <h2>⚙️ إعدادات الإحصائيات</h2>
      <p>يمكنك التحكم في الإحصائيات التي تظهر في الواجهة الأمامية</p>
      
      {message && (
        <div className={`message ${message.includes('نجح') ? 'success' : 'error'}`}>
          {message}
        </div>
      )}

      <div className="settings-grid">
        {settings.map(setting => (
          <div key={setting.id} className={`setting-card ${setting.is_enabled ? 'enabled' : 'disabled'}`}>
            <div className="setting-header">
              <h3>{setting.statistic_name_ar}</h3>
              <label className="toggle-switch">
                <input
                  type="checkbox"
                  checked={setting.is_enabled}
                  onChange={() => handleToggle(setting.statistic_key, setting.is_enabled)}
                />
                <span className="slider"></span>
              </label>
            </div>
            
            <div className="setting-details">
              <p className="description">{setting.description}</p>
              <div className="metadata">
                <span className="key">🔑 {setting.statistic_key}</span>
                <span className="order">📊 ترتيب: {setting.display_order}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// مكون عرض الإحصائيات (للمستخدمين)
const StatisticsDashboard = () => {
  const { enabledStats, loading, isStatisticEnabled } = useStatisticsSettings();
  const [statisticsData, setStatisticsData] = useState({});

  // محاكاة جلب بيانات الإحصائيات
  const fetchStatisticData = async (statKey) => {
    try {
      // هنا ستستدعي الـ endpoint الحقيقي للإحصائية
      const response = await fetch(`http://localhost:8001/api/statistics/${statKey}`);
      const data = await response.json();
      return data;
    } catch (err) {
      console.error(`خطأ في جلب إحصائية ${statKey}:`, err);
      return null;
    }
  };

  useEffect(() => {
    // جلب بيانات الإحصائيات المفعلة فقط
    enabledStats.forEach(async (statKey) => {
      const data = await fetchStatisticData(statKey);
      if (data) {
        setStatisticsData(prev => ({
          ...prev,
          [statKey]: data
        }));
      }
    });
  }, [enabledStats]);

  if (loading) return <div className="loading">جاري تحميل لوحة التحكم...</div>;

  return (
    <div className="statistics-dashboard">
      <h1>📊 لوحة معلومات الإحصائيات</h1>
      
      {enabledStats.length === 0 ? (
        <div className="no-statistics">
          <p>لا توجد إحصائيات مفعلة للعرض</p>
        </div>
      ) : (
        <div className="statistics-grid">
          {/* الإحصائيات العامة */}
          {isStatisticEnabled('overview') && (
            <div className="stat-card overview">
              <h3>📈 الإحصائيات العامة</h3>
              <div className="stat-content">
                {statisticsData.overview ? (
                  <div>بيانات الإحصائيات العامة</div>
                ) : (
                  <div className="loading-stat">جاري التحميل...</div>
                )}
              </div>
            </div>
          )}

          {/* إحصائيات الإشغال */}
          {isStatisticEnabled('occupancy') && (
            <div className="stat-card occupancy">
              <h3>🏢 إحصائيات الإشغال</h3>
              <div className="stat-content">
                {statisticsData.occupancy ? (
                  <div>بيانات إحصائيات الإشغال</div>
                ) : (
                  <div className="loading-stat">جاري التحميل...</div>
                )}
              </div>
            </div>
          )}

          {/* الإيرادات الشهرية */}
          {isStatisticEnabled('monthly_revenue') && (
            <div className="stat-card revenue">
              <h3>💰 الإيرادات الشهرية</h3>
              <div className="stat-content">
                {statisticsData.monthly_revenue ? (
                  <div>بيانات الإيرادات الشهرية</div>
                ) : (
                  <div className="loading-stat">جاري التحميل...</div>
                )}
              </div>
            </div>
          )}

          {/* معدلات التحصيل */}
          {isStatisticEnabled('collection_rates') && (
            <div className="stat-card collection">
              <h3>📊 معدلات التحصيل</h3>
              <div className="stat-content">
                {statisticsData.collection_rates ? (
                  <div>بيانات معدلات التحصيل</div>
                ) : (
                  <div className="loading-stat">جاري التحميل...</div>
                )}
              </div>
            </div>
          )}

          {/* مقارنة الأداء الشهري */}
          {isStatisticEnabled('monthly_comparison') && (
            <div className="stat-card comparison">
              <h3>📈 مقارنة الأداء الشهري</h3>
              <div className="stat-content">
                {statisticsData.monthly_comparison ? (
                  <div>بيانات مقارنة الأداء</div>
                ) : (
                  <div className="loading-stat">جاري التحميل...</div>
                )}
              </div>
            </div>
          )}

          {/* أداء المباني */}
          {isStatisticEnabled('building_performance') && (
            <div className="stat-card buildings">
              <h3>🏗️ أداء المباني</h3>
              <div className="stat-content">
                {statisticsData.building_performance ? (
                  <div>بيانات أداء المباني</div>
                ) : (
                  <div className="loading-stat">جاري التحميل...</div>
                )}
              </div>
            </div>
          )}

          {/* الأداء المالي السنوي */}
          {isStatisticEnabled('annual_financial') && (
            <div className="stat-card annual">
              <h3>📅 الأداء المالي السنوي</h3>
              <div className="stat-content">
                {statisticsData.annual_financial ? (
                  <div>بيانات الأداء المالي السنوي</div>
                ) : (
                  <div className="loading-stat">جاري التحميل...</div>
                )}
              </div>
            </div>
          )}

          {/* النشاطات الحديثة */}
          {isStatisticEnabled('recent_activities') && (
            <div className="stat-card activities">
              <h3>⚡ النشاطات الحديثة</h3>
              <div className="stat-content">
                {statisticsData.recent_activities ? (
                  <div>بيانات النشاطات الحديثة</div>
                ) : (
                  <div className="loading-stat">جاري التحميل...</div>
                )}
              </div>
            </div>
          )}

          {/* تقرير شامل */}
          {isStatisticEnabled('dashboard') && (
            <div className="stat-card dashboard">
              <h3>📋 التقرير الشامل</h3>
              <div className="stat-content">
                {statisticsData.dashboard ? (
                  <div>بيانات التقرير الشامل</div>
                ) : (
                  <div className="loading-stat">جاري التحميل...</div>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

// المكون الرئيسي
const App = () => {
  const [currentView, setCurrentView] = useState('dashboard');

  return (
    <div className="app">
      <nav className="navigation">
        <button 
          className={currentView === 'dashboard' ? 'active' : ''}
          onClick={() => setCurrentView('dashboard')}
        >
          📊 لوحة الإحصائيات
        </button>
        <button 
          className={currentView === 'settings' ? 'active' : ''}
          onClick={() => setCurrentView('settings')}
        >
          ⚙️ إعدادات الإحصائيات
        </button>
      </nav>

      <main className="main-content">
        {currentView === 'dashboard' ? (
          <StatisticsDashboard />
        ) : (
          <StatisticsSettingsPanel />
        )}
      </main>
    </div>
  );
};

export default App;
