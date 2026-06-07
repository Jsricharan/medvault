import React, { useState, useEffect } from 'react';
import {
  getMyNotifications,
  markAsRead
} from '../../services/notificationService';

function DoctorNotifications({ onRead }) {

  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

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
    return notification.read === true ||
           notification.isRead === true;
  };

  if (loading) {
    return (
      <div className="text-center py-5">
        <div className="spinner-border text-success" role="status">
        </div>
        <p className="mt-2 text-muted">Loading notifications...</p>
      </div>
    );
  }

  return (
    <div className="card shadow-sm">
      <div className="card-header bg-white py-3 d-flex
                      justify-content-between align-items-center">
        <h5 className="mb-0 fw-bold">🔔 My Notifications</h5>
        <span className="badge bg-success">
          {notifications.length} Total
        </span>
      </div>

      <div className="card-body p-0">

        {notifications.length === 0 ? (
          <div className="text-center py-5">
            <div style={{ fontSize: '64px' }}>🔔</div>
            <h5 className="mt-3 text-muted">
              No Notifications Yet
            </h5>
            <p className="text-muted">
              Notifications from admin will appear here
            </p>
          </div>
        ) : (
          <div className="list-group list-group-flush">
            {notifications.map(notification => (
              <div
                key={notification.id}
                className="list-group-item"
                style={{
                  backgroundColor: isNotificationRead(notification)
                    ? 'white' : '#f0fff4',
                  borderLeft: isNotificationRead(notification)
                    ? 'none' : '4px solid #198754'
                }}>

                <div className="d-flex justify-content-between
                                align-items-start py-1">

                  <div className="flex-grow-1">
                    <p className={`mb-1 ${
                      isNotificationRead(notification)
                        ? 'text-muted'
                        : 'fw-semibold'
                    }`}>
                      {notification.message}
                    </p>
                    <small className="text-muted">
                      {notification.createdAt
                        ? new Date(notification.createdAt)
                            .toLocaleString()
                        : 'Just now'}
                    </small>
                  </div>

                  {!isNotificationRead(notification) && (
                    <button
                      className="btn btn-sm btn-outline-success ms-3"
                      onClick={() =>
                        handleMarkAsRead(notification.id)
                      }>
                      ✓ Mark Read
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

export default DoctorNotifications;