const PermissionForm = ({
  formData,
  errors,
  handleInputChange,
  onSubmit,
  isEdit = false
}) => {
  // Base input classes
  const inputBaseClasses = "w-full px-2 py-1.5 sm:px-3 sm:py-2.5 text-xs sm:text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 dark:bg-gray-800 dark:border-gray-600 dark:text-white dark:focus:border-blue-400 transition-colors";

  const mergeClasses = (...classes) => {
    return classes.filter(Boolean).join(' ');
  };

  return (
    <form id="permission-form" onSubmit={onSubmit} autoComplete="off" className="space-y-3 sm:space-y-4 md:space-y-5">
      {/* Permission Name - Single field */}
      <div>
        <label className="mb-1 sm:mb-1.5 block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-400">
          Permission Name *
        </label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleInputChange}
          required
          autoComplete="off"
          className={mergeClasses(inputBaseClasses, errors.name ? 'border-red-300 focus:border-red-300 focus:ring-red-500/10' : '')}
          placeholder="e.g., view post, create user, delete customer"
        />
        {errors.name && (
          <p className="mt-1 text-xs text-red-600 dark:text-red-400">{errors.name}</p>
        )}
        <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
          Enter a descriptive name for this permission
        </p>
      </div>

      {/* Submit Button */}
      <div className="flex justify-end pt-2 sm:pt-4">
        <button
          type="submit"
          className="w-full sm:w-auto px-4 sm:px-6 py-2 sm:py-2.5 bg-green-600 hover:bg-green-700 dark:bg-blue-600 dark:hover:bg-blue-700 text-white text-xs sm:text-sm font-medium rounded-lg transition-colors duration-200 shadow-theme-xs"
        >
          {isEdit ? 'Update Permission' : 'Create Permission'}
        </button>
      </div>
    </form>
  );
};

export default PermissionForm;