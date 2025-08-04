import { useAuth } from '../contexts/AuthContext';

/**
 * Custom hook for permission-based UI rendering
 * Provides utilities to conditionally render components based on user permissions
 */
export const usePermissions = () => {
  const auth = useAuth();

  /**
   * Higher-order component that conditionally renders children based on permission
   * @param {string|string[]} permission - Single permission or array of permissions
   * @param {boolean} requireAll - If true, user must have ALL permissions. If false, user needs ANY permission
   * @returns {function} - Component wrapper function
   */
  const withPermission = (permission, requireAll = false) => {
    return (Component) => {
      return (props) => {
        const hasAccess = Array.isArray(permission)
          ? requireAll 
            ? auth.hasAllPermissions(permission)
            : auth.hasAnyPermission(permission)
          : auth.hasPermission(permission);

        if (!hasAccess) {
          return null;
        }

        return <Component {...props} />;
      };
    };
  };

  /**
   * Hook that returns whether user has specific permission(s)
   * @param {string|string[]} permission - Single permission or array of permissions
   * @param {boolean} requireAll - If true, user must have ALL permissions
   * @returns {boolean} - Whether user has the required permission(s)
   */
  const useHasPermission = (permission, requireAll = false) => {
    if (Array.isArray(permission)) {
      return requireAll 
        ? auth.hasAllPermissions(permission)
        : auth.hasAnyPermission(permission);
    }
    return auth.hasPermission(permission);
  };

  /**
   * Component that conditionally renders children based on permission
   * @param {object} props - Component props
   * @param {string|string[]} props.permission - Required permission(s)
   * @param {boolean} props.requireAll - Whether all permissions are required
   * @param {React.ReactNode} props.children - Children to render if permission check passes
   * @param {React.ReactNode} props.fallback - Fallback to render if permission check fails
   * @returns {React.ReactNode} - Rendered component or null
   */
  const PermissionGate = ({ permission, requireAll = false, children, fallback = null }) => {
    const hasAccess = useHasPermission(permission, requireAll);
    return hasAccess ? children : fallback;
  };

  /**
   * Component that conditionally renders children based on role
   * @param {object} props - Component props
   * @param {string|string[]} props.roles - Required role(s)
   * @param {React.ReactNode} props.children - Children to render if role check passes
   * @param {React.ReactNode} props.fallback - Fallback to render if role check fails
   * @returns {React.ReactNode} - Rendered component or null
   */
  const RoleGate = ({ roles, children, fallback = null }) => {
    const hasRole = Array.isArray(roles)
      ? roles.some(role => auth.hasRole(role))
      : auth.hasRole(roles);
    
    return hasRole ? children : fallback;
  };

  /**
   * Hook for CRUD operation permissions on specific entities
   * @param {string} entity - Entity name (customer, bank, etc.)
   * @returns {object} - Object with CRUD permission flags
   */
  const useCRUDPermissions = (entity) => {
    const entityUpper = entity.toUpperCase();
    
    return {
      canView: auth.hasPermission(`${entityUpper}_VIEW`),
      canCreate: auth.hasPermission(`${entityUpper}_CREATE`),
      canUpdate: auth.hasPermission(`${entityUpper}_UPDATE`),
      canDelete: auth.hasPermission(`${entityUpper}_DELETE`),
      canEdit: auth.hasPermission(`${entityUpper}_UPDATE`) || auth.hasPermission(`${entityUpper}_DELETE`),
      hasAnyAccess: auth.hasAnyPermission([
        `${entityUpper}_VIEW`,
        `${entityUpper}_CREATE`,
        `${entityUpper}_UPDATE`,
        `${entityUpper}_DELETE`
      ])
    };
  };

  /**
   * Hook for navigation permissions
   * @returns {object} - Object with navigation permission flags
   */
  const useNavigationPermissions = () => {
    return {
      canViewDashboard: auth.hasPermission(auth.PERMISSIONS.DASHBOARD_VIEW),
      canViewCustomers: auth.hasPermission(auth.PERMISSIONS.CUSTOMER_VIEW),
      canViewBanks: auth.hasPermission(auth.PERMISSIONS.BANK_VIEW),
      canAccessAdministration: auth.canAccessAdministration(),
      canViewRoles: auth.hasPermission(auth.PERMISSIONS.ROLES_VIEW),
      canViewPermissions: auth.hasPermission(auth.PERMISSIONS.PERMISSIONS_VIEW),
      canViewRolePermissions: auth.hasPermission(auth.PERMISSIONS.ROLE_PERMISSIONS_VIEW),
      canViewUsers: auth.hasPermission(auth.PERMISSIONS.USERS_VIEW)
    };
  };

  /**
   * Hook that returns disabled state for UI elements based on permissions
   * @param {string} permission - Required permission
   * @returns {boolean} - Whether the element should be disabled
   */
  const useDisabledState = (permission) => {
    return !auth.hasPermission(permission);
  };

  /**
   * Hook that returns CSS classes for disabled elements
   * @param {string} permission - Required permission
   * @param {string} enabledClasses - Classes when enabled
   * @param {string} disabledClasses - Classes when disabled
   * @returns {string} - CSS classes
   */
  const usePermissionClasses = (permission, enabledClasses = '', disabledClasses = 'opacity-50 cursor-not-allowed') => {
    const hasAccess = auth.hasPermission(permission);
    return hasAccess ? enabledClasses : disabledClasses;
  };

  return {
    // Components
    PermissionGate,
    RoleGate,
    
    // HOCs
    withPermission,
    
    // Hooks
    useHasPermission,
    useCRUDPermissions,
    useNavigationPermissions,
    useDisabledState,
    usePermissionClasses,
    
    // Direct auth access
    ...auth
  };
};

export default usePermissions;
