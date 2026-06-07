import React, { useState, useEffect } from 'react';
import { getAllAppointments } from '../../services/appointmentService';
import {
  updateAppointmentStatusAdmin,
  assignDoctor,
  getAllDoctors
} from '../../services/adminService';
import { formatDoctorName } from '../../utils/helpers';

function AllAppointments({ onStatusChange }) {

  const [appointments, setAppointments] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [assigningId, setAssigningId] = useState(null);
  const [selectedDoctorId, setSelectedDoctorId] = useState('');
  const [filter, setFilter] = useState('ALL');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [aptsData, docsData] = await Promise.all([
        getAllAppointments(),
        getAllDoctors()
      ]);

      // Sort newest first by ID
      const sortedApts = Array.isArray(aptsData)
        ? [...aptsData].sort((a, b) => b.id - a.id)
        : [];

      setAppointments(sortedApts);
      setDoctors(Array.isArray(docsData) ? docsData : []);
    } catch (err) {
      console.error('Error loading data:', err);
    } finally {
      setLoading(false);
    }
  };

  // Filtered appointments
  const filteredAppointments = filter === 'ALL'
    ? appointments
    : appointments.filter(apt => apt.status === filter);

    const handleStatusUpdate = async (id, status) => {
      try {
        await updateAppointmentStatusAdmin(id, status);
        setMessage(`Appointment ${status} successfully!`);

        // Reload and re-sort
        const [aptsData, docsData] = await Promise.all([
          getAllAppointments(),
          getAllDoctors()
        ]);
        const sortedApts = Array.isArray(aptsData)
          ? [...aptsData].sort((a, b) => b.id - a.id)
          : [];
        setAppointments(sortedApts);
        setDoctors(
          Array.isArray(docsData) ? docsData : []
        );

        if (onStatusChange) onStatusChange();
        setTimeout(() => setMessage(''), 3000);
      } catch (err) {
        setError('Failed to update appointment!');
        setTimeout(() => setError(''), 3000);
      }
    };

    const handleAssignDoctor = async (appointmentId) => {
      if (!selectedDoctorId) {
        setError('Please select a doctor first!');
        return;
      }
      try {
        await assignDoctor(appointmentId, selectedDoctorId);
        setMessage('Doctor assigned successfully!');
        setAssigningId(null);
        setSelectedDoctorId('');

        // Reload and re-sort
        const [aptsData, docsData] = await Promise.all([
          getAllAppointments(),
          getAllDoctors()
        ]);
        const sortedApts = Array.isArray(aptsData)
          ? [...aptsData].sort((a, b) => b.id - a.id)
          : [];
        setAppointments(sortedApts);
        setDoctors(
          Array.isArray(docsData) ? docsData : []
        );

        if (onStatusChange) onStatusChange();
        setTimeout(() => setMessage(''), 3000);
      } catch (err) {
        setError('Failed to assign doctor!');
        setTimeout(() => setError(''), 3000);
      }
    };

  const getStatusBadge = (status) => {
    const colors = {
      'UNASSIGNED': 'secondary',
      'PENDING': 'warning',
      'CONFIRMED': 'success',
      'CANCELLED': 'danger',
      'COMPLETED': 'primary'
    };
    return colors[status] || 'secondary';
  };

  if (loading) {
    return (
      <div className="text-center py-5">
        <div className="spinner-border text-danger"
             role="status">
        </div>
        <p className="mt-2 text-muted">
          Loading appointments...
        </p>
      </div>
    );
  }

  return (
    <div className="card shadow-sm">

      {/* Header */}
      <div className="card-header bg-white py-3">
        <div className="d-flex justify-content-between
                        align-items-center mb-3">
          <h5 className="mb-0 fw-bold">
            📅 All Appointments
          </h5>
          <span className="badge bg-danger">
            {appointments.length} Total
          </span>
        </div>

        {/* Filter Buttons */}
        <div className="d-flex gap-2 flex-wrap">
          <button
            className={`btn btn-sm ${filter === 'ALL'
              ? 'btn-danger' : 'btn-outline-danger'}`}
            onClick={() => setFilter('ALL')}>
            All ({appointments.length})
          </button>

          <button
            className={`btn btn-sm ${filter === 'UNASSIGNED'
              ? 'btn-secondary'
              : 'btn-outline-secondary'}`}
            onClick={() => setFilter('UNASSIGNED')}>
            ⚠️ Unassigned
            {appointments.filter(
              a => a.status === 'UNASSIGNED'
            ).length > 0 && (
              <span className="badge bg-warning
                               ms-1 text-dark">
                {appointments.filter(
                  a => a.status === 'UNASSIGNED'
                ).length}
              </span>
            )}
          </button>

          <button
            className={`btn btn-sm ${filter === 'PENDING'
              ? 'btn-warning' : 'btn-outline-warning'}`}
            onClick={() => setFilter('PENDING')}>
            Pending
          </button>

          <button
            className={`btn btn-sm ${filter === 'CONFIRMED'
              ? 'btn-success' : 'btn-outline-success'}`}
            onClick={() => setFilter('CONFIRMED')}>
            Confirmed
          </button>

          <button
            className={`btn btn-sm ${filter === 'COMPLETED'
              ? 'btn-primary' : 'btn-outline-primary'}`}
            onClick={() => setFilter('COMPLETED')}>
            Completed
          </button>

          <button
            className={`btn btn-sm ${filter === 'CANCELLED'
              ? 'btn-danger' : 'btn-outline-danger'}`}
            onClick={() => setFilter('CANCELLED')}>
            Cancelled
          </button>
        </div>
      </div>

      <div className="card-body">

        {message && (
          <div className="alert alert-success">
            {message}
          </div>
        )}
        {error && (
          <div className="alert alert-danger">{error}</div>
        )}

        {filteredAppointments.length === 0 ? (
          <div className="text-center py-5">
            <div style={{ fontSize: '64px' }}>📅</div>
            <h5 className="mt-3 text-muted">
              No {filter === 'ALL' ? '' : filter} Appointments
            </h5>
          </div>
        ) : (
          <div className="row g-3">
            {filteredAppointments.map(apt => (
              <div key={apt.id} className="col-12">
                <div className="card border-0 bg-light">
                  <div className="card-body">

                    {/* Header */}
                    <div className="d-flex
                                    justify-content-between
                                    align-items-start mb-3">
                      <div>
                        <span className="fw-bold me-2">
                          Appointment #{apt.id}
                        </span>
                        <span className={`badge
                          bg-${getStatusBadge(apt.status)}`}>
                          {apt.status}
                        </span>
                        {!apt.doctorAssigned && (
                          <span className="badge
                                           bg-warning
                                           text-dark ms-1">
                            ⚠️ Needs Doctor
                          </span>
                        )}
                      </div>
                      <small className="text-muted">
                        {apt.appointmentDate} at{' '}
                        {apt.appointmentTime}
                      </small>
                    </div>

                    {/* Patient and Doctor */}
                    <div className="row g-2 mb-3">
                      <div className="col-md-6">
                        <div className="p-2 bg-white rounded">
                          <small className="text-muted">
                            Patient
                          </small>
                          <div className="fw-semibold">
                            {apt.patientName}
                          </div>
                          <small className="text-muted">
                            ID: #{apt.patientId}
                          </small>
                        </div>
                      </div>
                      <div className="col-md-6">
                        <div className="p-2 bg-white rounded">
                          <small className="text-muted">
                            Doctor
                          </small>
                          <div className="fw-semibold">
                            {apt.doctorAssigned ? (
                              formatDoctorName(apt.doctorName)
                            ) : (
                              <span className="text-warning">
                                ⏳ Not Assigned Yet
                              </span>
                            )}
                          </div>
                          {apt.doctorAssigned && (
                            <small className="text-muted">
                              ID: #{apt.doctorId}
                            </small>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Problem Description */}
                    {apt.notes && (
                      <div className="p-2 bg-white rounded mb-3">
                        <small className="text-muted">
                          📝 Problem Description:
                        </small>
                        <p className="small mb-0 mt-1">
                          {apt.notes}
                        </p>
                      </div>
                    )}

                    {/* Actions */}
                    <div className="d-flex flex-wrap gap-2">

                      {/* Confirm/Cancel for PENDING */}
                      {apt.status === 'PENDING' && (
                        <>
                          <button
                            className="btn btn-sm btn-success"
                            onClick={() =>
                              handleStatusUpdate(
                                apt.id, 'CONFIRMED'
                              )
                            }>
                            ✓ Confirm
                          </button>
                          <button
                            className="btn btn-sm btn-danger"
                            onClick={() =>
                              handleStatusUpdate(
                                apt.id, 'CANCELLED'
                              )
                            }>
                            ✗ Cancel
                          </button>
                        </>
                      )}

                      {/* Complete for CONFIRMED */}
                      {apt.status === 'CONFIRMED' && (
                        <button
                          className="btn btn-sm btn-secondary"
                          onClick={() =>
                            handleStatusUpdate(
                              apt.id, 'COMPLETED'
                            )
                          }>
                          ✓ Mark Complete
                        </button>
                      )}

                      {/* Confirm for UNASSIGNED after
                          doctor is assigned */}
                      {apt.status === 'UNASSIGNED' && (
                        <button
                          className="btn btn-sm btn-danger"
                          onClick={() =>
                            handleStatusUpdate(
                              apt.id, 'CANCELLED'
                            )
                          }>
                          ✗ Cancel Request
                        </button>
                      )}

                      {/* Assign Doctor Button */}
                      {apt.status !== 'CANCELLED' &&
                       apt.status !== 'COMPLETED' && (
                        <button
                          className="btn btn-sm btn-outline-primary"
                          onClick={() => {
                            setAssigningId(
                              assigningId === apt.id
                                ? null : apt.id
                            );
                            setSelectedDoctorId('');
                          }}>
                          👨‍⚕️ {apt.doctorAssigned
                            ? 'Change Doctor'
                            : 'Assign Doctor'}
                        </button>
                      )}

                    </div>

                    {/* Assign Doctor Panel */}
                    {assigningId === apt.id && (
                      <div className="mt-3 p-3 bg-white
                                      rounded border
                                      border-primary">
                        <label className="form-label
                                          small fw-semibold">
                          Select Doctor to Assign
                        </label>
                        <div className="d-flex gap-2">
                          <select
                            className="form-select
                                       form-select-sm"
                            value={selectedDoctorId}
                            onChange={(e) =>
                              setSelectedDoctorId(e.target.value)
                            }>
                            <option value="">
                              -- Select Doctor --
                            </option>
                            {doctors.map(doc => (
                              <option
                                key={doc.id}
                                value={doc.id}>
                                {formatDoctorName(doc.fullName)}
                                {doc.specialization
                                  ? ` — ${doc.specialization}`
                                  : ''}
                              </option>
                            ))}
                          </select>
                          <button
                            className="btn btn-sm btn-primary"
                            onClick={() =>
                              handleAssignDoctor(apt.id)
                            }>
                            Assign
                          </button>
                          <button
                            className="btn btn-sm
                                       btn-secondary"
                            onClick={() =>
                              setAssigningId(null)
                            }>
                            Cancel
                          </button>
                        </div>
                      </div>
                    )}

                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}

export default AllAppointments;