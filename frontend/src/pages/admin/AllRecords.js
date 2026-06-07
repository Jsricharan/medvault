import React, { useState, useEffect } from 'react';
import { getAllRecords } from '../../services/medicalRecordService';

// Safely handle doctor name formatting locally in case the utility path differs
const formatDoctorName = (name) => {
  if (!name) return 'Assigned Doctor';
  const cleanName = name.trim();
  return cleanName.toLowerCase().startsWith('dr.') ? cleanName : `Dr. ${cleanName}`;
};

function AllRecords() {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    loadRecords();
  }, []);

  const loadRecords = async () => {
    try {
      setErrorMessage('');
      const data = await getAllRecords();
      setRecords(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Error loading records:', err);
      setErrorMessage('Failed to fetch medical records from server.');
      setRecords([]);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '48px 0' }}>
        <div className="spinner-border text-danger" role="status"></div>
        <p style={{ marginTop: '8px', color: '#6c757d' }}>Loading records...</p>
      </div>
    );
  }

  return (
    <div className="card shadow-sm" style={{ borderRadius: '12px', overflow: 'hidden' }}>
      <div className="card-header bg-white py-3 d-flex justify-content-between align-items-center" style={{ borderBottom: '1px solid #f1f5f9' }}>
        <h5 className="mb-0 fw-bold" style={{ color: '#1e293b' }}>🗂️ All Medical Records</h5>
        <span className="badge bg-danger" style={{ padding: '6px 12px', borderRadius: '20px' }}>
          {records.length} Total
        </span>
      </div>

      <div className="card-body" style={{ padding: '24px' }}>
        {errorMessage && (
          <div className="alert alert-danger" role="alert">
            ❌ {errorMessage}
          </div>
        )}

        {records.length === 0 ? (
          <div className="text-center py-5">
            <div style={{ fontSize: '64px', marginBottom: '16px' }}>🗂️</div>
            <h5 className="text-muted fw-normal">No Medical Records Found</h5>
          </div>
        ) : (
          <div className="row g-3">
            {records.map(record => {
              if (!record) return null;

              // Defensive extraction to prevent "Cannot read properties of undefined" errors
              const displayPatientName = record.patientName || record.patient?.fullName || 'Unknown Patient';
              const rawDoctorName = record.doctorName || record.doctor?.fullName || 'Assigned Staff';
              
              return (
                <div key={record.id} className="col-12">
                  <div className="card border-0 bg-light" style={{ borderRadius: '10px', transition: 'all 0.2s' }}>
                    <div className="card-body" style={{ padding: '20px' }}>
                      <div className="d-flex justify-content-between align-items-start mb-2">
                        <h6 className="fw-bold text-danger mb-0" style={{ fontSize: '16px' }}>
                          {record.diagnosis || 'General Medical Consultation'}
                        </h6>
                        <small className="text-muted font-monospace">
                          #{record.id}
                        </small>
                      </div>
                      
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', marginTop: '12px' }}>
                        <p className="small mb-0" style={{ color: '#475569' }}>
                          <strong style={{ color: '#1e293b' }}>Patient:</strong> {displayPatientName}
                        </p>
                        <p className="small mb-0" style={{ color: '#475569' }}>
                          <strong style={{ color: '#1e293b' }}>Doctor:</strong> {formatDoctorName(rawDoctorName)}
                        </p>
                        {record.prescription && (
                          <p className="small mb-0" style={{ color: '#475569' }}>
                            <strong style={{ color: '#1e293b' }}>Prescription:</strong> {record.prescription}
                          </p>
                        )}
                        {record.notes && (
                          <p className="small mb-0" style={{ color: '#475569' }}>
                            <strong style={{ color: '#1e293b' }}>Notes:</strong> {record.notes}
                          </p>
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
    </div>
  );
}

export default AllRecords;