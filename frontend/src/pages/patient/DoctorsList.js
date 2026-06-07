import React, { useState, useEffect } from 'react';
import { getAllDoctors } from '../../services/adminService';
import { formatDoctorName } from '../../utils/helpers';

function DoctorsList() {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterSpec, setFilterSpec] = useState('ALL');

  useEffect(() => {
    loadDoctors();
  }, []);

  const loadDoctors = async () => {
    try {
      // Add timestamp to prevent caching
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
      setLoading(false);
    }
  };

  // Get unique specializations
  const specializations = [
    'ALL',
    ...new Set(
      doctors
        .map(d => d.specialization)
        .filter(Boolean)
    )
  ];

  // Filter doctors
  const filteredDoctors = doctors.filter(doctor => {
    const matchesSearch =
      doctor.fullName.toLowerCase()
        .includes(search.toLowerCase()) ||
      (doctor.specialization || '').toLowerCase()
        .includes(search.toLowerCase());

    const matchesSpec =
      filterSpec === 'ALL' ||
      doctor.specialization === filterSpec;

    return matchesSearch && matchesSpec && doctor.enabled !== false;
  });

  // Specialization colors
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
      'Ophthalmologist': { bg: '#ecfdf5', color: '#10b981' },
      'Dentist': { bg: '#fff7ed', color: '#f97316' },
    };
    return colors[spec] || { bg: '#f1f5f9', color: '#64748b' };
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
        <div className="spinner-border text-primary"/>
        <p style={{ color: '#64748b' }}>
          Loading doctors...
        </p>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom: '24px' }}>
        <h4 style={{ fontWeight: '700', color: '#1e293b', margin: '0 0 4px' }}>
          Our Doctors
        </h4>
        <p style={{ color: '#64748b', margin: 0 }}>
          Find and learn about our qualified doctors
        </p>
      </div>

      {/* Search and Filter */}
      <div style={{
        display: 'flex',
        gap: '12px',
        marginBottom: '24px',
        flexWrap: 'wrap'
      }}>
        {/* Search */}
        <div style={{ position: 'relative', flex: 1 }}>
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
            placeholder="Search by name or specialization..."
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

        {/* Specialization Filter */}
        <select
          value={filterSpec}
          onChange={(e) => setFilterSpec(e.target.value)}
          style={{
            padding: '10px 16px',
            border: '1px solid #e2e8f0',
            borderRadius: '10px',
            fontSize: '14px',
            outline: 'none',
            background: 'white',
            color: '#1e293b',
            cursor: 'pointer'
          }}>
          {specializations.map((spec, i) => (
            <option key={i} value={spec}>
              {spec === 'ALL' ? 'All Specializations' : spec}
            </option>
          ))}
        </select>
      </div>

      {/* Results count */}
      <p style={{ color: '#64748b', fontSize: '13px', marginBottom: '16px' }}>
        Showing {filteredDoctors.length} doctor(s)
      </p>

      {/* Doctors Grid */}
      {filteredDoctors.length === 0 ? (
        <div style={{
          textAlign: 'center',
          padding: '60px 20px',
          background: 'white',
          borderRadius: '16px'
        }}>
          <div style={{ fontSize: '48px' }}>👨‍⚕️</div>
          <h5 style={{ color: '#64748b', marginTop: '12px' }}>
            No doctors found
          </h5>
          <p style={{ color: '#94a3b8' }}>
            Try a different search or filter
          </p>
        </div>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
          gap: '20px'
        }}>
          {filteredDoctors.map(doctor => {
            const specColors = getSpecColor(doctor.specialization);
            return (
              <div
                key={doctor.id}
                style={{
                  background: 'white',
                  borderRadius: '16px',
                  padding: '24px',
                  boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
                  border: '1px solid #f1f5f9',
                  transition: 'all 0.2s',
                  cursor: 'default'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-4px)';
                  e.currentTarget.style.boxShadow = '0 12px 30px rgba(0,0,0,0.1)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 2px 10px rgba(0,0,0,0.05)';
                }}>

                {/* Doctor Identity Header Block */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '16px' }}>
                  {/* Doctor Avatar */}
                  <div style={{
                    width: '56px',
                    height: '56px',
                    borderRadius: '50%',
                    overflow: 'hidden',
                    flexShrink: 0,
                    border: '2px solid #e2e8f0'
                  }}>
                    {doctor.profilePicture ? (
                      <img
                        src={doctor.profilePicture}
                        alt={doctor.fullName}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      />
                    ) : (
                      <div style={{
                        width: '100%',
                        height: '100%',
                        background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'white',
                        fontWeight: '700',
                        fontSize: '22px'
                      }}>
                        {doctor.fullName?.charAt(0)}
                      </div>
                    )}
                  </div>

                  {/* Name and Specialization */}
                  <div>
                    <h6 style={{ fontWeight: '700', color: '#1e293b', margin: '0 0 4px', fontSize: '15px' }}>
                      {formatDoctorName(doctor.fullName)}
                    </h6>
                    {doctor.specialization && (
                      <span style={{
                        background: specColors.bg,
                        color: specColors.color,
                        padding: '3px 10px',
                        borderRadius: '20px',
                        fontSize: '11px',
                        fontWeight: '600',
                        display: 'inline-block'
                      }}>
                        {doctor.specialization}
                      </span>
                    )}
                  </div>
                </div>

                {/* Doctor Details */}
                <div style={{
                  borderTop: '1px solid #f1f5f9',
                  paddingTop: '14px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '8px'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <svg xmlns="http://www.w3.org/2000/svg"
                      width="14" height="14" viewBox="0 0 24 24"
                      fill="none" stroke="#94a3b8" strokeWidth="2"
                      strokeLinecap="round" strokeLinejoin="round">
                      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                      <polyline points="22,6 12,13 2,6"/>
                    </svg>
                    <span style={{ fontSize: '13px', color: '#64748b' }}>
                      {doctor.email}
                    </span>
                  </div>

                  {doctor.phone && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <svg xmlns="http://www.w3.org/2000/svg"
                        width="14" height="14" viewBox="0 0 24 24"
                        fill="none" stroke="#ef4444" strokeWidth="2"
                        strokeLinecap="round" strokeLinejoin="round">
                        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 13a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.62 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 9.91a16 16 0 0 0 6.1 6.1l1.27-.96a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/>
                      </svg>
                      <span style={{ fontSize: '13px', color: '#64748b' }}>
                        {doctor.phone}
                      </span>
                    </div>
                  )}

                  {doctor.hospitalName && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ fontSize: '14px' }}>🏥</span>
                      <span style={{ fontSize: '13px', color: '#64748b' }}>
                        {doctor.hospitalName}
                        {doctor.hospitalCity ? `, ${doctor.hospitalCity}` : ''}
                      </span>
                    </div>
                  )}

                  {doctor.experience && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ fontSize: '14px' }}>⭐</span>
                      <span style={{ fontSize: '13px', color: '#64748b' }}>
                        {doctor.experience} experience
                      </span>
                    </div>
                  )}
                </div>

                {/* Available Badge */}
                  <div style={{
                    marginTop: '14px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}>
                    <div style={{
                      width: '8px',
                      height: '8px',
                      borderRadius: '50%',
                      // Only unavailable if explicitly set to false
                      background:
                        doctor.available === false
                          ? '#ef4444' : '#22c55e'
                    }}/>
                    <span style={{
                      fontSize: '12px',
                      color: doctor.available === false
                        ? '#ef4444' : '#22c55e',
                      fontWeight: '600'
                    }}>
                      {doctor.available === false
                        ? 'Currently unavailable'
                        : 'Available for appointments'}
                    </span>
                  </div>

              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default DoctorsList;