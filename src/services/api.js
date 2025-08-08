/**
 * API Service for Laravel API
 * Provides centralized HTTP request functions with Bearer token authentication
 */

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://192.168.10.12:8000/api';
const API_TIMEOUT = parseInt(import.meta.env.VITE_API_TIMEOUT) || 10000;
const AUTH_TOKEN_KEY = import.meta.env.VITE_AUTH_TOKEN_KEY || 'auth_token';

/**
 * Get authentication token from localStorage
 * @returns {string|null} - Bearer token or null
 */
const getAuthToken = () => {
  return localStorage.getItem(AUTH_TOKEN_KEY);
};

// Import utilities
import { parsePermissions } from '../contexts/AuthContext';
import { extractResponseData } from '../utils/apiHelpers';

/**
 * Transform Laravel API customer transaction for UI compatibility
 * @param {Object} laravelCustomer - Customer transaction from Laravel API
 * @returns {Object} - Transformed customer object
 */
const transformCustomerFromLaravel = (laravelCustomer) => {
  return {
    id: laravelCustomer.id,
    CustomerId: laravelCustomer.customer_id,
    Type: laravelCustomer.type, // "Deposit" or "Withdraw"
    currency: laravelCustomer.currency,
    Credit: laravelCustomer.credit || laravelCustomer.amount, // Use credit field if available
    amount: laravelCustomer.amount,
    bank_name: laravelCustomer.bank?.bank_name || '',
    bank_code: laravelCustomer.bank?.bank_code || '',
    bank_id: laravelCustomer.bank_id,
    created_by: laravelCustomer.created_by || 1,
    Note: laravelCustomer.note || laravelCustomer.description || '',
    created_at: laravelCustomer.created_at,
    name: laravelCustomer.customer_name || '',
    email: laravelCustomer.email || '',
    phone: laravelCustomer.phone || '',
    joinDate: laravelCustomer.transaction_date || laravelCustomer.created_at,
    accountNumber: laravelCustomer.account_number || ''
  };
};

/**
 * Transform Laravel API bank for UI compatibility
 * @param {Object} laravelBank - Bank from Laravel API
 * @returns {Object} - Transformed bank object
 */
const transformBankFromLaravel = (laravelBank) => {
  return {
    id: laravelBank.id,
    bank_name: laravelBank.bank_name,
    bank_code: laravelBank.bank_code,
    status: laravelBank.is_active ? 'active' : 'inactive',
    logo: laravelBank.logo,
    description: laravelBank.description,
    created_at: laravelBank.created_at,
    updated_at: laravelBank.updated_at
  };
};

/**
 * Transform UI customer data to Laravel API format for create/update operations
 * @param {Object} uiCustomer - Customer data from UI
 * @returns {Object} - Transformed customer data for Laravel API
 */
const transformCustomerToLaravel = (uiCustomer) => {
  return {
    customer_id: uiCustomer.CustomerId || uiCustomer.customer_id,
    customer_name: uiCustomer.fullName || uiCustomer.name || '', // Include customer name
    type: uiCustomer.Type || uiCustomer.type,
    amount: parseFloat(uiCustomer.amount || 0),
    credit: parseFloat(uiCustomer.Credit || 0),
    currency: uiCustomer.currency || 'USD',
    bank_id: parseInt(uiCustomer.bank_id),
    bank_name: uiCustomer.bank_name || '',
    bank_code: uiCustomer.bank_code || '',
    note: uiCustomer.Note || uiCustomer.note || '',
    transaction_date: uiCustomer.joinDate || uiCustomer.transaction_date || new Date().toISOString()
  };
};

/**
 * Transform UI bank data to Laravel API format for create/update operations
 * @param {Object} uiBank - Bank data from UI
 * @returns {Object} - Transformed bank data for Laravel API
 */
const transformBankToLaravel = (uiBank) => {
  return {
    bank_name: uiBank.bank_name,
    bank_code: uiBank.bank_code,
    logo: uiBank.logo || null,
    description: uiBank.description || null,
    is_active: uiBank.status === 'active'
  };
};



/**
 * Generic API request function with Bearer token authentication and error handling
 * @param {string} endpoint - API endpoint
 * @param {object} options - Fetch options
 * @param {boolean} requireAuth - Whether authentication is required (default: true)
 * @returns {Promise} - Response data or throws error
 */
const apiRequest = async (endpoint, options = {}, requireAuth = true) => {
  try {
    const url = `${API_BASE_URL}${endpoint}`;
    const headers = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      ...options.headers,
    };

    // Add Bearer token for authenticated requests
    if (requireAuth) {
      const token = getAuthToken();
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
    }

    const config = {
      headers,
      signal: AbortSignal.timeout(API_TIMEOUT),
      ...options,
    };

    const response = await fetch(url, config);

    // Handle different response types
    if (!response.ok) {
      let errorMessage = `HTTP error! status: ${response.status}`;
      let validationErrors = null;

      try {
        const errorData = await response.json();

        // Handle Laravel validation errors (422 status)
        if (response.status === 422 && errorData.errors) {
          validationErrors = errorData.errors;
          // Create a user-friendly message from validation errors
          const errorMessages = Object.values(errorData.errors).flat();
          errorMessage = errorMessages.join(' ');
        } else {
          errorMessage = errorData.message || errorData.error || errorMessage;
        }
      } catch (e) {
        // If response is not JSON, use status text
        errorMessage = response.statusText || errorMessage;
      }

      // Create enhanced error object with validation details
      const error = new Error(errorMessage);
      error.status = response.status;
      error.validationErrors = validationErrors;
      throw error;
    }

    // Handle empty responses (like 204 No Content)
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      return await response.json();
    }

    return null;
  } catch (error) {
    if (error.name === 'TimeoutError' || error.name === 'AbortError') {
      throw new Error(`Request timed out after ${API_TIMEOUT}ms`);
    }
    throw error;
  }
};

/**
 * Customer API functions
 */
export const customerAPI = {
  // Get all customers with optional search and pagination
  getAll: async (params = {}) => {
    const searchParams = new URLSearchParams();
    if (params.search) searchParams.append('search', params.search);
    if (params.page) searchParams.append('page', params.page);
    if (params.per_page) searchParams.append('per_page', params.per_page);

    const queryString = searchParams.toString();
    const response = await apiRequest(`/customer-transactions${queryString ? `?${queryString}` : ''}`);

    if (response && response.data) {
      const transformedData = Array.isArray(response.data)
        ? response.data.map(transformCustomerFromLaravel)
        : [transformCustomerFromLaravel(response.data)];

      return {
        ...response,
        data: transformedData
      };
    }

    if (Array.isArray(response)) {
      return response.map(transformCustomerFromLaravel);
    }

    return response;
  },

  // Get customer by ID
  getById: async (id) => {
    const response = await apiRequest(`/customer-transactions/${id}`);

    if (response && response.data) {
      return {
        ...response,
        data: transformCustomerFromLaravel(response.data)
      };
    }

    return response ? transformCustomerFromLaravel(response) : response;
  },

  // Create new customer transaction
  create: async (customerData) => {
    const transformedData = transformCustomerToLaravel(customerData);
    const response = await apiRequest('/customer-transactions', {
      method: 'POST',
      body: JSON.stringify(transformedData),
    });

    if (response && response.data) {
      return {
        ...response,
        data: transformCustomerFromLaravel(response.data)
      };
    }

    return response ? transformCustomerFromLaravel(response) : response;
  },

  // Update customer transaction
  update: async (id, customerData) => {
    const transformedData = transformCustomerToLaravel(customerData);
    const response = await apiRequest(`/customer-transactions/${id}`, {
      method: 'PUT',
      body: JSON.stringify(transformedData),
    });

    if (response && response.data) {
      return {
        ...response,
        data: transformCustomerFromLaravel(response.data)
      };
    }

    return response ? transformCustomerFromLaravel(response) : response;
  },

  // Delete customer transaction
  delete: (id) =>
    apiRequest(`/customer-transactions/${id}`, {
      method: 'DELETE',
    }),

  // Get total customer count for ID generation
  getTotalCount: async () => {
    try {
      // First try to get from stats endpoint
      const statsResponse = await apiRequest('/customer-transactions/stats');
      if (statsResponse && statsResponse.data && statsResponse.data.total_transactions) {
        return statsResponse.data.total_transactions;
      }

      // Fallback: Get from pagination data (fetch first page to get total)
      const paginationResponse = await apiRequest('/customer-transactions?page=1&per_page=1');
      if (paginationResponse && paginationResponse.pagination && paginationResponse.pagination.total) {
        return paginationResponse.pagination.total;
      }

      // Last fallback: return 0 if no data available
      return 0;
    } catch (error) {
      console.warn('Failed to get total customer count:', error);
      return 0;
    }
  },
};

/**
 * Bank API functions
 */
export const bankAPI = {
  // Get all banks with optional filters
  getAll: async (params = {}) => {
    const searchParams = new URLSearchParams();
    if (params.search) searchParams.append('search', params.search);

    const queryString = searchParams.toString();
    const response = await apiRequest(`/banks${queryString ? `?${queryString}` : ''}`);

    // Transform Laravel API response to match UI expectations
    if (response && response.data) {
      const transformedData = Array.isArray(response.data)
        ? response.data.map(transformBankFromLaravel)
        : [transformBankFromLaravel(response.data)];

      return {
        ...response,
        data: transformedData
      };
    }

    // If response is already an array (direct data), transform it
    if (Array.isArray(response)) {
      return response.map(transformBankFromLaravel);
    }

    return response;
  },

  // Get bank by ID
  getById: async (id) => {
    const response = await apiRequest(`/banks/${id}`);

    if (response && response.data) {
      return {
        ...response,
        data: transformBankFromLaravel(response.data)
      };
    }

    return response ? transformBankFromLaravel(response) : response;
  },

  // Create new bank
  create: async (bankData) => {
    const transformedData = transformBankToLaravel(bankData);
    const response = await apiRequest('/banks', {
      method: 'POST',
      body: JSON.stringify(transformedData),
    });

    if (response && response.data) {
      return {
        ...response,
        data: transformBankFromLaravel(response.data)
      };
    }

    return response ? transformBankFromLaravel(response) : response;
  },

  // Update bank
  update: async (id, bankData) => {
    const transformedData = transformBankToLaravel(bankData);
    const response = await apiRequest(`/banks/${id}`, {
      method: 'PUT',
      body: JSON.stringify(transformedData),
    });

    if (response && response.data) {
      return {
        ...response,
        data: transformBankFromLaravel(response.data)
      };
    }

    return response ? transformBankFromLaravel(response) : response;
  },

  // Delete bank
  delete: (id) =>
    apiRequest(`/banks/${id}`, {
      method: 'DELETE',
    }),
};

/**
 * Authentication API functions for Laravel Sanctum
 */
export const authAPI = {
  // Authenticate user with username and password
  login: async (username, password) => {
    try {
      const response = await apiRequest('/auth/login', {
        method: 'POST',
        body: JSON.stringify({
          username,
          password
        }),
      }, false); // Don't require auth for login

      if (!response || !response.token) {
        throw new Error('Invalid response from server');
      }

      // Store the Bearer token
      localStorage.setItem(AUTH_TOKEN_KEY, response.token);

      // Transform the response to match existing UI expectations
      const user = response.user;

      // Handle different formats of roles field (string, array, or object)
      let roleString = 'unknown';
      let roleName = 'Unknown';

      if (user.roles) {
        if (typeof user.roles === 'string') {
          // If roles is a string
          roleString = user.roles.toLowerCase().replace(' ', '_');
          roleName = user.roles;
        } else if (Array.isArray(user.roles)) {
          // If roles is an array, take the first role
          const firstRole = user.roles[0];
          if (typeof firstRole === 'string') {
            roleString = firstRole.toLowerCase().replace(' ', '_');
            roleName = firstRole;
          } else if (firstRole && firstRole.name) {
            // If array contains role objects with name property
            roleString = firstRole.name.toLowerCase().replace(' ', '_');
            roleName = firstRole.name;
          }
        } else if (user.roles.name) {
          // If roles is an object with name property
          roleString = user.roles.name.toLowerCase().replace(' ', '_');
          roleName = user.roles.name;
        }
      }

      const transformedUser = {
        id: user.id,
        username: user.username,
        email: user.email,
        name: user.name,
        status: 'active', // Assume active if login successful
        role: roleString,
        role_name: roleName,
        permissions: parsePermissions(user.permissions),
        token: response.token,
        token_type: response.token_type,
        expires_in: response.expires_in
      };

      return transformedUser;
    } catch (error) {
      console.error('Authentication API error:', error);
      throw error;
    }
  },

  // Get current authenticated user
  getUser: () => apiRequest('/auth/user'),

  // Logout user
  logout: async () => {
    try {
      await apiRequest('/auth/logout', {
        method: 'POST',
      });
    } catch (error) {
      console.error('Logout API error:', error);
      // Don't throw error for logout failure - still clear local storage
    } finally {
      // Always clear local storage
      localStorage.removeItem(AUTH_TOKEN_KEY);
      localStorage.removeItem('userData');
    }
  },

  // Logout from all devices
  logoutAll: async () => {
    try {
      await apiRequest('/auth/logout-all', {
        method: 'POST',
      });
    } catch (error) {
      console.error('Logout all API error:', error);
    } finally {
      // Always clear local storage
      localStorage.removeItem(AUTH_TOKEN_KEY);
      localStorage.removeItem('userData');
    }
  },


};

/**
 * Roles API functions
 */
export const rolesAPI = {
  // Get all roles
  getAll: () => apiRequest('/roles'),

  // Get role by ID
  getById: (id) => apiRequest(`/roles/${id}`),

  // Create new role
  create: (roleData) =>
    apiRequest('/roles', {
      method: 'POST',
      body: JSON.stringify(roleData),
    }),

  // Update role
  update: (id, roleData) =>
    apiRequest(`/roles/${id}`, {
      method: 'PUT',
      body: JSON.stringify(roleData),
    }),

  // Delete role
  delete: (id) =>
    apiRequest(`/roles/${id}`, {
      method: 'DELETE',
    }),
};

/**
 * Permissions API functions
 */
export const permissionsAPI = {
  // Get all permissions
  getAll: () => apiRequest('/permissions'),

  // Get permission by ID
  getById: (id) => apiRequest(`/permissions/${id}`),

  // Create new permission
  create: (permissionData) =>
    apiRequest('/permissions', {
      method: 'POST',
      body: JSON.stringify(permissionData),
    }),

  // Update permission
  update: (id, permissionData) =>
    apiRequest(`/permissions/${id}`, {
      method: 'PUT',
      body: JSON.stringify(permissionData),
    }),

  // Delete permission
  delete: (id) =>
    apiRequest(`/permissions/${id}`, {
      method: 'DELETE',
    }),
};

/**
 * Role Permissions API functions
 */
export const rolePermissionsAPI = {
  // Get all role-permission assignments
  getAll: () => apiRequest('/role-permissions'),

  // Get role permissions by role ID
  getByRoleId: (roleId) => apiRequest(`/role-permissions/role/${roleId}`),

  // Assign permission to role
  assign: (roleId, permissionId) =>
    apiRequest('/role-permissions', {
      method: 'POST',
      body: JSON.stringify({
        role_id: roleId,
        permission_id: permissionId,
      }),
    }),

  // Remove permission from role
  remove: (roleId, permissionId) =>
    apiRequest(`/role-permissions/role/${roleId}/permission/${permissionId}`, {
      method: 'DELETE',
    }),

  // Update role permissions (bulk update)
  updateRolePermissions: (roleId, permissionIds) =>
    apiRequest(`/role-permissions/role/${roleId}`, {
      method: 'PUT',
      body: JSON.stringify({
        permission_ids: permissionIds,
      }),
    }),
};

/**
 * Users API functions (Admin only)
 */
export const usersAPI = {
  // Get all users
  getAll: (params = {}) => {
    const searchParams = new URLSearchParams();
    if (params.search) searchParams.append('search', params.search);
    if (params.role_id) searchParams.append('role_id', params.role_id);
    if (params.status) searchParams.append('status', params.status);

    const queryString = searchParams.toString();
    return apiRequest(`/users${queryString ? `?${queryString}` : ''}`);
  },

  // Get user by ID
  getById: (id) => apiRequest(`/users/${id}`),

  // Create new user
  create: (userData) =>
    apiRequest('/admin/users', {
      method: 'POST',
      body: JSON.stringify(userData),
    }),

  // Update user
  update: (id, userData) =>
    apiRequest(`/admin/users/${id}`, {
      method: 'PUT',
      body: JSON.stringify(userData),
    }),

  // Delete user
  delete: (id) =>
    apiRequest(`/admin/users/${id}`, {
      method: 'DELETE',
    }),

  // Update user status
  updateStatus: (id, status) =>
    apiRequest(`/admin/users/${id}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status }),
    }),

  // Reset user password
  resetPassword: (id) =>
    apiRequest(`/admin/users/${id}/reset-password`, {
      method: 'POST',
    }),
};

/**
 * Helper function to derive transaction data from customer records
 */
const deriveTransactionsFromCustomers = (customers) => {
  return customers.map(customer => ({
    id: customer.id,
    customer_id: customer.id,
    type: customer.Type?.toLowerCase() || 'deposit',
    amount: customer.amount || customer.Credit || 0,
    currency: customer.currency || 'USD',
    status: 'completed', // Assume all customer records represent completed transactions
    created_at: customer.created_at || customer.joinDate,
    description: customer.Note || `${customer.Type || 'Transaction'} for ${customer.name}`
  }));
};

/**
 * Dashboard calculation service
 * Computes dashboard metrics from existing customer and bank data
 */
const calculateDashboardMetrics = (customers, banks) => {
  const now = new Date();
  const transactions = deriveTransactionsFromCustomers(customers);

  // Calculate basic metrics
  const totalCustomers = customers.length;
  const activeBanks = banks.filter(bank => bank.status === 'active').length;
  const totalTransactions = transactions.length;

  // Calculate transaction volumes by currency
  const transactionVolumeUSD = transactions
    .filter(t => t.currency === 'USD')
    .reduce((sum, t) => sum + (t.amount || 0), 0);

  const transactionVolumeKHR = transactions
    .filter(t => t.currency === 'KHR')
    .reduce((sum, t) => sum + (t.amount || 0), 0);

  // Calculate system status metrics
  const activeUsers = transactions.filter(t => t.status === 'completed').length;
  const pendingTransactions = transactions.filter(t => t.status === 'pending').length;
  const systemUptime = 99.9; // TODO: Get from monitoring API
  const dailyTransactions = transactions.filter(t => {
    const transactionDate = new Date(t.created_at);
    const today = new Date();
    return transactionDate.toDateString() === today.toDateString();
  }).length;

  return {
    id: 1,
    date: now.toISOString().split('T')[0],
    total_customers: totalCustomers,
    total_transactions: totalTransactions,
    active_banks: activeBanks,
    transaction_volume_usd: transactionVolumeUSD,
    transaction_volume_khr: transactionVolumeKHR,
    active_users: activeUsers,
    pending_transactions: pendingTransactions,
    system_uptime: systemUptime,
    daily_transactions: dailyTransactions
  };
};

/**
 * Generate monthly statistics from customer and bank data
 */
const calculateMonthlyStats = (customers, banks) => {
  const transactions = deriveTransactionsFromCustomers(customers);
  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const currentDate = new Date();
  const stats = [];

  // Generate stats for the last 12 months
  for (let i = 11; i >= 0; i--) {
    const date = new Date(currentDate.getFullYear(), currentDate.getMonth() - i, 1);
    const year = date.getFullYear();
    const month = date.getMonth();
    const monthName = monthNames[month];

    // Count customers created up to this month
    const customersUpToMonth = customers.filter(customer => {
      const customerDate = new Date(customer.created_at || customer.joinDate);
      return customerDate <= new Date(year, month + 1, 0); // End of month
    }).length;

    // Count transactions in this month
    const transactionsInMonth = transactions.filter(transaction => {
      const transactionDate = new Date(transaction.created_at);
      return transactionDate.getFullYear() === year && transactionDate.getMonth() === month;
    }).length;

    // Count banks active up to this month
    const banksUpToMonth = banks.filter(bank => {
      const bankDate = new Date(bank.created_at);
      return bankDate <= new Date(year, month + 1, 0); // End of month
    }).length;

    // Calculate transaction volumes for this month
    const monthTransactions = transactions.filter(transaction => {
      const transactionDate = new Date(transaction.created_at);
      return transactionDate.getFullYear() === year &&
             transactionDate.getMonth() === month &&
             transaction.status === 'completed';
    });

    const transactionVolumeUSD = monthTransactions
      .filter(t => t.currency === 'USD')
      .reduce((sum, t) => sum + (t.amount || 0), 0);

    const transactionVolumeKHR = monthTransactions
      .filter(t => t.currency === 'KHR')
      .reduce((sum, t) => sum + (t.amount || 0), 0);

    stats.push({
      id: stats.length + 1,
      month: monthName,
      year: year,
      customers: customersUpToMonth,
      transactions: transactionsInMonth,
      banks: banksUpToMonth,
      transaction_volume_usd: transactionVolumeUSD,
      transaction_volume_khr: transactionVolumeKHR
    });
  }

  return stats;
};

/**
 * Generate recent activities from customer and bank data
 */
const generateRecentActivities = (customers, banks) => {
  const transactions = deriveTransactionsFromCustomers(customers);
  const activities = [];

  // Get recent customers (last 10)
  const recentCustomers = customers
    .sort((a, b) => new Date(b.created_at || b.joinDate) - new Date(a.created_at || a.joinDate))
    .slice(0, 5);

  recentCustomers.forEach((customer) => {
    activities.push({
      id: activities.length + 1,
      type: 'customer',
      title: 'New customer registered',
      description: `${customer.name} created account #${customer.CustomerId}`,
      created_at: customer.created_at || customer.joinDate,
      customer_id: customer.id
    });
  });

  // Get recent transactions (last 10)
  const recentTransactions = transactions
    .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
    .slice(0, 5);

  recentTransactions.forEach((transaction) => {
    const customer = customers.find(c => c.id === transaction.customer_id);
    const customerName = customer ? customer.name : `Customer #${transaction.customer_id}`;
    const customerId = customer ? customer.CustomerId : `CUST-${transaction.customer_id}`;

    activities.push({
      id: activities.length + 1,
      type: transaction.type,
      title: `${transaction.type.charAt(0).toUpperCase() + transaction.type.slice(1)} processed`,
      description: `${transaction.currency === 'USD' ? '$' : '៛'}${transaction.amount.toLocaleString()} ${transaction.currency} ${transaction.type} completed for ${customerName} #${customerId}`,
      created_at: transaction.created_at,
      customer_id: transaction.customer_id
    });
  });

  // Add some bank-related activities
  const recentBanks = banks
    .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
    .slice(0, 2);

  recentBanks.forEach((bank) => {
    activities.push({
      id: activities.length + 1,
      type: 'bank',
      title: 'New bank partner added',
      description: `${bank.bank_name} integration completed successfully`,
      created_at: bank.created_at,
      bank_id: bank.id
    });
  });

  // Sort all activities by date and return the most recent ones
  return activities
    .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
    .slice(0, 10);
};

/**
 * Dashboard API functions - using Laravel API endpoints
 */
export const dashboardAPI = {
  // Get dashboard overview data with calculated metrics
  getOverview: async () => {
    const [customers, banks] = await Promise.all([
      customerAPI.getAll(),
      bankAPI.getAll()
    ]);

    // Extract data from Laravel API response format
    const customerData = extractResponseData(customers);
    const bankData = extractResponseData(banks);

    const transactions = deriveTransactionsFromCustomers(customerData);
    const metrics = calculateDashboardMetrics(customerData, bankData);
    const activities = generateRecentActivities(customerData, bankData);
    const monthlyStats = calculateMonthlyStats(customerData, bankData);

    return {
      metrics,
      activities,
      monthlyStats,
      transactions, // Derived transactions for backward compatibility
      banks: bankData
    };
  },


};



export default apiRequest;
