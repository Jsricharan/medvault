import api from './api';

// Register new user
export const register = async (userData) => {
  const response = await api.post(
    '/api/auth/register', userData
  );
  return response.data;
};

// Login user
export const login = async (credentials) => {
  const response = await api.post(
    '/api/auth/login', credentials
  );

  if (response.data.token) {
    localStorage.setItem('token', response.data.token);
    localStorage.setItem('role', response.data.role);
    localStorage.setItem('fullName', response.data.fullName);
    localStorage.setItem('email', response.data.email);
  }

  return response.data;
};

// Logout - clears only current user data
export const logout = () => {
  const email = localStorage.getItem('email');

  // Remove auth data
  localStorage.removeItem('token');
  localStorage.removeItem('role');
  localStorage.removeItem('fullName');
  localStorage.removeItem('email');

  // NOTE: We keep profilePicture_email key in storage
  // so it loads again when same user logs back in

  window.location.href = '/login';
};

// Check if user is logged in
export const isAuthenticated = () => {
  return localStorage.getItem('token') !== null;
};

// Get current user role
export const getUserRole = () => {
  return localStorage.getItem('role');
};

// Get current user name
export const getUserName = () => {
  return localStorage.getItem('fullName');
};