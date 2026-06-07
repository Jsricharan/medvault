import React, { useState, useEffect } from 'react';
import {
  getMyNotifications,
  markAsRead
} from '../../services/notificationService';

function MyNotifications({ onRead }) {

  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadNotifications();
  }, []);

  const loadNotifications = async () => {
  try {
    const data = await getMyNotifications();
    setNotifications(Array.isArray(data) ? data : []);
  } catch (err) {
    console.error('Notifications error:', err);
    setNotifications([]);
  } finally {
    setLoading(false);
  }
};

  const handleMarkAsRead = async (id) => {
    try {
      await markAsRead(id);
      setNotifications(
        notifications.map(n =>
          n.id === id ? { ...n, read: true, isRead: true } : n
        )
      );
      if (onRead) onRead();
    } catch (err) {
      console.error('Error marking as read:', err);
    }
  };

  const isNotificationRead = (notification) => {
    return notification.read === true || notification.isRead === true;
  };

  if (loading) {
    return (
      <div className="text-center py-5">
        <div className="spinner-border text-primary" role="status"></div>
        <p className="mt-2 text-muted">Loading notifications...</p>
      </div>
    );
  }

  return (
    <div className="card shadow-sm">
      <div className="card-header bg-white py-3">
        <h5 className="mb-0 fw-bold">My Notifications</h5>
      </div>

      <div className="card-body p-0">

        {error && (
          <div className="alert alert-danger m-3">{error}</div>
        )}

        {notifications.length === 0 ? (
          <div className="text-center py-5">
            <p className="text-muted">No notifications yet.</p>
          </div>
        ) : (
          <div className="list-group list-group-flush">
            {notifications.map(notification => (
              <div
                key={notification.id}
                className="list-group-item"
                style={{
                  backgroundColor: isNotificationRead(notification)
                    ? 'white' : '#f0f7ff',
                  borderLeft: isNotificationRead(notification)
                    ? 'none' : '4px solid #0d6efd'
                }}>

                <div className="d-flex justify-content-between align-items-start py-1">

                  <div className="flex-grow-1">
                    <p className="mb-1">
                      {notification.message}
                    </p>
                    <small className="text-muted">
                      {notification.createdAt
                        ? new Date(notification.createdAt).toLocaleString()
                        : 'Just now'}
                    </small>
                  </div>

                  {!isNotificationRead(notification) && (
                    <button
                      className="btn btn-sm btn-outline-primary ms-3"
                      onClick={() => handleMarkAsRead(notification.id)}>
                      Mark Read
                    </button>
                  )}

                  {isNotificationRead(notification) && (
                    <span className="badge bg-secondary ms-3">
                      Read
                    </span>
                  )}

                </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}

export default MyNotifications;