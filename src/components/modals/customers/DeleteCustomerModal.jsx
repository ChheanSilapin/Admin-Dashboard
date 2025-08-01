import { XIcon } from '../../../icons';

const DeleteCustomerModal = ({ 
  isOpen, 
  onClose, 
  onConfirm,
  customer = null
}) => {
  const handleConfirm = () => {
    if (customer) {
      onConfirm(customer.id);
    }
    onClose();
  };

  if (!isOpen || !customer) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center overflow-y-auto modal z-99999">
      <div
        className="fixed inset-0 h-full w-full bg-gray-400/50 backdrop-blur-[32px]"
        onClick={onClose}
      ></div>
      <div className="relative w-full max-w-md rounded-3xl bg-white dark:bg-gray-900 shadow-theme-xl mx-4">
        <button
          onClick={onClose}
          className="absolute right-3 top-3 z-999 flex h-9.5 w-9.5 items-center justify-center rounded-full bg-gray-100 text-gray-400 transition-colors hover:bg-gray-200 hover:text-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white sm:right-6 sm:top-6 sm:h-11 sm:w-11"
        >
          <XIcon className="w-5 h-5" />
        </button>

        <div className="px-6 py-8">
          {/* Warning Icon */}
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 bg-red-100 dark:bg-red-500/20 rounded-full flex items-center justify-center">
              <svg className="w-8 h-8 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
          </div>

          {/* Content */}
          <div className="text-center mb-8">
            <h4 className="mb-2 text-xl font-semibold text-gray-800 dark:text-white">
              Delete Customer
            </h4>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
              Are you sure you want to delete this customer? This action cannot be undone.
            </p>
            
            {/* Customer Info */}
            <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 mb-6">
              <div className="flex items-center justify-center space-x-3">
                <div className="w-10 h-10 bg-blue-100 dark:bg-blue-500/20 rounded-full flex items-center justify-center">
                  <span className="text-blue-600 dark:text-blue-400 font-medium">
                    {customer.name.charAt(0)}
                  </span>
                </div>
                <div className="text-left">
                  <div className="text-sm font-medium text-gray-900 dark:text-white">
                    {customer.name}
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    {customer.email}
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    {customer.accountNumber}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 inline-flex items-center justify-center gap-2 rounded-lg transition px-4 py-3 text-sm bg-white text-gray-700 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-400 dark:ring-gray-700 dark:hover:bg-white/[0.03] dark:hover:text-gray-300"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleConfirm}
              className="flex-1 inline-flex items-center justify-center gap-2 rounded-lg transition px-5 py-3.5 text-sm bg-red-600 text-white shadow-theme-xs hover:bg-red-700 disabled:bg-red-300"
            >
              Delete Customer
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeleteCustomerModal;
