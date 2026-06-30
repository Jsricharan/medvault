import api from './api';

// Add a new leave date
// Doctor calls this when submitting leave form
export const addLeave = async (leaveDate, reason) => {
    const response = await api.post(
        '/api/leaves/add',
        {
            leaveDate: leaveDate,
            reason: reason
        }
    );
    return response.data;
};

// Get all my upcoming leaves
// Doctor calls this to see their leave calendar
export const getMyLeaves = async () => {
    const response = await api.get(
        '/api/leaves/my'
    );
    return response.data;
};

// Cancel a leave by ID
// Doctor calls this to remove a leave date
export const cancelLeave = async (leaveId) => {
    const response = await api.delete(
        `/api/leaves/${leaveId}`
    );
    return response.data;
};

// Get leaves for a specific doctor
// Patient calls this to check if doctor
// is on leave on selected date
export const getDoctorLeaves = async (doctorId) => {
    const response = await api.get(
        `/api/leaves/doctor/${doctorId}`
    );
    return response.data;
};

// Check if doctor is on leave on a specific date
// Returns { onLeave: true } or { onLeave: false }
export const checkDoctorLeave = async (
    doctorId,
    date
) => {
    const response = await api.get(
        `/api/leaves/check`,
        {
            params: {
                doctorId: doctorId,
                date: date
            }
        }
    );
    return response.data;
};