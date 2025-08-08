import { ChevronDownIcon, EyeIcon, EyeOffIcon } from '../../../icons';
import { useState } from 'react';

const UserForm = ({
  formData,
  errors,
  roles,
  rolesLoading,
  dropdowns,
  handleInputChange,
  handleDropdownSelect,
  toggleDropdown,
  onSubmit,
  isEdit = false
}) => {
  // Password visibility state
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordConfirmation, setShowPasswordConfirmation] = useState(false);

  // Base input classes
  const inputBaseClasses = "w-full px-2 py-1.5 sm:px-3 sm:py-2.5 text-xs sm:text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 dark:bg-gray-800 dark:border-gray-600 dark:text-white dark:focus:border-blue-400 transition-colors";

  const mergeClasses = (...classes) => {
    return classes.filter(Boolean).join(' ');
  };



  return (
    <form id="user-form" onSubmit={onSubmit} autoComplete="off" className="space-y-3 sm:space-y-4 md:space-y-5">
      {/* Group 1: Basic Information - 2-column layout */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3 md:gap-4">
        <div>
          <label className="mb-1 sm:mb-1.5 block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-400">
            Full Name *
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            required
            autoComplete="off"
            className={mergeClasses(inputBaseClasses, errors.name ? 'border-red-300 focus:border-red-300 focus:ring-red-500/10' : '')}
            placeholder="e.g., John Doe"
          />
          {errors.name && (
            <p className="mt-1 text-xs text-red-600 dark:text-red-400">{errors.name}</p>
          )}
        </div>

        <div>
          <label className="mb-1 sm:mb-1.5 block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-400">
            Email Address *
          </label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            required
            autoComplete="off"
            className={mergeClasses(inputBaseClasses, errors.email ? 'border-red-300 focus:border-red-300 focus:ring-red-500/10' : '')}
            placeholder="e.g., john.doe@example.com"
          />
          {errors.email && (
            <p className="mt-1 text-xs text-red-600 dark:text-red-400">{errors.email}</p>
          )}
        </div>
      </div>

      {/* Group 2: Account Information - 2-column layout */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3 md:gap-4">
        <div>
          <label className="mb-1 sm:mb-1.5 block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-400">
            Username *
          </label>
          <input
            type="text"
            name="username"
            value={formData.username}
            onChange={handleInputChange}
            required
            autoComplete="off"
            className={mergeClasses(inputBaseClasses, errors.username ? 'border-red-300 focus:border-red-300 focus:ring-red-500/10' : '')}
            placeholder="e.g., johndoe"
          />
          {errors.username && (
            <p className="mt-1 text-xs text-red-600 dark:text-red-400">{errors.username}</p>
          )}
        </div>

        {/* Role Dropdown */}
        <div className="relative">
          <label className="mb-1 sm:mb-1.5 block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-400">
            Role *
          </label>
          <div className="relative">
            <button
              type="button"
              onClick={() => toggleDropdown('role')}
              className={mergeClasses(
                inputBaseClasses,
                'flex items-center justify-between',
                errors.role_id ? 'border-red-300 focus:border-red-300 focus:ring-red-500/10' : ''
              )}
            >
              <span className={formData.role_id ? 'text-gray-900 dark:text-white' : 'text-gray-500 dark:text-gray-400'}>
                {formData.role_id
                  ? roles.find(r => r.id === parseInt(formData.role_id))?.name || 'Select Role'
                  : rolesLoading ? 'Loading roles...' : 'Select Role'
                }
              </span>
              <ChevronDownIcon className={`w-4 h-4 transition-transform ${dropdowns.role ? 'rotate-180' : ''}`} />
            </button>

            {dropdowns.role && !rolesLoading && (
              <div className="absolute z-50 w-full mt-1 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg shadow-lg max-h-48 overflow-y-auto">
                {roles.length === 0 ? (
                  <div className="px-3 py-2 text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                    No roles available
                  </div>
                ) : (
                  roles.map((role) => (
                    <button
                      key={role.id}
                      type="button"
                      onClick={() => handleDropdownSelect('role_id', role.id, role.name)}
                      className="w-full px-3 py-2 text-left text-xs sm:text-sm text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors capitalize"
                    >
                      {role.name}
                    </button>
                  ))
                )}
              </div>
            )}
          </div>
          {errors.role_id && (
            <p className="mt-1 text-xs text-red-600 dark:text-red-400">{errors.role_id}</p>
          )}
        </div>
      </div>

      {/* Group 3: Password Fields - 2-column layout */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3 md:gap-4">
        <div>
          <label className="mb-1 sm:mb-1.5 block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-400">
            Password {!isEdit && '*'}
            {isEdit && <span className="text-xs text-gray-500 dark:text-gray-400 ml-1">(leave blank to keep current)</span>}
          </label>
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              required={!isEdit}
              autoComplete="new-password"
              className={mergeClasses(inputBaseClasses, 'pr-10', errors.password ? 'border-red-300 focus:border-red-300 focus:ring-red-500/10' : '')}
              placeholder={isEdit ? "Enter new password" : "Enter password"}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            >
              {showPassword ? (
                <EyeOffIcon className="w-4 h-4" />
              ) : (
                <EyeIcon className="w-4 h-4" />
              )}
            </button>
          </div>
          {errors.password && (
            <p className="mt-1 text-xs text-red-600 dark:text-red-400">{errors.password}</p>
          )}
        </div>

        <div>
          <label className="mb-1 sm:mb-1.5 block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-400">
            Confirm Password {!isEdit && '*'}
          </label>
          <div className="relative">
            <input
              type={showPasswordConfirmation ? 'text' : 'password'}
              name="password_confirmation"
              value={formData.password_confirmation}
              onChange={handleInputChange}
              required={!isEdit}
              autoComplete="new-password"
              className={mergeClasses(inputBaseClasses, 'pr-10', errors.password_confirmation ? 'border-red-300 focus:border-red-300 focus:ring-red-500/10' : '')}
              placeholder={isEdit ? "Confirm new password" : "Confirm password"}
            />
            <button
              type="button"
              onClick={() => setShowPasswordConfirmation(!showPasswordConfirmation)}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            >
              {showPasswordConfirmation ? (
                <EyeOffIcon className="w-4 h-4" />
              ) : (
                <EyeIcon className="w-4 h-4" />
              )}
            </button>
          </div>
          {errors.password_confirmation && (
            <p className="mt-1 text-xs text-red-600 dark:text-red-400">{errors.password_confirmation}</p>
          )}
        </div>
      </div>



      {/* Submit Button */}
      <div className="flex justify-end pt-2 sm:pt-4">
        <button
          type="submit"
          className="w-full sm:w-auto px-4 sm:px-6 py-2 sm:py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors duration-200 text-xs sm:text-sm"
        >
          {isEdit ? 'Update User' : 'Create User'}
        </button>
      </div>
    </form>
  );
};

export default UserForm;