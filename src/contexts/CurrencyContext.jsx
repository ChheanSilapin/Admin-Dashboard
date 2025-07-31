import React, { createContext, useContext, useState, useEffect } from 'react';

const CurrencyContext = createContext();

export const useCurrency = () => {
  const context = useContext(CurrencyContext);
  if (!context) {
    throw new Error('useCurrency must be used within a CurrencyProvider');
  }
  return context;
};


const CURRENCIES = {
  USD: {
    code: 'USD',
    symbol: '$',
    name: 'US Dollar',
    rate: 1, 
  },
  KHR: {
    code: 'KHR',
    symbol: '៛',
    name: 'Cambodian Riel',
    rate: 4100, 
  },
};

export const CurrencyProvider = ({ children }) => {
  const [currentCurrency, setCurrentCurrency] = useState(() => {
    // Get saved currency from localStorage or default to USD
    const saved = localStorage.getItem('currency');
    return saved && CURRENCIES[saved] ? saved : 'USD';
  });

  useEffect(() => {
    // Save currency preference to localStorage
    localStorage.setItem('currency', currentCurrency);
  }, [currentCurrency]);

  const switchCurrency = (currencyCode) => {
    if (CURRENCIES[currencyCode]) {
      setCurrentCurrency(currencyCode);
    }
  };

  const formatAmount = (amount, currencyCode = currentCurrency) => {
    const currency = CURRENCIES[currencyCode];
    if (!currency) return amount;

    // Convert from USD base to target currency
    const convertedAmount = currencyCode === 'USD' ? amount : amount * currency.rate;
    
    // Format with appropriate decimal places
    const decimals = currencyCode === 'KHR' ? 0 : 2;
    const formatted = new Intl.NumberFormat('en-US', {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    }).format(convertedAmount);

    return `${currency.symbol}${formatted}`;
  };

  const convertAmount = (amount, fromCurrency, toCurrency) => {
    if (fromCurrency === toCurrency) return amount;
    
    const from = CURRENCIES[fromCurrency];
    const to = CURRENCIES[toCurrency];
    
    if (!from || !to) return amount;

    // Convert to USD first, then to target currency
    const usdAmount = fromCurrency === 'USD' ? amount : amount / from.rate;
    return toCurrency === 'USD' ? usdAmount : usdAmount * to.rate;
  };

  const value = {
    currentCurrency,
    currencies: CURRENCIES,
    switchCurrency,
    formatAmount,
    convertAmount,
    getCurrencyInfo: (code) => CURRENCIES[code],
  };

  return (
    <CurrencyContext.Provider value={value}>
      {children}
    </CurrencyContext.Provider>
  );
};
