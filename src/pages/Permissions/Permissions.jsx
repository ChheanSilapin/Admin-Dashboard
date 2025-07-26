import React from 'react';
import { Link } from 'react-router-dom';
import { KeyIcon } from '../../icons';

const Permissions = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Permission</h1>
          <p className="text-gray-600 dark:text-gray-400">Manage system permissions</p>
        </div>
        <Link to="/permissions/add" className="inline-flex items-center px-4 py-2 bg-brand-600 hover:bg-brand-700 text-white font-medium rounded-lg transition-colors duration-200">
          <KeyIcon className="w-5 h-5 mr-2" />
          Add Permission
        </Link>
      </div>
      <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6">
        <p className="text-gray-600 dark:text-gray-400">Permission management interface coming soon...</p>
      </div>
    </div>
  );
};

export default Permissions;
