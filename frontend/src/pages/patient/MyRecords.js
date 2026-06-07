import React, { useState, useEffect } from 'react';
import { getMyRecords } from '../../services/medicalRecordService';
import { formatDoctorName } from '../../utils/helpers';

// Timing options for display
const timingOptions = [
  { id: 'morning', label: '🌅 Morning' },
  { id: 'afternoon', label: '☀️ Afternoon' },
  { id: 'evening', label: '🌆 Evening' },
  { id: 'night', label: '🌙 Night' },
  { id: 'beforeMeal', label: '🍽️ Before Meal' },
  { id: 'afterMeal', label: '🍛 After Meal' },
  { id: 'withMeal', label: '🥗 With Meal' },
  { id: 'empty', label: '⭕ Empty Stomach' },
  { id: 'bedtime', label: '🛏️ Bedtime' },
  { id: 'sos', label: '🚨 SOS' },
];

function MyRecords() {

  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadRecords();
  }, []);

  const loadRecords = async () => {
    try {
      const data = await getMyRecords();
      setRecords(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Records error:', err);
      setRecords([]);
    } finally {
      setLoading(false);
    }
  };

  // Parse medicine schedule from JSON
  const parseMedicineSchedule = (scheduleJson) => {
    if (!scheduleJson) return [];
    try {
      return JSON.parse(scheduleJson);
    } catch (e) {
      return [];
    }
  };

  if (loading) {
    return (
      <div className="text-center py-5">
        <div className="spinner-border text-primary"
             role="status">
        </div>
        <p className="mt-2 text-muted">Loading records...</p>
      </div>
    );
  }

  return (
    <div className="card shadow-sm">
      <div className="card-header bg-white py-3 d-flex
                      justify-content-between align-items-center">
        <h5 className="mb-0 fw-bold">My Medical Records</h5>
        <span className="badge bg-primary">
          {records.length} Total
        </span>
      </div>

      <div className="card-body">
        {records.length === 0 ? (
          <div className="text-center py-5">
            <div style={{ fontSize: '64px' }}>🗂️</div>
            <h5 className="mt-3 text-muted">
              No Medical Records Yet
            </h5>
            <p className="text-muted">
              Your medical records will appear here after
              your doctor adds them
            </p>
          </div>
        ) : (
          <div className="row g-3">
            {records.map(record => {
              const medicines = parseMedicineSchedule(
                record.medicineSchedule
              );
              return (
                <div key={record.id} className="col-12">
                  <div className="card border-0 bg-light">
                    <div className="card-body">

                      {/* Header */}
                      <div className="d-flex
                                      justify-content-between
                                      align-items-start mb-3">
                        <h6 className="fw-bold text-primary mb-0">
                          🔬 {record.diagnosis}
                        </h6>
                        <small className="text-muted">
                          {record.createdAt
                            ? new Date(record.createdAt)
                                .toLocaleDateString()
                            : ''}
                        </small>
                      </div>

                      {/* Doctor */}
                      <p className="text-muted small mb-2">
                        <strong>Doctor:</strong>{' '}
                        {formatDoctorName(record.doctorName)}
                      </p>

                      {/* Medicine Schedule */}
                      {medicines.length > 0 && (
                        <div className="mb-3">
                          <p className="fw-semibold small mb-2">
                            💊 Prescribed Medicines:
                          </p>
                          {medicines.map((med, idx) => (
                            <div
                              key={idx}
                              className="card border mb-2">
                              <div className="card-body p-2">

                                {/* Medicine name and dosage */}
                                <div className="d-flex
                                                justify-content-between
                                                mb-1">
                                  <span className="fw-semibold">
                                    {med.name}
                                    {med.dosage && (
                                      <span className="text-muted ms-1">
                                        ({med.dosage})
                                      </span>
                                    )}
                                  </span>
                                  {med.duration && (
                                    <span className="badge
                                                     bg-info
                                                     text-dark">
                                      ⏱️ {med.duration}
                                    </span>
                                  )}
                                </div>

                                {/* Timing badges */}
                                {med.timings &&
                                 med.timings.length > 0 && (
                                  <div className="d-flex
                                                  flex-wrap
                                                  gap-1 mb-1">
                                    {med.timings.map(
                                      timingId => {
                                        const timing =
                                          timingOptions.find(
                                            t => t.id === timingId
                                          );
                                        return timing ? (
                                          <span
                                            key={timingId}
                                            className="badge
                                                       bg-success">
                                            {timing.label}
                                          </span>
                                        ) : null;
                                      }
                                    )}
                                  </div>
                                )}

                                {/* Special note */}
                                {med.specialNote && (
                                  <small className="text-danger">
                                    ⚠️ {med.specialNote}
                                  </small>
                                )}

                              </div>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Notes */}
                      {record.notes && (
                        <p className="small mb-1">
                          <strong>Doctor Notes:</strong>{' '}
                          {record.notes}
                        </p>
                      )}

                      {/* Lab Results */}
                      {record.labResults && (
                        <p className="small mb-0">
                          <strong>Lab Results:</strong>{' '}
                          {record.labResults}
                        </p>
                      )}

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

export default MyRecords;