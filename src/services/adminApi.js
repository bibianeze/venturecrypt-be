// services/adminApi.js
// Frontend API service for connecting to your backend

const API_URL = import.meta.env.VITE_API_URL || 'https://venturecrypt-be-backend.onrender.com/api';

console.log('🔗 Admin API URL:', API_URL);

// Helper to get auth headers
const getAuthHeaders = () => {
  const token = localStorage.getItem('adminToken');
  return {
    'Content-Type': 'application/json',
    'Authorization': token ? `Bearer ${token}` : ''
  };
};

// Handle API responses with better error messages
const handleResponse = async (response) => {
  const contentType = response.headers.get('content-type');
  
  // Try to parse JSON response
  let data;
  try {
    if (contentType && contentType.includes('application/json')) {
      data = await response.json();
    } else {
      // If not JSON, get text for debugging
      const text = await response.text();
      console.error('Non-JSON response:', text);
      throw new Error('Server returned invalid response format');
    }
  } catch (parseError) {
    console.error('Failed to parse response:', parseError);
    throw new Error('Failed to parse server response');
  }

  // Handle error responses
  if (!response.ok) {
    const errorMessage = data?.error || data?.message || `Request failed with status ${response.status}`;
    console.error('API Error:', {
      status: response.status,
      statusText: response.statusText,
      error: errorMessage,
      data
    });
    throw new Error(errorMessage);
  }

  return data;
};

// Generic fetch wrapper with better error handling
const apiFetch = async (endpoint, options = {}) => {
  const url = `${API_URL}${endpoint}`;
  
  console.log(`📡 ${options.method || 'GET'} ${url}`);
  
  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers
      }
    });
    
    return await handleResponse(response);
  } catch (error) {
    console.error('Fetch error:', error);
    
    // Provide user-friendly error messages
    if (error.message === 'Failed to fetch') {
      throw new Error('Unable to connect to server. Please check your internet connection.');
    }
    
    throw error;
  }
};

// ==================== ADMIN AUTH ====================

export const adminLogin = async (email, password) => {
  console.log('🔐 Attempting admin login for:', email);
  
  try {
    const data = await apiFetch('/admin/login', {
      method: 'POST',
      body: JSON.stringify({ email: email.trim(), password })
    });
    
    console.log('✅ Login successful:', data.admin?.email);
    return data;
  } catch (error) {
    console.error('❌ Login failed:', error.message);
    throw error;
  }
};

export const getAdminProfile = async () => {
  return apiFetch('/admin/profile', {
    headers: getAuthHeaders()
  });
};

// ==================== DASHBOARD ====================

export const getDashboardStats = async () => {
  return apiFetch('/admin/stats', {
    headers: getAuthHeaders()
  });
};

// ==================== USERS ====================

export const getUsers = async (params = {}) => {
  // Remove undefined/null values
  const cleanParams = Object.fromEntries(
    Object.entries(params).filter(([_, v]) => v != null && v !== '')
  );
  
  const queryString = new URLSearchParams(cleanParams).toString();
  const endpoint = `/admin/users${queryString ? `?${queryString}` : ''}`;
  
  return apiFetch(endpoint, {
    headers: getAuthHeaders()
  });
};

export const getUserDetails = async (userId) => {
  return apiFetch(`/admin/users/${userId}`, {
    headers: getAuthHeaders()
  });
};

export const updateUserBalance = async (userId, amount, type, note = '') => {
  return apiFetch(`/admin/users/${userId}/update-balance`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify({ amount, type, note })
  });
};

export const updateUserEarnings = async (userId, amount, type, note = '') => {
  return apiFetch(`/admin/users/${userId}/update-earnings`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify({ amount, type, note })
  });
};

export const updateUserStatus = async (userId, status) => {
  return apiFetch(`/admin/users/${userId}/status`, {
    method: 'PATCH',
    headers: getAuthHeaders(),
    body: JSON.stringify({ status })
  });
};

export const deleteUser = async (userId) => {
  return apiFetch(`/admin/users/${userId}`, {
    method: 'DELETE',
    headers: getAuthHeaders()
  });
};

// ==================== INVESTMENTS ====================

export const getInvestments = async (params = {}) => {
  const cleanParams = Object.fromEntries(
    Object.entries(params).filter(([_, v]) => v != null && v !== '')
  );
  
  const queryString = new URLSearchParams(cleanParams).toString();
  const endpoint = `/admin/investments${queryString ? `?${queryString}` : ''}`;
  
  return apiFetch(endpoint, {
    headers: getAuthHeaders()
  });
};

export const approveInvestment = async (investmentId) => {
  return apiFetch(`/admin/investments/${investmentId}/approve`, {
    method: 'PATCH',
    headers: getAuthHeaders()
  });
};

export const rejectInvestment = async (investmentId, reason = '') => {
  return apiFetch(`/admin/investments/${investmentId}/reject`, {
    method: 'PATCH',
    headers: getAuthHeaders(),
    body: JSON.stringify({ reason })
  });
};

export const completeInvestment = async (investmentId) => {
  return apiFetch(`/admin/investments/${investmentId}/complete`, {
    method: 'PATCH',
    headers: getAuthHeaders()
  });
};

export const createInvestment = async (investmentData) => {
  return apiFetch('/admin/investments/create', {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(investmentData)
  });
};

// ==================== WITHDRAWALS ====================

export const getWithdrawals = async (params = {}) => {
  const cleanParams = Object.fromEntries(
    Object.entries(params).filter(([_, v]) => v != null && v !== '')
  );
  
  const queryString = new URLSearchParams(cleanParams).toString();
  const endpoint = `/admin/withdrawals${queryString ? `?${queryString}` : ''}`;
  
  return apiFetch(endpoint, {
    headers: getAuthHeaders()
  });
};

export const approveWithdrawal = async (withdrawalId, transactionHash = '') => {
  return apiFetch(`/admin/withdrawals/${withdrawalId}/approve`, {
    method: 'PATCH',
    headers: getAuthHeaders(),
    body: JSON.stringify({ transactionHash })
  });
};

export const rejectWithdrawal = async (withdrawalId, reason = '') => {
  return apiFetch(`/admin/withdrawals/${withdrawalId}/reject`, {
    method: 'PATCH',
    headers: getAuthHeaders(),
    body: JSON.stringify({ reason })
  });
};

// ==================== UTILITY ====================

// Test API connection
export const testConnection = async () => {
  try {
    const response = await fetch(`${API_URL.replace('/api', '')}/api/health`);
    return await response.json();
  } catch (error) {
    console.error('Connection test failed:', error);
    throw new Error('Unable to connect to API server');
  }
};

// Clear admin session
export const logout = () => {
  localStorage.removeItem('adminToken');
  localStorage.removeItem('adminInfo');
  localStorage.removeItem('adminEmail');
  localStorage.removeItem('adminName');
  localStorage.removeItem('isAdmin');
  console.log('🚪 Admin logged out');
};