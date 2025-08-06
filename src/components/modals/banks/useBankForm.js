import { useState, useEffect } from 'react';

export const useBankForm = (initialData = null) => {
  // Form state
  const [formData, setFormData] = useState({
    bank_name: '',
    bank_code: '',
    description: '',
    status: 'active',
    logo: null
  });

  // Error state
  const [errors, setErrors] = useState({});

  // Logo preview state
  const [logoPreview, setLogoPreview] = useState(null);

  // Dropdown states
  const [dropdowns, setDropdowns] = useState({
    status: false
  });

  // Initialize form data when initialData changes (for edit mode)
  useEffect(() => {
    if (initialData) {
      setFormData({
        bank_name: initialData.bank_name || '',
        bank_code: initialData.bank_code || '',
        description: initialData.description || '',
        status: initialData.status || 'active',
        logo: null // Don't set existing logo file, just show preview
      });

      // Set logo preview if exists
      if (initialData.logo) {
        setLogoPreview(initialData.logo);
      }
    }
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

  // Handle file upload
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file size (2MB limit)
      if (file.size > 2 * 1024 * 1024) {
        setErrors(prev => ({
          ...prev,
          logo: 'File size must be less than 2MB'
        }));
        return;
      }

      // Validate file type
      if (!file.type.startsWith('image/')) {
        setErrors(prev => ({
          ...prev,
          logo: 'Please select a valid image file'
        }));
        return;
      }

      setFormData(prev => ({
        ...prev,
        logo: file
      }));

      // Create preview URL
      const reader = new FileReader();
      reader.onload = (e) => {
        setLogoPreview(e.target.result);
      };
      reader.readAsDataURL(file);

      // Clear logo error
      if (errors.logo) {
        setErrors(prev => ({
          ...prev,
          logo: ''
        }));
      }
    }
  };

  // Remove logo
  const removeLogo = () => {
    setFormData(prev => ({
      ...prev,
      logo: null
    }));
    setLogoPreview(initialData?.logo || null);
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
      status: false
    });
  };

  // Validate form
  const validateForm = () => {
    const newErrors = {};

    // Required fields
    if (!formData.bank_name.trim()) {
      newErrors.bank_name = 'Bank name is required';
    }

    if (!formData.bank_code.trim()) {
      newErrors.bank_code = 'Bank code is required';
    } else if (formData.bank_code.length < 2) {
      newErrors.bank_code = 'Bank code must be at least 2 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Reset form
  const resetForm = () => {
    setFormData({
      bank_name: '',
      bank_code: '',
      description: '',
      status: 'active',
      logo: null
    });
    setErrors({});
    setLogoPreview(null);
    closeAllDropdowns();
  };

  return {
    // State
    formData,
    errors,
    logoPreview,
    dropdowns,

    // Handlers
    handleInputChange,
    handleFileChange,
    removeLogo,
    toggleDropdown,
    closeAllDropdowns,

    // Validation
    validateForm,
    resetForm
  };
};
