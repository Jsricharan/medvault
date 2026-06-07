import api from './api';

export const getAllUsers = async () => {
  const response = await api.get('/api/admin/users');
  return response.data;
};

export const getAllDoctors = async () => {
  const response = await api.get('/api/admin/doctors');
  return response.data;
};

export const getAllPatients = async () => {
  const response = await api.get('/api/admin/patients');
  return response.data;
};

export const getAdminStats = async () => {
  const response = await api.get('/api/admin/stats');
  return response.data;
};

export const updateUser = async (id, userData) => {
  const response = await api.put(
    `/api/admin/users/${id}`, userData
  );
  return response.data;
};

export const toggleUserStatus = async (id) => {
  const response = await api.put(
    `/api/admin/users/${id}/toggle-status`
  );
  return response.data;
};

export const resetUserPassword = async (
  id, newPassword
) => {
  const response = await api.put(
    `/api/admin/users/${id}/reset-password`,
    { newPassword }
  );
  return response.data;
};

export const updateAppointmentStatusAdmin = async (
  id, status
) => {
  const response = await api.put(
    `/api/admin/appointments/${id}/status?status=${status}`
  );
  return response.data;
};

export const assignDoctor = async (
  appointmentId, doctorId
) => {
  const response = await api.put(
    `/api/admin/appointments/${appointmentId}/assign-doctor?doctorId=${doctorId}`
  );
  return response.data;
};

export const getUnassignedAppointments = async () => {
  const response = await api.get(
    '/api/admin/appointments/unassigned'
  );
  return response.data;
};