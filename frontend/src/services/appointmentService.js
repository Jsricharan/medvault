import api from './api';

// Book a new appointment
export const bookAppointment = async (appointmentData) => {
  const response = await api.post(
    '/api/appointments/book',
    appointmentData
  );
  return response.data;
};

// Get my appointments (patient)
export const getMyAppointments = async () => {
  const response = await api.get('/api/appointments/my');
  return response.data;
};

// Get doctor appointments
export const getDoctorAppointments = async () => {
  const response = await api.get('/api/appointments/doctor');
  return response.data;
};

// Update appointment status
export const updateAppointmentStatus = async (id, status) => {
  const response = await api.put(
    `/api/appointments/${id}/status?status=${status}`
  );
  return response.data;
};

// Get all appointments (admin)
export const getAllAppointments = async () => {
  const response = await api.get('/api/appointments/all');
  return response.data;
};