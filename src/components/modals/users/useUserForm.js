import { useState, useEffect } from 'react';
import { rolesAPI, usersAPI } from '../../../services/api';

export const useUserForm = (initialData = null) => {
  // Form state
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    username: '',
    password: '',
    password_confirmation: '',
    role_id: ''
  });

  // Error state
  const [errors, setErrors] = useState({});

  // Roles data for dropdown
  const [roles, setRoles] = useState([]);
  const [rolesLoading, setRolesLoading] = useState(true);

  // Existing users data for validation
  const [existingUsers, setExistingUsers] = useState([]);
  const [usersLoading, setUsersLoading] = useState(false);

  // Dropdown states
  const [dropdowns, setDropdowns] = useState({
    role: false
  });

  // Fetch roles and users for validation
  useEffect(() => {
    const fetchRoles = async () => {
      try {
        setRolesLoading(true);
        const response = await rolesAPI.getAll();

        // Handle different response formats
        let rolesData = [];
        if (response.roles && Array.isArray(response.roles)) {
          rolesData = response.roles;
        } else if (response.data && Array.isArray(response.data)) {
          rolesData = response.data;
        } else if (Array.isArray(response)) {
          rolesData = response;
        }

        setRoles(rolesData);
      } catch (error) {
        console.error('Error fetching roles:', error);
        setRoles([]);
      } finally {
        setRolesLoading(false);
      }
    };

    const fetchUsers = async () => {
      try {
        setUsersLoading(true);
        const response = await usersAPI.getAll();

        // Handle different response formats
        let usersData = [];
        if (response.users && Array.isArray(response.users)) {
          usersData = response.users;
        } else if (response.data && Array.isArray(response.data)) {
          usersData = response.data;
        } else if (Array.isArray(response)) {
          usersData = response;
        }

        setExistingUsers(usersData);
      } catch (error) {
        console.error('Error fetching users:', error);
        setExistingUsers([]);
      } finally {
        setUsersLoading(false);
      }
    };

    fetchRoles();
    fetchUsers();
  }, []);

  // Initialize form data when initialData changes (for edit mode)
  useEffect(() => {
    if (initialData) {
      // Get role ID from roles array
      let roleId = '';
      if (initialData.roles && Array.isArray(initialData.roles) && initialData.roles.length > 0) {
        const role = initialData.roles[0];
        if (typeof role === 'object' && role.id) {
          roleId = role.id;
        } else if (typeof role === 'string') {
          // Find role by name
          const foundRole = roles.find(r => r.name === role);
          roleId = foundRole ? foundRole.id : '';
        }
      }

      setFormData({
        name: initialData.name || '',
        email: initialData.email || '',
        username: initialData.username || initialData.email || '',
        password: '', // Don't populate password for edit
        password_confirmation: '',
        role_id: roleId
      });
    }
  }, [initialData, roles]);

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

  // Handle dropdown selection
  const handleDropdownSelect = (name, value, label) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Clear error when user selects
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }

    // Close dropdown
    setDropdowns(prev => ({
      ...prev,
      [name.replace('_id', '')]: false
    }));
  };

  // Toggle dropdown
  const toggleDropdown = (name) => {
    setDropdowns(prev => ({
      ...prev,
      [name]: !prev[name]
    }));
  };

  // Close all dropdowns
  const closeAllDropdowns = () => {
    setDropdowns({
      role: false,
      status: false
    });
  };

  // Validate form
  const validateForm = (isEdit = false, currentUserId = null) => {
    const newErrors = {};

    // Required fields
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    } else {
      // Check for duplicate email (exclude current user in edit mode)
      const emailExists = existingUsers.some(user =>
        user.email && user.email.toLowerCase() === formData.email.toLowerCase() &&
        (!isEdit || user.id !== currentUserId)
      );
      if (emailExists) {
        newErrors.email = 'This email is already taken';
      }
    }

    if (!formData.username.trim()) {
      newErrors.username = 'Username is required';
    } else if (formData.username.length < 3) {
      newErrors.username = 'Username must be at least 3 characters';
    } else {
      // Check for duplicate username (exclude current user in edit mode)
      const usernameExists = existingUsers.some(user =>
        user.username && user.username.toLowerCase() === formData.username.toLowerCase() &&
        (!isEdit || user.id !== currentUserId)
      );
      if (usernameExists) {
        newErrors.username = 'This username is already taken';
      }
    }

    // Password validation (required for new users, optional for edit)
    if (!isEdit) {
      if (!formData.password) {
        newErrors.password = 'Password is required';
      } else if (formData.password.length < 8) {
        newErrors.password = 'Password must be at least 8 characters';
      } else if (!/[a-zA-Z]/.test(formData.password)) {
        newErrors.password = 'Password must contain at least one letter';
      }

      if (!formData.password_confirmation) {
        newErrors.password_confirmation = 'Password confirmation is required';
      } else if (formData.password !== formData.password_confirmation) {
        newErrors.password_confirmation = 'Passwords do not match';
      }
    } else {
      // For edit mode, only validate password if it's provided
      if (formData.password && formData.password.length < 8) {
        newErrors.password = 'Password must be at least 8 characters';
      } else if (formData.password && !/[a-zA-Z]/.test(formData.password)) {
        newErrors.password = 'Password must contain at least one letter';
      }

      if (formData.password && formData.password !== formData.password_confirmation) {
        newErrors.password_confirmation = 'Passwords do not match';
      }
    }

    if (!formData.role_id) {
      newErrors.role_id = 'Role is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Reset form
  const resetForm = () => {
    setFormData({
      name: '',
      email: '',
      username: '',
      password: '',
      password_confirmation: '',
      role_id: ''
    });
    setErrors({});
    closeAllDropdowns();
  };

  // Handle server validation errors
  const setServerValidationErrors = (validationErrors) => {
    if (validationErrors && typeof validationErrors === 'object') {
      const newErrors = {};

      // Map server validation errors to form fields
      Object.keys(validationErrors).forEach(field => {
        const errorMessages = validationErrors[field];
        if (Array.isArray(errorMessages) && errorMessages.length > 0) {
          newErrors[field] = errorMessages[0]; // Take the first error message
        }
      });

      setErrors(prev => ({ ...prev, ...newErrors }));
    }
  };

  // Get role name by ID
  const getRoleName = (roleId) => {
    const role = roles.find(r => r.id === parseInt(roleId));
    return role ? role.name : '';
  };

  return {
    // State
    formData,
    errors,
    roles,
    rolesLoading,
    existingUsers,
    usersLoading,
    dropdowns,

    // Handlers
    handleInputChange,
    handleDropdownSelect,
    toggleDropdown,
    closeAllDropdowns,

    // Validation
    validateForm,
    resetForm,
    setServerValidationErrors,

    // Utilities
    getRoleName
  };
};