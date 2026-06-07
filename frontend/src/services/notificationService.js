import api from './api';

// Get my notifications
export const getMyNotifications = async () => {
  const response = await api.get('/api/notifications/my');
  return response.data;
};

// Mark notification as read
export const markAsRead = async (id) => {
  const response = await api.put(`/api/notifications/${id}/read`);
  return response.data;
};

// Get unread count
export const getUnreadCount = async () => {
  const response = await api.get('/api/notifications/unread/count');
  return response.data;
};