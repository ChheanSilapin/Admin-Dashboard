import { useState, useEffect } from 'react';
import { customerAPI } from '../services/api';

/**
 * Custom hook for managing customer data with API calls
 * Provides CRUD operations with loading states and error handling
 */
export const useCustomers = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [retryCount, setRetryCount] = useState(0);
  const [pagination, setPagination] = useState({
    current_page: 1,
    last_page: 1,
    per_page: 15,
    total: 0,
    from: 0,
    to: 0
  });

  const fetchCustomers = async (page = 1, perPage = null, isRetry = false) => {
    try {
      setLoading(true);
      setError(null);

      // Force 10 per page on mobile, use provided perPage on desktop
      const isMobile = window.innerWidth < 640; // sm breakpoint
      const actualPerPage = perPage || (isMobile ? 10 : 15);

      const response = await customerAPI.getAll({ page, per_page: actualPerPage });

      // Handle both direct array and paginated response
      const customerData = response.data || response;
      setCustomers(Array.isArray(customerData) ? customerData : []);

      // Update pagination info if available
      if (response.pagination) {
        setPagination(response.pagination);
      }

      setRetryCount(0);
    } catch (err) {
      setError('Failed to fetch customers');
      // Fallback to empty array on error
      setCustomers([]);

      if(!isRetry && retryCount < 5) {
        setTimeout(() => {
          setRetryCount(prev => prev + 1);
          fetchCustomers(page, perPage, true);
        }, 5000);
      }
    } finally {
      setLoading(false);
    }
  };

  const addCustomer = async (customerData) => {
    try {
      setError(null);
      const response = await customerAPI.create(customerData);

      // Handle response format
      const newCustomer = response.data || response;
      setCustomers(prev => [...prev, newCustomer]);
      return newCustomer;
    } catch (err) {
      setError('Failed to add customer');
      throw err;
    }
  };

  const updateCustomer = async (id, customerData) => {
    try {
      setError(null);
      const response = await customerAPI.update(id, customerData);

      // Handle response format
      const updatedCustomer = response.data || response;
      setCustomers(prev =>
        prev.map(customer =>
          customer.id === id ? { ...customer, ...updatedCustomer } : customer
        )
      );
      return updatedCustomer;
    } catch (err) {
      setError('Failed to update customer');
      throw err;
    }
  };

  const deleteCustomer = async (id) => {
    try {
      setError(null);
      await customerAPI.delete(id);
      setCustomers(prev => prev.filter(customer => customer.id !== id));
    } catch (err) {
      setError('Failed to delete customer');
      throw err;
    }
  };

  const getCustomerById = (id) => {
    return customers.find(customer => customer.id === id) || null;
  };

  const isCustomerIdUnique = (customerId, excludeId = null) => {
    return !customers.some(customer => 
      customer.CustomerId === customerId && customer.id !== excludeId
    );
  };

  // Pagination handlers
  const goToPage = (page) => {
    const isMobile = window.innerWidth < 640;
    const perPage = isMobile ? 10 : pagination.per_page;
    fetchCustomers(page, perPage);
  };

  const changePerPage = (perPage) => {
    fetchCustomers(1, perPage); // Reset to first page when changing per_page
  };

  useEffect(() => {
    fetchCustomers();

    // Handle window resize to adjust per_page for mobile
    const handleResize = () => {
      const isMobile = window.innerWidth < 640;
      if (isMobile && pagination.per_page !== 10) {
        fetchCustomers(1, 10);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return {
    customers,
    loading,
    error,
    pagination,
    fetchCustomers,
    goToPage,
    changePerPage,
    addCustomer,
    updateCustomer,
    deleteCustomer,
    getCustomerById,
    isCustomerIdUnique,
  };
};
