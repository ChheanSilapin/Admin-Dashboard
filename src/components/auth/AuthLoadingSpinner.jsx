import React from 'react';

const AuthLoadingSpinner = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
      <div className="flex flex-col items-center space-y-4">
        {/* Spinner */}
        <div className="relative">
          <div className="w-12 h-12 border-4 border-gray-200 dark:border-gray-700 rounded-full animate-spin"></div>
          <div className="absolute top-0 left-0 w-12 h-12 border-4 border-green-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
        
        {/* Loading text */}
        <div className="text-center">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
            Loading...
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Checking authentication status
          </p>
        </div>
      </div>
    </div>
  );
};

export default AuthLoadingSpinner;
