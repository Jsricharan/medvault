import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { getAllUsers } from '../../services/adminService';

function SendNotification() {

  const [users, setUsers] = useState([]);
  const [formData, setFormData] = useState({
    userId: '',
    message: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      const data = await getAllUsers();
      setUsers(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Error loading users:', err);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      await api.post('/api/notifications/send', {
        userId: parseInt(formData.userId),
        message: formData.message
      });
      setSuccess('Notification sent successfully!');
      setFormData({ userId: '', message: '' });
    } catch (err) {
      setError(
        err.response?.data?.message ||
        'Failed to send notification!'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card shadow-sm">
      <div className="card-header bg-white py-3">
        <h5 className="mb-0 fw-bold">🔔 Send Notification</h5>
      </div>

      <div className="card-body p-4">

        {error && (
          <div className="alert alert-danger">{error}</div>
        )}
        {success && (
          <div className="alert alert-success">{success}</div>
        )}

        <form onSubmit={handleSubmit}>

          <div className="mb-3">
            <label className="form-label fw-semibold">
              Select User
            </label>
            <select
              className="form-select"
              name="userId"
              value={formData.userId}
              onChange={handleChange}
              required>
              <option value="">-- Select a user --</option>
              {users.map(user => (
                <option key={user.id} value={user.id}>
                  {user.fullName} ({user.role})
                </option>
              ))}
            </select>
          </div>

          <div className="mb-4">
            <label className="form-label fw-semibold">
              Message
            </label>
            <textarea
              className="form-control"
              name="message"
              rows="4"
              placeholder="Enter notification message"
              value={formData.message}
              onChange={handleChange}
              required
            />
          </div>

          <button
            type="submit"
            className="btn btn-danger btn-lg w-100"
            disabled={loading}>
            {loading ? (
              <span>
                <span className="spinner-border
                                 spinner-border-sm me-2">
                </span>
                Sending...
              </span>
            ) : (
              '🔔 Send Notification'
            )}
          </button>

        </form>
      </div>
    </div>
  );
}

export default SendNotification;