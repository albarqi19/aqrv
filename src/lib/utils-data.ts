// Utility functions for data formatting and manipulation

export const formatCurrency = (amount: string | number | undefined | null): string => {
  if (amount === undefined || amount === null || amount === '') {
    return '0 ﷼';
  }
  
  const numAmount = typeof amount === 'string' ? parseFloat(amount) : amount;
  
  if (isNaN(numAmount)) {
    return '0 ﷼';
  }
  
  return numAmount.toLocaleString('en-US') + ' ﷼';
};

export const formatNumber = (num: string | number | undefined | null): string => {
  if (num === undefined || num === null || num === '') {
    return '0';
  }
  
  const number = typeof num === 'string' ? parseFloat(num) : num;
  
  if (isNaN(number)) {
    return '0';
  }
  
  return number.toLocaleString('en-US');
};

export const formatPercentage = (value: number | undefined | null): string => {
  if (value === undefined || value === null || isNaN(value)) {
    return '0%';
  }
  return `${value.toFixed(1)}%`;
};

export const getStatusVariant = (occupancyRate: number): 'excellent' | 'good' | 'poor' => {
  if (occupancyRate >= 70) return 'excellent';
  if (occupancyRate >= 40) return 'good';
  return 'poor';
};

export const getStatusText = (occupancyRate: number): string => {
  if (occupancyRate >= 70) return 'ممتاز';
  if (occupancyRate >= 40) return 'جيد';
  return 'ضعيف';
};

export const calculateGrowth = (current: number, previous: number): { value: number; type: 'increase' | 'decrease' } => {
  if (previous === 0) return { value: 0, type: 'increase' };
  const growth = ((current - previous) / previous) * 100;
  return {
    value: Math.abs(growth),
    type: growth >= 0 ? 'increase' : 'decrease'
  };
};
