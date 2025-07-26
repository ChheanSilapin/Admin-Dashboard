import { useState } from 'react';
import { CheckIcon, XMarkIcon, ShieldIcon, KeyIcon } from '../../icons';

const RolePermissions = () => {
  // Mock data for roles and permissions
  const [roles] = useState([
    { id: 1, name: 'Admin', description: 'Full system access' },
    { id: 2, name: 'Manager', description: 'Management level access' },
    { id: 3, name: 'Sales', description: 'Sales operations access' },
    { id: 4, name: 'Viewer', description: 'Read-only access' },
  ]);

  const [permissions] = useState([
    { id: 1, category: 'Customer', action: 'create', description: 'Create new customers' },
    { id: 2, category: 'Customer', action: 'read', description: 'View customer information' },
    { id: 3, category: 'Customer', action: 'update', description: 'Update customer information' },
    { id: 4, category: 'Customer', action: 'delete', description: 'Delete customers' },
    { id: 5, category: 'Transaction', action: 'create', description: 'Process transactions' },
    { id: 6, category: 'Transaction', action: 'read', description: 'View transactions' },
    { id: 7, category: 'Transaction', action: 'update', description: 'Update transactions' },
    { id: 8, category: 'Transaction', action: 'delete', description: 'Delete transactions' },
    { id: 9, category: 'Bank', action: 'create', description: 'Add new banks' },
    { id: 10, category: 'Bank', action: 'read', description: 'View bank information' },
    { id: 11, category: 'Bank', action: 'update', description: 'Update bank information' },
    { id: 12, category: 'Bank', action: 'delete', description: 'Remove banks' },
    { id: 13, category: 'User', action: 'create', description: 'Create new users' },
    { id: 14, category: 'User', action: 'read', description: 'View user information' },
    { id: 15, category: 'User', action: 'update', description: 'Update user information' },
    { id: 16, category: 'User', action: 'delete', description: 'Delete users' },
    { id: 17, category: 'Role', action: 'create', description: 'Create new roles' },
    { id: 18, category: 'Role', action: 'read', description: 'View roles' },
    { id: 19, category: 'Role', action: 'update', description: 'Update roles' },
    { id: 20, category: 'Role', action: 'delete', description: 'Delete roles' },
  ]);

  // Mock role-permission assignments (in real app, this would come from API)
  const [rolePermissions, setRolePermissions] = useState({
    1: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20], // Admin - all permissions
    2: [1, 2, 3, 5, 6, 7, 9, 10, 11, 13, 14, 15, 17, 18, 19], // Manager - most permissions except delete
    3: [1, 2, 3, 5, 6, 9, 10, 14], // Sales - customer and transaction read/create
    4: [2, 6, 10, 14, 18], // Viewer - read-only permissions
  });

  const togglePermission = (roleId, permissionId) => {
    setRolePermissions(prev => {
      const rolePerms = prev[roleId] || [];
      const hasPermission = rolePerms.includes(permissionId);

      if (hasPermission) {
        return {
          ...prev,
          [roleId]: rolePerms.filter(id => id !== permissionId)
        };
      } else {
        return {
          ...prev,
          [roleId]: [...rolePerms, permissionId]
        };
      }
    });
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
