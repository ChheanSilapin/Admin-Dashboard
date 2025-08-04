/**
 * API Service for JSON Server
 * Provides centralized HTTP request functions for the application
 */

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001';
const API_TIMEOUT = parseInt(import.meta.env.VITE_API_TIMEOUT) || 10000;

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
      // Add timeout using AbortController
      signal: AbortSignal.timeout(API_TIMEOUT),
      ...options,
    };

    const response = await fetch(url, config);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    if (error.name === 'TimeoutError' || error.name === 'AbortError') {
      throw new Error(`Request timed out after ${API_TIMEOUT}ms`);
    }
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
 * Bank API functions
 */
export const bankAPI = {
  // Get all banks
  getAll: () => apiRequest('/banks'),

  // Get bank by ID
  getById: (id) => apiRequest(`/banks/${id}`),

  // Create new bank
  create: (bankData) =>
    apiRequest('/banks', {
      method: 'POST',
      body: JSON.stringify(bankData),
    }),

  // Update bank
  update: (id, bankData) =>
    apiRequest(`/banks/${id}`, {
      method: 'PUT',
      body: JSON.stringify(bankData),
    }),

  // Delete bank
  delete: (id) =>
    apiRequest(`/banks/${id}`, {
      method: 'DELETE',
    }),
};

/**
 * Authentication API functions
 */
export const authAPI = {
  // Authenticate user with username and password
  login: async (username, password) => {
    try {
      // Get all users from JSON server
      const users = await apiRequest('/users');

      // Find user with matching username and password
      const user = users.find(u => u.username === username && u.password === password);

      if (!user) {
        throw new Error('Invalid username or password');
      }

      if (user.status !== 'active') {
        throw new Error('Account is not active');
      }

      // Get user's role information
      const roles = await apiRequest('/roles');
      const userRole = roles.find(r => r.id === user.role_id);

      // Get user's permissions
      const rolePermissions = await apiRequest('/role_permissions');
      const permissions = await apiRequest('/permissions');

      const userPermissions = rolePermissions
        .filter(rp => rp.role_id === user.role_id)
        .map(rp => permissions.find(p => p.id === rp.permission_id))
        .filter(Boolean);

      // Return user data with role and permissions
      return {
        ...user,
        role: userRole?.name?.toLowerCase().replace(' ', '_') || 'unknown',
        role_name: userRole?.name || 'Unknown',
        permissions: userPermissions
      };
    } catch (error) {
      console.error('Authentication API error:', error);
      throw error;
    }
  },

  // Get user by ID (for token validation)
  getUser: (id) => apiRequest(`/users/${id}`),

  // Update user's last login
  updateLastLogin: async (id) => {
    try {
      // First get the current user data
      const user = await apiRequest(`/users/${id}`);

      // Update with new last_login timestamp
      return apiRequest(`/users/${id}`, {
        method: 'PUT',
        body: JSON.stringify({
          ...user,
          last_login: new Date().toISOString()
        }),
      });
    } catch (error) {
      console.error('Failed to update last login:', error);
      // Don't throw error for last login update failure - it's not critical
      return null;
    }
  },
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
  const activeUsers = Math.floor(totalCustomers * 0.8); // Assume 80% are active
  const pendingTransactions = transactions.filter(t => t.status === 'pending').length;
  const systemUptime = 99.9; // Static value for demo
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
 * Dashboard API functions - now using calculated data from customers and banks only
 */
export const dashboardAPI = {
  // Get dashboard overview data with calculated metrics
  getOverview: async () => {
    const [customers, banks] = await Promise.all([
      apiRequest('/customers'),
      apiRequest('/banks')
    ]);

    const transactions = deriveTransactionsFromCustomers(customers);
    const metrics = calculateDashboardMetrics(customers, banks);
    const activities = generateRecentActivities(customers, banks);
    const monthlyStats = calculateMonthlyStats(customers, banks);

    return {
      metrics,
      activities,
      monthlyStats,
      transactions, // Derived transactions for backward compatibility
      banks
    };
  },

  // Individual methods for backward compatibility
  getMetrics: async () => {
    const [customers, banks] = await Promise.all([
      apiRequest('/customers'),
      apiRequest('/banks')
    ]);
    return [calculateDashboardMetrics(customers, banks)];
  },

  getRecentActivities: async () => {
    const [customers, banks] = await Promise.all([
      apiRequest('/customers'),
      apiRequest('/banks')
    ]);
    return generateRecentActivities(customers, banks);
  },

  getMonthlyStats: async () => {
    const [customers, banks] = await Promise.all([
      apiRequest('/customers'),
      apiRequest('/banks')
    ]);
    return calculateMonthlyStats(customers, banks);
  },

  // Keep these for direct data access if needed
  getTransactions: async () => {
    const customers = await apiRequest('/customers');
    return deriveTransactionsFromCustomers(customers);
  },
  getBanks: () => apiRequest('/banks')
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
