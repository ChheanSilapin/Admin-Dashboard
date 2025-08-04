import { useState } from 'react';
import { Link } from 'react-router-dom';
import { BankIcon, PhotoIcon } from '../../icons';
import { useAuth, PERMISSIONS } from '../../contexts/AuthContext';
import PermissionWrapper from '../../components/ui/PermissionWrapper';
import { SaveButton } from '../../components/ui/PermissionButton';

const AddBank = () => {
  const [formData, setFormData] = useState({
    bank_name: '',
    icon_logo: null,
  });

  const [logoPreview, setLogoPreview] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({
        ...prev,
        icon_logo: file
      }));

      // Create preview URL
      const reader = new FileReader();
      reader.onload = (e) => {
        setLogoPreview(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission
    console.log('Form submitted:', formData);
  };

  return (
    <PermissionWrapper
      permission={PERMISSIONS.BANK_CREATE}
      fallbackType="message"
      showFallback={true}
    >
      <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Add New Bank
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Register a new banking partner
          </p>
        </div>
        <Link
          to="/banks"
          className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-medium rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors duration-200"
        >
          Back to Banks
        </Link>
      </div>

      <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Bank Information */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
              Bank Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Bank Name *
                </label>
                <input
                  type="text"
                  name="bank_name"
                  value={formData.bank_name}
                  onChange={handleInputChange}
                  required
                  placeholder="e.g., ABA Bank, ACLEDA Bank"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent dark:bg-gray-800 dark:text-white"
                />
              </div>
            </div>
          </div>

          {/* Logo Upload */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
              Bank Logo
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Upload Logo/Icon
                </label>
                <div className="flex items-center space-x-6">
                  <div className="flex-shrink-0">
                    <div className="w-20 h-20 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg flex items-center justify-center bg-gray-50 dark:bg-gray-800">
                      {logoPreview ? (
                        <img
                          src={logoPreview}
                          alt="Bank logo preview"
                          className="w-16 h-16 object-contain rounded"
                        />
                      ) : (
                        <div className="text-center">
                          <PhotoIcon className="w-8 h-8 text-gray-400 mx-auto mb-1" />
                          <span className="text-xs text-gray-500">Logo</span>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex-1">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="block w-full text-sm text-gray-500 dark:text-gray-400
                        file:mr-4 file:py-2 file:px-4
                        file:rounded-lg file:border-0
                        file:text-sm file:font-medium
                        file:bg-brand-50 file:text-brand-700
                        hover:file:bg-brand-100
                        dark:file:bg-brand-900 dark:file:text-brand-300"
                    />
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      PNG, JPG, GIF up to 2MB. Recommended size: 200x200px
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex items-center justify-end space-x-4 pt-6 border-t border-gray-200 dark:border-gray-700">
            <Link
              to="/banks"
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-medium rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors duration-200"
            >
              Cancel
            </Link>
            <SaveButton
              permission={PERMISSIONS.BANK_CREATE}
              type="submit"
              className="px-4 py-2 bg-brand-600 hover:bg-brand-700 text-white font-medium rounded-lg transition-colors duration-200"
            >
              Add Bank
            </SaveButton>
          </div>
        </form>
      </div>
    </div>
    </PermissionWrapper>
  );
};

export default AddBank;
