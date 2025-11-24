import axios from 'axios';

const AI_BASE_URL = process.env.AI_SERVICE_URL; // e.g., http://ml-service:8000

const predictCategory = async (expense) => {
  const { data } = await axios.post(`${AI_BASE_URL}/predict-category`, {
    description: expense.description,
    amount: expense.amount,
    merchant: expense.merchant || null,
  });
  return data.category;
};

const forecastExpenses = async (userId, history) => {
  const { data } = await axios.post(`${AI_BASE_URL}/forecast-expenses`, {
    userId,
    history,
  });
  return data.forecast;
};

const detectAnomalies = async (userId, expenses) => {
  const { data } = await axios.post(`${AI_BASE_URL}/detect-anomalies`, {
    userId,
    expenses,
  });
  return data.anomalies;
};

export { predictCategory, forecastExpenses, detectAnomalies };
