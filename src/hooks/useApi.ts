import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/lib/api';

// Fallback data for mobile/offline scenarios
const fallbackOverviewData = {
  total_buildings: 0,
  total_shops: 0,
  total_tenants: 0,
  total_landlords: 0,
  total_cities: 0,
  total_districts: 0,
  active_contracts: 0,
  expired_contracts: 0,
  pending_contracts: 0,
  total_revenue: "0",
  pending_payments: "0",
  overdue_payments: 0,
};

// Hook for overview data
export const useOverview = () => {
  return useQuery({
    queryKey: ['overview'],
    queryFn: () => apiClient.getOverview(),
    refetchInterval: 30000, // Refetch every 30 seconds
    retry: 3,
    retryDelay: 1000,
    staleTime: 5 * 60 * 1000, // 5 minutes
    placeholderData: fallbackOverviewData,
    meta: {
      errorMessage: 'فشل في تحميل البيانات العامة'
    }
  });
};

// Hook for occupancy data
export const useOccupancy = () => {
  return useQuery({
    queryKey: ['occupancy'],
    queryFn: () => apiClient.getOccupancy(),
    refetchInterval: 30000,
  });
};

// Hook for monthly revenue data
export const useMonthlyRevenue = () => {
  return useQuery({
    queryKey: ['monthly-revenue'],
    queryFn: () => apiClient.getMonthlyRevenue(),
    refetchInterval: 30000,
  });
};

// Hook for dashboard data
export const useDashboard = () => {
  return useQuery({
    queryKey: ['dashboard'],
    queryFn: () => apiClient.getDashboard(),
    refetchInterval: 30000,
    retry: 3,
    retryDelay: 1000,
    staleTime: 5 * 60 * 1000,
    placeholderData: {
      overview: { total_buildings: 0, occupancy_rate: 0, monthly_revenue: "0", overdue_payments: 0 },
      growth_metrics: { revenue_growth: 0, tenant_growth: 0, contract_growth: 0 },
      quick_stats: { active_contracts: 0, total_tenants: 0, average_rent: "0", collection_rate: 0 }
    },
    meta: {
      errorMessage: 'فشل في تحميل بيانات لوحة التحكم'
    }
  });
};

// Hook for collection rates
export const useCollectionRates = () => {
  return useQuery({
    queryKey: ['collection-rates'],
    queryFn: () => apiClient.getCollectionRates(),
    refetchInterval: 30000,
  });
};

// Hook for building performance
export const useBuildingPerformance = () => {
  return useQuery({
    queryKey: ['building-performance'],
    queryFn: () => apiClient.getBuildingPerformance(),
    refetchInterval: 30000,
  });
};
