import React from 'react';
import { useAuth } from '../../contexts/AuthContext';

/**
 * Permission wrapper component for conditional rendering based on user permissions
 * @param {object} props - Component props
 * @param {string|string[]} props.permission - Required permission(s)
 * @param {string|string[]} props.roles - Required role(s)
 * @param {boolean} props.requireAll - Whether all permissions/roles are required
 * @param {React.ReactNode} props.children - Content to render if authorized
 * @param {React.ReactNode} props.fallback - Content to render if not authorized
 * @param {boolean} props.showFallback - Whether to show fallback content
 * @param {string} props.fallbackType - Type of fallback (message, disabled, hidden)
 */
const PermissionWrapper = ({
  permission = null,
  roles = null,
  requireAll = false,
  children,
  fallback = null,
  showFallback = true,
  fallbackType = 'hidden'
}) => {
  const { hasPermission, hasAnyPermission, hasAllPermissions, hasRole, isSales, user } = useAuth();

  // Check if user has required permissions
  const hasRequiredPermission = () => {
    if (!permission) return true;
    
    if (Array.isArray(permission)) {
      return requireAll 
        ? hasAllPermissions(permission)
        : hasAnyPermission(permission);
    }
    return hasPermission(permission);
  };

  // Check if user has required roles
  const hasRequiredRole = () => {
    if (!roles) return true;
    
    if (Array.isArray(roles)) {
      return roles.some(role => hasRole(role));
    }
    return hasRole(roles);
  };

  // Determine if content should be accessible
  const isAccessible = hasRequiredPermission() && hasRequiredRole();

  // If accessible, render children
  if (isAccessible) {
    return children;
  }

  // If not accessible, handle fallback
  if (!showFallback || fallbackType === 'hidden') {
    return null;
  }

  // Custom fallback provided
  if (fallback) {
    return fallback;
  }

  // Default fallback based on type
  switch (fallbackType) {
    case 'message':
      return (
        <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
          <div className="flex items-center">
            <svg className="w-5 h-5 text-yellow-600 dark:text-yellow-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
            <p className="text-sm text-yellow-800 dark:text-yellow-300">
              {isSales() 
                ? 'You have read-only access to this section.'
                : 'You don\'t have permission to access this section.'
              }
            </p>
          </div>
        </div>
      );

    case 'disabled':
      return (
        <div className="opacity-50 pointer-events-none">
          {children}
        </div>
      );

    default:
      return null;
  }
};

/**
 * Specialized wrapper components for common use cases
 */

// Wrapper for CRUD operations
export const CRUDWrapper = ({ entity, operation, children, ...props }) => {
  const permission = `${entity.toUpperCase()}_${operation.toUpperCase()}`;
  
  return (
    <PermissionWrapper permission={permission} {...props}>
      {children}
    </PermissionWrapper>
  );
};

// Wrapper for admin-only content
export const AdminOnly = ({ children, ...props }) => (
  <PermissionWrapper roles="admin" {...props}>
    {children}
  </PermissionWrapper>
);

// Wrapper for customer service and admin
export const CustomerServiceAndAdmin = ({ children, ...props }) => (
  <PermissionWrapper roles={['admin', 'customer_service']} {...props}>
    {children}
  </PermissionWrapper>
);

// Wrapper for read-only content (shows disabled version for sales)
export const ReadOnlyWrapper = ({ permission, children, ...props }) => {
  const { isSales } = useAuth();
  
  if (isSales()) {
    return (
      <div className="relative">
        <div className="opacity-60 pointer-events-none">
          {children}
        </div>
        <div className="absolute top-2 right-2">
          <span className="inline-flex items-center px-2 py-1 text-xs font-medium bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400 rounded-full">
            Read Only
          </span>
        </div>
      </div>
    );
  }
  
  return (
    <PermissionWrapper permission={permission} {...props}>
      {children}
    </PermissionWrapper>
  );
};

// Wrapper for form sections
export const FormSectionWrapper = ({ permission, title, description, children, ...props }) => {
  const { hasPermission, isSales } = useAuth();
  const canAccess = !permission || hasPermission(permission);
  
  if (!canAccess) {
    return null;
  }
  
  const isReadOnly = isSales() && permission && !permission.includes('VIEW');
  
  return (
    <div className={`space-y-4 ${isReadOnly ? 'opacity-75' : ''}`}>
      {title && (
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">
              {title}
            </h3>
            {description && (
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {description}
              </p>
            )}
          </div>
          {isReadOnly && (
            <span className="inline-flex items-center px-2 py-1 text-xs font-medium bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400 rounded-full">
              View Only
            </span>
          )}
        </div>
      )}
      
      <div className={isReadOnly ? 'pointer-events-none' : ''}>
        {children}
      </div>
    </div>
  );
};

export default PermissionWrapper;
