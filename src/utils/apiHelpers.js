/**
 * API Helper Utilities
 * Common functions used across API services
 */

/**
 * Extract data from Laravel API response format
 * @param {object|array} response - API response
 * @returns {array} - Extracted data array
 */
export const extractResponseData = (response) => {
  const data = response?.data || response;
  return Array.isArray(data) ? data : [];
};

/**
 * Build query string from parameters object
 * @param {object} params - Parameters object
 * @returns {string} - Query string
 */
export const buildQueryString = (params = {}) => {
  const searchParams = new URLSearchParams();
  
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      searchParams.append(key, value);
    }
  });
  
  return searchParams.toString();
};

/**
 * Transform API response with data transformation function
 * @param {object|array} response - API response
 * @param {function} transformFn - Transformation function
 * @returns {object|array} - Transformed response
 */
export const transformResponse = (response, transformFn) => {
  if (response && response.data) {
    const transformedData = Array.isArray(response.data)
      ? response.data.map(transformFn)
      : [transformFn(response.data)];

    return {
      ...response,
      data: transformedData
    };
  }

  // If response is already an array (direct data), transform it
  if (Array.isArray(response)) {
    return response.map(transformFn);
  }

  return response ? transformFn(response) : response;
};

/**
 * Handle API errors consistently
 * @param {Error} error - Error object
 * @param {string} operation - Operation description
 * @returns {Error} - Formatted error
 */
export const handleApiError = (error, operation = 'API operation') => {
  console.error(`${operation} failed:`, error);
  
  if (error.name === 'TimeoutError' || error.name === 'AbortError') {
    return new Error(`${operation} timed out. Please try again.`);
  }
  
  if (error.message) {
    return new Error(error.message);
  }
  
  return new Error(`${operation} failed. Please try again.`);
};

/**
 * Validate required fields in data object
 * @param {object} data - Data object to validate
 * @param {array} requiredFields - Array of required field names
 * @throws {Error} - If validation fails
 */
export const validateRequiredFields = (data, requiredFields) => {
  const missingFields = requiredFields.filter(field => 
    data[field] === undefined || data[field] === null || data[field] === ''
  );
  
  if (missingFields.length > 0) {
    throw new Error(`Missing required fields: ${missingFields.join(', ')}`);
  }
};
