import React from 'react';
import { useState, useEffect } from 'react';
import { KeyIcon, PlusIcon, PencilIcon, TrashIcon, ViewColumnsIcon, ListBulletIcon, GridIcon } from '../../icons';
import { permissionsAPI } from '../../services/api';
import { formatFullDateTime } from '../../utils/currencyFormatter';
import { AddPermissionModal, EditPermissionModal, DeletePermissionModal } from '../../components/modals/permissions';
import GroupedPermissionsTable from '../../components/permissions/GroupedPermissionsTable';
import { groupPermissionsByEntity } from '../../utils/permissionGrouping';

const Permissions = () => {
  // State for permissions data
  const [permissions, setPermissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Modal states
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedPermission, setSelectedPermission] = useState(null);

  // View mode state
  const [viewMode, setViewMode] = useState('grouped'); // 'grouped' or 'individual'

  // Fetch permissions data
  const fetchPermissions = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await permissionsAPI.getAll();

      // Handle different response formats
      let permissionsData = [];
      if (response.permissions && Array.isArray(response.permissions)) {
        permissionsData = response.permissions;
      } else if (response.data && Array.isArray(response.data)) {
        permissionsData = response.data;
      } else if (Array.isArray(response)) {
        permissionsData = response;
      }

      setPermissions(permissionsData);
    } catch (err) {
      console.error('Error fetching permissions:', err);
      setError('Failed to fetch permissions');
      setPermissions([]);
    } finally {
      setLoading(false);
    }
  };

  // Load permissions on component mount
  useEffect(() => {
    fetchPermissions();
  }, []);

  // Compute grouped permissions
  const groupedPermissions = React.useMemo(() => {
    return groupPermissionsByEntity(permissions);
  }, [permissions]);

  const handleAddPermission = async (permissionData) => {
    try {
      const response = await permissionsAPI.create(permissionData);
      const newPermission = response.data || response;
      setPermissions(prev => [...prev, newPermission]);
      setIsAddModalOpen(false);
    } catch (err) {
      console.error('Error adding permission:', err);
      // Error is handled in the modal
    }
  };

  const handleEditPermission = (permission) => {
    setSelectedPermission(permission);
    setIsEditModalOpen(true);
  };

  const handleUpdatePermission = async (permissionId, permissionData) => {
    try {
      const response = await permissionsAPI.update(permissionId, permissionData);
      const updatedPermission = response.data || response;
      setPermissions(prev =>
        prev.map(permission =>
          permission.id === permissionId ? { ...permission, ...updatedPermission } : permission
        )
      );
      setIsEditModalOpen(false);
      setSelectedPermission(null);
    } catch (err) {
      console.error('Error updating permission:', err);
      // Error is handled in the modal
    }
  };

  const handleDeletePermission = (permission) => {
    setSelectedPermission(permission);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async (permissionId) => {
    try {
      await permissionsAPI.delete(permissionId);
      setPermissions(prev => prev.filter(permission => permission.id !== permissionId));
      setIsDeleteModalOpen(false);
      setSelectedPermission(null);
    } catch (err) {
      console.error('Error deleting permission:', err);
      // Error is handled in the modal
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Permission Management</h1>
          <p className="text-gray-600 dark:text-gray-400">Manage system permissions and access controls</p>
        </div>
        <div className="flex items-center space-x-3">
          {/* View Toggle */}
          <div className="flex items-center bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
            <button
              onClick={() => setViewMode('grouped')}
              className={`inline-flex items-center px-3 py-1.5 text-sm font-medium rounded-md transition-colors duration-200 ${
                viewMode === 'grouped'
                  ? 'bg-white dark:bg-gray-700 text-green-600 dark:text-blue-400 shadow-sm'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              <ViewColumnsIcon className="w-4 h-4 mr-1.5" />
              Grouped
            </button>
            <button
              onClick={() => setViewMode('individual')}
              className={`inline-flex items-center px-3 py-1.5 text-sm font-medium rounded-md transition-colors duration-200 ${
                viewMode === 'individual'
                  ? 'bg-white dark:bg-gray-700 text-green-600 dark:text-blue-400 shadow-sm'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              <ListBulletIcon className="w-4 h-4 mr-1.5" />
              Individual
            </button>
          </div>

          {/* Add Permission Button */}
          <button
            onClick={() => setIsAddModalOpen(true)}
            className=" inline-flex items-center px-4 py-2 bg-green-600 hover:bg-green-700 dark:bg-blue-600 dark:hover:bg-blue-700 text-white font-medium rounded-lg transition-colors duration-200 shadow-theme-xs"
          >
            <PlusIcon className="w-4 h-4 mr-2" />
            Add Permission
          </button>
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6">
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 dark:border-blue-400"></div>
            <span className="ml-3 text-gray-600 dark:text-gray-400">Loading permissions...</span>
          </div>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="bg-white dark:bg-gray-900 rounded-xl border border-red-200 dark:border-red-800 p-6">
          <div className="text-center py-8">
            <p className="text-red-600 dark:text-red-400">{error}</p>
            <button
              onClick={fetchPermissions}
              className="mt-4 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors duration-200"
            >
              Try Again
            </button>
          </div>
        </div>
      )}

      {/* Summary Statistics */}
      {!loading && !error && permissions.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 p-4">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <KeyIcon className="h-8 w-8 text-green-600 dark:text-blue-400" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Permissions</p>
                <p className="text-2xl font-semibold text-gray-900 dark:text-white">{permissions.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 p-4">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <GridIcon className="h-8 w-8 text-green-600 dark:text-blue-400" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Entity Groups</p>
                <p className="text-2xl font-semibold text-gray-900 dark:text-white">{groupedPermissions.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 p-4">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <ViewColumnsIcon className="h-8 w-8 text-green-600 dark:text-blue-400" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">View Mode</p>
                <p className="text-lg font-semibold text-gray-900 dark:text-white capitalize">{viewMode}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Permissions Table */}
      {!loading && !error && (
        <>
          {viewMode === 'grouped' ? (
            <GroupedPermissionsTable
              groupedPermissions={groupedPermissions}
              onEditPermission={handleEditPermission}
              onDeletePermission={handleDeletePermission}
              loading={loading}
            />
          ) : (
            <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-green-200 dark:divide-blue-400">
                  <thead className="bg-green-50 dark:bg-blue-500/10">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-green-600 dark:text-blue-400 uppercase tracking-wider">
                        Permission Name
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-green-600 dark:text-blue-400 uppercase tracking-wider">
                        Created
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-green-600 dark:text-blue-400 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white dark:bg-gray-900 divide-y divide-green-200 dark:divide-blue-400">
                    {permissions.length === 0 ? (
                      <tr>
                        <td colSpan="3" className="px-6 py-8 text-center text-gray-500 dark:text-gray-400">
                          No permissions found
                        </td>
                      </tr>
                    ) : (
                      permissions.map((permission) => (
                        <tr key={permission.id} className="hover:bg-green-50 dark:hover:bg-blue-500/10">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="flex-shrink-0 h-8 w-8 bg-green-100 dark:bg-blue-500/20 rounded-full flex items-center justify-center">
                                <KeyIcon className="h-4 w-4 text-green-600 dark:text-blue-400" />
                              </div>
                              <div className="ml-3">
                                <div className="text-sm font-medium text-gray-900 dark:text-white">
                                  {permission.name}
                                </div>
                                <div className="text-sm text-gray-500 dark:text-gray-400">
                                  ID: {permission.id}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                            {permission.created_at ? formatFullDateTime(permission.created_at) : '-'}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <div className="flex items-center justify-end space-x-2">
                              <button
                                onClick={() => handleEditPermission(permission)}
                                className="text-green-600 hover:text-green-900 dark:text-blue-400 dark:hover:text-blue-300 transition-colors duration-200"
                                title="Edit Permission"
                              >
                                <PencilIcon className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleDeletePermission(permission)}
                                className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300 transition-colors duration-200"
                                title="Delete Permission"
                              >
                                <TrashIcon className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </>
      )}

      {/* Add Permission Modal */}
      <AddPermissionModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSubmit={handleAddPermission}
      />

      {/* Edit Permission Modal */}
      <EditPermissionModal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setSelectedPermission(null);
        }}
        onSubmit={handleUpdatePermission}
        permission={selectedPermission}
      />

      {/* Delete Permission Modal */}
      <DeletePermissionModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setSelectedPermission(null);
        }}
        onConfirm={handleConfirmDelete}
        permission={selectedPermission}
      />
    </div>
  );
};

export default Permissions;


