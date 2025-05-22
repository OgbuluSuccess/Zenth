/**
 * Format a number as a currency string with commas and 2 decimal places
 * @param {number} number - The number to format
 * @param {number} decimals - Number of decimal places (default: 2)
 * @returns {string} Formatted number string
 */
export const formatNumber = (number, decimals = 2) => {
  if (number === null || number === undefined) return '0.00';
  
  // Convert to number if it's a string
  const num = typeof number === 'string' ? parseFloat(number) : number;
  
  // Check if it's a valid number
  if (isNaN(num)) return '0.00';
  
  // Format with commas and decimal places
  return num.toLocaleString('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals
  });
};

/**
 * Format a date string to a readable format
 * @param {string|Date} date - The date to format
 * @returns {string} Formatted date string
 */
export const formatDate = (date) => {
  if (!date) return '';
  
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  
  // Check if it's a valid date
  if (isNaN(dateObj.getTime())) return '';
  
  return dateObj.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

/**
 * Format a date string to include time
 * @param {string|Date} date - The date to format
 * @returns {string} Formatted date and time string
 */
export const formatDateTime = (date) => {
  if (!date) return '';
  
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  
  // Check if it's a valid date
  if (isNaN(dateObj.getTime())) return '';
  
  return dateObj.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

/**
 * Truncate a string if it exceeds a certain length
 * @param {string} str - The string to truncate
 * @param {number} length - Maximum length before truncating
 * @returns {string} Truncated string with ellipsis if needed
 */
export const truncateString = (str, length = 30) => {
  if (!str) return '';
  if (str.length <= length) return str;
  
  return `${str.substring(0, length)}...`;
};

/**
 * Format a percentage value
 * @param {number} value - The value to format as percentage
 * @param {number} decimals - Number of decimal places
 * @returns {string} Formatted percentage string
 */
export const formatPercentage = (value, decimals = 2) => {
  if (value === null || value === undefined) return '0%';
  
  // Convert to number if it's a string
  const num = typeof value === 'string' ? parseFloat(value) : value;
  
  // Check if it's a valid number
  if (isNaN(num)) return '0%';
  
  return `${num.toFixed(decimals)}%`;
};
