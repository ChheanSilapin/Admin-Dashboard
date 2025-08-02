import { useState, useEffect } from 'react';
import { dashboardAPI } from '../services/api';

/**
 * Custom hook for managing dashboard data with API calls
 * Provides dashboard metrics, activities, and statistics with loading states and error handling
 */
export const useDashboard = () => {
  const [dashboardData, setDashboardData] = useState({
    metrics: {},
    activities: [],
    monthlyStats: [],
    transactions: [],
    banks: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await dashboardAPI.getOverview();
      setDashboardData(data);
    } catch (err) {
      setError('Failed to fetch dashboard data');
      console.error('Error fetching dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  const refreshMetrics = async () => {
    try {
      const metrics = await dashboardAPI.getMetrics();
      setDashboardData(prev => ({
        ...prev,
        metrics: metrics[0] || {}
      }));
    } catch (err) {
      console.error('Error refreshing metrics:', err);
    }
  };

  const refreshActivities = async () => {
    try {
      const activities = await dashboardAPI.getRecentActivities();
      setDashboardData(prev => ({
        ...prev,
        activities: activities || []
      }));
    } catch (err) {
      console.error('Error refreshing activities:', err);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  return {
    dashboardData,
    loading,
    error,
    fetchDashboardData,
    refreshMetrics,
    refreshActivities,
  };
};
