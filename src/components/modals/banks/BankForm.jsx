import { PhotoIcon, XIcon, ChevronDownIcon } from '../../../icons';

const BankForm = ({
  formData,
  errors,
  logoPreview,
  dropdowns,
  handleInputChange,
  handleFileChange,
  removeLogo,
  toggleDropdown,
  onSubmit
}) => {
  // Base input classes
  const inputBaseClasses = "w-full px-2 py-1.5 sm:px-3 sm:py-2.5 text-xs sm:text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 dark:bg-gray-800 dark:border-gray-600 dark:text-white dark:focus:border-blue-400 transition-colors";

  const mergeClasses = (...classes) => {
    return classes.filter(Boolean).join(' ');
  };

  return (
    <form id="bank-form" onSubmit={onSubmit} autoComplete="off" className="space-y-3 sm:space-y-4 md:space-y-5">
      {/* Group 1: Bank Information - 2-column layout */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3 md:gap-4">
        <div>
          <label className="mb-1 sm:mb-1.5 block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-400">
            Bank Name *
          </label>
          <input
            type="text"
            name="bank_name"
            value={formData.bank_name}
            onChange={handleInputChange}
            required
            autoComplete="off"
            className={mergeClasses(inputBaseClasses, errors.bank_name ? 'border-red-300 focus:border-red-300 focus:ring-red-500/10' : '')}
            placeholder="e.g., ABA Bank, ACLEDA Bank"
          />
          {errors.bank_name && (
            <p className="mt-0.5 sm:mt-1 text-xs sm:text-sm text-red-600 dark:text-red-400">{errors.bank_name}</p>
          )}
        </div>

        <div>
          <label className="mb-1 sm:mb-1.5 block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-400">
            Bank Code *
          </label>
          <input
            type="text"
            name="bank_code"
            value={formData.bank_code}
            onChange={handleInputChange}
            required
            autoComplete="off"
            className={mergeClasses(inputBaseClasses, errors.bank_code ? 'border-red-300 focus:border-red-300 focus:ring-red-500/10' : '')}
            placeholder="e.g., 001, 002"
          />
          {errors.bank_code && (
            <p className="mt-0.5 sm:mt-1 text-xs sm:text-sm text-red-600 dark:text-red-400">{errors.bank_code}</p>
          )}
        </div>
      </div>

      {/* Group 2: Status and Description */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3 md:gap-4">
        <div className="relative">
          <label className="mb-1 sm:mb-1.5 block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-400">
            Status *
          </label>
          <button
            type="button"
            onClick={() => toggleDropdown('status')}
            className={mergeClasses(
              inputBaseClasses,
              'flex items-center justify-between',
              errors.status ? 'border-red-300 focus:border-red-300 focus:ring-red-500/10' : ''
            )}
          >
            <span className="text-gray-900 dark:text-white capitalize">
              {formData.status}
            </span>
            <ChevronDownIcon className={`w-4 h-4 text-gray-400 transition-transform ${dropdowns?.status ? 'rotate-180' : ''}`} />
          </button>

          {dropdowns?.status && (
            <div className="absolute z-50 w-full mt-0.5 sm:mt-1 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg shadow-lg">
              {['active', 'inactive'].map((status) => (
                <button
                  key={status}
                  type="button"
                  onClick={() => {
                    handleInputChange({ target: { name: 'status', value: status } });
                    toggleDropdown('status');
                  }}
                  className="w-full px-2 py-1.5 sm:px-3 sm:py-2 text-left text-xs sm:text-sm hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-900 dark:text-white first:rounded-t-lg last:rounded-b-lg capitalize"
                >
                  {status}
                </button>
              ))}
            </div>
          )}
          {errors.status && (
            <p className="mt-0.5 sm:mt-1 text-xs sm:text-sm text-red-600 dark:text-red-400">{errors.status}</p>
          )}
        </div>

        <div>
          <label className="mb-1 sm:mb-1.5 block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-400">
            Description
          </label>
          <input
            type="text"
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            autoComplete="off"
            className={mergeClasses(inputBaseClasses, errors.description ? 'border-red-300 focus:border-red-300 focus:ring-red-500/10' : '')}
            placeholder="Optional description"
          />
          {errors.description && (
            <p className="mt-0.5 sm:mt-1 text-xs sm:text-sm text-red-600 dark:text-red-400">{errors.description}</p>
          )}
        </div>
      </div>

      {/* Group 3: Logo Upload */}
      <div>
        <label className="mb-1 sm:mb-1.5 block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-400">
          Bank Logo
        </label>
        <div className="flex items-center space-x-4">
          {/* Logo Preview */}
          <div className="flex-shrink-0">
            <div className="w-16 h-16 sm:w-20 sm:h-20 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg flex items-center justify-center bg-gray-50 dark:bg-gray-800 relative">
              {logoPreview ? (
                <>
                  <img
                    src={logoPreview}
                    alt="Bank logo preview"
                    className="w-12 h-12 sm:w-16 sm:h-16 object-contain rounded"
                  />
                  <button
                    type="button"
                    onClick={removeLogo}
                    className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors"
                  >
                    <XIcon className="w-3 h-3" />
                  </button>
                </>
              ) : (
                <div className="text-center">
                  <PhotoIcon className="w-6 h-6 sm:w-8 sm:h-8 text-gray-400 mx-auto mb-1" />
                  <span className="text-xs text-gray-500">Logo</span>
                </div>
              )}
            </div>
          </div>

          {/* File Input */}
          <div className="flex-1">
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="block w-full text-xs sm:text-sm text-gray-500 dark:text-gray-400
                file:mr-2 sm:file:mr-4 file:py-1.5 sm:file:py-2 file:px-2 sm:file:px-4
                file:rounded-lg file:border-0
                file:text-xs sm:file:text-sm file:font-medium
                file:bg-blue-50 file:text-blue-700
                hover:file:bg-blue-100
                dark:file:bg-blue-900 dark:file:text-blue-300"
            />
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              PNG, JPG, GIF up to 2MB
            </p>
          </div>
        </div>
        {errors.logo && (
          <p className="mt-0.5 sm:mt-1 text-xs sm:text-sm text-red-600 dark:text-red-400">{errors.logo}</p>
        )}
      </div>
    </form>
  );
};

export default BankForm;
