/**
 * Khmer Font Demo Component
 * Demonstrates how to use Khmer fonts in your application
 */

import KhmerText from '../ui/KhmerText';

const KhmerFontDemo = () => {
  return (
    <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
      <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
        Khmer Font Demo
      </h2>
      
      <div className="space-y-4">
        {/* Currency Symbol */}
        <div>
          <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Currency Symbol (Already Working):
          </h3>
          <div className="text-2xl text-green-600 dark:text-green-400">
            ៛ 1,000,000 (Khmer Riel)
          </div>
        </div>

        {/* Khmer Numbers */}
        <div>
          <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Khmer Numbers:
          </h3>
          <KhmerText size="lg" className="text-blue-600 dark:text-blue-400">
            ០១២៣៤៥៦៧៨៩
          </KhmerText>
        </div>

        {/* Khmer Text */}
        <div>
          <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Khmer Text:
          </h3>
          <KhmerText size="base" className="text-gray-900 dark:text-white">
            ស្វាគមន៍មកកាន់ប្រព័ន្ធគ្រប់គ្រងអតិថិជន
          </KhmerText>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            (Welcome to Customer Management System)
          </p>
        </div>

        {/* Mixed Text */}
        <div>
          <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Mixed English and Khmer:
          </h3>
          <div className="text-base text-gray-900 dark:text-white">
            Customer ID: <KhmerText className="text-blue-600 dark:text-blue-400">អតិថិជន-០០១</KhmerText>
          </div>
        </div>

        {/* Usage Examples */}
        <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
          <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            How to Use:
          </h3>
          <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
            <div>1. Use <code className="bg-gray-200 dark:bg-gray-600 px-1 rounded">font-khmer</code> class for Khmer text</div>
            <div>2. Use <code className="bg-gray-200 dark:bg-gray-600 px-1 rounded">KhmerText</code> component for better control</div>
            <div>3. Currency symbol ៛ works automatically</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default KhmerFontDemo;
