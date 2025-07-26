import { useState, useEffect, useRef } from 'react';
import { useCurrency } from '../../contexts/CurrencyContext';
import { UsersIcon, SearchIcon, ChevronDownIcon } from '../../icons';
import { AddCustomerModal } from '../../components/modals/customers';

const Customers = () => {
  const { formatAmount } = useCurrency();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All Status');
  const [currencyFilter, setCurrencyFilter] = useState('All Currencies');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isStatusDropdownOpen, setIsStatusDropdownOpen] = useState(false);
  const [isCurrencyDropdownOpen, setIsCurrencyDropdownOpen] = useState(false);

  // Dropdown options
  const statusOptions = [
    { value: 'All Status', label: 'All Status' },
    { value: 'Active', label: 'Active' },
    { value: 'Inactive', label: 'Inactive' }
  ];

  const currencyOptions = [
    { value: 'All Currencies', label: 'All Currencies' },
    { value: 'USD', label: 'USD' },
    { value: 'KHR', label: 'KHR' }
  ];

  // Refs for click outside detection
  const statusDropdownRef = useRef(null);
  const currencyDropdownRef = useRef(null);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (statusDropdownRef.current && !statusDropdownRef.current.contains(event.target)) {
        setIsStatusDropdownOpen(false);
      }
      if (currencyDropdownRef.current && !currencyDropdownRef.current.contains(event.target)) {
        setIsCurrencyDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const [customers, setCustomers] = useState([
    {
      id: 1,
      name: 'John Doe',
      email: 'john.doe@example.com',
      phone: '+855 12 345 678',
      balance: 15000,
      currency: 'USD',
      status: 'Active',
      joinDate: '2024-01-15',
      accountNumber: 'ACC-001',
    },
    {
      id: 2,
      name: 'Sarah Wilson',
      email: 'sarah.wilson@example.com',
      phone: '+855 98 765 432',
      balance: 8500,
      currency: 'USD',
      status: 'Active',
      joinDate: '2024-02-20',
      accountNumber: 'ACC-002',
    },
    {
      id: 3,
      name: 'Michael Chen',
      email: 'michael.chen@example.com',
      phone: '+855 77 123 456',
      balance: 0,
      currency: 'KHR',
      status: 'Inactive',
      joinDate: '2024-03-10',
      accountNumber: 'ACC-003',
    },
  ]);

  // Enhanced filtering logic
  const filteredCustomers = customers.filter(customer => {
    const matchesSearch = customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         customer.accountNumber.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === 'All Status' || customer.status === statusFilter;
    const matchesCurrency = currencyFilter === 'All Currencies' || customer.currency === currencyFilter;

    return matchesSearch && matchesStatus && matchesCurrency;
  });

  // Handle adding new customer
  const handleAddCustomer = (newCustomer) => {
    setCustomers(prev => [...prev, newCustomer]);
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
          className="inline-flex items-center justify-center px-3 py-2 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition-colors duration-200 h-9 text-sm shadow-theme-xs"
        >
          <UsersIcon className="w-4 h-4 mr-2" />
          Add Customer
        </button>
      </div>

      {/* Enhanced Search and Filters */}
      <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-4 sm:p-6">
        {/* Desktop Layout: Single Row */}
        <div className="hidden md:flex gap-3 items-center">
          {/* Search Bar */}
          <div className="relative flex-1 max-w-md">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <SearchIcon className="" />
            </div>
            <input
              type="text"
              placeholder="Search by name, email, or account number..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="h-10 w-full pl-9 pr-3 py-2 border border-green-500 rounded-lg focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-200 dark:text-white dark:placeholder-gray-400 text-sm shadow-theme-xs"
            />
          </div>

          {/* Filter Dropdowns */}
          {/* Status Dropdown */}
          <div ref={statusDropdownRef} className="relative min-w-[120px]">
            <button
              onClick={() => {
                setIsStatusDropdownOpen(!isStatusDropdownOpen);
                setIsCurrencyDropdownOpen(false);
              }}
              className="h-10 w-full px-3 py-2 pr-8 rounded-lg text-theme-sm font-medium shadow-theme-xs bg-white dark:bg-gray-900 border border-green-500 dark:border-green-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/5 focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-200 transition-colors duration-200 cursor-pointer text-left"
            >
              {statusFilter}
            </button>
            <ChevronDownIcon className={`absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-green-500 dark:text-green-400 pointer-events-none transition-transform duration-200 ${isStatusDropdownOpen ? 'rotate-180' : ''}`} />

            {isStatusDropdownOpen && (
              <div className="absolute z-50 top-full left-0 mt-1 w-full bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg shadow-theme-lg overflow-hidden">
                <ul className="py-1">
                  {statusOptions.map((option) => (
                    <li key={option.value}>
                      <button
                        onClick={() => {
                          setStatusFilter(option.value);
                          setIsStatusDropdownOpen(false);
                        }}
                        className={`menu-dropdown-item w-full text-left ${
                          statusFilter === option.value
                            ? 'menu-dropdown-item-active'
                            : 'menu-dropdown-item-inactive'
                        }`}
                      >
                        {option.label}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Currency Dropdown */}
          <div ref={currencyDropdownRef} className="relative min-w-[140px]">
            <button
              onClick={() => {
                setIsCurrencyDropdownOpen(!isCurrencyDropdownOpen);
                setIsStatusDropdownOpen(false);
              }}
              className="h-10 w-full px-3 py-2 pr-8 rounded-lg text-theme-sm font-medium shadow-theme-xs bg-white dark:bg-gray-900 border border-green-500 dark:border-green-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/5 focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-200 transition-colors duration-200 cursor-pointer text-left"
            >
              {currencyFilter}
            </button>
            <ChevronDownIcon className={`absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-green-500 dark:text-green-400 pointer-events-none transition-transform duration-200 ${isCurrencyDropdownOpen ? 'rotate-180' : ''}`} />

            {isCurrencyDropdownOpen && (
              <div className="absolute z-50 top-full left-0 mt-1 w-full bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg shadow-theme-lg overflow-hidden">
                <ul className="py-1">
                  {currencyOptions.map((option) => (
                    <li key={option.value}>
                      <button
                        onClick={() => {
                          setCurrencyFilter(option.value);
                          setIsCurrencyDropdownOpen(false);
                        }}
                        className={`menu-dropdown-item w-full text-left ${
                          currencyFilter === option.value
                            ? 'menu-dropdown-item-active'
                            : 'menu-dropdown-item-inactive'
                        }`}
                      >
                        {option.label}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>

        {/* Mobile Layout: Stacked Rows */}
        <div className="md:hidden space-y-3">
          {/* Search Bar */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <SearchIcon className="" />
            </div>
            <input
              type="text"
              placeholder="Search by name, email, or account number..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="h-10 w-full pl-9 pr-3 py-2 border border-green-500 dark:border-green-600 rounded-lg bg-gray-50 dark:bg-gray-800 focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-200 dark:text-white dark:placeholder-gray-400 text-sm shadow-theme-xs"
            />
          </div>

          {/* Filter Dropdowns */}
          <div className="flex gap-3">
            {/* Status Dropdown */}
            <div ref={statusDropdownRef} className="relative flex-1">
              <button
                onClick={() => {
                  setIsStatusDropdownOpen(!isStatusDropdownOpen);
                  setIsCurrencyDropdownOpen(false);
                }}
                className="h-10 w-full px-3 py-2 pr-8 rounded-lg text-theme-sm font-medium shadow-theme-xs bg-white dark:bg-gray-900 border border-green-500 dark:border-green-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/5 focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-200 transition-colors duration-200 cursor-pointer text-left"
              >
                {statusFilter}
              </button>
              <ChevronDownIcon className={`absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-green-500 dark:text-green-400 pointer-events-none transition-transform duration-200 ${isStatusDropdownOpen ? 'rotate-180' : ''}`} />

              {isStatusDropdownOpen && (
                <div className="absolute z-50 top-full left-0 mt-1 w-full bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg shadow-theme-lg overflow-hidden">
                  <ul className="py-1">
                    {statusOptions.map((option) => (
                      <li key={option.value}>
                        <button
                          onClick={() => {
                            setStatusFilter(option.value);
                            setIsStatusDropdownOpen(false);
                          }}
                          className={`menu-dropdown-item w-full text-left ${
                            statusFilter === option.value
                              ? 'menu-dropdown-item-active'
                              : 'menu-dropdown-item-inactive'
                          }`}
                        >
                          {option.label}
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Currency Dropdown */}
            <div ref={currencyDropdownRef} className="relative flex-1">
              <button
                onClick={() => {
                  setIsCurrencyDropdownOpen(!isCurrencyDropdownOpen);
                  setIsStatusDropdownOpen(false);
                }}
                className="h-10 w-full px-3 py-2 pr-8 rounded-lg text-theme-sm font-medium shadow-theme-xs bg-white dark:bg-gray-900 border border-green-500 dark:border-green-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/5 focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-200 transition-colors duration-200 cursor-pointer text-left"
              >
                {currencyFilter}
              </button>
              <ChevronDownIcon className={`absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-green-500 dark:text-green-400 pointer-events-none transition-transform duration-200 ${isCurrencyDropdownOpen ? 'rotate-180' : ''}`} />

              {isCurrencyDropdownOpen && (
                <div className="absolute z-50 top-full left-0 mt-1 w-full bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg shadow-theme-lg overflow-hidden">
                  <ul className="py-1">
                    {currencyOptions.map((option) => (
                      <li key={option.value}>
                        <button
                          onClick={() => {
                            setCurrencyFilter(option.value);
                            setIsCurrencyDropdownOpen(false);
                          }}
                          className={`menu-dropdown-item w-full text-left ${
                            currencyFilter === option.value
                              ? 'menu-dropdown-item-active'
                              : 'menu-dropdown-item-inactive'
                          }`}
                        >
                          {option.label}
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Customer List - Responsive Design */}
      <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 overflow-hidden">
        {/* Desktop Table View */}
        <div className="hidden lg:block overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-800">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Customer
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Contact
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Balance
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Join Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {filteredCustomers.map((customer) => (
                <tr key={customer.id} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-blue-100 dark:bg-blue-500/20 rounded-full flex items-center justify-center">
                        <span className="text-blue-600 dark:text-blue-400 font-medium">
                          {customer.name.charAt(0)}
                        </span>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                          {customer.name}
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          {customer.accountNumber}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900 dark:text-white">{customer.email}</div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">{customer.phone}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900 dark:text-white">
                      {customer.currency} {formatAmount(customer.balance)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        customer.status === 'Active'
                          ? 'bg-green-100 text-green-800 dark:bg-green-500/20 dark:text-green-400'
                          : 'bg-red-100 text-red-800 dark:bg-red-500/20 dark:text-red-400'
                      }`}
                    >
                      {customer.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    {customer.joinDate}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button className="text-blue-600 dark:text-blue-400 hover:text-blue-900 dark:hover:text-blue-300 mr-3 px-2 py-1 text-xs font-medium">
                      Edit
                    </button>
                    <button className="text-red-600 dark:text-red-400 hover:text-red-900 dark:hover:text-red-300 px-2 py-1 text-xs font-medium">
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile Card View */}
        <div className="lg:hidden divide-y divide-gray-200 dark:divide-gray-700">
          {filteredCustomers.map((customer) => (
            <div key={customer.id} className="p-4 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-500/20 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-blue-600 dark:text-blue-400 font-medium text-lg">
                    {customer.name.charAt(0)}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="text-base font-medium text-gray-900 dark:text-white truncate">
                        {customer.name}
                      </h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                        {customer.accountNumber}
                      </p>
                    </div>
                    <span
                      className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ml-2 ${
                        customer.status === 'Active'
                          ? 'bg-green-100 text-green-800 dark:bg-green-500/20 dark:text-green-400'
                          : 'bg-red-100 text-red-800 dark:bg-red-500/20 dark:text-red-400'
                      }`}
                    >
                      {customer.status}
                    </span>
                  </div>

                  <div className="mt-3 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-500 dark:text-gray-400">Email:</span>
                      <span className="text-sm text-gray-900 dark:text-white truncate ml-2">{customer.email}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-500 dark:text-gray-400">Phone:</span>
                      <span className="text-sm text-gray-900 dark:text-white">{customer.phone}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-500 dark:text-gray-400">Balance:</span>
                      <span className="text-sm font-medium text-gray-900 dark:text-white">
                        {customer.currency} {formatAmount(customer.balance)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-500 dark:text-gray-400">Joined:</span>
                      <span className="text-sm text-gray-900 dark:text-white">{customer.joinDate}</span>
                    </div>
                  </div>

                  <div className="mt-4 flex space-x-3">
                    <button className="flex-1 bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-500/20 px-3 py-2 rounded-lg text-xs font-medium transition-colors h-8 flex items-center justify-center">
                      Edit
                    </button>
                    <button className="flex-1 bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-500/20 px-3 py-2 rounded-lg text-xs font-medium transition-colors h-8 flex items-center justify-center">
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Add Customer Modal */}
      <AddCustomerModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleAddCustomer}
        customers={customers}
      />
    </div>
  );
};

export default Customers;
