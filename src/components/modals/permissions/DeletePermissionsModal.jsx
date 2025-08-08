import { XIcon, TrashIcon } from '../../../icons';

const DeletePermissionModal = ({
  isOpen,
  onClose,
  onConfirm,
  permission = null
}) => {
  // Handle delete confirmation
  const handleConfirm = async () => {
    try {
      await onConfirm(permission.id);
      onClose();
    } catch (error) {
      console.error('Error deleting permission:', error);
      // Error handling is done in the parent component
    }
  };

  // Don't render if not open
  if (!isOpen || !permission) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center overflow-y-auto modal z-99999">
      <div
        className="fixed inset-0 h-full w-full bg-gray-400/50 backdrop-blur-[32px]"
        onClick={onClose}
      ></div>
      {/* Mobile-optimized modal sizing */}
      <div className="relative w-full max-w-sm sm:max-w-md rounded-3xl bg-white dark:bg-gray-900 shadow-theme-xl mx-2 sm:mx-4">
        <button
          onClick={onClose}
          className="absolute right-3 top-3 z-999 flex h-9.5 w-9.5 items-center justify-center rounded-full bg-gray-100 text-gray-400 transition-colors hover:bg-gray-200 hover:text-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white sm:right-6 sm:top-6 sm:h-11 sm:w-11"
        >
          <XIcon className="w-5 h-5" />
        </button>

        <div className="px-4 pb-4 pt-4 sm:px-6 sm:pb-6 sm:pt-6 md:px-8 md:pb-8 md:pt-8">
          <div className="mb-6 text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/20 mb-4">
              <TrashIcon className="h-6 w-6 text-red-600 dark:text-red-400" />
            </div>
            <h4 className="text-xl font-semibold text-gray-800 dark:text-white/90">
              Delete Permission
            </h4>
            <p className="mt-2 text-gray-500 text-sm dark:text-gray-400">
              Are you sure you want to delete this permission? This action cannot be undone.
            </p>
          </div>

          {/* Permission Info */}
          <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 mb-6">
            <div className="text-center">
              <p className="text-sm font-medium text-gray-900 dark:text-white">
                {permission.name}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Permission ID: {permission.id}
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2.5 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-medium rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors duration-200 text-sm"
            >
              Cancel
            </button>
            <button
              onClick={handleConfirm}
              className="flex-1 px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg transition-colors duration-200 text-sm"
            >
              Delete Permission
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeletePermissionModal;