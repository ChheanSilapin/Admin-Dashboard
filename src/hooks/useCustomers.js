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

  const fetchCustomers = async (isRetry = false) => {
    try {
      setLoading(true);
      setError(null);
      const data = await customerAPI.getAll();
      setCustomers(data);
      setRetryCount(0);
    } catch (err) {
      setError('Failed to fetch customers');
      console.error('Error fetching customers:', err);

      if(!isRetry && retryCount < 5) {
        setTimeout(() => {
          setRetryCount(prev => prev + 1);
          fetchCustomers(true);
        }, 5000);
      }
    } finally {
      setLoading(false);
    }
  };

  const addCustomer = async (customerData) => {
    try {
      setError(null);
      const newCustomer = await customerAPI.create(customerData);
      setCustomers(prev => [...prev, newCustomer]);
      return newCustomer;
    } catch (err) {
      setError('Failed to add customer');
      console.error('Error adding customer:', err);
      throw err;
    }
  };

  const updateCustomer = async (id, customerData) => {
    try {
      setError(null);
      const updatedCustomer = await customerAPI.update(id, customerData);
      setCustomers(prev =>
        prev.map(customer =>
          customer.id === id ? updatedCustomer : customer
        )
      );
      return updatedCustomer;
    } catch (err) {
      setError('Failed to update customer');
      console.error('Error updating customer:', err);
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
      console.error('Error deleting customer:', err);
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

  useEffect(() => {
    fetchCustomers();
  }, []);

  return {
    customers,
    loading,
    error,
    fetchCustomers,
    addCustomer,
    updateCustomer,
    deleteCustomer,
    getCustomerById,
    isCustomerIdUnique,
  };
};
