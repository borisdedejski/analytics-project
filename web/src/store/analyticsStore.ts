import { create } from 'zustand';

interface DateRange {
  startDate: Date | null;
  endDate: Date | null;
}

interface AnalyticsStore {
  dateRange: DateRange;
  groupBy: 'hour' | 'day' | 'week' | 'month';
  setDateRange: (range: DateRange) => void;
  setGroupBy: (groupBy: 'hour' | 'day' | 'week' | 'month') => void;
}

export const useAnalyticsStore = create<AnalyticsStore>((set) => ({
  dateRange: {
    startDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
    endDate: new Date(),
  },
  groupBy: 'day',
  setDateRange: (range) => set({ dateRange: range }),
  setGroupBy: (groupBy) => set({ groupBy }),
}));

