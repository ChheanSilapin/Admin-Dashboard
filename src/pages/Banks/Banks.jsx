import { useState } from 'react';
import { BankIcon, PencilIcon, TrashIcon } from '../../icons';
import { useAuth, PERMISSIONS } from '../../contexts/AuthContext';
import { EditButton, DeleteButton } from '../../components/ui/PermissionButton';
import PermissionWrapper from '../../components/ui/PermissionWrapper';
import { useBankManagement } from '../../hooks/useBanks';
import { AddBankModal, EditBankModal } from '../../components/modals/banks';
import { formatDateOnly } from '../../utils/currencyFormatter';

const Banks = () => {
  const { isSales } = useAuth();
  const { banks, loading, error, deleteBank, addBank, updateBank } = useBankManagement();

  // Modal states
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedBank, setSelectedBank] = useState(null);

  const handleDelete = async (bankId) => {
    if (window.confirm('Are you sure you want to delete this bank?')) {
      try {
        await deleteBank(bankId);
      } catch (err) {
        // Error is handled in the hook
      }
    }
  };

  const handleAddBank = async (bankData) => {
    try {
      await addBank(bankData);
    } catch (err) {
      // Error is handled in the hook
    }
  };

  const handleEditBank = (bank) => {
    setSelectedBank(bank);
    setIsEditModalOpen(true);
  };

  const handleUpdateBank = async (bankData) => {
    try {
      await updateBank(selectedBank.id, bankData);
      setSelectedBank(null);
    } catch (err) {
      // Error is handled in the hook
    }
  };

  return (
    <div className="space-y-6">

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Bank Management
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Manage banking partners and institutions
          </p>
        </div>
        {/* Temporarily removed permission check for testing */}
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors duration-200 whitespace-nowrap"
        >
          <BankIcon className="w-5 h-5 mr-2" />
          Add Bank
        </button>
        {/*
        <PermissionWrapper permission={PERMISSIONS.BANK_CREATE}>
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors duration-200"
          >
            <BankIcon className="w-5 h-5 mr-2" />
            Add Bank
          </button>
        </PermissionWrapper>
        */}
      </div>

      {/* Loading State */}
      {loading && (
        <div className="flex justify-center items-center py-12">
          <div className="text-gray-600 dark:text-gray-400">Loading banks...</div>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 rounded-lg p-4">
          <div className="text-red-800 dark:text-red-400">{error}</div>
        </div>
      )}

      {/* Responsive Banks List - Table for Desktop, Cards for Mobile */}
      {!loading && (
        <>
        {/* Desktop Table View - Hidden on Mobile */}
        <div className="hidden md:block overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-blue-400 dark:bg-white/[0.03]">
          <div className="w-full overflow-x-auto">
            <table className="w-full border-collapse">
              {/* Table Header */}
              <thead className="border-b border-green-200 dark:border-blue-400">
                <tr>
                  <th className="px-4 py-3 font-medium text-gray-500 text-start text-sm dark:text-gray-400">
                    Bank Logo
                  </th>
                  <th className="px-4 py-3 font-medium text-gray-500 text-start text-sm dark:text-gray-400">
                    Bank Name
                  </th>
                  <th className="px-4 py-3 font-medium text-gray-500 text-start text-sm dark:text-gray-400">
                    Bank Code
                  </th>
                  <th className="px-4 py-3 font-medium text-gray-500 text-center text-sm dark:text-gray-400">
                    Status
                  </th>
                  <th className="px-4 py-3 font-medium text-gray-500 text-start text-sm dark:text-gray-400">
                    Description
                  </th>
                  <th className="px-4 py-3 font-medium text-gray-500 text-center text-sm dark:text-gray-400">
                    Added Date
                  </th>
                  <th className="px-4 py-3 font-medium text-gray-500 text-center text-sm dark:text-gray-400">
                    Actions
                  </th>
                </tr>
              </thead>

              {/* Table Body */}
              <tbody className="divide-y divide-green-200 dark:divide-blue-400">
                {banks.map((bank) => (
                  <tr key={bank.id} className="hover:bg-gray-50 dark:hover:bg-white/[0.02]">
                    {/* Bank Logo */}
                    <td className="px-4 py-4">
                      <div className="w-10 h-10 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center">
                        {bank.logo ? (
                          <img
                            src={bank.logo}
                            alt={`${bank.bank_name} logo`}
                            className="w-6 h-6 object-contain"
                            onError={(e) => {
                              e.target.style.display = 'none';
                              e.target.nextSibling.style.display = 'block';
                            }}
                          />
                        ) : null}
                        <BankIcon
                          className="w-5 h-5 text-gray-600 dark:text-gray-400"
                          style={{ display: bank.logo ? 'none' : 'block' }}
                        />
                      </div>
                    </td>

                    {/* Bank Name */}
                    <td className="px-4 py-4">
                      <div className="font-semibold text-gray-900 dark:text-white">
                        {bank.bank_name}
                      </div>
                    </td>

                    {/* Bank Code */}
                    <td className="px-4 py-4">
                      <span className="font-medium text-gray-900 dark:text-white">
                        {bank.bank_code}
                      </span>
                    </td>

                    {/* Status */}
                    <td className="px-4 py-4 text-center">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        bank.status === 'active'
                          ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
                          : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300'
                      }`}>
                        {bank.status === 'active' ? 'Active' : 'Inactive'}
                      </span>
                    </td>

                    {/* Description */}
                    <td className="px-4 py-4">
                      <div className="max-w-xs">
                        {bank.description ? (
                          <p className="text-sm text-gray-600 dark:text-gray-400 truncate" title={bank.description}>
                            {bank.description}
                          </p>
                        ) : (
                          <span className="text-sm text-gray-400 dark:text-gray-500 italic">No description</span>
                        )}
                      </div>
                    </td>

                    {/* Added Date */}
                    <td className="px-4 py-4 text-center">
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        {formatDateOnly(bank.created_at)}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="px-4 py-4">
                      <div className="flex items-center justify-center space-x-2">
                        {/* Edit button */}
                        <button
                          onClick={() => handleEditBank(bank)}
                          className="p-2 text-gray-400 hover:text-green-600 dark:hover:text-green-400 transition-colors duration-200"
                          title="Edit Bank"
                        >
                          <PencilIcon className="w-4 h-4" />
                        </button>
                        {/* Delete button */}
                        <button
                          onClick={() => handleDelete(bank.id)}
                          className="p-2 text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-colors duration-200"
                          title="Delete Bank"
                        >
                          <TrashIcon className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Mobile Card View - Hidden on Desktop */}
        <div className="md:hidden grid grid-cols-1 gap-4">
        {banks.map((bank) => (
          <div
            key={bank.id}
            className="bg-white dark:bg-gray-900 rounded-xl border border-green-200 dark:border-blue-400 p-4 hover:shadow-lg transition-shadow duration-200"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center">
                <div className="w-10 h-10 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center mr-3">
                  {bank.logo ? (
                    <img
                      src={bank.logo}
                      alt={`${bank.bank_name} logo`}
                      className="w-6 h-6 object-contain"
                      onError={(e) => {
                        e.target.style.display = 'none';
                        e.target.nextSibling.style.display = 'block';
                      }}
                    />
                  ) : null}
                  <BankIcon
                    className="w-5 h-5 text-gray-600 dark:text-gray-400"
                    style={{ display: bank.logo ? 'none' : 'block' }}
                  />
                </div>
                <div>
                  <h3 className="text-base font-semibold text-gray-900 dark:text-white">
                    {bank.bank_name}
                  </h3>
                  <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                    bank.status === 'active'
                      ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
                      : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300'
                  }`}>
                    {bank.status === 'active' ? 'Active' : 'Inactive'}
                  </span>
                </div>
              </div>
              <div className="flex items-center space-x-1">
                {/* Edit button */}
                <button
                  onClick={() => handleEditBank(bank)}
                  className="p-1.5 text-gray-400 hover:text-green-600 dark:hover:text-green-400 transition-colors duration-200"
                  title="Edit Bank"
                >
                  <PencilIcon className="w-4 h-4" />
                </button>
                {/* Delete button */}
                <button
                  onClick={() => handleDelete(bank.id)}
                  className="p-1.5 text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-colors duration-200"
                  title="Delete Bank"
                >
                  <TrashIcon className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-400">Bank Code</span>
                <span className="font-medium text-gray-900 dark:text-white">
                  {bank.bank_code}
                </span>
              </div>
              {bank.description && (
                <div className="text-sm">
                  <span className="text-gray-600 dark:text-gray-400">Description</span>
                  <p className="font-medium text-gray-900 dark:text-white mt-1 text-xs leading-relaxed">
                    {bank.description}
                  </p>
                </div>
              )}
              <div className="flex justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-400">Added</span>
                <span className="font-medium text-gray-900 dark:text-white">
                  {formatDateOnly(bank.created_at)}
                </span>
              </div>
            </div>
          </div>
        ))}
        </div>

      {/* Summary Stats */}
      <div className="bg-white dark:bg-gray-900 rounded-xl border border-green-200 dark:border-blue-400 p-3 sm:p-4 md:p-6">
        <h2 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white mb-3 sm:mb-4">
          Banking Network Summary
        </h2>
        <div className="grid grid-cols-2 gap-3 sm:gap-4 md:gap-6">
          <div className="text-center">
            <div className="text-lg sm:text-xl md:text-2xl font-bold text-brand-600 dark:text-white">
              {banks.length}
            </div>
            <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Total Banks</div>
          </div>
          <div className="text-center">
            <div className="text-lg sm:text-xl md:text-2xl font-bold text-green-600 dark:text-green-400">
              {banks.filter(b => b.status === 'active').length}
            </div>
            <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Active Banks</div>
          </div>
        </div>
      </div>
      </>
      )}

      {/* Add Bank Modal */}
      <AddBankModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSubmit={handleAddBank}
      />

      {/* Edit Bank Modal */}
      <EditBankModal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setSelectedBank(null);
        }}
        onSubmit={handleUpdateBank}
        bank={selectedBank}
      />
    </div>
  );
};

export default Banks;
