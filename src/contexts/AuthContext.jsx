import { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '../services/api';

/**
 * Parse permissions from Laravel API into array format expected by UI
 * @param {string|Array} permissionsData - Comma-separated permissions string or array of permission strings
 * @returns {Array} - Array of permission objects
 */
export const parsePermissions = (permissionsData) => {
  if (!permissionsData) return [];

  let permissions = [];

  // Handle different formats of permissions data
  if (typeof permissionsData === 'string') {
    // If it's a string, split by comma
    permissions = permissionsData.split(',').map(p => p.trim());
  } else if (Array.isArray(permissionsData)) {
    // If it's already an array, use it directly
    permissions = permissionsData;
  } else {
    console.warn('Unexpected permissions format:', permissionsData);
    return [];
  }

  return permissions.map(permission => {
    const trimmedPermission = permission.trim();

    // Handle special cases first
    if (trimmedPermission === 'assign permissions') {
      return { category: 'assign_permissions', action: 'read' };
    }

    // Handle Laravel API format: "view users", "create customers", etc.
    const parts = trimmedPermission.split(' ');
    if (parts.length >= 2) {
      const action = parts[0]; // "view", "create", etc.
      const category = parts.slice(1).join('_'); // "users", "customers", etc.

      // Map action to standard CRUD operations
      const actionMap = {
        'view': 'read',
        'create': 'create',
        'update': 'update',
        'delete': 'delete',
        'manage': 'read', // Treat "manage" as read permission for now
        'assign': 'create' // For "assign permissions"
      };

      const mappedAction = actionMap[action] || action;

      return { category, action: mappedAction };
    }

    // Fallback for permissions that don't follow the standard format
    return { category: 'unknown', action: trimmedPermission };
  });
};

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const ROLES = {
  ADMIN: 'admin',
  CUSTOMER_SERVICE: 'customer_service',
  SALES: 'sales'
};


export const PERMISSIONS = {
  // Dashboard permissions
  DASHBOARD_VIEW: 'dashboard_view',
  
  // Customer permissions
  CUSTOMER_VIEW: 'customer_view',
  CUSTOMER_CREATE: 'customer_create',
  CUSTOMER_UPDATE: 'customer_update',
  CUSTOMER_DELETE: 'customer_delete',
  
  // Bank permissions
  BANK_VIEW: 'bank_view',
  BANK_CREATE: 'bank_create',
  BANK_UPDATE: 'bank_update',
  BANK_DELETE: 'bank_delete',
  
  // Administration permissions
  ROLES_VIEW: 'roles_view',
  ROLES_CREATE: 'roles_create',
  ROLES_UPDATE: 'roles_update',
  ROLES_DELETE: 'roles_delete',
  
  PERMISSIONS_VIEW: 'permissions_view',
  PERMISSIONS_CREATE: 'permissions_create',
  PERMISSIONS_UPDATE: 'permissions_update',
  PERMISSIONS_DELETE: 'permissions_delete',
  
  ROLE_PERMISSIONS_VIEW: 'role_permissions_view',
  ROLE_PERMISSIONS_CREATE: 'role_permissions_create',
  ROLE_PERMISSIONS_UPDATE: 'role_permissions_update',
  ROLE_PERMISSIONS_DELETE: 'role_permissions_delete',
  
  USERS_VIEW: 'users_view',
  USERS_CREATE: 'users_create',
  USERS_UPDATE: 'users_update',
  USERS_DELETE: 'users_delete'
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const token = localStorage.getItem('auth_token');
        const userData = localStorage.getItem('userData');

        if (token && userData) {
          const parsedUser = JSON.parse(userData);

          // Check if token is expired (if expires_in is available)
          const tokenExpiry = parsedUser.expires_in;
          const loginTime = parsedUser.login_time || Date.now();
          const currentTime = Date.now();

          // If token has expiry info and is expired, clear storage
          if (tokenExpiry && (currentTime - loginTime) > (tokenExpiry * 1000)) {
            console.warn('Token expired, clearing storage');
            localStorage.removeItem('auth_token');
            localStorage.removeItem('userData');
            setIsLoading(false);
            return;
          }

          // Use stored user data without making API call for better performance
          // Only validate token if it's been more than 1 hour since last validation
          const lastValidation = parsedUser.last_validation || 0;
          const shouldValidate = (currentTime - lastValidation) > (60 * 60 * 1000); // 1 hour

          if (shouldValidate) {
            try {
              const currentUser = await authAPI.getUser();
              if (currentUser) {
                // Update user data with fresh data from server
                let roleString = parsedUser.role || 'unknown';
                let roleName = parsedUser.role_name || 'Unknown';

                if (currentUser.roles) {
                  if (typeof currentUser.roles === 'string') {
                    roleString = currentUser.roles.toLowerCase().replace(' ', '_');
                    roleName = currentUser.roles;
                  } else if (Array.isArray(currentUser.roles)) {
                    const firstRole = currentUser.roles[0];
                    if (typeof firstRole === 'string') {
                      roleString = firstRole.toLowerCase().replace(' ', '_');
                      roleName = firstRole;
                    } else if (firstRole && firstRole.name) {
                      roleString = firstRole.name.toLowerCase().replace(' ', '_');
                      roleName = firstRole.name;
                    }
                  } else if (currentUser.roles.name) {
                    roleString = currentUser.roles.name.toLowerCase().replace(' ', '_');
                    roleName = currentUser.roles.name;
                  }
                }

                const updatedUser = {
                  ...parsedUser,
                  ...currentUser,
                  role: roleString,
                  role_name: roleName,
                  permissions: parsePermissions(currentUser.permissions) || parsedUser.permissions,
                  last_validation: currentTime
                };

                setUser(updatedUser);
                setIsAuthenticated(true);
                localStorage.setItem('userData', JSON.stringify(updatedUser));
              } else {
                throw new Error('Invalid token');
              }
            } catch (tokenError) {
              console.warn('Token validation failed:', tokenError);
              localStorage.removeItem('auth_token');
              localStorage.removeItem('userData');
            }
          } else {
            // Use cached user data without API call
            setUser(parsedUser);
            setIsAuthenticated(true);
          }
        }
      } catch (error) {
        console.error('Error initializing auth:', error);
        localStorage.removeItem('auth_token');
        localStorage.removeItem('userData');
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const login = async (username, password, rememberMe = false) => {
    setIsLoading(true);
    setError(null);

    try {
      const authenticatedUser = await authAPI.login(username, password);

      // Add login time and validation timestamp for better token management
      const userWithTimestamp = {
        ...authenticatedUser,
        login_time: Date.now(),
        last_validation: Date.now()
      };

      // Store user data in the appropriate storage
      const storage = rememberMe ? localStorage : sessionStorage;
      storage.setItem('userData', JSON.stringify(userWithTimestamp));

      // Always store in localStorage for consistency (token is already stored by authAPI.login)
      localStorage.setItem('userData', JSON.stringify(userWithTimestamp));

      setUser(userWithTimestamp);
      setIsAuthenticated(true);

      return { success: true, user: userWithTimestamp };
    } catch (error) {
      setError(error.message);
      return { success: false, error: error.message };
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      // Call the API logout endpoint to invalidate the token on the server
      await authAPI.logout();
    } catch (error) {
      console.warn('Failed to logout from server:', error);
      // Continue with local logout even if server logout fails
    }

    setUser(null);
    setIsAuthenticated(false);
    setError(null);

    // Clear all stored data (authAPI.logout() already clears the token)
    localStorage.removeItem('userData');
    sessionStorage.removeItem('userData');
  };

  const hasPermission = (permission) => {
    if (!user) return false;

    // Dashboard access is granted to all authenticated users
    if (permission === PERMISSIONS.DASHBOARD_VIEW) {
      return true;
    }

    if (!user.permissions) return false;

    // Check against user permissions from database
    const userPermissions = user.permissions || [];

    return userPermissions.some(p => {
      // Handle permission objects with category and action fields
      if (p.category && p.action) {
        const mappedPermission = getPermissionConstant(p.category, p.action);
        return mappedPermission === permission;
      }
      return false;
    });
  };

  const getPermissionConstant = (category, action) => {
    const permissionMap = {
      customers: {
        create: PERMISSIONS.CUSTOMER_CREATE,
        read: PERMISSIONS.CUSTOMER_VIEW,
        update: PERMISSIONS.CUSTOMER_UPDATE,
        delete: PERMISSIONS.CUSTOMER_DELETE,
      },
      banks: {
        create: PERMISSIONS.BANK_CREATE,
        read: PERMISSIONS.BANK_VIEW,
        update: PERMISSIONS.BANK_UPDATE,
        delete: PERMISSIONS.BANK_DELETE,
      },
      users: {
        create: PERMISSIONS.USERS_CREATE,
        read: PERMISSIONS.USERS_VIEW,
        update: PERMISSIONS.USERS_UPDATE,
        delete: PERMISSIONS.USERS_DELETE,
      },
      roles: {
        create: PERMISSIONS.ROLES_CREATE,
        read: PERMISSIONS.ROLES_VIEW,
        update: PERMISSIONS.ROLES_UPDATE,
        delete: PERMISSIONS.ROLES_DELETE,
      },
      permissions: {
        create: PERMISSIONS.PERMISSIONS_CREATE,
        read: PERMISSIONS.PERMISSIONS_VIEW,
        update: PERMISSIONS.PERMISSIONS_UPDATE,
        delete: PERMISSIONS.PERMISSIONS_DELETE,
      },
      // Handle "assign permissions" as role_permissions
      'assign_permissions': {
        read: PERMISSIONS.ROLE_PERMISSIONS_VIEW,
        create: PERMISSIONS.ROLE_PERMISSIONS_CREATE,
        update: PERMISSIONS.ROLE_PERMISSIONS_UPDATE,
        delete: PERMISSIONS.ROLE_PERMISSIONS_DELETE,
      },
    };

    return permissionMap[category]?.[action] || null;
  };

  const hasAnyPermission = (permissions) => {
    return permissions.some(permission => hasPermission(permission));
  };

  const hasAllPermissions = (permissions) => {
    return permissions.every(permission => hasPermission(permission));
  };

  const hasRole = (role) => {
    return user?.role === role;
  };

  const isAdmin = () => hasRole(ROLES.ADMIN);
  const isCustomerService = () => hasRole(ROLES.CUSTOMER_SERVICE);
  const isSales = () => hasRole(ROLES.SALES);

  const canAccessAdministration = () => {
    const adminPermissions = [
      PERMISSIONS.ROLES_VIEW,
      PERMISSIONS.PERMISSIONS_VIEW,
      PERMISSIONS.ROLE_PERMISSIONS_VIEW,
      PERMISSIONS.USERS_VIEW
    ];

    return hasAnyPermission(adminPermissions);
  };

  const canCreateCustomer = () => hasPermission(PERMISSIONS.CUSTOMER_CREATE);
  const canUpdateCustomer = () => hasPermission(PERMISSIONS.CUSTOMER_UPDATE);
  const canDeleteCustomer = () => hasPermission(PERMISSIONS.CUSTOMER_DELETE);
  const canViewCustomer = () => hasPermission(PERMISSIONS.CUSTOMER_VIEW);

  const canCreateBank = () => hasPermission(PERMISSIONS.BANK_CREATE);
  const canUpdateBank = () => hasPermission(PERMISSIONS.BANK_UPDATE);
  const canDeleteBank = () => hasPermission(PERMISSIONS.BANK_DELETE);
  const canViewBank = () => hasPermission(PERMISSIONS.BANK_VIEW);

  const value = {
    // State
    user,
    isAuthenticated,
    isLoading,
    error,
    

    login,
    logout,
    
    hasPermission,
    hasAnyPermission,
    hasAllPermissions,
    hasRole,
    
    // Role checks
    isAdmin,
    isCustomerService,
    isSales,
    
    // Feature access checks
    canAccessAdministration,
    
    // Entity-specific permission checks
    canCreateCustomer,
    canUpdateCustomer,
    canDeleteCustomer,
    canViewCustomer,
    canCreateBank,
    canUpdateBank,
    canDeleteBank,
    canViewBank,
    
    // Constants
    ROLES,
    PERMISSIONS
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
