import React, { useState, useEffect } from 'react';
import {
  getMyAppointments,
  updateAppointmentStatus
} from '../../services/appointmentService';
import { formatDoctorName } from '../../utils/helpers';
import ConfirmDialog from
  '../../components/ConfirmDialog';
import { showToast } from '../../components/Toast';

function MyAppointments() {

  const [appointments, setAppointments] =
    useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] =
    useState('ALL');
  const [confirmDialog, setConfirmDialog] =
    useState({
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

  // Filter appointments by search and status
  const filteredAppointments = appointments.filter(
    apt => {
      // Search by doctor name, notes or date
      const searchLower =
        search.toLowerCase().trim();

      const doctorName = apt.doctorName
        ? apt.doctorName.toLowerCase()
        : '';
      const doctorNameFormatted = apt.doctorName
        ? formatDoctorName(apt.doctorName)
            .toLowerCase()
        : '';
      const notes = apt.notes
        ? apt.notes.toLowerCase()
        : '';
      const date = apt.appointmentDate
        ? apt.appointmentDate.toLowerCase()
        : '';

      const matchesSearch = searchLower === '' ||
        doctorName.includes(searchLower) ||
        doctorNameFormatted.includes(searchLower) ||
        notes.includes(searchLower) ||
        date.includes(searchLower);

      // Filter by status
      const matchesStatus =
        filterStatus === 'ALL' ||
        apt.status === filterStatus;

      return matchesSearch && matchesStatus;
    }
  );

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

  return (
    <div>

      {/* Confirm Cancel Dialog */}
      <ConfirmDialog
        isOpen={confirmDialog.isOpen}
        title="Cancel Appointment?"
        message="Are you sure you want to cancel this appointment? This action cannot be undone."
        confirmText="Yes, Cancel It"
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
            count: appointments.filter(a =>
              a.status === 'PENDING' ||
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
        marginBottom: '20px',
        flexWrap: 'wrap'
      }}>

        {/* Search Box */}
        <div style={{
          position: 'relative',
          flex: 1,
          minWidth: '200px'
        }}>
          <span style={{
            position: 'absolute',
            left: '12px',
            top: '50%',
            transform: 'translateY(-50%)',
            color: '#94a3b8',
            fontSize: '16px',
            pointerEvents: 'none'
          }}>
            🔍
          </span>
          <input
            type="text"
            placeholder="Search by doctor name, date or problem..."
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
            style={{
              width: '100%',
              padding: '10px 12px 10px 38px',
              border: '1px solid #e2e8f0',
              borderRadius: '10px',
              fontSize: '14px',
              outline: 'none',
              boxSizing: 'border-box',
              background: 'white',
              boxShadow:
                '0 1px 4px rgba(0,0,0,0.05)'
            }}
            onFocus={(e) => {
              e.target.style.borderColor =
                '#6366f1';
            }}
            onBlur={(e) => {
              e.target.style.borderColor =
                '#e2e8f0';
            }}
          />
          {/* Clear search button */}
          {search && (
            <button
              onClick={() => setSearch('')}
              style={{
                position: 'absolute',
                right: '10px',
                top: '50%',
                transform: 'translateY(-50%)',
                background: '#f1f5f9',
                border: 'none',
                borderRadius: '50%',
                width: '22px',
                height: '22px',
                cursor: 'pointer',
                fontSize: '12px',
                color: '#64748b',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
              ✕
            </button>
          )}
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
            cursor: 'pointer',
            color: '#1e293b',
            boxShadow:
              '0 1px 4px rgba(0,0,0,0.05)'
          }}>
          <option value="ALL">All Status</option>
          <option value="UNASSIGNED">
            Awaiting Doctor
          </option>
          <option value="PENDING">Pending</option>
          <option value="CONFIRMED">Confirmed</option>
          <option value="COMPLETED">Completed</option>
          <option value="CANCELLED">Cancelled</option>
        </select>
      </div>

      {/* Results count */}
      <div style={{
        marginBottom: '16px',
        display: 'flex',
        alignItems: 'center',
        gap: '8px'
      }}>
        <p style={{
          color: '#64748b',
          fontSize: '13px',
          margin: 0
        }}>
          Showing{' '}
          <strong style={{ color: '#1e293b' }}>
            {filteredAppointments.length}
          </strong>
          {' '}of{' '}
          <strong style={{ color: '#1e293b' }}>
            {appointments.length}
          </strong>
          {' '}appointments
        </p>

        {/* Active search indicator */}
        {search && (
          <span style={{
            background: '#ede9fe',
            color: '#6366f1',
            padding: '2px 10px',
            borderRadius: '20px',
            fontSize: '12px',
            fontWeight: '600'
          }}>
            🔍 "{search}"
          </span>
        )}

        {/* Active filter indicator */}
        {filterStatus !== 'ALL' && (
          <span style={{
            background: '#fef3c7',
            color: '#d97706',
            padding: '2px 10px',
            borderRadius: '20px',
            fontSize: '12px',
            fontWeight: '600'
          }}>
            {filterStatus}
          </span>
        )}
      </div>

      {/* Empty state */}
      {filteredAppointments.length === 0 ? (
        <div style={{
          textAlign: 'center',
          padding: '60px 20px',
          background: 'white',
          borderRadius: '16px',
          boxShadow:
            '0 2px 10px rgba(0,0,0,0.05)'
        }}>
          <div style={{ fontSize: '64px' }}>
            {appointments.length === 0
              ? '📅' : '🔍'}
          </div>
          <h5 style={{
            color: '#64748b',
            marginTop: '12px'
          }}>
            {appointments.length === 0
              ? 'No Appointments Yet'
              : `No results for "${search}"`}
          </h5>
          <p style={{ color: '#94a3b8' }}>
            {appointments.length === 0
              ? 'Book your first appointment to get started'
              : 'Try a different search term or clear filters'}
          </p>
          {(search || filterStatus !== 'ALL') && (
            <button
              onClick={() => {
                setSearch('');
                setFilterStatus('ALL');
              }}
              style={{
                marginTop: '12px',
                padding: '8px 20px',
                background:
                  'linear-gradient(135deg, ' +
                  '#6366f1, #8b5cf6)',
                border: 'none',
                borderRadius: '8px',
                color: 'white',
                fontSize: '13px',
                fontWeight: '600',
                cursor: 'pointer'
              }}>
              Clear Filters
            </button>
          )}
        </div>
      ) : (

        /* Appointments List */
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '16px'
        }}>
          {filteredAppointments.map(apt => {
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
                  border: '1px solid #f1f5f9',
                  transition: 'all 0.2s'
                }}>

                {/* Card Header */}
                <div style={{
                  background: '#f8fafc',
                  padding: '12px 20px',
                  borderBottom:
                    '1px solid #f1f5f9',
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
                    gridTemplateColumns: '1fr 1fr',
                    gap: '12px',
                    marginBottom: '16px'
                  }}>

                    {/* Doctor */}
                    <div>
                      <p style={{
                        color: '#94a3b8',
                        fontSize: '11px',
                        fontWeight: '600',
                        margin: '0 0 4px',
                        textTransform: 'uppercase',
                        letterSpacing: '0.5px'
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

                    {/* Date & Time */}
                    <div>
                      <p style={{
                        color: '#94a3b8',
                        fontSize: '11px',
                        fontWeight: '600',
                        margin: '0 0 4px',
                        textTransform: 'uppercase',
                        letterSpacing: '0.5px'
                      }}>
                        Date & Time
                      </p>
                      <p style={{
                        color: '#1e293b',
                        fontWeight: '600',
                        fontSize: '14px',
                        margin: 0
                      }}>
                        {apt.appointmentDate}
                      </p>
                      <p style={{
                        color: '#64748b',
                        fontSize: '13px',
                        margin: 0
                      }}>
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
                        margin: '0 0 4px',
                        textTransform: 'uppercase'
                      }}>
                        Problem Description:
                      </p>
                      <p style={{
                        color: '#1e293b',
                        fontSize: '13px',
                        margin: 0,
                        fontStyle: 'italic',
                        lineHeight: '1.6'
                      }}>
                        "{apt.notes}"
                      </p>
                    </div>
                  )}

                  {/* Cancel Button */}
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