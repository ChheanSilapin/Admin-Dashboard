import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const Unauthorized = () => {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4">
      <div className="max-w-lg w-full bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 text-center">
        {/* Icon */}
        <div className="mb-8">
          <div className="mx-auto w-20 h-20 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center mb-6">
            <svg className="w-10 h-10 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728L5.636 5.636m12.728 12.728L5.636 5.636" />
            </svg>
          </div>
          
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-3">
            Access Denied
          </h1>
          
          <p className="text-lg text-gray-600 dark:text-gray-400 mb-2">
            You don't have permission to access this resource
          </p>
          
          {user && (
            <p className="text-sm text-gray-500 dark:text-gray-500">
              Logged in as: <span className="font-medium">{user.username}</span> ({user.role})
            </p>
          )}
        </div>

        {/* Error Details */}
        <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4 mb-8">
          <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-2">
            What you can do:
          </h3>
          <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1 text-left">
            <li>• Contact your administrator to request access</li>
            <li>• Check if you're logged in with the correct account</li>
            <li>• Return to a page you have access to</li>
          </ul>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          <Link
            to="/"
            className="w-full inline-flex items-center justify-center bg-green-600 hover:bg-green-700 text-white font-medium py-3 px-6 rounded-lg transition-colors"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            Go to Dashboard
          </Link>
          
          <button
            onClick={() => window.history.back()}
            className="w-full bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 font-medium py-3 px-6 rounded-lg transition-colors"
          >
            Go Back
          </button>
          
          <button
            onClick={logout}
            className="w-full bg-red-100 hover:bg-red-200 dark:bg-red-900/20 dark:hover:bg-red-900/30 text-red-700 dark:text-red-400 font-medium py-3 px-6 rounded-lg transition-colors"
          >
            Logout & Login as Different User
          </button>
        </div>

        {/* Help Text */}
        <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
          <p className="text-xs text-gray-500 dark:text-gray-500">
            If you believe this is an error, please contact your system administrator.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Unauthorized;
