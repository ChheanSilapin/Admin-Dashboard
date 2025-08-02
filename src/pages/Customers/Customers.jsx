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
  const [currencyFilter, setCurrencyFilter] = useState('All Currencies');
  const [typeFilter, setTypeFilter] = useState('All Types');
  const [statusFilter, setStatusFilter] = useState('All Status');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [isFilterDropdownOpen, setIsFilterDropdownOpen] = useState(false);

  // Loading states for individual operations
  const [isAdding, setIsAdding] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // Dropdown options
  const currencyOptions = [
    { value: 'All Currencies', label: 'All Currencies' },
    { value: 'USD', label: 'USD' },
    { value: 'KHR', label: 'KHR' }
  ];

  const typeOptions = [
    { value: 'All Types', label: 'All Types' },
    { value: 'Deposit', label: 'Deposit' },
    { value: 'Withdraw', label: 'Withdraw' }
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



  // Enhanced filtering logic
  const filteredCustomers = customers.filter(customer => {
    const matchesSearch = customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         customer.accountNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         customer.CustomerId.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         customer.bank_name.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCurrency = currencyFilter === 'All Currencies' || customer.currency === currencyFilter;
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
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
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
          className="inline-flex items-center justify-center px-3 py-2 bg-blue-400 hover:bg-blue-500/50 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-medium rounded-lg transition-colors duration-200 h-9 text-sm shadow-theme-xs"
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
      <div className="bg-white dark:bg-gray-900 rounded-xl border border-green-200 dark:border-blue-400 p-4 sm:p-6">
        {/* Single responsive layout */}
        <div className="flex flex-col md:flex-row gap-3 md:items-start">
          {/* Search Bar */}
          <div className="relative flex-1 md:max-w-md">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <SearchIcon className="dark:text-blue-400" />
            </div>
            <input
              type="text"
              placeholder="Search by name, email, or account number..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="h-10 w-full pl-9 pr-3 py-2 border border-green-200 dark:border-blue-400 rounded-lg bg-white dark:bg-gray-900 focus:border-green-200 focus:outline-none focus:ring-2 focus:ring-green-200 dark:text-white dark:placeholder-gray-400 text-sm shadow-theme-xs"
            />
          </div>

          {/* Filter Button */}
          <div ref={filterDropdownRef} className="relative">
            <button
              onClick={() => setIsFilterDropdownOpen(!isFilterDropdownOpen)}
              className="h-10 px-4 py-2 rounded-lg text-sm font-medium shadow-theme-xs bg-white dark:bg-gray-900 border border-green-200 dark:border-blue-400 text-gray-700 dark:text-gray-300 hover:bg-green-50 dark:hover:bg-green-800 focus:border-green-300 focus:outline-none focus:ring-2 focus:ring-green-200 transition-colors duration-200 cursor-pointer flex items-center gap-2"
            >
              <Filter className="w-4 h-4 text-green-400 dark:text-blue-400" />
              Filter
              <ChevronDownIcon className={`w-4 h-4 transition-transform duration-200 ${isFilterDropdownOpen ? 'rotate-180' : ''}`} />
            </button>

            {/* Filter Dropdown - Responsive positioning */}
            {isFilterDropdownOpen && (
              <div className="absolute top-full right-0 md:right-0 left-0 md:left-auto mt-2 w-80 bg-white dark:bg-gray-900 border border-green-200 dark:border-blue-400 rounded-lg shadow-lg z-50 overflow-hidden">
                {/* Header with close button */}
                <div className="flex items-center justify-between p-4 border-b border-green-200 dark:border-blue-400">
                  <h3 className="text-sm font-medium text-gray-900 dark:text-white">Filters</h3>
                  <button
                    onClick={() => setIsFilterDropdownOpen(false)}
                    className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                <div className="p-4">
                  {/* Filter Sections in 2-column grid */}
                  <div className="grid grid-cols-2 gap-4">

                    {/* Currency Filter */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Currency
                      </label>
                      <div className="space-y-1">
                        {currencyOptions.map((option) => (
                          <button
                            key={option.value}
                            onClick={() => {
                              setCurrencyFilter(option.value);
                              // Don't close dropdown to allow multiple selections
                            }}
                            className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors flex items-center justify-between ${
                              currencyFilter === option.value
                                ? 'bg-green-50 dark:bg-green-500/10 text-green-700 dark:text-green-400 font-medium'
                                : 'text-gray-700 dark:text-gray-300 hover:bg-green-50 dark:hover:bg-green-800'
                            }`}
                          >
                            <span>{option.label}</span>
                            {currencyFilter === option.value && (
                              <svg className="w-4 h-4 text-green-600 dark:text-green-400" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                              </svg>
                            )}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Type Filter */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Type
                      </label>
                      <div className="space-y-1">
                        {typeOptions.map((option) => (
                          <button
                            key={option.value}
                            onClick={() => {
                              setTypeFilter(option.value);
                              // Don't close dropdown to allow multiple selections
                            }}
                            className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors flex items-center justify-between ${
                              typeFilter === option.value
                                ? 'bg-green-50 dark:bg-green-500/10 text-green-700 dark:text-green-400 font-medium'
                                : 'text-gray-700 dark:text-gray-300 hover:bg-green-50 dark:hover:bg-green-800'
                            }`}
                          >
                            <span>{option.label}</span>
                            {typeFilter === option.value && (
                              <svg className="w-4 h-4 text-green-600 dark:text-green-400" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                              </svg>
                            )}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Clear Filters */}
                  <div className="pt-4 mt-4 border-t border-green-200 dark:border-blue-400">
                    <button
                      onClick={() => {
                        setStatusFilter('All Status');
                        setCurrencyFilter('All Currencies');
                        setTypeFilter('All Types');
                        setIsFilterDropdownOpen(false);
                      }}
                      className="w-full text-left px-3 py-2 rounded-md text-sm text-gray-500 dark:text-gray-400 hover:bg-green-50 dark:hover:bg-green-800 transition-colors"
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
      <div className="bg-white dark:bg-gray-900 rounded-xl border border-green-200 dark:border-blue-400 overflow-hidden">
        {/* Table Header - Desktop Only */}
        <div className="hidden lg:block">
          <div className="bg-green-50 dark:bg-gray-800 px-4 py-2">
            <div className="grid grid-cols-6 gap-3">
              <div className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Customer
              </div>
              <div className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Transaction
              </div>
              <div className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Bank
              </div>
              <div className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Amount
              </div>
              <div className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Date
              </div>
              <div className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Actions
              </div>
            </div>
          </div>
        </div>

        {/* Customer Items - Responsive Layout */}
        <div className="divide-y divide-green-200 dark:divide-blue-400">
          {filteredCustomers.map((customer, index) => (
            <div key={`${customer.CustomerId}-${index}`} className="p-3 lg:px-4 lg:py-2.5 hover:bg-green-50 dark:hover:bg-green-800 transition-colors">
              {/* Mobile/Tablet Card Layout */}
              <div className="lg:hidden">
                <div className="flex items-start space-x-3">
                  <div className="w-10 h-10 bg-blue-100 dark:bg-blue-500/20 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-blue-600 dark:text-blue-400 font-medium text-base">
                      {customer.name.charAt(0)}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="text-sm font-medium text-gray-900 dark:text-white truncate">
                          {customer.name}
                        </h3>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                          {customer.accountNumber}
                        </p>
                      </div>
                    </div>

                    <div className="mt-2 space-y-1.5">
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-500 dark:text-gray-400">Customer ID:</span>
                        <span className="text-xs text-gray-900 dark:text-white truncate ml-2">{customer.CustomerId}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-500 dark:text-gray-400">Type:</span>
                        <span className={`text-xs font-medium px-1.5 py-0.5 rounded-full ${
                          customer.Type === 'Deposit'
                            ? 'bg-green-100 text-green-800 dark:bg-green-500/20 dark:text-green-400'
                            : 'bg-orange-100 text-orange-800 dark:bg-orange-500/20 dark:text-orange-400'
                        }`}>
                          {customer.Type}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-500 dark:text-gray-400">Bank:</span>
                        <span className="text-xs text-gray-900 dark:text-white truncate ml-2">{customer.bank_name}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-500 dark:text-gray-400">Amount:</span>
                        <span className="text-xs font-medium text-gray-900 dark:text-white">
                          {customer.currency} {formatAmount(customer.amount)}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-500 dark:text-gray-400">Credit:</span>
                        <span className="text-xs font-medium text-gray-900 dark:text-white">
                          {customer.currency} {formatAmount(customer.Credit)}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-500 dark:text-gray-400">Created:</span>
                        <span className="text-xs text-gray-900 dark:text-white">
                          {new Date(customer.created_at).toLocaleDateString()}
                        </span>
                      </div>
                    </div>

                    <div className="mt-3 flex space-x-2">
                      <button
                        onClick={() => handleEditCustomer(customer)}
                        disabled={isUpdating || isDeleting}
                        className="flex-1 bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-500/20 disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed px-2 py-1.5 rounded-md text-xs font-medium transition-colors h-7 flex items-center justify-center"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteCustomer(customer)}
                        disabled={isUpdating || isDeleting}
                        className="flex-1 bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-500/20 disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed px-2 py-1.5 rounded-md text-xs font-medium transition-colors h-7 flex items-center justify-center"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Desktop Table Row Layout */}
              <div className="hidden lg:block">
                <div className="grid grid-cols-6 gap-3 items-center">
                  {/* Customer Info */}
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-blue-100 dark:bg-blue-500/20 rounded-full flex items-center justify-center">
                      <span className="text-blue-600 dark:text-blue-400 font-medium text-sm">
                        {customer.name.charAt(0)}
                      </span>
                    </div>
                    <div className="ml-3">
                      <div className="text-sm font-medium text-gray-900 dark:text-white">
                        {customer.name}
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        {customer.CustomerId}
                      </div>
                    </div>
                  </div>

                  {/* Transaction Info */}
                  <div>
                    <span
                      className={`inline-flex px-1.5 py-0.5 text-xs font-semibold rounded-full ${
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
                  </div>

                  {/* Bank Info */}
                  <div>
                    <div className="text-sm text-gray-900 dark:text-white">{customer.bank_name}</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">{customer.bank_code}</div>
                  </div>

                  {/* Amount */}
                  <div>
                    <div className="text-sm font-medium text-gray-900 dark:text-white">
                      {customer.currency} {formatAmount(customer.amount)}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      Credit: {customer.currency} {formatAmount(customer.Credit)}
                    </div>
                  </div>

                  {/* Created Date */}
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    {new Date(customer.created_at).toLocaleDateString()}
                  </div>

                  {/* Actions */}
                  <div className="flex space-x-1">
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
                </div>
              </div>
            </div>
          ))}
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
