import React from 'react';
import { CheckIcon, XMarkIcon, PencilIcon, TrashIcon } from '../../icons';
import { formatFullDateTime } from '../../utils/currencyFormatter';
import { getCRUDOperations, getGroupStatistics } from '../../utils/permissionGrouping';

/**
 * Grouped Permissions Table Component
 * Displays permissions grouped by entity with CRUD operations as columns
 */
const GroupedPermissionsTable = ({ 
  groupedPermissions, 
  onEditPermission, 
  onDeletePermission,
  loading = false 
}) => {
  const crudOperations = getCRUDOperations();

  if (loading) {
    return (
      <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 overflow-hidden">
        <div className="p-8 text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 dark:border-blue-400 mx-auto"></div>
          <p className="mt-2 text-gray-500 dark:text-gray-400">Loading permissions...</p>
        </div>
      </div>
    );
  }

  if (!groupedPermissions || groupedPermissions.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 overflow-hidden">
        <div className="p-8 text-center text-gray-500 dark:text-gray-400">
          No permissions found
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 overflow-hidden">
      <div>
        <table className="w-full divide-y divide-green-200 dark:divide-blue-400">
          <thead className="bg-green-50 dark:bg-blue-500/10">
            <tr>
              {/* Entity Name Column */}
              <th className="px-6 py-3 text-left text-xs font-medium text-green-600 dark:text-blue-400 uppercase tracking-wider">
                Entity / Resource
              </th>
              
              {/* CRUD Operation Columns */}
              {crudOperations.map(operation => (
                <th
                  key={operation.key}
                  className="px-4 py-3 text-center text-xs font-medium text-green-600 dark:text-blue-400 uppercase tracking-wider"
                >
                  {operation.label}
                </th>
              ))}
              
              {/* Created Date Column */}
              <th className="px-6 py-3 text-left text-xs font-medium text-green-600 dark:text-blue-400 uppercase tracking-wider">
                Created
              </th>
              
              {/* Actions Column */}
              <th className="px-6 py-3 text-right text-xs font-medium text-green-600 dark:text-blue-400 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          
          <tbody className="bg-white dark:bg-gray-900 divide-y divide-green-200 dark:divide-blue-400">
            {groupedPermissions.map((group, index) => {
              const stats = getGroupStatistics(group);
              
              return (
                <tr key={group.entity} className="hover:bg-green-50 dark:hover:bg-blue-500/10">
                  {/* Entity Name */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-8 w-8 bg-green-100 dark:bg-blue-500/20 rounded-full flex items-center justify-center">
                        <span className="text-sm font-medium text-green-600 dark:text-blue-400">
                          {group.displayName.charAt(0)}
                        </span>
                      </div>
                      <div className="ml-3">
                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                          {group.displayName}
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          {stats.active} of {stats.total} permissions ({stats.percentage}%)
                        </div>
                      </div>
                    </div>
                  </td>
                  
                  {/* CRUD Operation Indicators */}
                  {crudOperations.map(operation => {
                    const hasPermission = !!group.permissions[operation.key];
                    const permission = group.permissions[operation.key];
                    
                    return (
                      <td key={operation.key} className="px-4 py-4 text-center">
                        <div className="flex justify-center">
                          {hasPermission ? (
                            <div 
                              className="flex items-center justify-center w-6 h-6 bg-green-100 dark:bg-green-900/30 rounded-full cursor-pointer group relative"
                              title={`${permission.name} (ID: ${permission.id})`}
                            >
                              <CheckIcon className="w-4 h-4 text-green-600 dark:text-green-400" />
                              
                              {/* Tooltip */}
                              <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 text-xs text-white bg-gray-900 dark:bg-gray-700 rounded opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap z-50">
                                {permission.name}
                              </div>
                            </div>
                          ) : (
                            <div className="flex items-center justify-center w-6 h-6 bg-gray-100 dark:bg-gray-800 rounded-full">
                              <XMarkIcon className="w-4 h-4 text-gray-400 dark:text-gray-600" />
                            </div>
                          )}
                        </div>
                      </td>
                    );
                  })}
                  
                  {/* Created Date */}
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                    {group.createdAt ? formatFullDateTime(group.createdAt) : '-'}
                  </td>
                  
                  {/* Actions */}
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center justify-end space-x-2">
                      {/* Edit - Show dropdown for multiple permissions */}
                      {group.originalPermissions.length > 1 ? (
                        <div className="relative group">
                          <button
                            className="text-green-600 hover:text-green-900 dark:text-blue-400 dark:hover:text-blue-300 transition-colors duration-200"
                            title="Edit Permissions"
                          >
                            <PencilIcon className="w-4 h-4" />
                          </button>
                          
                          {/* Dropdown menu */}
                          <div className="absolute right-0 top-full mt-1 w-48 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                            <div className="py-1">
                              {group.originalPermissions.map(permission => (
                                <button
                                  key={permission.id}
                                  onClick={() => onEditPermission(permission)}
                                  className="block w-full text-left px-3 py-2 text-xs text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                                >
                                  Edit {permission.name}
                                </button>
                              ))}
                            </div>
                          </div>
                        </div>
                      ) : (
                        <button
                          onClick={() => onEditPermission(group.originalPermissions[0])}
                          className="text-green-600 hover:text-green-900 dark:text-blue-400 dark:hover:text-blue-300 transition-colors duration-200"
                          title="Edit Permission"
                        >
                          <PencilIcon className="w-4 h-4" />
                        </button>
                      )}
                      
                      {/* Delete - Show dropdown for multiple permissions */}
                      {group.originalPermissions.length > 1 ? (
                        <div className="relative group">
                          <button
                            className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300 transition-colors duration-200"
                            title="Delete Permissions"
                          >
                            <TrashIcon className="w-4 h-4" />
                          </button>
                          
                          {/* Dropdown menu */}
                          <div className="absolute right-0 top-full mt-1 w-48 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                            <div className="py-1">
                              {group.originalPermissions.map(permission => (
                                <button
                                  key={permission.id}
                                  onClick={() => onDeletePermission(permission)}
                                  className="block w-full text-left px-3 py-2 text-xs text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                                >
                                  Delete {permission.name}
                                </button>
                              ))}
                            </div>
                          </div>
                        </div>
                      ) : (
                        <button
                          onClick={() => onDeletePermission(group.originalPermissions[0])}
                          className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300 transition-colors duration-200"
                          title="Delete Permission"
                        >
                          <TrashIcon className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default GroupedPermissionsTable;
