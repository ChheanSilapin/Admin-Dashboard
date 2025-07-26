import React from 'react';
import { Link } from 'react-router-dom';

const AddRole = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Add New Role</h1>
          <p className="text-gray-600 dark:text-gray-400">Create a new user role</p>
        </div>
        <Link to="/roles" className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-medium rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors duration-200">
          Back to Roles
        </Link>
      </div>
      <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6">
        <p className="text-gray-600 dark:text-gray-400">Add role form coming soon...</p>
      </div>
    </div>
  );
};

export default AddRole;
