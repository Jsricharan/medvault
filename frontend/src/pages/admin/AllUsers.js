import React, { useState, useEffect } from 'react';
import {
  getAllUsers,
  updateUser,
  toggleUserStatus
} from '../../services/adminService';
import specializations from '../../utils/specializations';
import { bloodGroups, genders } from '../../utils/medicalData';
import { showToast } from '../../components/Toast';

function AllUsers() {

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingUser, setEditingUser] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [filterRole, setFilterRole] = useState('ALL');

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      const data = await getAllUsers();
      setUsers(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  // Filter users
  const filteredUsers = users.filter(user => {
    const matchesSearch =
      user.fullName.toLowerCase()
        .includes(search.toLowerCase()) ||
      user.email.toLowerCase()
        .includes(search.toLowerCase());
    const matchesRole =
      filterRole === 'ALL' ||
      user.role === filterRole;
    return matchesSearch && matchesRole;
  });

  const handleEditClick = (user) => {
    setEditingUser(user.id);
    setEditForm({
      fullName: user.fullName || '',
      phone: user.phone || '',
      gender: user.gender || '',
      age: user.age || '',
      bloodGroup: user.bloodGroup || '',
      specialization: user.specialization || '',
      hospitalName: user.hospitalName || '',
      hospitalAddress: user.hospitalAddress || '',
      hospitalCity: user.hospitalCity || '',
      consultationFee: user.consultationFee || '',
      experience: user.experience || ''
    });
  };

  const handleEditChange = (e) => {
    setEditForm({
      ...editForm,
      [e.target.name]: e.target.value
    });
  };

  const handleSaveEdit = async (id) => {
    try {
      await updateUser(id, editForm);
      setMessage('User updated successfully!');
      setEditingUser(null);
      loadUsers();
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      setError('Failed to update user!');
      setTimeout(() => setError(''), 3000);
    }
  };

  const handleToggleStatus = async (id, current) => {
    try {
      await toggleUserStatus(id);
      setMessage(`User ${current
        ? 'deactivated' : 'activated'} successfully!`);
      loadUsers();
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      setError('Failed to update status!');
      setTimeout(() => setError(''), 3000);
    }
  };

  const getRoleStyle = (role) => {
    const styles = {
      'PATIENT': { bg: '#dbeafe', color: '#1d4ed8' },
      'DOCTOR': { bg: '#d1fae5', color: '#059669' },
      'ADMIN': { bg: '#fee2e2', color: '#dc2626' }
    };
    return styles[role] || {
      bg: '#f1f5f9', color: '#64748b'
    };
  };

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: '300px',
        flexDirection: 'column',
        gap: '12px'
      }}>
        <div className="spinner-border text-danger"/>
        <p style={{ color: '#64748b' }}>
          Loading users...
        </p>
      </div>
    );
  }

  return (
    <div>

      {/* Header */}
      <div style={{ marginBottom: '24px' }}>
        <h4 style={{
          fontWeight: '700',
          color: '#1e293b',
          margin: '0 0 4px'
        }}>
          Manage Users
        </h4>
        <p style={{ color: '#64748b', margin: 0 }}>
          View and edit all user accounts
        </p>
      </div>

      {/* Alerts */}
      {message && (
        <div style={{
          background: '#d1fae5',
          border: '1px solid #a7f3d0',
          borderRadius: '10px',
          padding: '12px 16px',
          marginBottom: '20px',
          color: '#059669',
          fontSize: '14px'
        }}>
          ✅ {message}
        </div>
      )}
      {error && (
        <div style={{
          background: '#fee2e2',
          border: '1px solid #fecaca',
          borderRadius: '10px',
          padding: '12px 16px',
          marginBottom: '20px',
          color: '#dc2626',
          fontSize: '14px'
        }}>
          ❌ {error}
        </div>
      )}

      {/* Search and Filter */}
      <div style={{
        display: 'flex',
        gap: '12px',
        marginBottom: '20px'
      }}>
        <div style={{
          position: 'relative',
          flex: 1
        }}>
          <span style={{
            position: 'absolute',
            left: '12px',
            top: '50%',
            transform: 'translateY(-50%)',
            color: '#94a3b8'
          }}>
            🔍
          </span>
          <input
            type="text"
            placeholder="Search by name or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{
              width: '100%',
              padding: '10px 12px 10px 36px',
              border: '1px solid #e2e8f0',
              borderRadius: '10px',
              fontSize: '14px',
              outline: 'none',
              boxSizing: 'border-box',
              background: 'white'
            }}
          />
        </div>

        {/* Role Filter */}
        <div style={{
          display: 'flex',
          gap: '8px',
          background: 'white',
          padding: '4px',
          borderRadius: '10px',
          border: '1px solid #e2e8f0'
        }}>
          {['ALL', 'PATIENT', 'DOCTOR', 'ADMIN'].map(
            role => (
              <button
                key={role}
                onClick={() => setFilterRole(role)}
                style={{
                  padding: '6px 14px',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontSize: '13px',
                  fontWeight: '600',
                  background: filterRole === role
                    ? '#ef4444' : 'transparent',
                  color: filterRole === role
                    ? 'white' : '#64748b',
                  transition: 'all 0.2s'
                }}>
                {role}
              </button>
            )
          )}
        </div>
      </div>

      {/* Results count */}
      <p style={{
        color: '#64748b',
        fontSize: '13px',
        marginBottom: '16px'
      }}>
        Showing {filteredUsers.length} user(s)
      </p>

      {/* Users List */}
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '16px'
      }}>
        {filteredUsers.map(user => (
          <div
            key={user.id}
            style={{
              background: 'white',
              borderRadius: '16px',
              overflow: 'hidden',
              boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
              border: '1px solid #f1f5f9'
            }}>

            {/* User Card Header */}
            <div style={{
              padding: '16px 20px',
              display: 'flex',
              alignItems: 'center',
              gap: '14px',
              borderBottom: editingUser === user.id
                ? '1px solid #f1f5f9'
                : 'none'
            }}>

              {/* Avatar */}
              <div style={{
                width: '48px',
                height: '48px',
                borderRadius: '50%',
                background: user.role === 'DOCTOR'
                  ? 'linear-gradient(135deg, #10b981, #059669)'
                  : user.role === 'ADMIN'
                  ? 'linear-gradient(135deg, #ef4444, #dc2626)'
                  : 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                fontWeight: '700',
                fontSize: '20px',
                flexShrink: 0
              }}>
                {user.fullName?.charAt(0)}
              </div>

              {/* User Info */}
              <div style={{ flex: 1 }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  marginBottom: '2px'
                }}>
                  <span style={{
                    fontWeight: '700',
                    color: '#1e293b',
                    fontSize: '15px'
                  }}>
                    {user.fullName}
                  </span>
                  <span style={{
                    fontSize: '11px',
                    color: '#94a3b8'
                  }}>
                    ID: #{user.id}
                  </span>
                  <span style={{
                    background: getRoleStyle(user.role).bg,
                    color: getRoleStyle(user.role).color,
                    padding: '1px 8px',
                    borderRadius: '20px',
                    fontSize: '11px',
                    fontWeight: '600'
                  }}>
                    {user.role}
                  </span>
                  <span style={{
                    background: user.enabled
                      ? '#d1fae5' : '#f1f5f9',
                    color: user.enabled
                      ? '#059669' : '#94a3b8',
                    padding: '1px 8px',
                    borderRadius: '20px',
                    fontSize: '11px',
                    fontWeight: '600'
                  }}>
                    {user.enabled ? 'Active' : 'Inactive'}
                  </span>
                </div>
                <div style={{
                  display: 'flex',
                  gap: '16px'
                }}>
                  <span style={{
                    color: '#64748b',
                    fontSize: '13px'
                  }}>
                    📧 {user.email}
                  </span>
                  <span style={{
                    color: '#64748b',
                    fontSize: '13px'
                  }}>
                    📞 {user.phone}
                  </span>
                  {user.specialization && (
                    <span style={{
                      color: '#64748b',
                      fontSize: '13px'
                    }}>
                      🏥 {user.specialization}
                    </span>
                  )}
                  {user.hospitalName && (
                    <span style={{
                      color: '#64748b',
                      fontSize: '13px'
                    }}>
                      🏨 {user.hospitalName}
                    </span>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div style={{
                display: 'flex',
                gap: '8px',
                flexShrink: 0
              }}>
                <button
                  onClick={() =>
                    editingUser === user.id
                      ? setEditingUser(null)
                      : handleEditClick(user)
                  }
                  style={{
                    padding: '7px 16px',
                    border: '1px solid #e2e8f0',
                    borderRadius: '8px',
                    background: editingUser === user.id
                      ? '#6366f1' : 'white',
                    color: editingUser === user.id
                      ? 'white' : '#374151',
                    fontSize: '13px',
                    fontWeight: '600',
                    cursor: 'pointer'
                  }}>
                  {editingUser === user.id
                    ? 'Cancel' : '✏️ Edit'}
                </button>

                <button
                  onClick={() =>
                    handleToggleStatus(
                      user.id, user.enabled
                    )
                  }
                  style={{
                    padding: '7px 16px',
                    border: 'none',
                    borderRadius: '8px',
                    background: user.enabled
                      ? '#fee2e2' : '#d1fae5',
                    color: user.enabled
                      ? '#dc2626' : '#059669',
                    fontSize: '13px',
                    fontWeight: '600',
                    cursor: 'pointer'
                  }}>
                  {user.enabled
                    ? '🔴 Deactivate'
                    : '🟢 Activate'}
                </button>
              </div>
            </div>

            {/* Edit Form */}
            {editingUser === user.id && (
              <div style={{ padding: '20px' }}>

                <h6 style={{
                  fontWeight: '700',
                  color: '#1e293b',
                  marginBottom: '16px',
                  fontSize: '14px'
                }}>
                  ✏️ Edit User Details
                </h6>

                {/* Basic Info */}
                <div style={{
                  display: 'grid',
                  gridTemplateColumns:
                    'repeat(3, 1fr)',
                  gap: '12px',
                  marginBottom: '16px'
                }}>
                  <div>
                    <label style={{
                      display: 'block',
                      fontSize: '12px',
                      fontWeight: '600',
                      color: '#374151',
                      marginBottom: '4px'
                    }}>
                      Full Name
                    </label>
                    <input
                      type="text"
                      name="fullName"
                      value={editForm.fullName}
                      onChange={handleEditChange}
                      style={{
                        width: '100%',
                        padding: '8px 12px',
                        border: '1px solid #e2e8f0',
                        borderRadius: '8px',
                        fontSize: '13px',
                        outline: 'none',
                        boxSizing: 'border-box'
                      }}
                    />
                  </div>

                  <div>
                    <label style={{
                      display: 'block',
                      fontSize: '12px',
                      fontWeight: '600',
                      color: '#374151',
                      marginBottom: '4px'
                    }}>
                      Phone
                    </label>
                    <input
                      type="text"
                      name="phone"
                      value={editForm.phone}
                      onChange={handleEditChange}
                      style={{
                        width: '100%',
                        padding: '8px 12px',
                        border: '1px solid #e2e8f0',
                        borderRadius: '8px',
                        fontSize: '13px',
                        outline: 'none',
                        boxSizing: 'border-box'
                      }}
                    />
                  </div>

                  <div>
                    <label style={{
                      display: 'block',
                      fontSize: '12px',
                      fontWeight: '600',
                      color: '#374151',
                      marginBottom: '4px'
                    }}>
                      Gender
                    </label>
                    <select
                      name="gender"
                      value={editForm.gender}
                      onChange={handleEditChange}
                      style={{
                        width: '100%',
                        padding: '8px 12px',
                        border: '1px solid #e2e8f0',
                        borderRadius: '8px',
                        fontSize: '13px',
                        outline: 'none',
                        boxSizing: 'border-box',
                        background: 'white'
                      }}>
                      <option value="">
                        Select Gender
                      </option>
                      {genders.map((g, i) => (
                        <option key={i} value={g}>
                          {g}
                        </option>
                      ))}
                    </select>
                  </div>

                  {user.role === 'PATIENT' && (
                    <>
                      <div>
                        <label style={{
                          display: 'block',
                          fontSize: '12px',
                          fontWeight: '600',
                          color: '#374151',
                          marginBottom: '4px'
                        }}>
                          Age
                        </label>
                        <input
                          type="number"
                          name="age"
                          value={editForm.age}
                          onChange={handleEditChange}
                          min="1"
                          max="120"
                          style={{
                            width: '100%',
                            padding: '8px 12px',
                            border: '1px solid #e2e8f0',
                            borderRadius: '8px',
                            fontSize: '13px',
                            outline: 'none',
                            boxSizing: 'border-box'
                          }}
                        />
                      </div>

                      <div>
                        <label style={{
                          display: 'block',
                          fontSize: '12px',
                          fontWeight: '600',
                          color: '#374151',
                          marginBottom: '4px'
                        }}>
                          Blood Group
                        </label>
                        <select
                          name="bloodGroup"
                          value={editForm.bloodGroup}
                          onChange={handleEditChange}
                          style={{
                            width: '100%',
                            padding: '8px 12px',
                            border: '1px solid #e2e8f0',
                            borderRadius: '8px',
                            fontSize: '13px',
                            outline: 'none',
                            boxSizing: 'border-box',
                            background: 'white'
                          }}>
                          <option value="">
                            Select Blood Group
                          </option>
                          {bloodGroups.map((bg, i) => (
                            <option key={i} value={bg}>
                              {bg}
                            </option>
                          ))}
                        </select>
                      </div>
                    </>
                  )}

                  {user.role === 'DOCTOR' && (
                    <div>
                      <label style={{
                        display: 'block',
                        fontSize: '12px',
                        fontWeight: '600',
                        color: '#374151',
                        marginBottom: '4px'
                      }}>
                        Specialization
                      </label>
                      <select
                        name="specialization"
                        value={editForm.specialization}
                        onChange={handleEditChange}
                        style={{
                          width: '100%',
                          padding: '8px 12px',
                          border: '1px solid #e2e8f0',
                          borderRadius: '8px',
                          fontSize: '13px',
                          outline: 'none',
                          boxSizing: 'border-box',
                          background: 'white'
                        }}>
                        <option value="">
                          Select Specialization
                        </option>
                        {specializations.map((s, i) => (
                          <option key={i} value={s}>
                            {s}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}
                </div>
                {/* Reset Password Section */}
                  <div style={{
                    borderTop: '1px solid #f1f5f9',
                    paddingTop: '16px',
                    marginTop: '4px'
                  }}>
                    <h6 style={{
                      fontWeight: '700',
                      color: '#1e293b',
                      marginBottom: '12px',
                      fontSize: '13px'
                    }}>
                      🔑 Reset Password
                    </h6>
                    <div style={{
                      display: 'flex',
                      gap: '8px'
                    }}>
                      <input
                        type="text"
                        placeholder="Enter new password for user"
                        id={`reset-pwd-${user.id}`}
                        style={{
                          flex: 1,
                          padding: '8px 12px',
                          border: '1px solid #e2e8f0',
                          borderRadius: '8px',
                          fontSize: '13px',
                          outline: 'none'
                        }}
                      />
                      <button
                        onClick={async () => {
                          const pwd = document.getElementById(
                            `reset-pwd-${user.id}`
                          ).value;
                          if (!pwd || pwd.length < 6) {
                            showToast(
                              'Password must be at least 6 chars!',
                              'error'
                            );
                            return;
                          }
                          try {
                            const { resetUserPassword } =
                              await import(
                                '../../services/adminService'
                              );
                            await resetUserPassword(user.id, pwd);
                            showToast(
                              'Password reset successfully!',
                              'success'
                            );
                            document.getElementById(
                              `reset-pwd-${user.id}`
                            ).value = '';
                          } catch (err) {
                            showToast(
                              'Failed to reset password!',
                              'error'
                            );
                          }
                        }}
                        style={{
                          padding: '8px 16px',
                          border: 'none',
                          borderRadius: '8px',
                          background:
                            'linear-gradient(135deg, #f59e0b, #d97706)',
                          color: 'white',
                          fontSize: '13px',
                          fontWeight: '600',
                          cursor: 'pointer'
                        }}>
                        Reset
                      </button>
                    </div>
                  </div>
                {/* Hospital Info for Doctors */}
                {user.role === 'DOCTOR' && (
                  <div>
                    <h6 style={{
                      fontWeight: '700',
                      color: '#1e293b',
                      marginBottom: '12px',
                      fontSize: '13px',
                      paddingTop: '12px',
                      borderTop: '1px solid #f1f5f9'
                    }}>
                      🏥 Hospital Information
                    </h6>
                    <div style={{
                      display: 'grid',
                      gridTemplateColumns:
                        'repeat(3, 1fr)',
                      gap: '12px',
                      marginBottom: '16px'
                    }}>
                      <div>
                        <label style={{
                          display: 'block',
                          fontSize: '12px',
                          fontWeight: '600',
                          color: '#374151',
                          marginBottom: '4px'
                        }}>
                          Hospital Name
                        </label>
                        <input
                          type="text"
                          name="hospitalName"
                          value={editForm.hospitalName}
                          onChange={handleEditChange}
                          placeholder="e.g. Apollo Hospital"
                          style={{
                            width: '100%',
                            padding: '8px 12px',
                            border: '1px solid #e2e8f0',
                            borderRadius: '8px',
                            fontSize: '13px',
                            outline: 'none',
                            boxSizing: 'border-box'
                          }}
                        />
                      </div>

                      <div>
                        <label style={{
                          display: 'block',
                          fontSize: '12px',
                          fontWeight: '600',
                          color: '#374151',
                          marginBottom: '4px'
                        }}>
                          Hospital City
                        </label>
                        <input
                          type="text"
                          name="hospitalCity"
                          value={editForm.hospitalCity}
                          onChange={handleEditChange}
                          placeholder="e.g. Mumbai"
                          style={{
                            width: '100%',
                            padding: '8px 12px',
                            border: '1px solid #e2e8f0',
                            borderRadius: '8px',
                            fontSize: '13px',
                            outline: 'none',
                            boxSizing: 'border-box'
                          }}
                        />
                      </div>

                      <div>
                        <label style={{
                          display: 'block',
                          fontSize: '12px',
                          fontWeight: '600',
                          color: '#374151',
                          marginBottom: '4px'
                        }}>
                          Experience
                        </label>
                        <input
                          type="text"
                          name="experience"
                          value={editForm.experience}
                          onChange={handleEditChange}
                          placeholder="e.g. 10 years"
                          style={{
                            width: '100%',
                            padding: '8px 12px',
                            border: '1px solid #e2e8f0',
                            borderRadius: '8px',
                            fontSize: '13px',
                            outline: 'none',
                            boxSizing: 'border-box'
                          }}
                        />
                      </div>

                      <div style={{
                        gridColumn: 'span 2'
                      }}>
                        <label style={{
                          display: 'block',
                          fontSize: '12px',
                          fontWeight: '600',
                          color: '#374151',
                          marginBottom: '4px'
                        }}>
                          Hospital Address
                        </label>
                        <input
                          type="text"
                          name="hospitalAddress"
                          value={editForm.hospitalAddress}
                          onChange={handleEditChange}
                          placeholder="e.g. 123 Main Street, Mumbai"
                          style={{
                            width: '100%',
                            padding: '8px 12px',
                            border: '1px solid #e2e8f0',
                            borderRadius: '8px',
                            fontSize: '13px',
                            outline: 'none',
                            boxSizing: 'border-box'
                          }}
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Save and Cancel */}
                <div style={{
                  display: 'flex',
                  gap: '10px',
                  justifyContent: 'flex-end'
                }}>
                  <button
                    onClick={() => setEditingUser(null)}
                    style={{
                      padding: '9px 20px',
                      border: '1px solid #e2e8f0',
                      borderRadius: '8px',
                      background: 'white',
                      color: '#64748b',
                      fontSize: '13px',
                      fontWeight: '600',
                      cursor: 'pointer'
                    }}>
                    Cancel
                  </button>
                  <button
                    onClick={() =>
                      handleSaveEdit(user.id)
                    }
                    style={{
                      padding: '9px 20px',
                      border: 'none',
                      borderRadius: '8px',
                      background:
                        'linear-gradient(135deg, #10b981, #059669)',
                      color: 'white',
                      fontSize: '13px',
                      fontWeight: '600',
                      cursor: 'pointer',
                      boxShadow:
                        '0 4px 12px rgba(16,185,129,0.3)'
                    }}>
                    💾 Save Changes
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default AllUsers;