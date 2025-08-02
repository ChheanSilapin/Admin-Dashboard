/**
 * API Service for JSON Server
 * Provides centralized HTTP request functions for the application
 */

const API_BASE_URL = 'http://localhost:3001';

/**
 * Generic API request function with error handling
 * @param {string} endpoint - API endpoint
 * @param {object} options - Fetch options
 * @returns {Promise} - Response data or throws error
 */
const apiRequest = async (endpoint, options = {}) => {
  try {
    const url = `${API_BASE_URL}${endpoint}`;
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    const response = await fetch(url, config);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('API request failed:', error);
    throw error;
  }
};

/**
 * Customer API functions
 */
export const customerAPI = {
  // Get all customers
  getAll: () => apiRequest('/customers'),

  // Get customer by ID
  getById: (id) => apiRequest(`/customers/${id}`),

  // Create new customer
  create: (customerData) => 
    apiRequest('/customers', {
      method: 'POST',
      body: JSON.stringify(customerData),
    }),

  // Update customer
  update: (id, customerData) =>
    apiRequest(`/customers/${id}`, {
      method: 'PUT',
      body: JSON.stringify(customerData),
    }),

  // Delete customer
  delete: (id) =>
    apiRequest(`/customers/${id}`, {
      method: 'DELETE',
    }),
};

/**
 * Generic CRUD operations for any resource
 * @param {string} resource - Resource name (e.g., 'customers', 'banks')
 */
export const createResourceAPI = (resource) => ({
  getAll: () => apiRequest(`/${resource}`),
  getById: (id) => apiRequest(`/${resource}/${id}`),
  create: (data) => 
    apiRequest(`/${resource}`, {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  update: (id, data) =>
    apiRequest(`/${resource}/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
  delete: (id) =>
    apiRequest(`/${resource}/${id}`, {
      method: 'DELETE',
    }),
});

export default apiRequest;
