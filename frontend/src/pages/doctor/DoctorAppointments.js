import React, { useState, useEffect } from 'react';
import {
  getDoctorAppointments,
  updateAppointmentStatus
} from '../../services/appointmentService';
import ConfirmDialog from
  '../../components/ConfirmDialog';
import { showToast } from
  '../../components/Toast';

// Preset rejection reasons
const REJECTION_REASONS = [
  'Problem not relevant to my specialization',
  'Appointment slot not available',
  'Patient should visit emergency department',
  'Insufficient medical information provided',
  'Please consult a general physician first',
  'Patient is outside my service area',
  'Other (please specify below)'
];

function DoctorAppointments() {

  const [appointments, setAppointments] =
    useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('ALL');

  // Confirm dialog state
  const [confirmAction, setConfirmAction] =
    useState({ isOpen: false });

  // Rejection modal state
  const [rejectModal, setRejectModal] = useState({
    isOpen: false,
    appointmentId: null,
    selectedReason: '',
    customReason: '',
    error: ''
  });

  // Patient history state
  const [patientHistory, setPatientHistory] =
    useState(null);
  const [showHistory, setShowHistory] =
    useState(false);

  useEffect(() => {
    loadAppointments();
  }, []);

  const loadAppointments = async () => {
    try {
      const data = await getDoctorAppointments();
      const sorted = Array.isArray(data)
        ? [...data].sort((a, b) => b.id - a.id)
        : [];
      setAppointments(sorted);
    } catch (err) {
      console.error('Error:', err);
      setAppointments([]);
    } finally {
      setLoading(false);
    }
  };

  // Handle confirm (accept/complete)
  const handleConfirmAction = async () => {
    try {
      await updateAppointmentStatus(
        confirmAction.id,
        confirmAction.status
      );
      showToast(
        `Appointment ${confirmAction.status
          .toLowerCase()} successfully!`,
        'success'
      );
      setConfirmAction({ isOpen: false });
      loadAppointments();
    } catch (err) {
      showToast(
        'Failed to update appointment!',
        'error'
      );
    }
  };

  // Open rejection modal
  const handleRejectClick = (appointmentId) => {
    setRejectModal({
      isOpen: true,
      appointmentId,
      selectedReason: '',
      customReason: '',
      error: ''
    });
  };

  // Submit rejection with reason
  const handleRejectSubmit = async () => {
    const { selectedReason, customReason,
      appointmentId } = rejectModal;

    // Validate reason
    if (!selectedReason) {
      setRejectModal(prev => ({
        ...prev,
        error: 'Please select a reason!'
      }));
      return;
    }

    const isOther = selectedReason ===
      'Other (please specify below)';

    if (isOther && !customReason.trim()) {
      setRejectModal(prev => ({
        ...prev,
        error: 'Please provide a reason ' +
               'in the text field!'
      }));
      return;
    }

    if (isOther && customReason.trim().length < 10) {
      setRejectModal(prev => ({
        ...prev,
        error: 'Please provide a detailed ' +
               'reason (min 10 characters)!'
      }));
      return;
    }

    // Build final reason
    const finalReason = isOther
      ? customReason.trim()
      : selectedReason;

    try {
      // Update status with reason in notes
      await updateAppointmentStatus(
        appointmentId,
        'CANCELLED'
      );

      // Send notification to patient with reason
      const { default: api } = await import(
        '../../services/api'
      );
      const apt = appointments.find(
        a => a.id === appointmentId
      );

      if (apt) {
        await api.post('/api/notifications/send', {
          userId: apt.patientId,
          message:
            `❌ Your appointment on ` +
            `${apt.appointmentDate} at ` +
            `${apt.appointmentTime} was declined.\n` +
            `Reason: ${finalReason}\n` +
            `Please book a new appointment or ` +
            `consult another doctor.`
        });
      }

      showToast(
        'Appointment declined with reason sent ' +
        'to patient!',
        'success'
      );
      setRejectModal({
        isOpen: false,
        appointmentId: null,
        selectedReason: '',
        customReason: '',
        error: ''
      });
      loadAppointments();

    } catch (err) {
      showToast(
        'Failed to decline appointment!',
        'error'
      );
    }
  };

  // Load patient history
  const loadPatientHistory = async (patientId) => {
    try {
      const { getPatientRecords } = await import(
        '../../services/medicalRecordService'
      );
      const records =
        await getPatientRecords(patientId);
      setPatientHistory(records);
      setShowHistory(true);
    } catch (err) {
      console.error('History error:', err);
    }
  };

  const getStatusStyle = (status) => {
    const styles = {
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
        label: '❌ Declined'
      },
      'COMPLETED': {
        bg: '#dbeafe',
        color: '#1d4ed8',
        label: '✔️ Completed'
      },
      'UNASSIGNED': {
        bg: '#f1f5f9',
        color: '#64748b',
        label: '⏳ Unassigned'
      }
    };
    return styles[status] || styles['PENDING'];
  };

  const filteredAppointments = filter === 'ALL'
    ? appointments
    : appointments.filter(
        a => a.status === filter
      );

  const counts = {
    ALL: appointments.length,
    PENDING: appointments.filter(
      a => a.status === 'PENDING'
    ).length,
    CONFIRMED: appointments.filter(
      a => a.status === 'CONFIRMED'
    ).length,
    COMPLETED: appointments.filter(
      a => a.status === 'COMPLETED'
    ).length
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
          className="spinner-border text-success"
          role="status"/>
        <p style={{ color: '#64748b' }}>
          Loading appointments...
        </p>
      </div>
    );
  }

  return (
    <div>

      {/* Confirm Dialog */}
      <ConfirmDialog
        isOpen={confirmAction.isOpen}
        title={confirmAction.title}
        message={confirmAction.message}
        confirmText="Yes, Proceed"
        cancelText="Cancel"
        confirmColor={
          confirmAction.status === 'CONFIRMED'
            ? '#10b981' : '#6366f1'
        }
        onConfirm={handleConfirmAction}
        onCancel={() =>
          setConfirmAction({ isOpen: false })
        }
      />

      {/* Rejection Modal */}
      {rejectModal.isOpen && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 9999,
          padding: '20px'
        }}>
          <div style={{
            background: 'white',
            borderRadius: '20px',
            padding: '28px',
            maxWidth: '500px',
            width: '100%',
            boxShadow:
              '0 25px 50px rgba(0,0,0,0.3)'
          }}>

            {/* Header */}
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '20px'
            }}>
              <h5 style={{
                fontWeight: '700',
                color: '#1e293b',
                margin: 0,
                fontSize: '17px'
              }}>
                ❌ Decline Appointment
              </h5>
              <button
                onClick={() => setRejectModal({
                  isOpen: false
                })}
                style={{
                  background: '#f1f5f9',
                  border: 'none',
                  borderRadius: '8px',
                  padding: '6px 12px',
                  cursor: 'pointer',
                  color: '#64748b',
                  fontWeight: '600'
                }}>
                ✕
              </button>
            </div>

            <p style={{
              color: '#64748b',
              fontSize: '14px',
              marginBottom: '16px'
            }}>
              Please select a reason for declining.
              This will be sent to the patient.
            </p>

            {/* Preset Reasons */}
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '8px',
              marginBottom: '16px'
            }}>
              {REJECTION_REASONS.map(
                (reason, index) => (
                <div
                  key={index}
                  onClick={() => setRejectModal(
                    prev => ({
                      ...prev,
                      selectedReason: reason,
                      error: ''
                    })
                  )}
                  style={{
                    padding: '12px 16px',
                    borderRadius: '10px',
                    cursor: 'pointer',
                    border: rejectModal
                      .selectedReason === reason
                      ? '2px solid #ef4444'
                      : '1px solid #e2e8f0',
                    background: rejectModal
                      .selectedReason === reason
                      ? '#fee2e2'
                      : 'white',
                    color: rejectModal
                      .selectedReason === reason
                      ? '#dc2626'
                      : '#374151',
                    fontSize: '13px',
                    fontWeight: rejectModal
                      .selectedReason === reason
                      ? '600' : '400',
                    transition: 'all 0.2s',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px'
                  }}>
                  <div style={{
                    width: '18px',
                    height: '18px',
                    borderRadius: '50%',
                    border: rejectModal
                      .selectedReason === reason
                      ? '5px solid #ef4444'
                      : '2px solid #cbd5e1',
                    flexShrink: 0,
                    transition: 'all 0.2s'
                  }}/>
                  {reason}
                </div>
              ))}
            </div>

            {/* Custom Reason - shows when
                Other is selected */}
            {rejectModal.selectedReason ===
              'Other (please specify below)' && (
              <div style={{ marginBottom: '16px' }}>
                <label style={{
                  display: 'block',
                  fontSize: '13px',
                  fontWeight: '600',
                  color: '#374151',
                  marginBottom: '6px'
                }}>
                  Please write your reason:
                  <span style={{
                    color: '#ef4444'
                  }}> *</span>
                </label>
                <textarea
                  rows="3"
                  placeholder="Write a clear reason for the patient (minimum 10 characters)..."
                  value={rejectModal.customReason}
                  onChange={(e) =>
                    setRejectModal(prev => ({
                      ...prev,
                      customReason: e.target.value,
                      error: ''
                    }))
                  }
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    border: '1px solid #e2e8f0',
                    borderRadius: '10px',
                    fontSize: '13px',
                    outline: 'none',
                    resize: 'vertical',
                    boxSizing: 'border-box',
                    fontFamily: 'inherit'
                  }}
                />
                <small style={{
                  color: rejectModal.customReason
                    .length >= 10
                    ? '#10b981' : '#94a3b8'
                }}>
                  {rejectModal.customReason.length}
                  /10 minimum characters
                </small>
              </div>
            )}

            {/* Error */}
            {rejectModal.error && (
              <div style={{
                background: '#fee2e2',
                border: '1px solid #fecaca',
                borderRadius: '8px',
                padding: '10px 14px',
                marginBottom: '16px',
                color: '#dc2626',
                fontSize: '13px'
              }}>
                ❌ {rejectModal.error}
              </div>
            )}

            {/* Buttons */}
            <div style={{
              display: 'flex',
              gap: '10px'
            }}>
              <button
                onClick={() => setRejectModal({
                  isOpen: false
                })}
                style={{
                  flex: 1,
                  padding: '11px',
                  border: '1px solid #e2e8f0',
                  borderRadius: '10px',
                  background: 'white',
                  color: '#64748b',
                  fontSize: '14px',
                  fontWeight: '600',
                  cursor: 'pointer'
                }}>
                Cancel
              </button>
              <button
                onClick={handleRejectSubmit}
                style={{
                  flex: 1,
                  padding: '11px',
                  border: 'none',
                  borderRadius: '10px',
                  background:
                    'linear-gradient(135deg, ' +
                    '#ef4444, #dc2626)',
                  color: 'white',
                  fontSize: '14px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  boxShadow:
                    '0 4px 12px rgba(239,68,68,0.3)'
                }}>
                ❌ Decline Appointment
              </button>
            </div>

          </div>
        </div>
      )}

      {/* Patient History Modal */}
      {showHistory && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 9999,
          padding: '20px'
        }}>
          <div style={{
            background: 'white',
            borderRadius: '20px',
            padding: '28px',
            maxWidth: '600px',
            width: '100%',
            maxHeight: '80vh',
            overflowY: 'auto',
            boxShadow:
              '0 25px 50px rgba(0,0,0,0.3)'
          }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '20px'
            }}>
              <h5 style={{
                fontWeight: '700',
                margin: 0,
                color: '#1e293b'
              }}>
                📋 Patient Medical History
              </h5>
              <button
                onClick={() =>
                  setShowHistory(false)
                }
                style={{
                  background: '#f1f5f9',
                  border: 'none',
                  borderRadius: '8px',
                  padding: '6px 14px',
                  cursor: 'pointer',
                  fontWeight: '600',
                  color: '#64748b'
                }}>
                Close ✕
              </button>
            </div>

            {!patientHistory ||
             patientHistory.length === 0 ? (
              <div style={{
                textAlign: 'center',
                padding: '40px',
                color: '#94a3b8'
              }}>
                <div style={{ fontSize: '48px' }}>
                  🗂️
                </div>
                <p style={{ marginTop: '12px' }}>
                  No medical history found
                </p>
              </div>
            ) : (
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '16px'
              }}>
                {patientHistory.map(record => (
                  <div
                    key={record.id}
                    style={{
                      background: '#f8fafc',
                      borderRadius: '12px',
                      padding: '16px',
                      borderLeft:
                        '3px solid #6366f1'
                    }}>
                    <div style={{
                      display: 'flex',
                      justifyContent:
                        'space-between',
                      marginBottom: '8px'
                    }}>
                      <span style={{
                        fontWeight: '700',
                        color: '#6366f1',
                        fontSize: '14px'
                      }}>
                        {record.diagnosis}
                      </span>
                      <span style={{
                        color: '#94a3b8',
                        fontSize: '12px'
                      }}>
                        {record.createdAt
                          ? new Date(
                              record.createdAt
                            ).toLocaleDateString()
                          : ''}
                      </span>
                    </div>
                    {record.prescription && (
                      <p style={{
                        color: '#64748b',
                        fontSize: '13px',
                        margin: '0 0 4px'
                      }}>
                        💊 {record.prescription}
                      </p>
                    )}
                    {record.notes && (
                      <p style={{
                        color: '#64748b',
                        fontSize: '13px',
                        margin: 0
                      }}>
                        📝 {record.notes}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Header */}
      <div style={{ marginBottom: '24px' }}>
        <h4 style={{
          fontWeight: '700',
          color: '#1e293b',
          margin: '0 0 4px'
        }}>
          Patient Appointments
        </h4>
        <p style={{ color: '#64748b', margin: 0 }}>
          Manage and respond to patient requests
        </p>
      </div>

      {/* Filter Tabs */}
      <div style={{
        display: 'flex',
        gap: '8px',
        marginBottom: '24px',
        background: 'white',
        padding: '6px',
        borderRadius: '12px',
        boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
        width: 'fit-content'
      }}>
        {['ALL', 'PENDING', 'CONFIRMED',
          'COMPLETED'].map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            style={{
              padding: '8px 16px',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '13px',
              fontWeight: '600',
              transition: 'all 0.2s',
              background: filter === f
                ? 'linear-gradient(135deg, ' +
                  '#10b981, #059669)'
                : 'transparent',
              color: filter === f
                ? 'white' : '#64748b'
            }}>
            {f} ({counts[f] || 0})
          </button>
        ))}
      </div>

      {/* Appointments */}
      {filteredAppointments.length === 0 ? (
        <div style={{
          textAlign: 'center',
          padding: '60px 20px',
          background: 'white',
          borderRadius: '16px',
          boxShadow: '0 2px 10px rgba(0,0,0,0.05)'
        }}>
          <div style={{ fontSize: '48px' }}>📅</div>
          <h5 style={{
            color: '#64748b',
            marginTop: '12px'
          }}>
            No appointments found
          </h5>
        </div>
      ) : (
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
                    fontSize: '13px'
                  }}>
                    REQUEST #{apt.id}
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

                  {/* Patient Info Grid */}
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr',
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
                        Patient
                      </p>
                      <p style={{
                        color: '#1e293b',
                        fontWeight: '600',
                        fontSize: '15px',
                        margin: 0,
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px'
                      }}>
                        <span style={{
                          width: '28px',
                          height: '28px',
                          borderRadius: '50%',
                          background:
                            'linear-gradient(' +
                            '135deg, #6366f1, ' +
                            '#8b5cf6)',
                          display: 'inline-flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: 'white',
                          fontSize: '12px',
                          fontWeight: '700'
                        }}>
                          {apt.patientName?.charAt(0)}
                        </span>
                        {apt.patientName}
                      </p>
                      <small style={{
                        color: '#94a3b8'
                      }}>
                        ID: #{apt.patientId}
                      </small>
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

                  {/* Problem */}
                  {apt.notes && (
                    <div style={{
                      background: '#f8fafc',
                      borderRadius: '10px',
                      padding: '14px',
                      marginBottom: '16px',
                      borderLeft:
                        '3px solid #10b981'
                    }}>
                      <p style={{
                        color: '#64748b',
                        fontSize: '12px',
                        fontWeight: '600',
                        margin: '0 0 6px',
                        textTransform: 'uppercase'
                      }}>
                        Reason for Appointment:
                      </p>
                      <p style={{
                        color: '#1e293b',
                        fontSize: '14px',
                        margin: 0,
                        lineHeight: '1.6',
                        fontStyle: 'italic'
                      }}>
                        "{apt.notes}"
                      </p>
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div style={{
                    display: 'flex',
                    gap: '10px',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}>

                    {/* View History */}
                    <button
                      onClick={() =>
                        loadPatientHistory(
                          apt.patientId
                        )
                      }
                      style={{
                        padding: '8px 16px',
                        border: '1px solid #c7d2fe',
                        borderRadius: '8px',
                        background: '#ede9fe',
                        color: '#6366f1',
                        fontSize: '12px',
                        fontWeight: '600',
                        cursor: 'pointer'
                      }}>
                      📋 Patient History
                    </button>

                    <div style={{
                      display: 'flex',
                      gap: '8px'
                    }}>
                      {/* PENDING actions */}
                      {apt.status === 'PENDING' && (
                        <>
                          <button
                            onClick={() =>
                              setConfirmAction({
                                isOpen: true,
                                id: apt.id,
                                status: 'CONFIRMED',
                                title:
                                  'Confirm Appointment?',
                                message:
                                  'Confirm this appointment? ' +
                                  'Patient will be notified.'
                              })
                            }
                            style={{
                              padding: '9px 20px',
                              border: 'none',
                              borderRadius: '8px',
                              background:
                                'linear-gradient(' +
                                '135deg, #10b981, ' +
                                '#059669)',
                              color: 'white',
                              fontSize: '13px',
                              fontWeight: '600',
                              cursor: 'pointer',
                              boxShadow:
                                '0 4px 12px rgba(' +
                                '16,185,129,0.3)'
                            }}>
                            ✓ Accept
                          </button>

                          {/* Decline with reasons */}
                          <button
                            onClick={() =>
                              handleRejectClick(
                                apt.id
                              )
                            }
                            style={{
                              padding: '9px 20px',
                              border:
                                '1px solid #fecaca',
                              borderRadius: '8px',
                              background: 'white',
                              color: '#dc2626',
                              fontSize: '13px',
                              fontWeight: '600',
                              cursor: 'pointer'
                            }}>
                            ✗ Decline
                          </button>
                        </>
                      )}

                      {/* CONFIRMED action */}
                      {apt.status ===
                        'CONFIRMED' && (
                        <button
                          onClick={() =>
                            setConfirmAction({
                              isOpen: true,
                              id: apt.id,
                              status: 'COMPLETED',
                              title:
                                'Complete Appointment?',
                              message:
                                'Mark this appointment ' +
                                'as completed?'
                            })
                          }
                          style={{
                            padding: '9px 20px',
                            border: 'none',
                            borderRadius: '8px',
                            background:
                              'linear-gradient(' +
                              '135deg, #6366f1, ' +
                              '#8b5cf6)',
                            color: 'white',
                            fontSize: '13px',
                            fontWeight: '600',
                            cursor: 'pointer'
                          }}>
                          ✓ Mark Complete
                        </button>
                      )}

                      {/* No actions */}
                      {(apt.status === 'CANCELLED' ||
                        apt.status ===
                          'COMPLETED') && (
                        <span style={{
                          color: '#94a3b8',
                          fontSize: '13px',
                          padding: '9px 0'
                        }}>
                          No actions available
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default DoctorAppointments;