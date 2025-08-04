import { ROLES, PERMISSIONS } from '../contexts/AuthContext';

/**
 * Route configuration with role and permission requirements
 * This centralizes all route protection logic for easier maintenance
 */
export const ROUTE_CONFIG = {
  // Public routes (no authentication required)
  PUBLIC: {
    LOGIN: '/login',
    UNAUTHORIZED: '/unauthorized'
  },

  // Dashboard routes (all authenticated users)
  DASHBOARD: {
    HOME: '/',
    permissions: [PERMISSIONS.DASHBOARD_VIEW],
    roles: [ROLES.ADMIN, ROLES.CUSTOMER_SERVICE, ROLES.SALES]
  },

  // Customer management routes
  CUSTOMERS: {
    LIST: '/customers',
    permissions: [PERMISSIONS.CUSTOMER_VIEW],
    roles: [ROLES.ADMIN, ROLES.CUSTOMER_SERVICE, ROLES.SALES]
  },

  // Bank management routes
  BANKS: {
    LIST: '/banks',
    ADD: '/banks/add',
    permissions: [PERMISSIONS.BANK_VIEW],
    roles: [ROLES.ADMIN, ROLES.CUSTOMER_SERVICE, ROLES.SALES],
    // Add/Edit specific permissions
    addPermissions: [PERMISSIONS.BANK_CREATE],
    addRoles: [ROLES.ADMIN, ROLES.CUSTOMER_SERVICE]
  },

  // Administration routes (Admin only)
  ADMIN: {
    ROLES: {
      LIST: '/roles',
      ADD: '/roles/add',
      permissions: [PERMISSIONS.ROLES_VIEW],
      roles: [ROLES.ADMIN],
      addPermissions: [PERMISSIONS.ROLES_CREATE]
    },
    PERMISSIONS: {
      LIST: '/permissions',
      ADD: '/permissions/add',
      permissions: [PERMISSIONS.PERMISSIONS_VIEW],
      roles: [ROLES.ADMIN],
      addPermissions: [PERMISSIONS.PERMISSIONS_CREATE]
    },
    ROLE_PERMISSIONS: {
      LIST: '/role-permissions',
      permissions: [PERMISSIONS.ROLE_PERMISSIONS_VIEW],
      roles: [ROLES.ADMIN]
    },
    USERS: {
      LIST: '/users',
      permissions: [PERMISSIONS.USERS_VIEW],
      roles: [ROLES.ADMIN]
    },
    AUTH_SETTINGS: {
      LIST: '/auth/settings',
      permissions: [PERMISSIONS.USERS_VIEW],
      roles: [ROLES.ADMIN]
    }
  }
};

/**
 * Helper function to check if user can access a route
 * @param {object} user - Current user object
 * @param {object} routeConfig - Route configuration
 * @param {function} hasPermission - Permission checking function
 * @param {function} hasRole - Role checking function
 * @returns {boolean} - Whether user can access the route
 */
export const canAccessRoute = (user, routeConfig, hasPermission, hasRole) => {
  if (!user || !routeConfig) return false;

  // Check role requirements
  if (routeConfig.roles && routeConfig.roles.length > 0) {
    const hasRequiredRole = routeConfig.roles.some(role => hasRole(role));
    if (!hasRequiredRole) return false;
  }

  // Check permission requirements
  if (routeConfig.permissions && routeConfig.permissions.length > 0) {
    const hasRequiredPermission = routeConfig.permissions.some(permission => hasPermission(permission));
    if (!hasRequiredPermission) return false;
  }

  return true;
};

/**
 * Get accessible routes for current user
 * @param {object} user - Current user object
 * @param {function} hasPermission - Permission checking function
 * @param {function} hasRole - Role checking function
 * @returns {object} - Object with accessible routes
 */
export const getAccessibleRoutes = (user, hasPermission, hasRole) => {
  const accessible = {
    dashboard: false,
    customers: false,
    banks: false,
    administration: {
      roles: false,
      permissions: false,
      rolePermissions: false,
      users: false,
      authSettings: false
    }
  };

  if (!user) return accessible;

  // Check dashboard access
  accessible.dashboard = canAccessRoute(user, ROUTE_CONFIG.DASHBOARD, hasPermission, hasRole);

  // Check customer access
  accessible.customers = canAccessRoute(user, ROUTE_CONFIG.CUSTOMERS, hasPermission, hasRole);

  // Check bank access
  accessible.banks = canAccessRoute(user, ROUTE_CONFIG.BANKS, hasPermission, hasRole);

  // Check administration access
  accessible.administration.roles = canAccessRoute(user, ROUTE_CONFIG.ADMIN.ROLES, hasPermission, hasRole);
  accessible.administration.permissions = canAccessRoute(user, ROUTE_CONFIG.ADMIN.PERMISSIONS, hasPermission, hasRole);
  accessible.administration.rolePermissions = canAccessRoute(user, ROUTE_CONFIG.ADMIN.ROLE_PERMISSIONS, hasPermission, hasRole);
  accessible.administration.users = canAccessRoute(user, ROUTE_CONFIG.ADMIN.USERS, hasPermission, hasRole);
  accessible.administration.authSettings = canAccessRoute(user, ROUTE_CONFIG.ADMIN.AUTH_SETTINGS, hasPermission, hasRole);

  return accessible;
};

/**
 * Check if user can perform CRUD operations on an entity
 * @param {object} user - Current user object
 * @param {string} entity - Entity name (customer, bank, etc.)
 * @param {function} hasPermission - Permission checking function
 * @returns {object} - CRUD permissions object
 */
export const getEntityCRUDPermissions = (user, entity, hasPermission) => {
  if (!user || !entity) {
    return {
      canView: false,
      canCreate: false,
      canUpdate: false,
      canDelete: false
    };
  }

  const entityUpper = entity.toUpperCase();
  
  return {
    canView: hasPermission(`${entityUpper}_VIEW`),
    canCreate: hasPermission(`${entityUpper}_CREATE`),
    canUpdate: hasPermission(`${entityUpper}_UPDATE`),
    canDelete: hasPermission(`${entityUpper}_DELETE`)
  };
};

/**
 * Route protection presets for common use cases
 */
export const ROUTE_PRESETS = {
  // Admin only routes
  ADMIN_ONLY: {
    roles: [ROLES.ADMIN]
  },

  // Customer service and admin routes
  CUSTOMER_SERVICE_AND_ADMIN: {
    roles: [ROLES.ADMIN, ROLES.CUSTOMER_SERVICE]
  },

  // All authenticated users
  ALL_AUTHENTICATED: {
    roles: [ROLES.ADMIN, ROLES.CUSTOMER_SERVICE, ROLES.SALES]
  },

  // Dashboard access
  DASHBOARD_ACCESS: {
    permissions: [PERMISSIONS.DASHBOARD_VIEW]
  },

  // Customer management
  CUSTOMER_VIEW: {
    permissions: [PERMISSIONS.CUSTOMER_VIEW]
  },

  CUSTOMER_MANAGE: {
    permissions: [PERMISSIONS.CUSTOMER_CREATE, PERMISSIONS.CUSTOMER_UPDATE, PERMISSIONS.CUSTOMER_DELETE],
    requireAll: false // User needs ANY of these permissions
  },

  // Bank management
  BANK_VIEW: {
    permissions: [PERMISSIONS.BANK_VIEW]
  },

  BANK_MANAGE: {
    permissions: [PERMISSIONS.BANK_CREATE, PERMISSIONS.BANK_UPDATE, PERMISSIONS.BANK_DELETE],
    requireAll: false
  }
};

export default ROUTE_CONFIG;
