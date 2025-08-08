import { XIcon } from '../../../icons';
import { usePermissionForm } from './usePermissionForm';
import PermissionForm from './PermissionForm';

const EditPermissionModal = ({
  isOpen,
  onClose,
  onSubmit,
  permission = null
}) => {
  // Use shared form logic (for edit mode, pass permission data)
  const {
    formData,
    errors,
    handleInputChange,
    validateForm,
    resetForm
  } = usePermissionForm(permission);

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      await onSubmit(permission.id, formData);

      // Reset form and close modal on success
      resetForm();
      onClose();
    } catch (error) {
      console.error('Error updating permission:', error);
      // Error handling is done in the parent component
    }
  };

  // Handle modal close
  const handleClose = () => {
    resetForm();
    onClose();
  };

  // Don't render if not open
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
              Edit Permission
            </h4>
            <p className="mt-1 text-gray-500 text-theme-sm dark:text-gray-400">
              Update permission details and configuration
            </p>
          </div>

          <PermissionForm
            formData={formData}
            errors={errors}
            handleInputChange={handleInputChange}
            onSubmit={handleSubmit}
            isEdit={true}
          />
        </div>
      </div>
    </div>
  );
};

export default EditPermissionModal;