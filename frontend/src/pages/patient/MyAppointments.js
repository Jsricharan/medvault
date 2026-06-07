import React, { useState, useEffect } from 'react';
import {
  getMyAppointments,
  updateAppointmentStatus
} from '../../services/appointmentService';
import { formatDoctorName } from '../../utils/helpers';
import ConfirmDialog from '../../components/ConfirmDialog';
import { showToast } from '../../components/Toast';

function MyAppointments() {

  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [confirmDialog, setConfirmDialog] = useState({
    isOpen: false,
    appointmentId: null
  });

  useEffect(() => {
    loadAppointments();
  }, []);

  const loadAppointments = async () => {
    try {
      const data = await getMyAppointments();
      const sorted = Array.isArray(data)
        ? [...data].sort((a, b) => b.id - a.id)
        : [];
      setAppointments(sorted);
    } catch (err) {
      console.error('Appointments error:', err);
      setAppointments([]);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelClick = (id) => {
    setConfirmDialog({
      isOpen: true,
      appointmentId: id
    });
  };

  const handleConfirmCancel = async () => {
    try {
      await updateAppointmentStatus(
        confirmDialog.appointmentId,
        'CANCELLED'
      );
      setConfirmDialog({
        isOpen: false,
        appointmentId: null
      });
      showToast(
        'Appointment cancelled successfully!',
        'success'
      );
      loadAppointments();
    } catch (err) {
      showToast(
        'Failed to cancel appointment!',
        'error'
      );
    }
  };

  const getStatusStyle = (status) => {
    const styles = {
      'UNASSIGNED': {
        bg: '#f1f5f9',
        color: '#64748b',
        label: '⏳ Awaiting Doctor'
      },
      'PENDING': {
        bg: '#fef3c7',
        color: '#d97706',
        label: '🕐 Pending'
      },
      'CONFIRMED': {
        bg: '#d1fae5',
        color: '#059669',
        label: '✅ Confirmed'
      },
      'CANCELLED': {
        bg: '#fee2e2',
        color: '#dc2626',
        label: '❌ Cancelled'
      },
      'COMPLETED': {
        bg: '#dbeafe',
        color: '#1d4ed8',
        label: '✔️ Completed'
      }
    };
    return styles[status] || styles['PENDING'];
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
        <div
          className="spinner-border text-primary"
          role="status"/>
        <p style={{ color: '#64748b' }}>
          Loading appointments...
        </p>
      </div>
    );
  }

  const filteredAppointments = appointments.filter(apt => {
    const matchesSearch =
      apt.doctorName?.toLowerCase()
        .includes(search.toLowerCase()) ||
      apt.notes?.toLowerCase()
        .includes(search.toLowerCase()) ||
      apt.appointmentDate?.includes(search);

    const matchesStatus =
      filterStatus === 'ALL' ||
      apt.status === filterStatus;

    return matchesSearch && matchesStatus;
  });

  return (
    <div>

      {/* Confirm Cancel Dialog */}
      <ConfirmDialog
        isOpen={confirmDialog.isOpen}
        title="Cancel Appointment?"
        message="Are you sure you want to cancel this appointment? This action cannot be undone."
        confirmText="Yes, Cancel"
        cancelText="Keep Appointment"
        confirmColor="#ef4444"
        onConfirm={handleConfirmCancel}
        onCancel={() => setConfirmDialog({
          isOpen: false,
          appointmentId: null
        })}
      />

      {/* Header */}
      <div style={{ marginBottom: '24px' }}>
        <h4 style={{
          fontWeight: '700',
          color: '#1e293b',
          margin: '0 0 4px'
        }}>
          My Appointments
        </h4>
        <p style={{ color: '#64748b', margin: 0 }}>
          View and manage your appointments
        </p>
      </div>

      {/* Stats Row */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        gap: '12px',
        marginBottom: '24px'
      }}>
        {[
          {
            label: 'Total',
            count: appointments.length,
            color: '#6366f1',
            bg: '#ede9fe'
          },
          {
            label: 'Pending',
            count: appointments.filter(
              a => a.status === 'PENDING' ||
                   a.status === 'UNASSIGNED'
            ).length,
            color: '#f59e0b',
            bg: '#fef3c7'
          },
          {
            label: 'Confirmed',
            count: appointments.filter(
              a => a.status === 'CONFIRMED'
            ).length,
            color: '#10b981',
            bg: '#d1fae5'
          },
          {
            label: 'Completed',
            count: appointments.filter(
              a => a.status === 'COMPLETED'
            ).length,
            color: '#0ea5e9',
            bg: '#e0f2fe'
          }
        ].map((stat, i) => (
          <div
            key={i}
            style={{
              background: 'white',
              borderRadius: '12px',
              padding: '16px',
              boxShadow:
                '0 2px 8px rgba(0,0,0,0.05)',
              display: 'flex',
              alignItems: 'center',
              gap: '12px'
            }}>
            <div style={{
              width: '40px',
              height: '40px',
              borderRadius: '10px',
              background: stat.bg,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: '800',
              color: stat.color,
              fontSize: '18px'
            }}>
              {stat.count}
            </div>
            <span style={{
              color: '#64748b',
              fontSize: '13px',
              fontWeight: '500'
            }}>
              {stat.label}
            </span>
          </div>
        ))}
      </div>

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
            placeholder="Search by doctor, date or problem..."
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

        {/* Status Filter */}
        <select
          value={filterStatus}
          onChange={(e) =>
            setFilterStatus(e.target.value)
          }
          style={{
            padding: '10px 16px',
            border: '1px solid #e2e8f0',
            borderRadius: '10px',
            fontSize: '14px',
            outline: 'none',
            background: 'white',
            cursor: 'pointer'
          }}>
          <option value="ALL">All Status</option>
          <option value="UNASSIGNED">Unassigned</option>
          <option value="PENDING">Pending</option>
          <option value="CONFIRMED">Confirmed</option>
          <option value="COMPLETED">Completed</option>
          <option value="CANCELLED">Cancelled</option>
        </select>
      </div>
      {/* Appointments List */}
      {filteredAppointments.length === 0 ? (
        <div style={{
          textAlign: 'center',
          padding: '60px 20px',
          background: 'white',
          borderRadius: '16px',
          boxShadow: '0 2px 10px rgba(0,0,0,0.05)'
        }}>
          <div style={{ fontSize: '64px' }}>📅</div>
          <h5 style={{
            color: '#64748b',
            marginTop: '12px'
          }}>
            No Appointments Yet
          </h5>
          <p style={{ color: '#94a3b8' }}>
            Book your first appointment to get started
          </p>
        </div>
      ) : (
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '16px'
        }}>
          {appointments.map(apt => {
            const statusStyle =
              getStatusStyle(apt.status);
            return (
              <div
                key={apt.id}
                style={{
                  background: 'white',
                  borderRadius: '16px',
                  overflow: 'hidden',
                  boxShadow:
                    '0 2px 10px rgba(0,0,0,0.05)',
                  border: '1px solid #f1f5f9'
                }}>

                {/* Card Header */}
                <div style={{
                  background: '#f8fafc',
                  padding: '12px 20px',
                  borderBottom: '1px solid #f1f5f9',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}>
                  <span style={{
                    color: '#94a3b8',
                    fontSize: '13px',
                    fontWeight: '500'
                  }}>
                    Appointment #{apt.id}
                  </span>
                  <span style={{
                    background: statusStyle.bg,
                    color: statusStyle.color,
                    padding: '4px 12px',
                    borderRadius: '20px',
                    fontSize: '12px',
                    fontWeight: '600'
                  }}>
                    {statusStyle.label}
                  </span>
                </div>

                {/* Card Body */}
                <div style={{ padding: '20px' }}>
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns:
                      '1fr 1fr',
                    gap: '12px',
                    marginBottom: '16px'
                  }}>
                    <div>
                      <p style={{
                        color: '#94a3b8',
                        fontSize: '11px',
                        fontWeight: '600',
                        margin: '0 0 4px',
                        textTransform: 'uppercase'
                      }}>
                        Doctor
                      </p>
                      <p style={{
                        color: '#1e293b',
                        fontWeight: '600',
                        fontSize: '14px',
                        margin: 0
                      }}>
                        {apt.doctorAssigned
                          ? formatDoctorName(
                              apt.doctorName
                            )
                          : '⏳ Pending Assignment'}
                      </p>
                    </div>

                    <div>
                      <p style={{
                        color: '#94a3b8',
                        fontSize: '11px',
                        fontWeight: '600',
                        margin: '0 0 4px',
                        textTransform: 'uppercase'
                      }}>
                        Date & Time
                      </p>
                      <p style={{
                        color: '#1e293b',
                        fontWeight: '600',
                        fontSize: '14px',
                        margin: 0
                      }}>
                        {apt.appointmentDate} at{' '}
                        {apt.appointmentTime}
                      </p>
                    </div>
                  </div>

                  {/* Problem Description */}
                  {apt.notes && (
                    <div style={{
                      background: '#f8fafc',
                      borderRadius: '10px',
                      padding: '12px',
                      marginBottom: '16px',
                      borderLeft:
                        '3px solid #6366f1'
                    }}>
                      <p style={{
                        color: '#64748b',
                        fontSize: '12px',
                        fontWeight: '600',
                        margin: '0 0 4px'
                      }}>
                        Problem Description:
                      </p>
                      <p style={{
                        color: '#1e293b',
                        fontSize: '13px',
                        margin: 0,
                        fontStyle: 'italic'
                      }}>
                        "{apt.notes}"
                      </p>
                    </div>
                  )}

                  {/* Cancel Button for
                      PENDING/UNASSIGNED only */}
                  {(apt.status === 'PENDING' ||
                    apt.status === 'UNASSIGNED') && (
                    <div style={{
                      display: 'flex',
                      justifyContent: 'flex-end'
                    }}>
                      <button
                        onClick={() =>
                          handleCancelClick(apt.id)
                        }
                        style={{
                          padding: '8px 20px',
                          border:
                            '1px solid #fecaca',
                          borderRadius: '8px',
                          background: 'white',
                          color: '#dc2626',
                          fontSize: '13px',
                          fontWeight: '600',
                          cursor: 'pointer',
                          transition: 'all 0.2s'
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style
                            .background = '#fee2e2';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style
                            .background = 'white';
                        }}>
                        ✗ Cancel Appointment
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default MyAppointments;