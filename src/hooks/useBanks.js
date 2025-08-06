import { useState, useEffect } from 'react';
import { bankAPI } from '../services/api';

/**
 * Utility function to handle API response data extraction
 */
const extractBankData = (response) => {
  const bankData = response.data || response;
  return Array.isArray(bankData) ? bankData : [];
};

/**
 * Custom hook to manage bank data for customer forms
 * Provides bank data from the Laravel API
 */
export const useBanks = () => {
  const [banks, setBanks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchBanks = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await bankAPI.getAll();
      setBanks(extractBankData(response));
    } catch (err) {
      setError('Failed to fetch banks');
      // Fallback to empty array on error
      setBanks([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
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
      icon_logo: bank.logo
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
    refetch: fetchBanks
  };
};

/**
 * Custom hook to manage bank data with CRUD operations
 * Provides comprehensive bank management functionality using Laravel API
 */
export const useBankManagement = () => {
  const [banks, setBanks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchBanks = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await bankAPI.getAll();
      setBanks(extractBankData(response));
    } catch (err) {
      setError('Failed to fetch banks');
      // Only clear banks if we don't have any existing data
      setBanks(prev => prev.length > 0 ? prev : []);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBanks();
  }, []);

  const addBank = async (bankData) => {
    try {
      setError(null);
      const response = await bankAPI.create(bankData);
      const bankToAdd = response.data || response;
      setBanks(prev => [...prev, bankToAdd]);
      return bankToAdd;
    } catch (err) {
      setError('Failed to add bank');
      throw err;
    }
  };

  const updateBank = async (id, bankData) => {
    try {
      setError(null);
      const response = await bankAPI.update(id, bankData);
      const bankToUpdate = response.data || response;
      setBanks(prev => prev.map(bank =>
        bank.id === id ? { ...bank, ...bankToUpdate } : bank
      ));
      return bankToUpdate;
    } catch (err) {
      setError('Failed to update bank');
      throw err;
    }
  };

  const deleteBank = async (id) => {
    try {
      setError(null);
      await bankAPI.delete(id);
      setBanks(prev => prev.filter(bank => bank.id !== id));
      return true;
    } catch (err) {
      setError('Failed to delete bank');
      throw err;
    }
  };

  return {
    banks,
    loading,
    error,
    addBank,
    updateBank,
    deleteBank,
    refetch: fetchBanks
  };
};

export default useBanks;
