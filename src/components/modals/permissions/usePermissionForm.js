import { useState, useEffect } from 'react';

/**
 * Custom hook for permission form logic
 * Handles form state, validation, and data management
 */
export const usePermissionForm = (permission = null) => {
  // Initial form state - only name field needed
  const initialFormData = {
    name: ''
  };

  const [formData, setFormData] = useState(initialFormData);
  const [errors, setErrors] = useState({});

  // Populate form data when editing
  useEffect(() => {
    if (permission) {
      setFormData({
        name: permission.name || ''
      });
    } else {
      setFormData(initialFormData);
    }
  }, [permission]);

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

  // Validate form
  const validateForm = () => {
    const newErrors = {};

    // Required fields
    if (!formData.name.trim()) {
      newErrors.name = 'Permission name is required';
    }

    // Basic validation - just ensure it's not empty and reasonable length
    if (formData.name && formData.name.trim().length < 3) {
      newErrors.name = 'Permission name must be at least 3 characters long';
    }

    if (formData.name && formData.name.trim().length > 100) {
      newErrors.name = 'Permission name must be less than 100 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Reset form
  const resetForm = () => {
    setFormData(initialFormData);
    setErrors({});
  };

  return {
    formData,
    errors,
    handleInputChange,
    validateForm,
    resetForm
  };
};