import { XIcon } from '../../../icons';
import { useCustomerForm } from './useCustomerForm';
import CustomerForm from './CustomerForm';

const AddCustomerModal = ({
  isOpen,
  onClose,
  onSubmit,
  customers = []
}) => {
  // Use shared form logic
  const {
    formData,
    displayValues,
    errors,
    dropdowns,
    customerIdPreview,
    banksLoading,
    getBankOptions,
    getBankById,
    handleInputChange,
    handleNumberInput,
    handleCurrencyChange,
    toggleDropdown,
    closeAllDropdowns,
    validateForm,
    resetForm
  } = useCustomerForm(null, customers);



  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();

    // Validate form (for add mode, check unique ID)
    if (!validateForm(false)) {
      return;
    }

    // Get selected bank details
    const selectedBank = getBankById(formData.bank_id);

    // Create new customer object
    const newCustomer = {
      id: customers.length + 1,
      CustomerId: formData.CustomerId,
      Type: formData.Type,
      currency: formData.currency,
      Credit: parseFloat(formData.Credit),
      amount: parseFloat(formData.amount),
      bank_name: selectedBank?.bank_name || '',
      bank_code: selectedBank?.bank_code || '',
      bank_id: formData.bank_id,
      created_by: 1, // Current user ID - in real app, get from auth context
      Note: formData.Note,
      created_at: new Date().toISOString().split('.')[0] + 'Z',
      // Legacy fields for backward compatibility - use customer ID if name is empty
      name: formData.fullName.trim() || formData.CustomerId,
      //email: `${formData.CustomerId.toLowerCase()}@example.com`,
      //phone: '+855 12 345 678',
      joinDate: new Date().toISOString().split('T')[0],
      accountNumber: `ACC-${String(customers.length + 1).padStart(3, '0')}`,
    };

    // Call parent submit handler
    onSubmit(newCustomer);

    // Reset form and close modal
    resetForm();
    onClose();
  };



  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center overflow-y-auto modal z-99999">
      <div
        className="fixed inset-0 h-full w-full bg-gray-400/50 backdrop-blur-[32px]"
        onClick={onClose}
      ></div>
      {/* Mobile-optimized modal sizing */}
      <div className="relative w-full max-w-sm sm:max-w-2xl rounded-3xl bg-white dark:bg-gray-900 shadow-theme-xl max-h-[95vh] overflow-y-auto mx-2 sm:mx-4">
        <button
          onClick={onClose}
          className="absolute right-3 top-3 z-999 flex h-9.5 w-9.5 items-center justify-center rounded-full bg-gray-100 text-gray-400 transition-colors hover:bg-gray-200 hover:text-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white sm:right-6 sm:top-6 sm:h-11 sm:w-11"
        >
          <XIcon className="w-5 h-5" />
        </button>

        <div className="px-4 pb-4 pt-4 sm:px-6 sm:pb-6 sm:pt-6 md:px-8 md:pb-8 md:pt-8">
          <div className="mb-6">
            <h4 className="text-xl font-semibold text-gray-800 dark:text-white/90">
              Add New Customer Info
            </h4>
            <p className="mt-1 text-gray-500 text-theme-sm dark:text-gray-400">
              Create a new customer transaction record with banking details
            </p>
          </div>

          <CustomerForm
            formData={formData}
            displayValues={displayValues}
            errors={errors}
            dropdowns={dropdowns}
            banksLoading={banksLoading}
            getBankOptions={getBankOptions}
            getBankById={getBankById}
            handleInputChange={handleInputChange}
            handleNumberInput={handleNumberInput}
            handleCurrencyChange={handleCurrencyChange}
            toggleDropdown={toggleDropdown}
            closeAllDropdowns={closeAllDropdowns}
            onSubmit={handleSubmit}
            isEditMode={false}
            customerIdPreview={customerIdPreview}
          />

          {/* Form Actions - Mobile-optimized */}
          <div className="flex flex-col sm:flex-row justify-end gap-2 pt-4 border-t border-gray-200 dark:border-gray-700 mt-4 sm:mt-6">
            <button
              type="button"
              onClick={onClose}
              className="inline-flex items-center justify-center gap-2 rounded-md transition px-3 py-2.5 text-sm bg-white text-[var(--color-white-100)] ring-1 ring-inset ring-red-300 hover:bg-gray-50 dark:bg-red-600 dark:text-[var(--color-white-100)] dark:ring-red-700 dark:hover:bg-red-700 dark:hover:text-gray-300 w-full sm:w-auto"
            >
              Close
            </button>
            <button
              type="submit"
              form="customer-form"
              className="inline-flex items-center justify-center gap-2 rounded-md transition px-4 py-2.5 text-sm bg-blue-400 text-[var(--color-white-100)] shadow-theme-xs hover:bg-brand-600 disabled:bg-brand-300 w-full sm:w-auto"
            >
              Add Customer Info
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddCustomerModal;
