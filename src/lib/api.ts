const API_BASE_URL = 'https://barq.fun/api';

// Types for API responses
export interface ApiResponse<T> {
  success: boolean;
  data: T;
}

export interface OverviewData {
  total_buildings: number;
  total_shops: number;
  total_tenants: number;
  total_landlords: number;
  total_cities: number;
  total_districts: number;
  active_contracts: number;
  expired_contracts: number;
  pending_contracts: number;
  total_revenue: string;
  pending_payments: string;
  overdue_payments: number;
}

export interface OccupancyData {
  total_shops: number;
  occupied_shops: number;
  vacant_shops: number;
  occupancy_rate: number;
  shops_by_status: {
    occupied: number;
    vacant: number;
    maintenance: number;
  };
}

export interface MonthlyRevenueData {
  labels: string[];
  revenues: number[];
  total_revenue: number;
  average_monthly: number;
}

export interface DashboardData {
  overview: {
    total_buildings: number;
    occupancy_rate: number;
    monthly_revenue: string;
    overdue_payments: number;
  };
  growth_metrics: {
    revenue_growth: number;
    tenant_growth: number;
    contract_growth: number;
  };
  quick_stats: {
    active_contracts: number;
    total_tenants: number;
    average_rent: string;
    collection_rate: number;
  };
}

export interface CollectionRatesData {
  current_month: {
    collected: number;
    pending: number;
    overdue: number;
    rate: number;
  };
  trend: Array<{
    month: string;
    rate: number;
  }>;
}

export interface BuildingPerformanceData {
  buildings: Array<{
    id: number;
    name: string;
    occupancy_rate: number;
    monthly_revenue: number;
    total_shops: number;
    occupied_shops: number;
  }>;
}

// API Client class
class ApiClient {
  private async request<T>(endpoint: string): Promise<ApiResponse<T>> {
    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Cache-Control': 'no-cache',
          'User-Agent': 'AqariDashboard/1.0 (Mobile Compatible)',
        },
        mode: 'cors',
        credentials: 'omit',
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status} - ${response.statusText}`);
      }
      
      const data = await response.json();
      
      // Log for debugging on mobile
      if (process.env.NODE_ENV === 'development') {
        console.log(`✅ API Success ${endpoint}:`, data);
      }
      
      return data;
    } catch (error) {
      console.error(`❌ API request failed for ${endpoint}:`, error);
      
      // More detailed error for mobile debugging
      if (error instanceof TypeError && error.message.includes('fetch')) {
        throw new Error('خطأ في الشبكة - تأكد من الاتصال بالإنترنت');
      }
      
      throw error;
    }
  }

  async getOverview(): Promise<OverviewData> {
    const response = await this.request<OverviewData>('/statistics/overview');
    return response.data;
  }

  async getOccupancy(): Promise<OccupancyData> {
    const response = await this.request<OccupancyData>('/statistics/occupancy');
    return response.data;
  }

  async getMonthlyRevenue(): Promise<MonthlyRevenueData> {
    const response = await this.request<MonthlyRevenueData>('/statistics/monthly-revenue');
    return response.data;
  }

  async getDashboard(): Promise<DashboardData> {
    const response = await this.request<DashboardData>('/statistics/dashboard');
    return response.data;
  }

  async getCollectionRates(): Promise<CollectionRatesData> {
    const response = await this.request<CollectionRatesData>('/statistics/collection-rates');
    return response.data;
  }

  async getBuildingPerformance(): Promise<BuildingPerformanceData> {
    const response = await this.request<BuildingPerformanceData>('/statistics/building-performance');
    return response.data;
  }

  async getMonthlyComparison(): Promise<any> {
    const response = await this.request('/statistics/monthly-comparison');
    return response.data;
  }

  async getAnnualFinancial(): Promise<any> {
    const response = await this.request('/statistics/annual-financial');
    return response.data;
  }

  async getRecentActivities(): Promise<any> {
    const response = await this.request('/statistics/recent-activities');
    return response.data;
  }
}

export const apiClient = new ApiClient();
