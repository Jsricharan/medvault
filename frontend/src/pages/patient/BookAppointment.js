import React, { useState, useEffect } from 'react';
import { bookAppointment } from '../../services/appointmentService';
import { getAllDoctors } from '../../services/adminService';
import { formatDoctorName } from '../../utils/helpers';
import { showToast } from '../../components/Toast';

function BookAppointment({ onBooked }) {

  const [doctors, setDoctors] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [search, setSearch] = useState('');
  const [step, setStep] = useState(1);
  // Step 1 = Select Doctor
  // Step 2 = Fill Appointment Details

  const [formData, setFormData] = useState({
    appointmentDate: '',
    appointmentTime: '',
    appointmentHour: '',
    appointmentMinute: '00',
    appointmentAmPm: 'AM',
    notes: ''
  });

  const [errors, setErrors] = useState({});
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [loadingDoctors, setLoadingDoctors] = useState(true);

  useEffect(() => {
    loadDoctors();
  }, []);

  const loadDoctors = async () => {
    try {
      // Fresh fetch with no cache
      const response = await fetch(
        `http://localhost:8080/api/admin/doctors?t=${Date.now()}`,
        {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json'
          }
        }
      );
      const data = await response.json();
      setDoctors(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Error loading doctors:', err);
    } finally {
      setLoadingDoctors(false);
    }
  };

  // Filter doctors by search
  const filteredDoctors = doctors.filter(doc =>
    doc.fullName.toLowerCase()
      .includes(search.toLowerCase()) ||
    (doc.specialization || '').toLowerCase()
      .includes(search.toLowerCase())
  );

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: '' });
    }
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.appointmentDate) {
      newErrors.appointmentDate = 'Appointment date is required!';
      return newErrors;
    }

    // Check if date is in the past
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const selectedDate = new Date(formData.appointmentDate);

    if (selectedDate < today) {
      newErrors.appointmentDate = 'Cannot book appointment for past dates!';
      return newErrors;
    }

    if (!formData.appointmentTime) {
      newErrors.appointmentTime = 'Please select an appointment time!';
      return newErrors;
    }

    // Check if selected time is past for today
    const isToday = selectedDate.toDateString() === new Date().toDateString();

    if (isToday) {
      const now = new Date();
      const [h, m] = formData.appointmentTime.split(':');
      const selectedTime = new Date();
      selectedTime.setHours(parseInt(h), parseInt(m), 0, 0);

      const bufferTime = new Date(now.getTime() + 30 * 60000);

      if (selectedTime < bufferTime) {
        newErrors.appointmentTime = 'This time slot has already passed! Please select a future time.';
        return newErrors;
      }
    }

    if (!formData.notes.trim()) {
      newErrors.notes = 'Please describe your problem!';
    } else if (formData.notes.trim().length < 10) {
      newErrors.notes = 'Please provide more details (min 10 chars)!';
    }

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setLoading(true);

    try {
      const bookingData = {
        appointmentDate: formData.appointmentDate,
        // Time already in HH:MM format from select
        appointmentTime:
          formData.appointmentTime.length === 5
            ? formData.appointmentTime + ':00'
            : formData.appointmentTime,
        notes: formData.notes
      };

      if (selectedDoctor) {
        bookingData.doctorId = selectedDoctor.id;
      }

      await bookAppointment(bookingData);

      setSuccess(
        selectedDoctor
          ? `✅ Appointment booked with ${formatDoctorName(selectedDoctor.fullName)} successfully!`
          : '✅ Appointment request sent! Admin will assign a doctor shortly.'
      );

      setTimeout(() => {
        if (onBooked) onBooked();
      }, 2000);

    } catch (err) {
      setError(
        err.response?.data?.message ||
        'Failed to book appointment!'
      );
    } finally {
      setLoading(false);
    }
  };

  // Specialization badge colors
  const getSpecColor = (spec) => {
    const colors = {
      'Cardiologist': { bg: '#fee2e2', color: '#ef4444' },
      'Neurologist': { bg: '#fce7f3', color: '#ec4899' },
      'Pediatrician': { bg: '#dcfce7', color: '#22c55e' },
      'Dermatologist': { bg: '#fef9c3', color: '#eab308' },
      'Orthopedic Surgeon': { bg: '#dbeafe', color: '#3b82f6' },
      'Gynecologist': { bg: '#f3e8ff', color: '#a855f7' },
      'General Physician': { bg: '#e0f2fe', color: '#0ea5e9' },
      'Psychiatrist': { bg: '#fdf4ff', color: '#c026d3' },
      'Family Medicine': { bg: '#f1f5f9', color: '#64748b' },
      'Dentist': { bg: '#fff7ed', color: '#f97316' },
    };
    return colors[spec] || { bg: '#ede9fe', color: '#6366f1' };
  };

  return (
    <div>

      {/* Header */}
      <div style={{ marginBottom: '24px' }}>
        <h4 style={{ fontWeight: '700', color: '#1e293b', margin: '0 0 4px' }}>
          Book Appointment
        </h4>
        <p style={{ color: '#64748b', margin: 0 }}>
          Select a doctor or send a request to admin
        </p>
      </div>

      {/* Progress Steps */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0', marginBottom: '28px' }}>
        {/* Step 1 */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{
            width: '32px',
            height: '32px',
            borderRadius: '50%',
            background: step >= 1 ? 'linear-gradient(135deg, #6366f1, #8b5cf6)' : '#e2e8f0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: step >= 1 ? 'white' : '#94a3b8',
            fontWeight: '700',
            fontSize: '14px'
          }}>
            {step > 1 ? '✓' : '1'}
          </div>
          <span style={{ fontSize: '14px', fontWeight: '600', color: step >= 1 ? '#6366f1' : '#94a3b8' }}>
            Select Doctor
          </span>
        </div>

        {/* Line */}
        <div style={{ flex: 1, height: '2px', background: step >= 2 ? '#6366f1' : '#e2e8f0', margin: '0 12px', maxWidth: '60px' }}/>

        {/* Step 2 */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{
            width: '32px',
            height: '32px',
            borderRadius: '50%',
            background: step >= 2 ? 'linear-gradient(135deg, #6366f1, #8b5cf6)' : '#e2e8f0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: step >= 2 ? 'white' : '#94a3b8',
            fontWeight: '700',
            fontSize: '14px'
          }}>
            2
          </div>
          <span style={{ fontSize: '14px', fontWeight: '600', color: step >= 2 ? '#6366f1' : '#94a3b8' }}>
            Appointment Details
          </span>
        </div>
      </div>

      {/* STEP 1 — Select Doctor */}
      {step === 1 && (
        <div>

          {/* Info Box */}
          <div style={{
            background: '#eff6ff',
            border: '1px solid #bfdbfe',
            borderRadius: '12px',
            padding: '14px 16px',
            marginBottom: '20px',
            fontSize: '14px',
            color: '#1d4ed8',
            display: 'flex',
            alignItems: 'flex-start',
            gap: '8px'
          }}>
            <span>💡</span>
            <span>
              <strong>Doctor is optional.</strong> You can select a specific doctor or skip and let the admin assign the best doctor for your condition.
            </span>
          </div>

          {/* Search */}
          <div style={{ position: 'relative', marginBottom: '20px' }}>
            <span style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8', fontSize: '16px' }}>
              🔍
            </span>
            <input
              type="text"
              placeholder="Search by name or specialization..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{
                width: '100%',
                padding: '12px 12px 12px 42px',
                border: '1px solid #e2e8f0',
                borderRadius: '12px',
                fontSize: '14px',
                outline: 'none',
                boxSizing: 'border-box',
                background: 'white',
                boxShadow: '0 1px 4px rgba(0,0,0,0.05)'
              }}
            />
          </div>

          {/* Skip Option */}
          <div
            onClick={() => {
              setSelectedDoctor(null);
              setStep(2);
            }}
            style={{
              background: 'white',
              border: '2px dashed #cbd5e1',
              borderRadius: '16px',
              padding: '20px',
              marginBottom: '16px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '16px',
              transition: 'all 0.2s'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = '#6366f1';
              e.currentTarget.style.background = '#fafafe';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = '#cbd5e1';
              e.currentTarget.style.background = 'white';
            }}>
            <div style={{
              width: '50px',
              height: '50px',
              borderRadius: '50%',
              background: '#f1f5f9',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '24px',
              flexShrink: 0
            }}>
              🏥
            </div>
            <div>
              <p style={{ fontWeight: '700', color: '#1e293b', margin: '0 0 4px', fontSize: '15px' }}>
                No Preference — Let Admin Assign
              </p>
              <p style={{ color: '#64748b', margin: 0, fontSize: '13px' }}>
                Describe your problem and admin will assign the most suitable doctor for you
              </p>
            </div>
            <span style={{ marginLeft: 'auto', color: '#94a3b8', fontSize: '20px' }}>
              →
            </span>
          </div>

          {/* Doctors Grid */}
          {loadingDoctors ? (
            <div style={{ textAlign: 'center', padding: '40px', color: '#64748b' }}>
              <div className="spinner-border spinner-border-sm text-primary me-2"/>
              Loading doctors...
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '16px' }}>
              {filteredDoctors.map(doctor => {
                const specColors = getSpecColor(doctor.specialization);
                const isSelected = selectedDoctor?.id === doctor.id;
                const isUnavailable = doctor.available === false;

                return (
                  <div
                    key={doctor.id}
                    onClick={() => {
                      if (!isUnavailable) {
                        setSelectedDoctor(doctor);
                        setStep(2);
                      }
                    }}
                    style={{
                      background: isUnavailable ? '#f8f9fa' : 'white',
                      borderRadius: '16px',
                      padding: '24px',
                      cursor: isUnavailable ? 'not-allowed' : 'pointer',
                      border: isSelected ? '2px solid #6366f1' : isUnavailable ? '1px solid #e2e8f0' : '1px solid #f1f5f9',
                      boxShadow: isSelected ? '0 8px 25px rgba(99,102,241,0.2)' : '0 2px 10px rgba(0,0,0,0.05)',
                      transition: 'all 0.2s',
                      position: 'relative',
                      opacity: isUnavailable ? 0.7 : 1
                    }}
                    onMouseEnter={(e) => {
                      if (!isSelected && !isUnavailable) {
                        e.currentTarget.style.transform = 'translateY(-4px)';
                        e.currentTarget.style.boxShadow = '0 12px 30px rgba(0,0,0,0.1)';
                        e.currentTarget.style.borderColor = '#c7d2fe';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!isSelected && !isUnavailable) {
                        e.currentTarget.style.transform = 'translateY(0)';
                        e.currentTarget.style.boxShadow = '0 2px 10px rgba(0,0,0,0.05)';
                        e.currentTarget.style.borderColor = '#f1f5f9';
                      }
                    }}>

                    {/* Unavailable Overlay Badge */}
                    {isUnavailable && (
                      <div style={{
                        position: 'absolute',
                        top: '12px',
                        right: '12px',
                        background: '#fee2e2',
                        color: '#dc2626',
                        padding: '3px 10px',
                        borderRadius: '20px',
                        fontSize: '11px',
                        fontWeight: '700'
                      }}>
                        🔴 Unavailable
                      </div>
                    )}

                    {/* Doctor Identity Layout block */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '16px' }}>
                      <div style={{ width: '56px', height: '56px', borderRadius: '50%', overflow: 'hidden', flexShrink: 0, border: '2px solid #e2e8f0' }}>
                        {doctor.profilePicture ? (
                          <img src={doctor.profilePicture} alt={doctor.fullName} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        ) : (
                          <div style={{
                            width: '100%',
                            height: '100%',
                            background: isUnavailable ? 'linear-gradient(135deg, #94a3b8, #64748b)' : 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: 'white',
                            fontWeight: '700',
                            fontSize: '22px',
                            position: 'relative'
                          }}>
                            {doctor.fullName?.charAt(0)}
                            <div style={{
                              position: 'absolute',
                              bottom: '2px',
                              right: '2px',
                              width: '12px',
                              height: '12px',
                              borderRadius: '50%',
                              background: isUnavailable ? '#ef4444' : '#22c55e',
                              border: '2px solid white'
                            }}/>
                          </div>
                        )}
                      </div>

                      <div>
                        <h6 style={{ fontWeight: '700', color: isUnavailable ? '#94a3b8' : '#1e293b', margin: '0 0 6px', fontSize: '15px' }}>
                          {formatDoctorName(doctor.fullName)}
                        </h6>
                        {doctor.specialization && (
                          <span style={{
                            background: isUnavailable ? '#f1f5f9' : specColors.bg,
                            color: isUnavailable ? '#94a3b8' : specColors.color,
                            padding: '3px 12px',
                            borderRadius: '20px',
                            fontSize: '12px',
                            fontWeight: '600',
                            display: 'inline-block'
                          }}>
                            {doctor.specialization}
                          </span>
                        )}
                      </div>
                    </div>

                    <div style={{ height: '1px', background: '#f1f5f9', marginBottom: '14px' }}/>

                    {/* Doctor Details */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                          <polyline points="22,6 12,13 2,6"/>
                        </svg>
                        <span style={{ fontSize: '13px', color: '#64748b' }}>{doctor.email}</span>
                      </div>

                      {doctor.phone && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 13a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.62 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 9.91a16 16 0 0 0 6.1 6.1l1.27-.96a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/>
                          </svg>
                          <span style={{ fontSize: '13px', color: '#64748b' }}>{doctor.phone}</span>
                        </div>
                      )}

                      {doctor.hospitalName && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <span style={{ fontSize: '13px' }}>🏥</span>
                          <span style={{ fontSize: '13px', color: '#64748b' }}>
                            {doctor.hospitalName}{doctor.hospitalCity ? `, ${doctor.hospitalCity}` : ''}
                          </span>
                        </div>
                      )}

                      {doctor.experience && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <span style={{ fontSize: '13px' }}>⭐</span>
                          <span style={{ fontSize: '13px', color: '#64748b' }}>{doctor.experience} experience</span>
                        </div>
                      )}
                    </div>

                    <div style={{ marginTop: '14px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: isUnavailable ? '#ef4444' : '#22c55e' }}/>
                      <span style={{ fontSize: '12px', color: isUnavailable ? '#ef4444' : '#22c55e', fontWeight: '600' }}>
                        {isUnavailable ? 'Not available for appointments' : 'Available for appointments'}
                      </span>
                    </div>

                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* STEP 2 — Appointment Details */}
      {step === 2 && (
        <div>

          {/* Selected Doctor Card overview */}
          <div style={{
            background: 'white',
            borderRadius: '16px',
            padding: '20px',
            marginBottom: '24px',
            boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
            border: '1px solid #f1f5f9'
          }}>
            {selectedDoctor ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                <div style={{
                  width: '50px',
                  height: '50px',
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  fontWeight: '700',
                  fontSize: '20px',
                  flexShrink: 0
                }}>
                  {selectedDoctor.fullName?.charAt(0)}
                </div>
                <div style={{ flex: 1 }}>
                  <p style={{ fontWeight: '700', color: '#1e293b', margin: '0 0 2px', fontSize: '15px' }}>
                    {formatDoctorName(selectedDoctor.fullName)}
                  </p>
                  {selectedDoctor.specialization && (
                    <span style={{
                      background: getSpecColor(selectedDoctor.specialization).bg,
                      color: getSpecColor(selectedDoctor.specialization).color,
                      padding: '2px 10px',
                      borderRadius: '20px',
                      fontSize: '11px',
                      fontWeight: '600'
                    }}>
                      {selectedDoctor.specialization}
                    </span>
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setSelectedDoctor(null);
                    setStep(1);
                  }}
                  style={{
                    background: '#f1f5f9',
                    border: 'none',
                    borderRadius: '8px',
                    color: '#64748b',
                    padding: '6px 14px',
                    fontSize: '12px',
                    cursor: 'pointer',
                    fontWeight: '600'
                  }}>
                  Change
                </button>
              </div>
            ) : (
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                <div style={{ width: '50px', height: '50px', borderRadius: '50%', background: '#f1f5f9', display: 'flex', alignItems: 'center', justifyYontent: 'center', fontSize: '22px', flexShrink: 0 }}>
                  🏥
                </div>
                <div style={{ flex: 1 }}>
                  <p style={{ fontWeight: '700', color: '#1e293b', margin: '0 0 2px', fontSize: '15px' }}>
                    No Doctor Selected
                  </p>
                  <p style={{ color: '#64748b', margin: 0, fontSize: '13px' }}>
                    Admin will assign the best doctor for your condition
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  style={{
                    background: '#f1f5f9',
                    border: 'none',
                    borderRadius: '8px',
                    color: '#64748b',
                    padding: '6px 14px',
                    fontSize: '12px',
                    cursor: 'pointer',
                    fontWeight: '600'
                  }}>
                  Select Doctor
                </button>
              </div>
            )}
          </div>

          {/* Alerts */}
          {error && (
            <div style={{ background: '#fee2e2', border: '1px solid #fecaca', borderRadius: '12px', padding: '12px 16px', marginBottom: '20px', color: '#dc2626', fontSize: '14px' }}>
              ❌ {error}
            </div>
          )}
          {success && (
            <div style={{ background: '#d1fae5', border: '1px solid #a7f3d0', borderRadius: '12px', padding: '12px 16px', marginBottom: '20px', color: '#059669', fontSize: '14px' }}>
              {success}
            </div>
          )}

          <form onSubmit={handleSubmit}>

            {/* Date and Time Row container Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '20px' }}>

              {/* Appointment Date Input field */}
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#374151', marginBottom: '8px' }}>
                  Appointment Date
                  <span style={{ color: '#ef4444' }}> *</span>
                </label>
                <input
                  type="date"
                  name="appointmentDate"
                  value={formData.appointmentDate}
                  onChange={(e) => {
                    const selectedDate = e.target.value;
                    const today = new Date().toISOString().split('T')[0];

                    if (selectedDate < today) {
                      showToast('Cannot book for past dates!', 'error');
                      return;
                    }
                    handleChange(e);
                  }}
                  min={new Date().toISOString().split('T')[0]}
                  style={{
                    width: '100%',
                    padding: '11px 14px',
                    border: errors.appointmentDate ? '1px solid #ef4444' : '1px solid #e2e8f0',
                    borderRadius: '10px',
                    fontSize: '14px',
                    outline: 'none',
                    boxSizing: 'border-box',
                    background: 'white'
                  }}
                />
                {errors.appointmentDate && (
                  <p style={{ color: '#ef4444', fontSize: '12px', margin: '4px 0 0' }}>
                    {errors.appointmentDate}
                  </p>
                )}
              </div>

              {/* Appointment Fixed Time Slots Selector */}
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#374151', marginBottom: '8px' }}>
                  Appointment Time
                  <span style={{ color: '#ef4444' }}> *</span>
                </label>

                <select
                  style={{
                    width: '100%',
                    padding: '11px 14px',
                    border: errors.appointmentTime ? '1px solid #ef4444' : '1px solid #e2e8f0',
                    borderRadius: '10px',
                    fontSize: '14px',
                    outline: 'none',
                    background: 'white',
                    cursor: 'pointer',
                    boxSizing: 'border-box'
                  }}
                  value={formData.appointmentTime}
                  onChange={(e) => {
                    setFormData({
                      ...formData,
                      appointmentTime: e.target.value,
                      appointmentHour: e.target.value ? e.target.value.split(':')[0] : '',
                      appointmentMinute: e.target.value ? e.target.value.split(':')[1] : '00',
                      appointmentAmPm: parseInt(e.target.value) >= 12 ? 'PM' : 'AM'
                    });
                    if (errors.appointmentTime) {
                      setErrors({ ...errors, appointmentTime: '' });
                    }
                  }}>
                  <option value="">-- Select Time Slot --</option>

                  {/* Morning Session */}
                  <optgroup label="🌅 Morning (9:30 AM - 1:00 PM)">
                    <option value="09:30">9:30 AM</option>
                    <option value="10:00">10:00 AM</option>
                    <option value="10:30">10:30 AM</option>
                    <option value="11:00">11:00 AM</option>
                    <option value="11:30">11:30 AM</option>
                    <option value="12:00">12:00 PM</option>
                    <option value="12:30">12:30 PM</option>
                  </optgroup>

                  {/* Evening Session */}
                  <optgroup label="🌆 Evening (2:00 PM - 10:00 PM)">
                    <option value="14:00">2:00 PM</option>
                    <option value="14:30">2:30 PM</option>
                    <option value="15:00">3:00 PM</option>
                    <option value="15:30">3:30 PM</option>
                    <option value="16:00">4:00 PM</option>
                    <option value="16:30">4:30 PM</option>
                    <option value="17:00">5:00 PM</option>
                    <option value="17:30">5:30 PM</option>
                    <option value="18:00">6:00 PM</option>
                    <option value="18:30">6:30 PM</option>
                    <option value="19:00">7:00 PM</option>
                    <option value="19:30">7:30 PM</option>
                    <option value="20:00">8:00 PM</option>
                    <option value="20:30">8:30 PM</option>
                    <option value="21:00">9:00 PM</option>
                    <option value="21:30">9:30 PM</option>
                    <option value="22:00">10:00 PM</option>
                  </optgroup>
                </select>

                {/* Time Selection Indicator Badge preview */}
                {formData.appointmentTime && (
                  <p style={{ color: '#22c55e', fontSize: '12px', margin: '4px 0 0', fontWeight: '500' }}>
                    ✓ Selected: {(() => {
                      const [h, m] = formData.appointmentTime.split(':');
                      const hour = parseInt(h);
                      const ampm = hour >= 12 ? 'PM' : 'AM';
                      const displayHour = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour;
                      return `${displayHour}:${m} ${ampm}`;
                    })()}
                  </p>
                )}

                {errors.appointmentTime && (
                  <p style={{ color: '#ef4444', fontSize: '12px', margin: '4px 0 0' }}>
                    {errors.appointmentTime}
                  </p>
                )}
              </div>
            </div>

            {/* Problem Symptom Details description textarea context block */}
            <div style={{ marginBottom: '24px' }}>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#374151', marginBottom: '8px' }}>
                Describe Your Problem
                <span style={{ color: '#ef4444' }}> *</span>
              </label>
              <textarea
                name="notes"
                rows="4"
                placeholder="Please describe your symptoms or reason for visit in detail..."
                value={formData.notes}
                onChange={handleChange}
                style={{
                  width: '100%',
                  padding: '12px 14px',
                  border: errors.notes ? '1px solid #ef4444' : '1px solid #e2e8f0',
                  borderRadius: '10px',
                  fontSize: '14px',
                  outline: 'none',
                  boxSizing: 'border-box',
                  resize: 'vertical',
                  fontFamily: 'inherit',
                  lineHeight: '1.6'
                }}
              />
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '4px' }}>
                {errors.notes ? (
                  <p style={{ color: '#ef4444', fontSize: '12px', margin: 0 }}>{errors.notes}</p>
                ) : (
                  <p style={{ color: '#94a3b8', fontSize: '12px', margin: 0 }}>Minimum 10 characters</p>
                )}
                <p style={{ color: formData.notes.length >= 10 ? '#22c55e' : '#94a3b8', fontSize: '12px', margin: 0, fontWeight: '500' }}>
                  {formData.notes.length} chars
                </p>
              </div>
            </div>

            {/* Action buttons handling context changes */}
            <div style={{ display: 'flex', gap: '12px' }}>
              <button
                type="button"
                onClick={() => setStep(1)}
                style={{
                  padding: '12px 24px',
                  background: 'white',
                  border: '1px solid #e2e8f0',
                  borderRadius: '10px',
                  color: '#64748b',
                  fontSize: '14px',
                  fontWeight: '600',
                  cursor: 'pointer'
                }}>
                ← Back
              </button>

              <button
                type="submit"
                disabled={loading}
                style={{
                  flex: 1,
                  padding: '12px 24px',
                  background: loading ? '#c7d2fe' : 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                  border: 'none',
                  borderRadius: '10px',
                  color: 'white',
                  fontSize: '14px',
                  fontWeight: '600',
                  cursor: loading ? 'not-allowed' : 'pointer',
                  boxShadow: loading ? 'none' : '0 4px 15px rgba(99,102,241,0.4)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px'
                }}>
                {loading ? (
                  <>
                    <span className="spinner-border spinner-border-sm"/>
                    Booking...
                  </>
                ) : selectedDoctor ? (
                  `📅 Book with ${formatDoctorName(selectedDoctor.fullName)}`
                ) : (
                  '📤 Send Request to Admin'
                )}
              </button>
            </div>

          </form>
        </div>
      )}
    </div>
  );
}

export default BookAppointment;