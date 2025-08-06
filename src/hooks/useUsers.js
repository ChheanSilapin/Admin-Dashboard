import { useState, useEffect } from 'react';
import { usersAPI } from '../services/api';

/**
 * Custom hook for managing user data with API calls
 * Provides CRUD operations with loading states and error handling
 */
export const useUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await usersAPI.getAll();

      console.log('Users fetched:', response);

      // Handle different response formats
      let usersData = [];
      if (response.users && Array.isArray(response.users)) {
        usersData = response.users;
      } else if (response.data && Array.isArray(response.data)) {
        usersData = response.data;
      } else if (Array.isArray(response)) {
        usersData = response;
      }

      setUsers(usersData);
      console.log('Users set to state:', usersData);
    } catch (err) {
      console.error('Error fetching users:', err);
      setError('Failed to fetch users');
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  const addUser = async (userData) => {
    try {
      setError(null);
      const response = await usersAPI.create(userData);
      
      // Handle response format
      const newUser = response.data || response;
      setUsers(prev => [...prev, newUser]);
      return newUser;
    } catch (err) {
      setError('Failed to add user');
      throw err;
    }
  };

  const updateUser = async (id, userData) => {
    try {
      setError(null);
      const response = await usersAPI.update(id, userData);
      
      // Handle response format
      const updatedUser = response.data || response;
      setUsers(prev =>
        prev.map(user =>
          user.id === id ? { ...user, ...updatedUser } : user
        )
      );
      return updatedUser;
    } catch (err) {
      setError('Failed to update user');
      throw err;
    }
  };

  const deleteUser = async (id) => {
    try {
      setError(null);
      await usersAPI.delete(id);
      setUsers(prev => prev.filter(user => user.id !== id));
    } catch (err) {
      setError('Failed to delete user');
      throw err;
    }
  };

  const updateUserStatus = async (id, status) => {
    try {
      setError(null);
      await usersAPI.updateStatus(id, status);
      
      // Update local state
      setUsers(prev => prev.map(user =>
        user.id === id ? { ...user, status } : user
      ));
    } catch (err) {
      setError('Failed to update user status');
      throw err;
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return {
    users,
    loading,
    error,
    fetchUsers,
    addUser,
    updateUser,
    deleteUser,
    updateUserStatus,
  };
};
