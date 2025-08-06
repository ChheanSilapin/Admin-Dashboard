import { useState, useEffect, useRef } from 'react';
import { dashboardAPI } from '../services/api';

// Shared cache for dashboard data to prevent multiple API calls
let dashboardCache = {
  data: null,
  loading: false,
  error: null,
  lastFetch: 0,
  subscribers: new Set()
};

const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

/**
 * Custom hook for managing dashboard data with API calls
 * Uses shared cache to prevent multiple API calls from different components
 */
export const useDashboard = () => {
  const [dashboardData, setDashboardData] = useState(
    dashboardCache.data || {
      metrics: {},
      activities: [],
      monthlyStats: [],
      transactions: [],
      banks: []
    }
  );
  const [loading, setLoading] = useState(dashboardCache.loading);
  const [error, setError] = useState(dashboardCache.error);
  const subscriberRef = useRef(null);

  // Create a unique subscriber ID
  if (!subscriberRef.current) {
    subscriberRef.current = Symbol('dashboard-subscriber');
  }

  const updateState = (newData, newLoading, newError) => {
    setDashboardData(newData);
    setLoading(newLoading);
    setError(newError);
  };

  const fetchDashboardData = async (force = false) => {
    const now = Date.now();
    const isCacheValid = dashboardCache.data && (now - dashboardCache.lastFetch) < CACHE_DURATION;

    // If cache is valid and not forcing refresh, use cached data
    if (isCacheValid && !force) {
      updateState(dashboardCache.data, false, dashboardCache.error);
      return;
    }

    // If already loading, don't start another request
    if (dashboardCache.loading) {
      return;
    }

    try {
      dashboardCache.loading = true;
      dashboardCache.error = null;

      // Notify all subscribers that loading started
      dashboardCache.subscribers.forEach(subscriber => {
        if (typeof subscriber === 'function') {
          subscriber(dashboardCache.data, true, null);
        }
      });

      const data = await dashboardAPI.getOverview();

      dashboardCache.data = data;
      dashboardCache.lastFetch = now;
      dashboardCache.loading = false;

      // Notify all subscribers with new data
      dashboardCache.subscribers.forEach(subscriber => {
        if (typeof subscriber === 'function') {
          subscriber(data, false, null);
        }
      });
    } catch (err) {
      const errorMessage = 'Failed to fetch dashboard data';
      dashboardCache.error = errorMessage;
      dashboardCache.loading = false;

      // Notify all subscribers of error
      dashboardCache.subscribers.forEach(subscriber => {
        if (typeof subscriber === 'function') {
          subscriber(dashboardCache.data, false, errorMessage);
        }
      });
    }
  };

  const refreshMetrics = async () => {
    try {
      const metrics = await dashboardAPI.getMetrics();
      const newData = {
        ...dashboardCache.data,
        metrics: metrics[0] || {}
      };

      dashboardCache.data = newData;
      dashboardCache.lastFetch = Date.now();

      // Notify all subscribers
      dashboardCache.subscribers.forEach(subscriber => {
        if (typeof subscriber === 'function') {
          subscriber(newData, false, null);
        }
      });
    } catch (err) {
      console.error('Error refreshing metrics:', err);
    }
  };

  const refreshActivities = async () => {
    try {
      const activities = await dashboardAPI.getRecentActivities();
      const newData = {
        ...dashboardCache.data,
        activities: activities || []
      };

      dashboardCache.data = newData;
      dashboardCache.lastFetch = Date.now();

      // Notify all subscribers
      dashboardCache.subscribers.forEach(subscriber => {
        if (typeof subscriber === 'function') {
          subscriber(newData, false, null);
        }
      });
    } catch (err) {
      console.error('Error refreshing activities:', err);
    }
  };

  useEffect(() => {
    // Add this component as a subscriber
    const subscriber = (data, isLoading, errorMsg) => {
      updateState(data, isLoading, errorMsg);
    };

    dashboardCache.subscribers.add(subscriber);

    // Fetch data if not already cached or cache is expired
    fetchDashboardData();

    // Cleanup: remove subscriber when component unmounts
    return () => {
      dashboardCache.subscribers.delete(subscriber);
    };
  }, []);

  return {
    dashboardData,
    loading,
    error,
    fetchDashboardData: () => fetchDashboardData(true), // Force refresh
    refreshMetrics,
    refreshActivities,
  };
};
