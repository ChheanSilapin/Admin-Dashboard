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
    <div className="fixed inset-0 flex items-center justify-center overflow-y-auto z-999999 p-4">
      <div
        className="fixed inset-0 h-full w-full bg-gray-400/50 backdrop-blur-sm"
        onClick={onClose}
      ></div>
      <div className="relative w-full max-w-md bg-white dark:bg-gray-900 rounded-3xl shadow-xl">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 text-gray-400 transition-colors hover:bg-gray-200 hover:text-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
        >
          <XIcon className="w-4 h-4" />
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
              className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-medium rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors duration-200 h-9 text-sm shadow-theme-xs"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleConfirm}
              className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg transition-colors duration-200 h-9 text-sm shadow-theme-xs"
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
