// src/utils/validateForm.js
export const validateEmail = (email) => {
  const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return pattern.test(email);
};

export const validateRequired = (value) => value != null && String(value).trim().length > 0;
