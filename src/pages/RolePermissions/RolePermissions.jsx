import { useState, useEffect } from 'react';
import { CheckIcon, XMarkIcon, ShieldIcon, KeyIcon } from '../../icons';
import { rolesAPI, permissionsAPI, rolePermissionsAPI } from '../../services/api';

const RolePermissions = () => {
  const [roles, setRoles] = useState([]);
  const [permissions, setPermissions] = useState([]);
  const [rolePermissions, setRolePermissions] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch data from Laravel API
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        const [rolesResponse, permissionsResponse, rolePermissionsResponse] = await Promise.all([
          rolesAPI.getAll(),
          permissionsAPI.getAll(),
          rolePermissionsAPI.getAll()
        ]);

        // Handle response format (data property or direct array)
        const rolesData = rolesResponse.data || rolesResponse;
        const permissionsData = permissionsResponse.data || permissionsResponse;
        const rolePermissionsData = rolePermissionsResponse.data || rolePermissionsResponse;

        setRoles(Array.isArray(rolesData) ? rolesData : []);
        setPermissions(Array.isArray(permissionsData) ? permissionsData : []);

        // Transform role permissions data into the format expected by UI
        const rolePermissionsMap = {};
        if (Array.isArray(rolePermissionsData)) {
          rolePermissionsData.forEach(rp => {
            if (!rolePermissionsMap[rp.role_id]) {
              rolePermissionsMap[rp.role_id] = [];
            }
            rolePermissionsMap[rp.role_id].push(rp.permission_id);
          });
        }
        setRolePermissions(rolePermissionsMap);

      } catch (err) {
        console.error('Error fetching role permissions data:', err);
        setError('Failed to load role permissions data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const togglePermission = async (roleId, permissionId) => {
    try {
      const rolePerms = rolePermissions[roleId] || [];
      const hasPermission = rolePerms.includes(permissionId);

      if (hasPermission) {
        // Remove permission from role
        await rolePermissionsAPI.remove(roleId, permissionId);
        setRolePermissions(prev => ({
          ...prev,
          [roleId]: rolePerms.filter(id => id !== permissionId)
        }));
      } else {
        // Add permission to role
        await rolePermissionsAPI.assign(roleId, permissionId);
        setRolePermissions(prev => ({
          ...prev,
          [roleId]: [...rolePerms, permissionId]
        }));
      }
    } catch (err) {
      console.error('Error updating role permission:', err);
      setError('Failed to update permission');
    }
  };

  const hasPermission = (roleId, permissionId) => {
    return rolePermissions[roleId]?.includes(permissionId) || false;
  };

  // Group permissions by category
  const permissionsByCategory = permissions.reduce((acc, permission) => {
    if (!acc[permission.category]) {
      acc[permission.category] = [];
    }
    acc[permission.category].push(permission);
    return acc;
  }, {});

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Role Permissions</h1>
            <p className="text-gray-600 dark:text-gray-400">Manage role-based access control</p>
          </div>
        </div>
        <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6">
          <div className="animate-pulse">
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4 mb-4"></div>
            <div className="space-y-3">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-3 bg-gray-200 dark:bg-gray-700 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Role Permissions</h1>
            <p className="text-gray-600 dark:text-gray-400">Manage role-based access control</p>
          </div>
        </div>
        <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6">
          <div className="text-center py-8">
            <div className="text-red-500 mb-2">
              <XMarkIcon className="w-12 h-12 mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Error Loading Data</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="inline-flex items-center px-4 py-2 bg-brand-600 hover:bg-brand-700 text-white font-medium rounded-lg transition-colors duration-200"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Role Permissions</h1>
          <p className="text-gray-600 dark:text-gray-400">Manage role-based access control</p>
        </div>
      </div>

      {/* Permission Matrix */}
      <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 overflow-hidden">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Permission Matrix</h2>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            Configure permissions for each role
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-800">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Permission
                </th>
                {roles.map(role => (
                  <th key={role.id} className="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    <div className="flex flex-col items-center">
                      <ShieldIcon className="w-4 h-4 mb-1" />
                      {role.name}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
              {Object.entries(permissionsByCategory).map(([category, categoryPermissions]) => (
                <>
                  <tr key={category} className="bg-gray-25 dark:bg-gray-800/50">
                    <td colSpan={roles.length + 1} className="px-6 py-3">
                      <div className="flex items-center">
                        <KeyIcon className="w-4 h-4 mr-2 text-gray-500" />
                        <span className="font-medium text-gray-900 dark:text-white">{category}</span>
                      </div>
                    </td>
                  </tr>
                  {categoryPermissions.map(permission => (
                    <tr key={permission.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                      <td className="px-6 py-4">
                        <div>
                          <div className="text-sm font-medium text-gray-900 dark:text-white">
                            {permission.action.charAt(0).toUpperCase() + permission.action.slice(1)}
                          </div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">
                            {permission.description}
                          </div>
                        </div>
                      </td>
                      {roles.map(role => (
                        <td key={role.id} className="px-6 py-4 text-center">
                          <button
                            onClick={() => togglePermission(role.id, permission.id)}
                            className={`inline-flex items-center justify-center w-6 h-6 rounded-full transition-colors duration-200 ${
                              hasPermission(role.id, permission.id)
                                ? 'bg-green-500 text-white hover:bg-green-600'
                                : 'bg-gray-200 dark:bg-gray-700 text-gray-400 hover:bg-gray-300 dark:hover:bg-gray-600'
                            }`}
                          >
                            {hasPermission(role.id, permission.id) ? (
                              <CheckIcon className="w-4 h-4" />
                            ) : (
                              <XMarkIcon className="w-4 h-4" />
                            )}
                          </button>
                        </td>
                      ))}
                    </tr>
                  ))}
                </>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default RolePermissions;
