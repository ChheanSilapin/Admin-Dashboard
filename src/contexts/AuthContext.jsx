import { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '../services/api';

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
    const initializeAuth = () => {
      try {
        const token = localStorage.getItem('authToken');
        const userData = localStorage.getItem('userData');
        
        if (token && userData) {
          const parsedUser = JSON.parse(userData);
          setUser(parsedUser);
          setIsAuthenticated(true);
        }
      } catch (error) {
        console.error('Error initializing auth:', error);
        localStorage.removeItem('authToken');
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

      try {
        await authAPI.updateLastLogin(authenticatedUser.id);
      } catch (loginUpdateError) {
        console.warn('Failed to update last login timestamp:', loginUpdateError);
        
      }
      const token = `auth_token_${authenticatedUser.id}_${Date.now()}`;

      const storage = rememberMe ? localStorage : sessionStorage;
      storage.setItem('authToken', token);
      storage.setItem('userData', JSON.stringify(authenticatedUser));

      localStorage.setItem('authToken', token);
      localStorage.setItem('userData', JSON.stringify(authenticatedUser));

      setUser(authenticatedUser);
      setIsAuthenticated(true);

      return { success: true, user: authenticatedUser };
    } catch (error) {
      setError(error.message);
      return { success: false, error: error.message };
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    setError(null);
    
    localStorage.removeItem('authToken');
    localStorage.removeItem('userData');
    sessionStorage.removeItem('authToken');
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
        return getPermissionConstant(p.category, p.action) === permission;
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
    return hasAnyPermission([
      PERMISSIONS.ROLES_VIEW,
      PERMISSIONS.PERMISSIONS_VIEW,
      PERMISSIONS.ROLE_PERMISSIONS_VIEW,
      PERMISSIONS.USERS_VIEW
    ]);
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
