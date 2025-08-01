import { XIcon } from '../../../icons';
import { useCustomerForm } from './useCustomerForm';
import CustomerForm from './CustomerForm';

const EditCustomerModal = ({
  isOpen,
  onClose,
  onSubmit,
  customer = null
}) => {
  // Use shared form logic (for edit mode, pass customer data)
  const {
    formData,
    displayValues,
    errors,
    dropdowns,
    banks,
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
  } = useCustomerForm(customer, []);

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();

    // Validate form (for edit mode, don't check unique ID)
    if (!validateForm(true)) {
      return;
    }

    // Get selected bank details
    const selectedBank = getBankById(formData.bank_id);

    // Create updated customer object
    const updatedCustomer = {
      ...customer,
      CustomerId: formData.CustomerId,
      Type: formData.Type,
      currency: formData.currency,
      Credit: parseFloat(formData.Credit),
      amount: parseFloat(formData.amount),
      bank_name: selectedBank?.bank_name || '',
      bank_code: selectedBank?.bank_code || '',
      bank_id: formData.bank_id,
      Note: formData.Note,
      // Legacy fields - using updated full name
      name: formData.fullName.trim(),
      email: customer.email,
      phone: customer.phone,
      accountNumber: customer.accountNumber,
    };

    // Call parent submit handler
    onSubmit(updatedCustomer);

    // Close modal
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center overflow-y-auto modal z-99999">
      <div
        className="fixed inset-0 h-full w-full bg-gray-400/50 backdrop-blur-[32px]"
        onClick={onClose}
      ></div>
      <div className="relative w-full max-w-2xl rounded-3xl bg-white dark:bg-gray-900 shadow-theme-xl max-h-[95vh] overflow-y-auto mx-4">
        <button
          onClick={onClose}
          className="absolute right-3 top-3 z-999 flex h-9.5 w-9.5 items-center justify-center rounded-full bg-gray-100 text-gray-400 transition-colors hover:bg-gray-200 hover:text-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white sm:right-6 sm:top-6 sm:h-11 sm:w-11"
        >
          <XIcon className="w-5 h-5" />
        </button>

        <div className="px-6 pb-6 pt-6 sm:px-8 sm:pb-8 sm:pt-8">
          <div className="mb-6">
            <h4 className="text-xl font-semibold text-gray-800 dark:text-white/90">
              Edit Customer Info
            </h4>
            <p className="mt-1 text-gray-500 text-theme-sm dark:text-gray-400">
              Update customer transaction record and banking details
            </p>
          </div>

          <CustomerForm
            formData={formData}
            displayValues={displayValues}
            errors={errors}
            dropdowns={dropdowns}
            banks={banks}
            banksLoading={banksLoading}
            getBankOptions={getBankOptions}
            getBankById={getBankById}
            handleInputChange={handleInputChange}
            handleNumberInput={handleNumberInput}
            handleCurrencyChange={handleCurrencyChange}
            toggleDropdown={toggleDropdown}
            closeAllDropdowns={closeAllDropdowns}
            onSubmit={handleSubmit}
          />

          {/* Form Actions */}
          <div className="flex flex-col-reverse sm:flex-row justify-end gap-2 pt-4 border-t border-gray-200 dark:border-gray-700 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="inline-flex items-center justify-center gap-2 rounded-md transition px-3 py-2 text-sm bg-white text-gray-700 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-400 dark:ring-gray-700 dark:hover:bg-white/[0.03] dark:hover:text-gray-300"
            >
              Close
            </button>
            <button
              type="submit"
              form="customer-form"
              className="inline-flex items-center justify-center gap-2 rounded-md transition px-4 py-2 text-sm bg-brand-500 text-white shadow-theme-xs hover:bg-brand-600 disabled:bg-brand-300"
            >
              Update Customer Info
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditCustomerModal;