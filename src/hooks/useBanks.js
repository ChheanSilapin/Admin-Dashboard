import { useState, useEffect } from 'react';

/**
 * Custom hook to manage bank data for customer forms
 * Provides bank data from the existing Banks page structure
 */
export const useBanks = () => {
  const [banks, setBanks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Mock bank data - in a real app, this would come from an API
  const mockBanks = [
    {
      id: 1,
      bank_name: 'ABA Bank',
      bank_code: 'ABA001',
      icon_logo: '/images/banks/aba-bank.png',
      created_at: '2024-01-15',
      status: 'Active',
      total_customers: 1250,
      total_transactions: 5680,
    },
    {
      id: 2,
      bank_name: 'ACLEDA Bank',
      bank_code: 'ACL002',
      icon_logo: '/images/banks/acleda-bank.png',
      created_at: '2024-01-20',
      status: 'Active',
      total_customers: 980,
      total_transactions: 4320,
    },
    {
      id: 3,
      bank_name: 'Canadia Bank',
      bank_code: 'CAN003',
      icon_logo: '/images/banks/canadia-bank.png',
      created_at: '2024-02-01',
      status: 'Active',
      total_customers: 756,
      total_transactions: 3210,
    },
    {
      id: 4,
      bank_name: 'Wing Bank',
      bank_code: 'WNG004',
      icon_logo: '/images/banks/wing-bank.png',
      created_at: '2024-02-10',
      status: 'Pending',
      total_customers: 0,
      total_transactions: 0,
    },
  ];

  useEffect(() => {
    // Simulate API call
    const fetchBanks = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Filter only active banks for customer forms
        const activeBanks = mockBanks.filter(bank => bank.status === 'Active');
        setBanks(activeBanks);
      } catch (err) {
        setError('Failed to fetch banks');
        console.error('Error fetching banks:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchBanks();
  }, []);

  /**
   * Get bank details by ID
   * @param {number} bankId - The bank ID
   * @returns {object|null} Bank object or null if not found
   */
  const getBankById = (bankId) => {
    return banks.find(bank => bank.id === bankId) || null;
  };

  /**
   * Get bank options formatted for dropdown
   * @returns {Array} Array of {value, label, bank_code} objects
   */
  const getBankOptions = () => {
    return banks.map(bank => ({
      value: bank.id,
      label: bank.bank_name,
      bank_code: bank.bank_code,
      icon_logo: bank.icon_logo
    }));
  };

  /**
   * Validate if a bank ID exists and is active
   * @param {number} bankId - The bank ID to validate
   * @returns {boolean} True if valid, false otherwise
   */
  const isValidBankId = (bankId) => {
    return banks.some(bank => bank.id === bankId);
  };

  return {
    banks,
    loading,
    error,
    getBankById,
    getBankOptions,
    isValidBankId,
    refetch: () => {
      // Re-trigger the useEffect
      setBanks([]);
      setLoading(true);
    }
  };
};

export default useBanks;
