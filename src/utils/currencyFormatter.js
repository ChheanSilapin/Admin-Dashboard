/**
 * Currency and number formatting utilities for customer forms
 * Handles real-time formatting, currency symbols, and locale-appropriate display
 */

/**
 * Currency symbols mapping
 */
export const CURRENCY_SYMBOLS = {
  USD: '$',
  KHR: '៛'
};

/**
 * Format a number with thousand separators (commas)
 * @param {string|number} value - The numeric value to format
 * @param {number} decimals - Number of decimal places (default: 2)
 * @param {boolean} forceDecimals - Whether to force decimal places (default: false)
 * @returns {string} Formatted number with commas
 */
export const formatNumberWithCommas = (value, decimals = 2, forceDecimals = false) => {
  if (!value && value !== 0) return '';

  // Convert to string and remove any existing formatting
  const cleanValue = value.toString().replace(/[^\d.-]/g, '');

  // Parse as float
  const numValue = parseFloat(cleanValue);

  if (isNaN(numValue)) return '';

  // Check if the original value has decimal places
  const hasDecimals = cleanValue.includes('.');

  // Format with appropriate decimal handling
  if (forceDecimals || hasDecimals) {
    return numValue.toLocaleString('en-US', {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals
    });
  } else {
    // Don't force decimals for whole numbers during typing
    return numValue.toLocaleString('en-US', {
      minimumFractionDigits: 0,
      maximumFractionDigits: decimals
    });
  }
};

/**
 * Format currency with symbol and thousand separators
 * @param {string|number} value - The numeric value to format
 * @param {string} currency - Currency code (USD, KHR)
 * @param {number} decimals - Number of decimal places (default: 2)
 * @param {boolean} forceDecimals - Whether to force decimal places (default: false)
 * @returns {string} Formatted currency string
 */
export const formatCurrency = (value, currency = 'USD', decimals = 2, forceDecimals = false) => {
  if (!value && value !== 0) return '';

  const formattedNumber = formatNumberWithCommas(value, decimals, forceDecimals);
  const symbol = CURRENCY_SYMBOLS[currency] || '$';

  return `${symbol}${formattedNumber}`;
};

/**
 * Remove formatting from a formatted number string
 * @param {string} formattedValue - The formatted string to clean
 * @returns {string} Clean numeric string
 */
export const removeNumberFormatting = (formattedValue) => {
  if (!formattedValue) return '';
  
  // Remove currency symbols, commas, and spaces, but keep digits, dots, and minus
  return formattedValue.toString().replace(/[^\d.-]/g, '');
};

/**
 * Parse a formatted value back to a clean number
 * @param {string} formattedValue - The formatted string to parse
 * @returns {number} Parsed numeric value
 */
export const parseFormattedNumber = (formattedValue) => {
  const cleanValue = removeNumberFormatting(formattedValue);
  const parsed = parseFloat(cleanValue);
  return isNaN(parsed) ? 0 : parsed;
};

/**
 * Handle input change for formatted number fields during typing
 * This version allows natural typing without forced formatting
 * @param {string} inputValue - The current input value
 * @returns {string} Clean numeric value for storage
 */
export const handleTypingInput = (inputValue) => {
  // Allow digits, one decimal point, and minus sign at the beginning
  const cleanValue = inputValue.replace(/[^\d.-]/g, '');

  // Ensure only one decimal point
  const parts = cleanValue.split('.');
  if (parts.length > 2) {
    return parts[0] + '.' + parts.slice(1).join('');
  }

  // Ensure minus sign only at the beginning
  const minusCount = (cleanValue.match(/-/g) || []).length;
  if (minusCount > 1) {
    return cleanValue.replace(/-/g, '').replace(/^/, cleanValue.startsWith('-') ? '-' : '');
  }

  return cleanValue;
};

/**
 * Format value for display during typing (minimal formatting)
 * @param {string} value - The raw numeric value
 * @param {string} currency - Currency code for amount fields (optional)
 * @returns {string} Lightly formatted value for display during typing
 */
export const formatForTyping = (value, currency = null) => {
  if (!value && value !== 0) return '';

  // During typing, only add currency symbol, no comma formatting or forced decimals
  if (currency) {
    const symbol = CURRENCY_SYMBOLS[currency] || '$';
    return `${symbol}${value}`;
  }

  return value;
};

/**
 * Handle input change for formatted number fields
 * @param {Event} event - The input change event
 * @param {Function} setFormData - State setter for form data
 * @param {string} fieldName - Name of the field being updated
 * @param {string} currency - Currency for amount field (optional)
 * @returns {Object} Object with displayValue and rawValue
 */
export const handleFormattedNumberChange = (event, setFormData, fieldName, currency = null) => {
  const inputValue = event.target.value;

  // Remove all formatting to get raw numeric value
  const rawValue = removeNumberFormatting(inputValue);

  // Update form data with raw numeric value
  setFormData(prev => ({
    ...prev,
    [fieldName]: rawValue
  }));

  return {
    displayValue: currency ? formatCurrency(rawValue, currency) : formatNumberWithCommas(rawValue),
    rawValue: rawValue
  };
};

/**
 * Get display value for a field based on its type
 * @param {string|number} value - The raw value
 * @param {string} fieldType - Type of field ('credit' or 'amount')
 * @param {string} currency - Currency code for amount fields
 * @param {boolean} forceDecimals - Whether to force decimal places
 * @returns {string} Formatted display value
 */
export const getDisplayValue = (value, fieldType, currency = 'USD', forceDecimals = false) => {
  if (!value && value !== 0) return '';

  switch (fieldType) {
    case 'credit':
      return formatNumberWithCommas(value, 2, forceDecimals);
    case 'amount':
      return formatCurrency(value, currency, 2, forceDecimals);
    default:
      return formatNumberWithCommas(value, 2, forceDecimals);
  }
};

/**
 * Validate and format input on blur (when user leaves the field)
 * @param {string|number} value - The current value
 * @param {string} fieldType - Type of field ('credit' or 'amount')
 * @param {string} currency - Currency code for amount fields
 * @returns {string} Properly formatted value
 */
export const formatOnBlur = (value, fieldType, currency = 'USD') => {
  if (!value && value !== 0) return '';

  const numValue = parseFormattedNumber(value);

  // Force decimal places on blur for final formatting
  return getDisplayValue(numValue, fieldType, currency, true);
};

/**
 * Format date to full format with date and time (MM/DD/YYYY HH:MM AM/PM)
 * @param {string|Date} dateString - The date string or Date object to format
 * @returns {string} Formatted date string in full format
 */
export const formatFullDateTime = (dateString) => {
  if (!dateString) return '';

  const date = new Date(dateString);

  // Check if date is valid
  if (isNaN(date.getTime())) return '';

  // Format date as MM/DD/YYYY
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const year = date.getFullYear();

  // Format time as HH:MM AM/PM
  const timeString = date.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  });

  return `${month}/${day}/${year} ${timeString}`;
};

/**
 * Format date to date only format (MM/DD/YYYY)
 * @param {string|Date} dateString - The date string or Date object to format
 * @returns {string} Formatted date string without time
 */
export const formatDateOnly = (dateString) => {
  if (!dateString) return '';

  const date = new Date(dateString);

  // Check if date is valid
  if (isNaN(date.getTime())) return '';

  // Format date as MM/DD/YYYY
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const year = date.getFullYear();

  return `${month}/${day}/${year}`;
};

/**
 * Get placeholder text based on field type and currency
 * @param {string} fieldType - Type of field ('credit' or 'amount')
 * @param {string} currency - Currency code
 * @returns {string} Appropriate placeholder text
 */
export const getPlaceholder = (fieldType, currency = 'USD') => {
  const symbol = CURRENCY_SYMBOLS[currency] || '$';

  switch (fieldType) {
    case 'credit':
      return '0.00';
    case 'amount':
      return `${symbol}0.00`;
    default:
      return '0.00';
  }
};

/**
 * Enhanced input handler for better typing experience
 * Separates typing behavior from final formatting
 * @param {string} inputValue - Current input value
 * @param {string} fieldType - Type of field ('credit' or 'amount')
 * @param {string} currency - Currency code for amount fields
 * @returns {Object} Object with cleanValue for storage and displayValue for input
 */
export const handleCurrencyInput = (inputValue, fieldType, currency = 'USD') => {
  // Clean the input value for storage
  const cleanValue = handleTypingInput(inputValue);

  // For display during typing, show minimal formatting
  let displayValue = cleanValue;

  // Only add currency symbol for amount fields, no other formatting during typing
  if (fieldType === 'amount' && cleanValue) {
    const symbol = CURRENCY_SYMBOLS[currency] || '$';
    // Only add symbol if not already present
    if (!cleanValue.startsWith(symbol)) {
      displayValue = `${symbol}${cleanValue}`;
    }
  }

  return {
    cleanValue,
    displayValue
  };
};
