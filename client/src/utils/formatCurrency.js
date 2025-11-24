// src/utils/formatCurrency.js
export const formatCurrency = (value, currency = "INR") => {
  if (value == null) return "₹0";
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency,
    maximumFractionDigits: 2,
  }).format(value);
};
