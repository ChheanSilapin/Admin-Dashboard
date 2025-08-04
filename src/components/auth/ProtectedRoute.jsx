import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import AuthLoadingSpinner from './AuthLoadingSpinner';

/**
 * ProtectedRoute component that handles authentication and authorization
 * @param {object} props - Component props
 * @param {React.ReactNode} props.children - Child components to render if authorized
 * @param {string|string[]} props.requiredPermissions - Required permission(s) to access the route
 * @param {string|string[]} props.requiredRoles - Required role(s) to access the route
 * @param {boolean} props.requireAll - Whether all permissions/roles are required (default: false)
 * @param {string} props.redirectTo - Where to redirect if unauthorized (default: '/login')
 * @param {React.ReactNode} props.fallback - Custom component to show if unauthorized
 */
const ProtectedRoute = ({ 
  children, 
  requiredPermissions = null,
  requiredRoles = null,
  requireAll = false,
  redirectTo = '/login',
  fallback = null
}) => {
  const { isAuthenticated, isLoading, user, hasPermission, hasAnyPermission, hasAllPermissions, hasRole } = useAuth();
  const location = useLocation();

  // Show loading spinner while checking authentication
  if (isLoading) {
    return <AuthLoadingSpinner />;
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to={redirectTo} state={{ from: location }} replace />;
  }

  // Check role-based access if roles are specified
  if (requiredRoles) {
    const hasRequiredRole = Array.isArray(requiredRoles)
      ? requiredRoles.some(role => hasRole(role))
      : hasRole(requiredRoles);

    if (!hasRequiredRole) {
      // If fallback is provided, show it; otherwise redirect to unauthorized page
      if (fallback) {
        return fallback;
      }
      return <Navigate to="/unauthorized" replace />;
    }
  }

  // Check permission-based access if permissions are specified
  if (requiredPermissions) {
    let hasRequiredPermission = false;

    if (Array.isArray(requiredPermissions)) {
      hasRequiredPermission = requireAll 
        ? hasAllPermissions(requiredPermissions)
        : hasAnyPermission(requiredPermissions);
    } else {
      hasRequiredPermission = hasPermission(requiredPermissions);
    }

    if (!hasRequiredPermission) {
      // If fallback is provided, show it; otherwise redirect to unauthorized page
      if (fallback) {
        return fallback;
      }
      return <Navigate to="/unauthorized" replace />;
    }
  }

  // User is authenticated and authorized, render the protected content
  return children;
};

/**
 * Higher-order component version of ProtectedRoute
 * @param {React.Component} Component - Component to protect
 * @param {object} protectionConfig - Protection configuration
 * @returns {React.Component} - Protected component
 */
export const withProtectedRoute = (Component, protectionConfig = {}) => {
  return (props) => (
    <ProtectedRoute {...protectionConfig}>
      <Component {...props} />
    </ProtectedRoute>
  );
};

/**
 * Route protection for admin-only pages
 */
export const AdminRoute = ({ children, ...props }) => (
  <ProtectedRoute 
    requiredRoles="admin" 
    fallback={<UnauthorizedAccess />}
    {...props}
  >
    {children}
  </ProtectedRoute>
);

/**
 * Route protection for customer service and admin
 */
export const CustomerServiceRoute = ({ children, ...props }) => (
  <ProtectedRoute 
    requiredRoles={['admin', 'customer_service']} 
    fallback={<UnauthorizedAccess />}
    {...props}
  >
    {children}
  </ProtectedRoute>
);

/**
 * Route protection for all authenticated users (dashboard access)
 */
export const DashboardRoute = ({ children, ...props }) => (
  <ProtectedRoute 
    requiredPermissions="dashboard_view"
    fallback={<UnauthorizedAccess />}
    {...props}
  >
    {children}
  </ProtectedRoute>
);

/**
 * Unauthorized access component
 */
const UnauthorizedAccess = () => (
  <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
    <div className="max-w-md w-full bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 text-center">
      <div className="mb-6">
        <div className="mx-auto w-16 h-16 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center mb-4">
          <svg className="w-8 h-8 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          Access Denied
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          You don't have permission to access this page. Please contact your administrator if you believe this is an error.
        </p>
      </div>
      
      <div className="space-y-3">
        <button
          onClick={() => window.history.back()}
          className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
        >
          Go Back
        </button>
        <button
          onClick={() => window.location.href = '/'}
          className="w-full bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 font-medium py-2 px-4 rounded-lg transition-colors"
        >
          Go to Dashboard
        </button>
      </div>
    </div>
  </div>
);

export default ProtectedRoute;
