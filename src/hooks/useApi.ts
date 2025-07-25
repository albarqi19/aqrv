import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/lib/api';

// Hook for overview data
export const useOverview = () => {
  return useQuery({
    queryKey: ['overview'],
    queryFn: () => apiClient.getOverview(),
    refetchInterval: 30000, // Refetch every 30 seconds
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
