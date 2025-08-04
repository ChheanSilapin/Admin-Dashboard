import { useRef, useEffect } from 'react';
import { ChevronDownIcon, mergeClasses } from '../../../icons';
import { CURRENCY_SYMBOLS } from '../../../utils/currencyFormatter';

const CustomerForm = ({
  formData,
  displayValues,
  errors,
  dropdowns,
  banksLoading,
  getBankOptions,
  getBankById,
  handleInputChange,
  handleNumberInput,
  handleCurrencyChange,
  toggleDropdown,
  closeAllDropdowns,
  onSubmit
}) => {
  // Refs for dropdown management
  const typeDropdownRef = useRef(null);
  const currencyDropdownRef = useRef(null);
  const bankDropdownRef = useRef(null);

  // Base input classes - smaller on mobile
  const inputBaseClasses = "w-full px-2 py-1.5 sm:px-3 sm:py-2.5 text-xs sm:text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 dark:bg-gray-800 dark:border-gray-600 dark:text-white dark:focus:border-blue-400 transition-colors";

  // Handle clicks outside dropdowns
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        typeDropdownRef.current && !typeDropdownRef.current.contains(event.target) &&
        currencyDropdownRef.current && !currencyDropdownRef.current.contains(event.target) &&
        bankDropdownRef.current && !bankDropdownRef.current.contains(event.target)
      ) {
        closeAllDropdowns();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [closeAllDropdowns]);

  return (
    <form id="customer-form" onSubmit={onSubmit} autoComplete="off" className="space-y-3 sm:space-y-4 md:space-y-5">
      {/* Group 1: Customer Identity - 2-column layout on all screen sizes */}
      <div className="grid grid-cols-2 gap-2 sm:gap-3 md:gap-4">
        <div>
          <label className="mb-1 sm:mb-1.5 block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-400">
            Customer ID *
          </label>
          <input
            type="text"
            name="CustomerId"
            value={formData.CustomerId}
            onChange={handleInputChange}
            required
            autoComplete="off"
            autoCorrect="off"
            autoCapitalize="off"
            spellCheck="false"
            className={mergeClasses(inputBaseClasses, errors.CustomerId ? 'border-red-300 focus:border-red-300 focus:ring-red-500/10' : '')}
            placeholder="CUST-001"
          />
          {errors.CustomerId && (
            <p className="mt-0.5 sm:mt-1 text-xs sm:text-sm text-red-600 dark:text-red-400">{errors.CustomerId}</p>
          )}
        </div>

        <div>
          <label className="mb-1 sm:mb-1.5 block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-400">
            Full Name *
          </label>
          <input
            type="text"
            name="fullName"
            value={formData.fullName}
            onChange={handleInputChange}
            required
            autoComplete="off"
            className={mergeClasses(inputBaseClasses, errors.fullName ? 'border-red-300 focus:border-red-300 focus:ring-red-500/10' : '')}
            placeholder="Enter customer's full name"
          />
          {errors.fullName && (
            <p className="mt-0.5 sm:mt-1 text-xs sm:text-sm text-red-600 dark:text-red-400">{errors.fullName}</p>
          )}
        </div>
      </div>

      {/* Group 2: Transaction Details - 2-column layout on all screen sizes */}
      <div className="grid grid-cols-2 gap-2 sm:gap-3 md:gap-4">
        {/* Type Dropdown */}
        <div className="relative" ref={typeDropdownRef}>
          <label className="mb-1 sm:mb-1.5 block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-400">
            Type *
          </label>
          <button
            type="button"
            onClick={() => toggleDropdown('Type')}
            className={mergeClasses(
              inputBaseClasses,
              'flex items-center justify-between',
              errors.Type ? 'border-red-300 focus:border-red-300 focus:ring-red-500/10' : ''
            )}
          >
            <span className={formData.Type ? 'text-gray-900 dark:text-white' : 'text-gray-500 dark:text-gray-400'}>
              {formData.Type || 'Select type'}
            </span>
            <ChevronDownIcon className={`w-4 h-4 text-gray-400 transition-transform ${dropdowns.Type ? 'rotate-180' : ''}`} />
          </button>

          {dropdowns.Type && (
            <div className="absolute z-50 w-full mt-0.5 sm:mt-1 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg shadow-lg max-h-32 sm:max-h-40 overflow-y-auto">
              {['Deposit', 'Withdrawal'].map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => {
                    handleInputChange({ target: { name: 'Type', value: type } });
                    toggleDropdown('Type');
                  }}
                  className="w-full px-2 py-1.5 sm:px-3 sm:py-2 text-left text-xs sm:text-sm hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-900 dark:text-white first:rounded-t-lg last:rounded-b-lg"
                >
                  {type}
                </button>
              ))}
            </div>
          )}
          {errors.Type && (
            <p className="mt-0.5 sm:mt-1 text-xs sm:text-sm text-red-600 dark:text-red-400">{errors.Type}</p>
          )}
        </div>

        {/* Currency Dropdown */}
        <div className="relative" ref={currencyDropdownRef}>
          <label className="mb-1 sm:mb-1.5 block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-400">
            Currency *
          </label>
          <button
            type="button"
            onClick={() => toggleDropdown('currency')}
            className={mergeClasses(
              inputBaseClasses,
              'flex items-center justify-between',
              errors.currency ? 'border-red-300 focus:border-red-300 focus:ring-red-500/10' : ''
            )}
          >
            <span className="text-gray-900 dark:text-white">
              {CURRENCY_SYMBOLS[formData.currency]} {formData.currency}
            </span>
            <ChevronDownIcon className={`w-4 h-4 text-gray-400 transition-transform ${dropdowns.currency ? 'rotate-180' : ''}`} />
          </button>
          
          {dropdowns.currency && (
            <div className="absolute z-50 w-full mt-0.5 sm:mt-1 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg shadow-lg">
              {Object.entries(CURRENCY_SYMBOLS).map(([code, symbol]) => (
                <button
                  key={code}
                  type="button"
                  onClick={() => handleCurrencyChange(code)}
                  className="w-full px-2 py-1.5 sm:px-3 sm:py-2 text-left text-xs sm:text-sm hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-900 dark:text-white first:rounded-t-lg last:rounded-b-lg"
                >
                  {symbol} {code}
                </button>
              ))}
            </div>
          )}
          {errors.currency && (
            <p className="mt-0.5 sm:mt-1 text-xs sm:text-sm text-red-600 dark:text-red-400">{errors.currency}</p>
          )}
        </div>
      </div>

      {/* Group 3: Financial Information */}
      <div className="space-y-3 sm:space-y-0 sm:grid sm:grid-cols-2 sm:gap-3 md:gap-4">
        {/* Credit Field - Full width on mobile for inline layout */}
        <div className="sm:col-span-1">
          {/* Mobile: Inline label and input */}
          <div className="sm:hidden">
            <div className="flex items-center gap-2">
              <label className="text-xs font-medium text-gray-700 dark:text-gray-400 whitespace-nowrap">
                Credit :
              </label>
              <input
                type="text"
                name="Credit"
                value={displayValues.Credit || formData.Credit}
                onChange={(e) => handleNumberInput(e, 'Credit')}
                required
                autoComplete="off"
                className={mergeClasses(
                  "flex-1 px-2 py-1.5 text-xs border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 dark:bg-gray-800 dark:border-gray-600 dark:text-white dark:focus:border-blue-400 transition-colors",
                  errors.Credit ? 'border-red-300 focus:border-red-300 focus:ring-red-500/10' : ''
                )}
                placeholder="0"
              />
            </div>
            {errors.Credit && (
              <p className="mt-0.5 text-xs text-red-600 dark:text-red-400">{errors.Credit}</p>
            )}
          </div>

          {/* Desktop: Standard label above input */}
          <div className="hidden sm:block">
            <label className="mb-1 sm:mb-1.5 block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-400">
              Credit *
            </label>
            <input
              type="text"
              name="Credit"
              value={displayValues.Credit || formData.Credit}
              onChange={(e) => handleNumberInput(e, 'Credit')}
              required
              autoComplete="off"
              className={mergeClasses(inputBaseClasses, errors.Credit ? 'border-red-300 focus:border-red-300 focus:ring-red-500/10' : '')}
              placeholder="0"
            />
            {errors.Credit && (
              <p className="mt-0.5 sm:mt-1 text-xs sm:text-sm text-red-600 dark:text-red-400">{errors.Credit}</p>
            )}
          </div>
        </div>

        <div>
          <label className="mb-1 sm:mb-1.5 block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-400">
            Amount *
          </label>
          <input
            type="text"
            name="amount"
            value={displayValues.amount || formData.amount}
            onChange={(e) => handleNumberInput(e, 'amount')}
            required
            autoComplete="off"
            className={mergeClasses(inputBaseClasses, errors.amount ? 'border-red-300 focus:border-red-300 focus:ring-red-500/10' : '')}
            placeholder={`${formData.currency === 'KHR' ? '៛' : '$'}0`}
          />
          {errors.amount && (
            <p className="mt-0.5 sm:mt-1 text-xs sm:text-sm text-red-600 dark:text-red-400">{errors.amount}</p>
          )}
        </div>
      </div>

      {/* Group 4: Bank Selection */}
      <div className="relative" ref={bankDropdownRef}>
        <label className="mb-1 sm:mb-1.5 block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-400">
          Bank *
        </label>
        <button
          type="button"
          onClick={() => toggleDropdown('bank')}
          disabled={banksLoading}
          className={mergeClasses(
            inputBaseClasses,
            'flex items-center justify-between',
            errors.bank_id ? 'border-red-300 focus:border-red-300 focus:ring-red-500/10' : '',
            banksLoading ? 'opacity-50 cursor-not-allowed' : ''
          )}
        >
          <span className={formData.bank_id ? 'text-gray-900 dark:text-white' : 'text-gray-500 dark:text-gray-400'}>
            {formData.bank_id ? getBankById(formData.bank_id)?.bank_name || 'Select bank' : 'Select bank'}
          </span>
          <ChevronDownIcon className={`w-4 h-4 text-gray-400 transition-transform ${dropdowns.bank ? 'rotate-180' : ''}`} />
        </button>
        
        {dropdowns.bank && !banksLoading && (
          <div className="absolute z-50 w-full mt-0.5 sm:mt-1 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg shadow-lg max-h-40 sm:max-h-48 overflow-y-auto">
            {getBankOptions().map((bank) => (
              <button
                key={bank.value}
                type="button"
                onClick={() => {
                  handleInputChange({ target: { name: 'bank_id', value: bank.value } });
                  toggleDropdown('bank');
                }}
                className="w-full px-2 py-1.5 sm:px-3 sm:py-2.5 text-left text-xs sm:text-sm hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-900 dark:text-white border-b border-gray-100 dark:border-gray-700 last:border-b-0 first:rounded-t-lg last:rounded-b-lg focus:outline-none focus:bg-gray-50 dark:focus:bg-gray-700"
              >
                <div className="font-medium">{bank.label}</div>
                <div className="text-xs text-gray-500 dark:text-gray-400">{bank.bank_code}</div>
              </button>
            ))}
          </div>
        )}
        {errors.bank_id && (
          <p className="mt-0.5 sm:mt-1 text-xs sm:text-sm text-red-600 dark:text-red-400">{errors.bank_id}</p>
        )}
      </div>

      {/* Group 5: Notes - Mobile-optimized */}
      <div>
        <label className="mb-1 sm:mb-1.5 block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-400">
          Note
        </label>
        <textarea
          name="Note"
          value={formData.Note}
          onChange={handleInputChange}
          rows={2}
          autoComplete="off"
          className={mergeClasses(inputBaseClasses, 'resize-none sm:rows-3')}
          placeholder="Additional notes (optional)"
        />
      </div>
    </form>
  );
};

export default CustomerForm;
