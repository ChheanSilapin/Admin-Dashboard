import { useState } from 'react';
import { Link } from 'react-router-dom';
import { BankIcon, PencilIcon, TrashIcon, EyeIcon } from '../../icons';
import { useAuth, PERMISSIONS } from '../../contexts/AuthContext';
import { AddButton, EditButton, DeleteButton } from '../../components/ui/PermissionButton';
import PermissionWrapper from '../../components/ui/PermissionWrapper';

const Banks = () => {
  const { isSales } = useAuth();

  // Mock data for banks
  const [banks] = useState([
    {
      id: 1,
      bank_name: 'ABA Bank',
      icon_logo: '/images/banks/aba-bank.png',
      created_at: '2024-01-15',
      status: 'Active',
      total_customers: 1250,
      total_transactions: 5680,
    },
    {
      id: 2,
      bank_name: 'ACLEDA Bank',
      icon_logo: '/images/banks/acleda-bank.png',
      created_at: '2024-01-20',
      status: 'Active',
      total_customers: 980,
      total_transactions: 4320,
    },
    {
      id: 3,
      bank_name: 'Canadia Bank',
      icon_logo: '/images/banks/canadia-bank.png',
      created_at: '2024-02-01',
      status: 'Active',
      total_customers: 756,
      total_transactions: 3210,
    },
    {
      id: 4,
      bank_name: 'Wing Bank',
      icon_logo: '/images/banks/wing-bank.png',
      created_at: '2024-02-10',
      status: 'Pending',
      total_customers: 0,
      total_transactions: 0,
    },
  ]);

  const handleDelete = (bankId) => {
    if (window.confirm('Are you sure you want to delete this bank?')) {
      console.log('Delete bank:', bankId);
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
        <PermissionWrapper permission={PERMISSIONS.BANK_CREATE}>
          <Link
            to="/banks/add"
            className="inline-flex items-center px-4 py-2 bg-brand-600 hover:bg-brand-700 text-white font-medium rounded-lg transition-colors duration-200"
          >
            <BankIcon className="w-5 h-5 mr-2" />
            Add Bank
          </Link>
        </PermissionWrapper>
      </div>

      {/* Banks Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {banks.map((bank) => (
          <div
            key={bank.id}
            className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6 hover:shadow-lg transition-shadow duration-200"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center mr-3">
                  {bank.icon_logo ? (
                    <img
                      src={bank.icon_logo}
                      alt={`${bank.bank_name} logo`}
                      className="w-8 h-8 object-contain"
                      onError={(e) => {
                        e.target.style.display = 'none';
                        e.target.nextSibling.style.display = 'block';
                      }}
                    />
                  ) : null}
                  <BankIcon
                    className="w-6 h-6 text-gray-600 dark:text-gray-400"
                    style={{ display: bank.icon_logo ? 'none' : 'block' }}
                  />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    {bank.bank_name}
                  </h3>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    bank.status === 'Active'
                      ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
                      : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300'
                  }`}>
                    {bank.status}
                  </span>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                {/* View button - always visible for all roles */}
                <button
                  className="p-2 text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200"
                  title="View Details"
                >
                  <EyeIcon className="w-4 h-4" />
                </button>

                {/* Edit button - permission-based */}
                <EditButton
                  permission={PERMISSIONS.BANK_UPDATE}
                  className="p-2 text-gray-400 hover:text-green-600 dark:hover:text-green-400 transition-colors duration-200"
                  title="Edit Bank"
                  showTooltip={isSales()}
                >
                  <PencilIcon className="w-4 h-4" />
                </EditButton>

                {/* Delete button - permission-based */}
                <DeleteButton
                  permission={PERMISSIONS.BANK_DELETE}
                  onClick={() => handleDelete(bank.id)}
                  className="p-2 text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-colors duration-200"
                  title="Delete Bank"
                  showTooltip={isSales()}
                >
                  <TrashIcon className="w-4 h-4" />
                </DeleteButton>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-400">Customers</span>
                <span className="font-medium text-gray-900 dark:text-white">
                  {bank.total_customers.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-400">Transactions</span>
                <span className="font-medium text-gray-900 dark:text-white">
                  {bank.total_transactions.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-400">Added</span>
                <span className="font-medium text-gray-900 dark:text-white">
                  {new Date(bank.created_at).toLocaleDateString()}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Summary Stats */}
      <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Banking Network Summary
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="text-2xl font-bold text-brand-600 dark:text-brand-400">
              {banks.length}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Total Banks</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600 dark:text-green-400">
              {banks.filter(b => b.status === 'Active').length}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Active Banks</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
              {banks.reduce((sum, bank) => sum + bank.total_customers, 0).toLocaleString()}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Total Customers</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
              {banks.reduce((sum, bank) => sum + bank.total_transactions, 0).toLocaleString()}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Total Transactions</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Banks;
