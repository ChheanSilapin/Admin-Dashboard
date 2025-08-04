import React from 'react';
import { useAuth } from '../../contexts/AuthContext';

/**
 * Role indicator component that shows the current user's access level
 * @param {object} props - Component props
 * @param {boolean} props.showOnlyForSales - Only show indicator for Sales role
 * @param {string} props.className - Additional CSS classes
 * @param {string} props.position - Position of the indicator (top-right, top-left, etc.)
 */
const RoleIndicator = ({ 
  showOnlyForSales = true, 
  className = '',
  position = 'top-right'
}) => {
  const { user, isAdmin, isCustomerService, isSales } = useAuth();

  if (!user) return null;

  // Only show for Sales role if showOnlyForSales is true
  if (showOnlyForSales && !isSales()) return null;

  const getRoleInfo = () => {
    if (isAdmin()) {
      return {
        label: 'Admin',
        description: 'Full Access',
        bgColor: 'bg-green-100 dark:bg-green-900/30',
        textColor: 'text-green-700 dark:text-green-400',
        icon: '🔐'
      };
    }
    
    if (isCustomerService()) {
      return {
        label: 'Customer Service',
        description: 'Customer & Bank Management',
        bgColor: 'bg-blue-100 dark:bg-blue-900/30',
        textColor: 'text-blue-700 dark:text-blue-400',
        icon: '👥'
      };
    }
    
    if (isSales()) {
      return {
        label: 'Sales',
        description: 'Read-Only Access',
        bgColor: 'bg-yellow-100 dark:bg-yellow-900/30',
        textColor: 'text-yellow-700 dark:text-yellow-400',
        icon: '📊'
      };
    }

    return null;
  };

  const roleInfo = getRoleInfo();
  if (!roleInfo) return null;

  const getPositionClasses = () => {
    switch (position) {
      case 'top-right':
        return 'absolute top-4 right-4';
      case 'top-left':
        return 'absolute top-4 left-4';
      case 'bottom-right':
        return 'absolute bottom-4 right-4';
      case 'bottom-left':
        return 'absolute bottom-4 left-4';
      default:
        return 'absolute top-4 right-4';
    }
  };

  return (
    <div className={`${getPositionClasses()} z-10 ${className}`}>
      <div className={`inline-flex items-center px-3 py-2 rounded-lg shadow-sm ${roleInfo.bgColor} ${roleInfo.textColor}`}>
        <span className="mr-2 text-sm">{roleInfo.icon}</span>
        <div className="text-sm">
          <div className="font-medium">{roleInfo.label}</div>
          <div className="text-xs opacity-75">{roleInfo.description}</div>
        </div>
      </div>
    </div>
  );
};

/**
 * Compact role badge for inline use
 */
export const RoleBadge = ({ className = '' }) => {
  const { user, isAdmin, isCustomerService, isSales } = useAuth();

  if (!user) return null;

  const getRoleInfo = () => {
    if (isAdmin()) {
      return {
        label: 'Admin',
        bgColor: 'bg-green-100 dark:bg-green-900/30',
        textColor: 'text-green-700 dark:text-green-400',
        icon: '🔐'
      };
    }
    
    if (isCustomerService()) {
      return {
        label: 'Customer Service',
        bgColor: 'bg-blue-100 dark:bg-blue-900/30',
        textColor: 'text-blue-700 dark:text-blue-400',
        icon: '👥'
      };
    }
    
    if (isSales()) {
      return {
        label: 'Sales',
        bgColor: 'bg-yellow-100 dark:bg-yellow-900/30',
        textColor: 'text-yellow-700 dark:text-yellow-400',
        icon: '📊'
      };
    }

    return null;
  };

  const roleInfo = getRoleInfo();
  if (!roleInfo) return null;

  return (
    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${roleInfo.bgColor} ${roleInfo.textColor} ${className}`}>
      <span className="mr-1">{roleInfo.icon}</span>
      {roleInfo.label}
    </span>
  );
};

/**
 * Read-only banner for Sales users
 */
export const ReadOnlyBanner = ({ className = '' }) => {
  const { isSales } = useAuth();

  if (!isSales()) return null;

  return (
    <div className={`bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-3 mb-4 ${className}`}>
      <div className="flex items-center">
        <svg className="w-5 h-5 text-yellow-600 dark:text-yellow-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
        </svg>
        <div>
          <p className="text-sm font-medium text-yellow-800 dark:text-yellow-300">
            Read-Only Access
          </p>
          <p className="text-xs text-yellow-700 dark:text-yellow-400">
            You can view data but cannot make changes. Contact your administrator for additional permissions.
          </p>
        </div>
      </div>
    </div>
  );
};

export default RoleIndicator;
