import api from './api';

// Create medical record (doctor)
export const createRecord = async (recordData) => {
  // Correct URL is /api/records/create
  const response = await api.post(
    '/api/records/create',
    recordData
  );
  return response.data;
};

// Get my records (patient)
export const getMyRecords = async () => {
  const response = await api.get('/api/records/my');
  return response.data;
};

// Get patient records (doctor)
export const getPatientRecords = async (patientId) => {
  const response = await api.get(
    `/api/records/patient/${patientId}`
  );
  return response.data;
};

// Update medical record
export const updateRecord = async (id, recordData) => {
  const response = await api.put(
    `/api/records/${id}`,
    recordData
  );
  return response.data;
};

// Get all records (admin)
export const getAllRecords = async () => {
  const response = await api.get('/api/records/all');
  return response.data;
};

// Delete medical record
export const deleteRecord = async (id) => {
  const response = await api.delete(
    `/api/records/${id}`
  );
  return response.data;
};