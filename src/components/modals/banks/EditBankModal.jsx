import { XIcon } from '../../../icons';
import { useBankForm } from './useBankForm';
import BankForm from './BankForm';

const EditBankModal = ({
  isOpen,
  onClose,
  onSubmit,
  bank = null
}) => {
  // Use shared form logic (for edit mode, pass bank data)
  const {
    formData,
    errors,
    logoPreview,
    dropdowns,
    handleInputChange,
    handleFileChange,
    removeLogo,
    toggleDropdown,
    validateForm,
    resetForm
  } = useBankForm(bank);

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();

    // Validate form
    if (!validateForm()) {
      return;
    }

    // Create updated bank object
    const updatedBank = {
      ...bank,
      bank_name: formData.bank_name,
      bank_code: formData.bank_code,
      description: formData.description,
      status: formData.status,
      is_active: formData.status === 'active',
      updated_at: new Date().toISOString()
    };

    // Only include logo if a new one was uploaded
    if (formData.logo) {
      updatedBank.logo = formData.logo;
    }

    // Call parent submit handler
    onSubmit(updatedBank);

    // Close modal
    onClose();
  };

  // Handle modal close
  const handleClose = () => {
    resetForm();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center overflow-y-auto modal z-99999">
      <div
        className="fixed inset-0 h-full w-full bg-gray-400/50 backdrop-blur-[32px]"
        onClick={handleClose}
      ></div>
      {/* Mobile-optimized modal sizing */}
      <div className="relative w-full max-w-sm sm:max-w-2xl rounded-3xl bg-white dark:bg-gray-900 shadow-theme-xl max-h-[95vh] overflow-y-auto mx-2 sm:mx-4">
        <button
          onClick={handleClose}
          className="absolute right-3 top-3 z-999 flex h-9.5 w-9.5 items-center justify-center rounded-full bg-gray-100 text-gray-400 transition-colors hover:bg-gray-200 hover:text-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white sm:right-6 sm:top-6 sm:h-11 sm:w-11"
        >
          <XIcon className="w-5 h-5" />
        </button>

        <div className="px-4 pb-4 pt-4 sm:px-6 sm:pb-6 sm:pt-6 md:px-8 md:pb-8 md:pt-8">
          <div className="mb-6">
            <h4 className="text-xl font-semibold text-gray-800 dark:text-white/90">
              Edit Bank Information
            </h4>
            <p className="mt-1 text-gray-500 text-theme-sm dark:text-gray-400">
              Update banking partner details and settings
            </p>
          </div>

          <BankForm
            formData={formData}
            errors={errors}
            logoPreview={logoPreview}
            dropdowns={dropdowns}
            handleInputChange={handleInputChange}
            handleFileChange={handleFileChange}
            removeLogo={removeLogo}
            toggleDropdown={toggleDropdown}
            onSubmit={handleSubmit}
          />

          {/* Form Actions */}
          <div className="flex items-center justify-end space-x-3 pt-4 sm:pt-6 border-t border-gray-200 dark:border-gray-700 mt-4 sm:mt-6">
            <button
              type="button"
              onClick={handleClose}
              className="px-3 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-medium rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors duration-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              form="bank-form"
              className="px-3 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition-colors duration-200"
            >
              Update Bank
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditBankModal;
