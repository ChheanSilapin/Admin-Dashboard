import { useState, useEffect, useRef } from 'react';
import { useCurrency } from '../../contexts/CurrencyContext';
import { UsersIcon, SearchIcon, ChevronDownIcon } from '../../icons';
import { Filter } from 'lucide-react';
import { AddCustomerModal, EditCustomerModal, DeleteCustomerModal } from '../../components/modals/customers';
import { useCustomers } from '../../hooks/useCustomers';

const Customers = () => {
  const { formatAmount } = useCurrency();
  const {
    customers,
    loading,
    error,
    addCustomer,
    updateCustomer,
    deleteCustomer
  } = useCustomers();

  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('All Types');
  const [statusFilter, setStatusFilter] = useState('All Status');
  const [localCurrency, setLocalCurrency] = useState('All Currencies'); // Local currency filter
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [isFilterDropdownOpen, setIsFilterDropdownOpen] = useState(false);

  // Loading states for individual operations
  const [isAdding, setIsAdding] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);





  const typeOptions = [
    { value: 'All Types', label: 'All Types' },
    { value: 'Deposit', label: 'Deposit' },
    { value: 'Withdraw', label: 'Withdraw' }
  ];

  const currencyOptions = [
    { value: 'All Currencies', label: 'All Currencies' },
    { value: 'USD', label: 'USD ($)' },
    { value: 'KHR', label: 'KHR (៛)' }
  ];

  // Single ref for filter dropdown (responsive)
  const filterDropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (filterDropdownRef.current && !filterDropdownRef.current.contains(event.target)) {
        setIsFilterDropdownOpen(false);
      }
    };

    if (isFilterDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isFilterDropdownOpen]);

  // Enhanced filtering logic with local currency filter
  const filteredCustomers = customers.filter(customer => {
    const matchesSearch =
                         customer.CustomerId.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         customer.bank_name.toLowerCase().includes(searchTerm.toLowerCase());

    // Local currency filter - independent from global currency
    const matchesCurrency = localCurrency === 'All Currencies' || customer.currency === localCurrency;

    const matchesType = typeFilter === 'All Types' || customer.Type === typeFilter;

    return matchesSearch && matchesCurrency && matchesType;
  });

  // Handle adding new customer
  const handleAddCustomer = async (newCustomer) => {
    try {
      setIsAdding(true);
      await addCustomer(newCustomer);
    } catch (err) {
      console.error('Failed to add customer:', err);
      // Error is already handled in the hook
    } finally {
      setIsAdding(false);
    }
  };

  // Handle editing customer
  const handleEditCustomer = (customer) => {
    setSelectedCustomer(customer);
    setIsEditModalOpen(true);
  };

  const handleUpdateCustomer = async (updatedCustomer) => {
    try {
      setIsUpdating(true);
      await updateCustomer(updatedCustomer.id, updatedCustomer);
      setIsEditModalOpen(false);
      setSelectedCustomer(null);
    } catch (err) {
      console.error('Failed to update customer:', err);
      // Error is already handled in the hook
    } finally {
      setIsUpdating(false);
    }
  };

  // Handle deleting customer
  const handleDeleteCustomer = (customer) => {
    setSelectedCustomer(customer);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async (customerId) => {
    try {
      setIsDeleting(true);
      await deleteCustomer(customerId);
      setIsDeleteModalOpen(false);
      setSelectedCustomer(null);
    } catch (err) {
      console.error('Failed to delete customer:', err);
      // Error is already handled in the hook
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Customer
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Manage customer accounts and information
          </p>
          
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          disabled={loading || isAdding}
          className="inline-flex items-center justify-center px-2 py-1 bg-blue-400 hover:bg-blue-500/50 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-medium rounded-lg transition-colors duration-200 h-9 text-xs shadow-theme-xs"
        >
          <UsersIcon className="w-4 h-4 mr-2 dark:text-white" />
          {isAdding ? 'Adding...' : 'Add Customer'}
        </button>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 rounded-lg p-4">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <svg className="w-5 h-5 text-red-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-800 dark:text-red-400">{error}</p>
            </div>
          </div>
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div className="bg-white dark:bg-gray-900 rounded-xl border border-green-200 dark:border-blue-400 p-8">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
            <span className="ml-3 text-gray-600 dark:text-gray-400">Loading customers...</span>
          </div>
        </div>
      )}

      {/* Responsive Search and Filters */}
      {!loading && (
      <div className="bg-white dark:bg-gray-900 rounded-xl border border-green-200 dark:border-blue-400 p-4 sm:px-6 sm:py-4">
        {/* Single responsive layout */}
        <div className="flex flex-col md:flex-row gap-3 md:items-start">
          {/* Search Bar */}
          <div className="relative flex-1 md:max-w-lg">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <SearchIcon className="dark:text-blue-400" />
            </div>
            <input
              type="text"
              placeholder="Search by Bank, id, ....."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="h-9 w-full pl-9 pr-3 py-2 border border-green-200 dark:border-blue-400 rounded-lg bg-white dark:bg-gray-900 focus:border-green-200 focus:outline-none focus:ring-2 focus:ring-green-200 dark:text-white dark:placeholder-gray-400 text-sm shadow-theme-xs"
            />
          </div>

          {/* Filter Button */}
          <div ref={filterDropdownRef} className="relative">
            <button
              onClick={() => setIsFilterDropdownOpen(!isFilterDropdownOpen)}
              className="h-9 px-2 py-2 rounded-lg text-sm font-medium shadow-theme-xs bg-white dark:bg-gray-900 border border-green-200 dark:border-blue-400 text-gray-700 dark:text-gray-300 hover:bg-green-50 dark:hover:bg-green-800 focus:border-green-300 focus:outline-none focus:ring-2 focus:ring-green-200 transition-colors duration-200 cursor-pointer flex items-center gap-2"
            >
              <Filter className="w-4 h-4 text-green-400 dark:text-blue-400" />
              Filter
              <ChevronDownIcon className={`w-4 h-4 transition-transform duration-200 ${isFilterDropdownOpen ? 'rotate-180' : ''}`} />
            </button>

            {/* Filter Dropdown - Compact responsive positioning */}
            {isFilterDropdownOpen && (
              <div className="absolute top-full right-0 md:right-0 left-0 md:left-auto mt-2 w-full md:w-80 bg-white dark:bg-gray-900 border border-green-200 dark:border-blue-400 rounded-lg shadow-lg z-50 overflow-hidden">
                {/* Header with close button */}
                <div className="flex items-center justify-between px-3 py-2 border-b border-green-200 dark:border-blue-400">
                  <h3 className="text-xs font-medium text-gray-900 dark:text-white">Filters</h3>
                  <button
                    onClick={() => setIsFilterDropdownOpen(false)}
                    className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                  >
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                <div className="p-2.5">
                  {/* Filter Sections - Two-column layout on all screen sizes */}
                  <div className="grid grid-cols-2 gap-3">
                    {/* Currency Filter */}
                    <div>
                      <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                        Currency
                      </label>
                      <div className="space-y-0.5">
                        {currencyOptions.map((option) => (
                          <button
                            key={option.value}
                            onClick={() => {
                              setLocalCurrency(option.value);
                              // Don't close dropdown to allow multiple selections
                            }}
                            className={`w-full text-left px-2 py-1 rounded text-xs transition-colors flex items-center justify-between ${
                              localCurrency === option.value
                                ? 'bg-green-50 dark:bg-green-500/10 text-green-700 dark:text-green-400 font-medium'
                                : 'text-gray-700 dark:text-gray-300 hover:bg-green-50 dark:hover:bg-green-800'
                            }`}
                          >
                            <span>{option.label}</span>
                            {localCurrency === option.value && (
                              <svg className="w-3 h-3 text-green-600 dark:text-green-400" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                              </svg>
                            )}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Type Filter */}
                    <div>
                      <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                        Type
                      </label>
                      <div className="space-y-0.5">
                        {typeOptions.map((option) => (
                          <button
                            key={option.value}
                            onClick={() => {
                              setTypeFilter(option.value);
                              // Don't close dropdown to allow multiple selections
                            }}
                            className={`w-full text-left px-2 py-1 rounded text-xs transition-colors flex items-center justify-between ${
                              typeFilter === option.value
                                ? 'bg-green-50 dark:bg-green-500/10 text-green-700 dark:text-green-400 font-medium'
                                : 'text-gray-700 dark:text-gray-300 hover:bg-green-50 dark:hover:bg-green-800'
                            }`}
                          >
                            <span>{option.label}</span>
                            {typeFilter === option.value && (
                              <svg className="w-3 h-3 text-green-600 dark:text-green-400" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                              </svg>
                            )}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Clear Filters */}
                  <div className="pt-2 mt-2 border-t border-green-200 dark:border-blue-400">
                    <button
                      onClick={() => {
                        setStatusFilter('All Status');
                        setTypeFilter('All Types');
                        setLocalCurrency('All Currencies');
                        setIsFilterDropdownOpen(false);
                      }}
                      className="w-full text-center px-2 py-1.5 rounded text-xs text-gray-500 dark:text-gray-400 hover:bg-green-50 dark:hover:bg-green-800 transition-colors"
                    >
                      Clear all filters
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      )}

      {/* Responsive Customer List */}
      {!loading && (
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-blue-400 dark:bg-white/[0.03]">
        <div className="max-w-full overflow-x-auto">
          <table className="min-w-full border-collapse">
            {/* Table Header */}
            <thead className="border-b border-gray-100 dark:border-blue-400">
              <tr>
                <th className="pr-1 pl-1 py-2 font-medium text-gray-500 text-center text-xs dark:text-gray-400">
                  #
                </th>
                <th className="pr-1 pl-1 py-2 font-medium text-gray-500 text-start text-xs dark:text-gray-400">
                  Customer
                </th>
                <th className="pr-1 pl-1 py-2 font-medium text-gray-500 text-center text-xs dark:text-gray-400">
                  Transaction
                </th>
                <th className="pr-1 pl-1 py-2 font-medium text-gray-500 text-start text-xs dark:text-gray-400">
                  Bank
                </th>
                <th className="pr-1 pl-1 py-2 font-medium text-gray-500 text-end text-xs dark:text-gray-400">
                  Amount
                </th>
                <th className="pr-1 pl-1 py-2 font-medium text-gray-500 text-end text-xs dark:text-gray-400">
                  Credit
                </th>
                <th className="pr-1 pl-1 py-2 font-medium text-gray-500 text-center text-xs dark:text-gray-400">
                  Date
                </th>
                <th className="pr-1 pl-1 py-2 font-medium text-gray-500 text-center text-xs dark:text-gray-400">
                  Actions
                </th>
              </tr>
            </thead>

            {/* Table Body */}
            <tbody className="divide-y divide-green-200 dark:divide-blue-400">
              {filteredCustomers.map((customer, index) => (
                <tr key={`${customer.CustomerId}-${index}`} className="hover:bg-gray-50 dark:hover:bg-white/[0.02]">
                  {/* Row Number */}
                  <td className="pr-1 pl-1 py-2 text-center">
                    <span className="text-xs font-medium text-gray-600 dark:text-gray-300">
                      {index + 1}
                    </span>
                  </td>

                  {/* Customer Info */}
                  <td className="pr-1 pl-1 py-2">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 bg-blue-100 dark:bg-blue-500/20 rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-blue-600 dark:text-blue-400 font-medium text-xs">
                          {customer.name.charAt(0)}
                        </span>
                      </div>
                      <div>
                        <span className="block font-medium text-gray-800 text-xs dark:text-white/90">
                          {customer.name}
                        </span>
                        <span className="block text-gray-500 text-xs dark:text-gray-400">
                          {customer.CustomerId}
                        </span>
                      </div>
                    </div>
                  </td>

                  {/* Transaction Info */}
                  <td className="pr-1 pl-1 py-2 text-center">
                    <span
                      className={`inline-flex px-1.5 py-0.5 text-xs font-medium rounded-full ${
                        customer.Type === 'Deposit'
                          ? 'bg-green-100 text-green-800 dark:bg-green-500/20 dark:text-green-400'
                          : 'bg-orange-100 text-orange-800 dark:bg-orange-500/20 dark:text-orange-400'
                      }`}
                    >
                      {customer.Type}
                    </span>
                    <div className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                      {customer.currency}
                    </div>
                  </td>

                  {/* Bank Info */}
                  <td className="pr-1 pl-1 py-2 text-gray-500 text-start text-xs dark:text-gray-400">
                    <div>
                      <div className="font-medium text-gray-800 dark:text-white/90">{customer.bank_name}</div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">{customer.bank_code}</div>
                    </div>
                  </td>

                  {/* Amount */}
                  <td className="pr-1 pl-1 py-2 text-end text-gray-500 text-xs dark:text-gray-400">
                    <span className="font-medium text-gray-800 dark:text-white/90">
                      {formatAmount(customer.amount, customer.currency)}
                    </span>
                  </td>

                  {/* Credit */}
                  <td className="pr-1 pl-1 py-2 text-end text-gray-500 text-xs dark:text-gray-400">
                    <span className="font-medium text-gray-800 dark:text-white/90">
                      {customer.Credit.toLocaleString()}
                    </span>
                  </td>

                  {/* Created Date */}
                  <td className="pr-1 pl-1 py-2 text-center text-gray-500 text-xs dark:text-gray-400">
                    {new Date(customer.created_at).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric'
                    })}
                  </td>

                  {/* Actions */}
                  <td className="pr-1 pl-1 py-2 text-center">
                    <div className="flex justify-center space-x-1">
                      <button
                        onClick={() => handleEditCustomer(customer)}
                        disabled={isUpdating || isDeleting}
                        className="text-blue-600 dark:text-blue-400 hover:text-blue-900 dark:hover:text-blue-300 disabled:text-gray-400 disabled:cursor-not-allowed px-1.5 py-0.5 text-xs font-medium"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteCustomer(customer)}
                        disabled={isUpdating || isDeleting}
                        className="text-red-600 dark:text-red-400 hover:text-red-900 dark:hover:text-red-300 disabled:text-gray-400 disabled:cursor-not-allowed px-1.5 py-0.5 text-xs font-medium"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      )}

      {/* Add Customer Modal */}
      <AddCustomerModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleAddCustomer}
        customers={customers}
        isLoading={isAdding}
      />

      {/* Edit Customer Modal */}
      <EditCustomerModal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setSelectedCustomer(null);
        }}
        onSubmit={handleUpdateCustomer}
        customer={selectedCustomer}
        isLoading={isUpdating}
      />

      {/* Delete Customer Modal */}
      <DeleteCustomerModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setSelectedCustomer(null);
        }}
        onConfirm={handleConfirmDelete}
        customer={selectedCustomer}
        isLoading={isDeleting}
      />
    </div>
  );
};

export default Customers;
