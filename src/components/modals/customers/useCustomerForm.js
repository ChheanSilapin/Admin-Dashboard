import { useState, useEffect } from 'react';
import { useBanks } from '../../../hooks/useBanks';
import { formatCurrency } from '../../../utils/currencyFormatter';

export const useCustomerForm = (initialData = null, customers = []) => {
  const { banks, loading: banksLoading, getBankOptions, getBankById } = useBanks();

  // Form state - Essential fields only
  const [formData, setFormData] = useState({
    CustomerId: '',
    fullName: '',
    Type: 'Deposit',
    currency: 'USD',
    Credit: '',
    amount: '',
    bank_id: '',
    Note: '',
  });

  // Display values for formatted fields
  const [displayValues, setDisplayValues] = useState({
    Credit: '',
    amount: ''
  });

  // Error state
  const [errors, setErrors] = useState({});

  // Dropdown states
  const [dropdowns, setDropdowns] = useState({
    Type: false,
    currency: false,
    bank: false
  });

  // Initialize form data when initialData changes (for edit mode)
  useEffect(() => {
    if (initialData) {
      setFormData({
        CustomerId: initialData.CustomerId || '',
        fullName: initialData.name || '',
        Type: initialData.Type || 'Deposit',
        currency: initialData.currency || 'USD',
        Credit: initialData.Credit?.toString() || '',
        amount: initialData.amount?.toString() || '',
        bank_id: initialData.bank_id || '',
        Note: initialData.Note || ''
      });

      // Set display values for formatted fields
      setDisplayValues({
        Credit: initialData.Credit ? formatCurrency(initialData.Credit, 'USD').replace('$', '') : '',
        amount: initialData.amount ? formatCurrency(initialData.amount, initialData.currency || 'USD') : ''
      });
    } else {
      // Reset form for add mode
      setFormData({
        CustomerId: '',
        fullName: '',
        Type: 'Deposit',
        currency: 'USD',
        Credit: '',
        amount: '',
        bank_id: '',
        Note: '',
      });
      setDisplayValues({
        Credit: '',
        amount: ''
      });
    }
    setErrors({});
  }, [initialData]);

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  // Handle number input with formatting
  const handleNumberInput = (e, fieldName) => {
    const value = e.target.value;
    
    // Remove all non-digit characters except decimal point
    const numericValue = value.replace(/[^\d.]/g, '');
    
    // Prevent multiple decimal points
    const parts = numericValue.split('.');
    const cleanValue = parts.length > 2 ? parts[0] + '.' + parts.slice(1).join('') : numericValue;
    
    // Update form data with clean numeric value
    setFormData(prev => ({
      ...prev,
      [fieldName]: cleanValue
    }));
    
    // Format for display
    if (cleanValue) {
      const currency = fieldName === 'Credit' ? 'USD' : formData.currency;
      const formatted = formatCurrency(parseFloat(cleanValue), currency);
      const displayValue = fieldName === 'Credit' ? formatted.replace('$', '') : formatted;
      
      setDisplayValues(prev => ({
        ...prev,
        [fieldName]: displayValue
      }));
    } else {
      setDisplayValues(prev => ({
        ...prev,
        [fieldName]: ''
      }));
    }

    // Clear error when user starts typing
    if (errors[fieldName]) {
      setErrors(prev => ({
        ...prev,
        [fieldName]: ''
      }));
    }
  };

  // Handle currency change
  const handleCurrencyChange = (currency) => {
    setFormData(prev => ({
      ...prev,
      currency
    }));

    // Update amount display format when currency changes
    if (formData.amount) {
      const formatted = formatCurrency(parseFloat(formData.amount), currency);
      setDisplayValues(prev => ({
        ...prev,
        amount: formatted
      }));
    }

    setDropdowns(prev => ({
      ...prev,
      currency: false
    }));
  };

  // Toggle dropdown
  const toggleDropdown = (dropdownName) => {
    setDropdowns(prev => ({
      ...prev,
      [dropdownName]: !prev[dropdownName]
    }));
  };

  // Close all dropdowns
  const closeAllDropdowns = () => {
    setDropdowns({
      Type: false,
      currency: false,
      bank: false
    });
  };

  // Form validation
  const validateForm = (isEdit = false) => {
    const newErrors = {};

    // CustomerId validation
    if (!formData.CustomerId.trim()) {
      newErrors.CustomerId = 'Customer ID is required';
    } else if (!isEdit && customers.some(c => c.CustomerId === formData.CustomerId)) {
      newErrors.CustomerId = 'Customer ID must be unique';
    }

    // Full Name validation
    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Full name is required';
    } else if (formData.fullName.trim().length < 2) {
      newErrors.fullName = 'Full name must be at least 2 characters';
    }

    // Type validation
    if (!formData.Type) {
      newErrors.Type = 'Type is required';
    }

    // Currency validation
    if (!formData.currency) {
      newErrors.currency = 'Currency is required';
    }

    // Credit validation
    if (!formData.Credit) {
      newErrors.Credit = 'Credit is required';
    } else if (isNaN(parseFloat(formData.Credit)) || parseFloat(formData.Credit) < 0) {
      newErrors.Credit = 'Credit must be a valid positive number';
    }

    // Amount validation
    if (!formData.amount) {
      newErrors.amount = 'Amount is required';
    } else if (isNaN(parseFloat(formData.amount)) || parseFloat(formData.amount) <= 0) {
      newErrors.amount = 'Amount must be a valid positive number';
    }

    // Bank validation
    if (!formData.bank_id) {
      newErrors.bank_id = 'Bank selection is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Reset form
  const resetForm = () => {
    setFormData({
      CustomerId: '',
      fullName: '',
      Type: 'Deposit',
      currency: 'USD',
      Credit: '',
      amount: '',
      bank_id: '',
      Note: '',
    });
    setDisplayValues({
      Credit: '',
      amount: ''
    });
    setErrors({});
    closeAllDropdowns();
  };

  return {
    // State
    formData,
    displayValues,
    errors,
    dropdowns,
    
    // Bank data
    banks,
    banksLoading,
    getBankOptions,
    getBankById,
    
    // Handlers
    handleInputChange,
    handleNumberInput,
    handleCurrencyChange,
    toggleDropdown,
    closeAllDropdowns,
    
    // Validation
    validateForm,
    resetForm
  };
};
