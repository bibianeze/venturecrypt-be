// services/adminApi.js
// Frontend API service for connecting to your backend

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';


// Helper to get auth headers
const getAuthHeaders = () => {
  const token = localStorage.getItem('adminToken');
  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  };
};

// Handle API responses
const handleResponse = async (response) => {
  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Request failed' }));
    throw new Error(error.error || 'Request failed');
  }
  return response.json();
};

// ==================== ADMIN AUTH ====================

export const adminLogin = async (email, password) => {
  const response = await fetch(`${API_URL}/admin/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });
  return handleResponse(response);
};

// ==================== DASHBOARD ====================

export const getDashboardStats = async () => {
  const response = await fetch(`${API_URL}/admin/stats`, {
    headers: getAuthHeaders()
  });
  return handleResponse(response);
};

// ==================== USERS ====================

export const getUsers = async (params = {}) => {
  const queryString = new URLSearchParams(params).toString();
  const response = await fetch(`${API_URL}/admin/users?${queryString}`, {
    headers: getAuthHeaders()
  });
  return handleResponse(response);
};

export const getUserDetails = async (userId) => {
  const response = await fetch(`${API_URL}/admin/users/${userId}`, {
    headers: getAuthHeaders()
  });
  return handleResponse(response);
};

export const updateUserBalance = async (userId, amount, type, note) => {
  const response = await fetch(`${API_URL}/admin/users/${userId}/update-balance`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify({ amount, type, note })
  });
  return handleResponse(response);
};

// Add this after updateUserBalance function (around line 68)

export const updateUserEarnings = async (userId, amount, type, note) => {
  const response = await fetch(`${API_URL}/admin/users/${userId}/update-earnings`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify({ amount, type, note })
  });
  return handleResponse(response);
};

export const updateUserStatus = async (userId, status) => {
  const response = await fetch(`${API_URL}/admin/users/${userId}/status`, {
    method: 'PATCH',
    headers: getAuthHeaders(),
    body: JSON.stringify({ status })
  });
  return handleResponse(response);
};

// ==================== INVESTMENTS ====================

export const getInvestments = async (params = {}) => {
  const queryString = new URLSearchParams(params).toString();
  const response = await fetch(`${API_URL}/admin/investments?${queryString}`, {
    headers: getAuthHeaders()
  });
  return handleResponse(response);
};

export const approveInvestment = async (investmentId) => {
  const response = await fetch(`${API_URL}/admin/investments/${investmentId}/approve`, {
    method: 'PATCH',
    headers: getAuthHeaders()
  });
  return handleResponse(response);
};

export const rejectInvestment = async (investmentId, reason) => {
  const response = await fetch(`${API_URL}/admin/investments/${investmentId}/reject`, {
    method: 'PATCH',
    headers: getAuthHeaders(),
    body: JSON.stringify({ reason })
  });
  return handleResponse(response);
};

export const completeInvestment = async (investmentId) => {
  const response = await fetch(`${API_URL}/admin/investments/${investmentId}/complete`, {
    method: 'PATCH',
    headers: getAuthHeaders()
  });
  return handleResponse(response);
};

export const createInvestment = async (investmentData) => {
  const response = await fetch(`${API_URL}/admin/investments/create`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(investmentData)
  });
  return handleResponse(response);
};

// ==================== WITHDRAWALS ====================

export const getWithdrawals = async (params = {}) => {
  const queryString = new URLSearchParams(params).toString();
  const response = await fetch(`${API_URL}/admin/withdrawals?${queryString}`, {
    headers: getAuthHeaders()
  });
  return handleResponse(response);
};

export const approveWithdrawal = async (withdrawalId, transactionHash) => {
  const response = await fetch(`${API_URL}/admin/withdrawals/${withdrawalId}/approve`, {
    method: 'PATCH',
    headers: getAuthHeaders(),
    body: JSON.stringify({ transactionHash })
  });
  return handleResponse(response);
};

export const rejectWithdrawal = async (withdrawalId, reason) => {
  const response = await fetch(`${API_URL}/admin/withdrawals/${withdrawalId}/reject`, {
    method: 'PATCH',
    headers: getAuthHeaders(),
    body: JSON.stringify({ reason })
  });
  return handleResponse(response);
};