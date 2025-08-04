import React from 'react';
import { useAuth } from '../../contexts/AuthContext';

/**
 * Permission-based button component that handles role-based access control
 * @param {object} props - Component props
 * @param {string|string[]} props.permission - Required permission(s)
 * @param {string|string[]} props.roles - Required role(s)
 * @param {boolean} props.requireAll - Whether all permissions/roles are required
 * @param {React.ReactNode} props.children - Button content
 * @param {function} props.onClick - Click handler
 * @param {boolean} props.disabled - Additional disabled state
 * @param {string} props.className - CSS classes
 * @param {string} props.disabledClassName - CSS classes when disabled
 * @param {string} props.variant - Button variant (primary, secondary, danger)
 * @param {string} props.size - Button size (sm, md, lg)
 * @param {boolean} props.showTooltip - Whether to show permission tooltip
 * @param {string} props.tooltipText - Custom tooltip text
 * @param {object} props.rest - Other button props
 */
const PermissionButton = ({
  permission = null,
  roles = null,
  requireAll = false,
  children,
  onClick,
  disabled = false,
  className = '',
  disabledClassName = '',
  variant = 'primary',
  size = 'md',
  showTooltip = true,
  tooltipText = null,
  ...rest
}) => {
  const { hasPermission, hasAnyPermission, hasAllPermissions, hasRole, isSales } = useAuth();

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

  // Determine if button should be accessible
  const isAccessible = hasRequiredPermission() && hasRequiredRole();
  const isDisabled = disabled || !isAccessible;

  // For Sales role, hide action buttons completely instead of showing disabled buttons
  if (isSales() && permission && !permission.includes('VIEW')) {
    return null;
  }

  // Get variant classes
  const getVariantClasses = () => {
    const baseClasses = 'inline-flex items-center justify-center font-medium rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2';
    
    if (isDisabled) {
      return `${baseClasses} bg-gray-300 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed ${disabledClassName}`;
    }

    switch (variant) {
      case 'primary':
        return `${baseClasses} bg-blue-600 hover:bg-blue-700 text-white focus:ring-blue-500`;
      case 'secondary':
        return `${baseClasses} bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 focus:ring-gray-500`;
      case 'danger':
        return `${baseClasses} bg-red-600 hover:bg-red-700 text-white focus:ring-red-500`;
      case 'success':
        return `${baseClasses} bg-green-600 hover:bg-green-700 text-white focus:ring-green-500`;
      case 'warning':
        return `${baseClasses} bg-yellow-600 hover:bg-yellow-700 text-white focus:ring-yellow-500`;
      case 'ghost':
        return `${baseClasses} bg-transparent hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300 focus:ring-gray-500`;
      default:
        return `${baseClasses} bg-blue-600 hover:bg-blue-700 text-white focus:ring-blue-500`;
    }
  };

  // Get size classes
  const getSizeClasses = () => {
    switch (size) {
      case 'sm':
        return 'px-3 py-1.5 text-sm';
      case 'md':
        return 'px-4 py-2 text-sm';
      case 'lg':
        return 'px-6 py-3 text-base';
      default:
        return 'px-4 py-2 text-sm';
    }
  };

  // Get tooltip text
  const getTooltipText = () => {
    if (tooltipText) return tooltipText;
    
    if (!isAccessible) {
      if (isSales()) {
        return 'Read-only access - Contact administrator for permissions';
      }
      return 'Insufficient permissions - Contact administrator';
    }
    
    return null;
  };

  // Handle click
  const handleClick = (e) => {
    if (isDisabled) {
      e.preventDefault();
      return;
    }
    
    if (onClick) {
      onClick(e);
    }
  };

  const buttonClasses = `${getVariantClasses()} ${getSizeClasses()} ${className}`;
  const tooltip = showTooltip ? getTooltipText() : null;

  return (
    <div className="relative inline-block">
      <button
        {...rest}
        onClick={handleClick}
        disabled={isDisabled}
        className={buttonClasses}
        title={tooltip}
      >
        {children}
      </button>
      
      {/* Tooltip for better UX */}
      {tooltip && showTooltip && (
        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 text-xs text-white bg-gray-900 dark:bg-gray-700 rounded opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap z-50">
          {tooltip}
        </div>
      )}
    </div>
  );
};

/**
 * Specialized button components for common actions
 */

// Add button with create permission
export const AddButton = ({ permission, children = 'Add', ...props }) => (
  <PermissionButton
    permission={permission}
    variant="primary"
    {...props}
  >
    {children}
  </PermissionButton>
);

// Edit button with update permission
export const EditButton = ({ permission, children, variant = "ghost", ...props }) => (
  <PermissionButton
    permission={permission}
    variant={variant}
    size="sm"
    {...props}
  >
    {children}
  </PermissionButton>
);

// Delete button with delete permission
export const DeleteButton = ({ permission, children, variant = "ghost", ...props }) => (
  <PermissionButton
    permission={permission}
    variant={variant}
    size="sm"
    {...props}
  >
    {children}
  </PermissionButton>
);

// Save button with update/create permission
export const SaveButton = ({ permission, children = 'Save', ...props }) => (
  <PermissionButton
    permission={permission}
    variant="success"
    {...props}
  >
    {children}
  </PermissionButton>
);

export default PermissionButton;
