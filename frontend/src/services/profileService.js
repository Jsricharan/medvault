import api from './api';

// Get current user profile
export const getProfile = async () => {
  const response = await api.get('/api/profile');
  return response.data;
};

// Update phone number
export const updatePhone = async (phone) => {
  const response = await api.put(
    '/api/profile/phone', { phone }
  );
  return response.data;
};

// Update password
export const updatePassword = async (
  currentPassword,
  newPassword
) => {
  const response = await api.put('/api/profile/password', {
    currentPassword,
    newPassword
  });
  return response.data;
};

// Update profile picture
export const updateProfilePicture = async (profilePicture) => {
  const response = await api.put('/api/profile/picture', {
    profilePicture
  });
  return response.data;
};

// ===========================
// Helper functions for
// user-specific localStorage
// ===========================

// Get profile picture key for current user
export const getProfilePicKey = () => {
  const email = localStorage.getItem('email');
  return email ? `profilePicture_${email}` : 'profilePicture';
};

// Save profile picture for current user
export const saveProfilePicToStorage = (pic) => {
  const key = getProfilePicKey();
  if (pic) {
    localStorage.setItem(key, pic);
  } else {
    localStorage.removeItem(key);
  }
};

// Get profile picture for current user
export const getProfilePicFromStorage = () => {
  const key = getProfilePicKey();
  return localStorage.getItem(key) || null;
};

// Update hospital info
export const updateHospitalInfo = async (hospitalData) => {
  const response = await api.put(
    '/api/profile/hospital', hospitalData
  );
  return response.data;
};
// Toggle doctor availability
export const toggleAvailability = async () => {
  const response = await api.put('/api/profile/availability');
  return response.data;
};