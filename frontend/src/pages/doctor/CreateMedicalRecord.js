import React, { useState, useEffect } from 'react';
import { createRecord } from '../../services/medicalRecordService';
import { getAllPatients } from '../../services/adminService';

// Medicine timing options
const timingOptions = [
  { id: 'morning', label: '🌅 Morning', time: 'Before 12 PM' },
  { id: 'afternoon', label: '☀️ Afternoon', time: '12 PM - 4 PM' },
  { id: 'evening', label: '🌆 Evening', time: '4 PM - 8 PM' },
  { id: 'night', label: '🌙 Night', time: 'After 8 PM' },
  { id: 'beforeMeal', label: '🍽️ Before Meal', time: '30 min before' },
  { id: 'afterMeal', label: '🍛 After Meal', time: '30 min after' },
  { id: 'withMeal', label: '🥗 With Meal', time: 'During meal' },
  { id: 'empty', label: '⭕ Empty Stomach', time: 'No food' },
  { id: 'bedtime', label: '🛏️ Bedtime', time: 'Before sleep' },
  { id: 'sos', label: '🚨 SOS', time: 'When needed' },
];

// Empty medicine template
const emptyMedicine = {
  name: '',
  dosage: '',
  duration: '',
  timings: [],
  specialNote: ''
};

function CreateMedicalRecord() {

  const [patients, setPatients] = useState([]);
  const [formData, setFormData] = useState({
    patientId: '',
    diagnosis: '',
    notes: '',
    labResults: ''
  });

  // Medicines list
  const [medicines, setMedicines] = useState([
    { ...emptyMedicine }
  ]);

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadPatients();
  }, []);

  const loadPatients = async () => {
    try {
      const data = await getAllPatients();
      setPatients(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Error loading patients:', err);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  // Add new medicine row
  const addMedicine = () => {
    setMedicines([...medicines, { ...emptyMedicine }]);
  };

  // Remove medicine row
  const removeMedicine = (index) => {
    setMedicines(medicines.filter((_, i) => i !== index));
  };

  // Update medicine field
  const updateMedicine = (index, field, value) => {
    const updated = medicines.map((med, i) => {
      if (i === index) {
        return { ...med, [field]: value };
      }
      return med;
    });
    setMedicines(updated);
  };

  // Toggle medicine timing checkbox
  const toggleTiming = (index, timingId) => {
    const medicine = medicines[index];
    const timings = medicine.timings.includes(timingId)
      ? medicine.timings.filter(t => t !== timingId)
      : [...medicine.timings, timingId];
    updateMedicine(index, 'timings', timings);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // Validate
    if (!formData.patientId) {
      setError('Please select a patient!');
      return;
    }

    if (!formData.diagnosis.trim()) {
      setError('Diagnosis is required!');
      return;
    }

    setLoading(true);

    try {
      // Build prescription from medicines
      const validMedicines = medicines.filter(
        med => med.name && med.name.trim()
      );

      let prescriptionText = '';
      if (validMedicines.length > 0) {
        prescriptionText = validMedicines
          .map(med => {
            const timingLabels = (med.timings || [])
              .map(t => {
                const opt = timingOptions.find(
                  o => o.id === t
                );
                return opt ? opt.label : t;
              })
              .join(', ');

            return `${med.name}${
              med.dosage ? ` (${med.dosage})` : ''
            }${
              med.duration ? ` - ${med.duration}` : ''
            }${
              timingLabels ? ` [${timingLabels}]` : ''
            }${
              med.specialNote
                ? ` Note: ${med.specialNote}`
                : ''
            }`;
          })
          .join('\n');
      }

      // Save medicines as JSON string
      let medicineScheduleJson = null;
      if (validMedicines.length > 0) {
        try {
          medicineScheduleJson =
            JSON.stringify(validMedicines);
        } catch (jsonErr) {
          console.error('JSON error:', jsonErr);
          medicineScheduleJson = null;
        }
      }

      const recordData = {
        patientId: parseInt(formData.patientId),
        diagnosis: formData.diagnosis.trim(),
        prescription: prescriptionText || null,
        medicineSchedule: medicineScheduleJson,
        notes: formData.notes || null,
        labResults: formData.labResults || null
      };

      console.log('Creating record:', recordData);

      await createRecord(recordData);

      setSuccess(
        'Medical record created successfully!'
      );

      // Reset form
      setFormData({
        patientId: '',
        diagnosis: '',
        notes: '',
        labResults: ''
      });
      setMedicines([{ ...emptyMedicine }]);

    } catch (err) {
      console.error('Create record error:', err);
      const msg =
        err.response?.data?.message ||
        err.response?.data?.error ||
        err.message ||
        'Failed to create medical record!';
      setError(String(msg));
    } finally {
      setLoading(false);
    }
  };

  // Get selected patient
  const selectedPatient = patients.find(
    p => p.id === parseInt(formData.patientId)
  );

  return (
    <div className="card shadow-sm">
      <div className="card-header bg-white py-3">
        <h5 className="mb-0 fw-bold">
          📋 Create Medical Record
        </h5>
      </div>

      <div className="card-body p-4">

        {error && (
          <div className="alert alert-danger">{error}</div>
        )}
        {success && (
          <div className="alert alert-success">{success}</div>
        )}

        <form onSubmit={handleSubmit}>

          {/* Patient Selection */}
          <div className="mb-3">
            <label className="form-label fw-semibold">
              Select Patient
            </label>
            <select
              className="form-select"
              name="patientId"
              value={formData.patientId}
              onChange={handleChange}
              required>
              <option value="">-- Select a Patient --</option>
              {patients.map(patient => (
                <option key={patient.id} value={patient.id}>
                  {patient.fullName}
                </option>
              ))}
            </select>
          </div>

          {/* Selected Patient Info */}
          {selectedPatient && (
            <div className="alert alert-info py-2 mb-3">
              <div className="d-flex align-items-center gap-2">
                <div
                  className="rounded-circle bg-primary
                              d-inline-flex align-items-center
                              justify-content-center"
                  style={{
                    width: '35px',
                    height: '35px',
                    minWidth: '35px'
                  }}>
                  <span className="text-white fw-bold">
                    {selectedPatient.fullName?.charAt(0)}
                  </span>
                </div>
                <div>
                  <div className="fw-semibold">
                    {selectedPatient.fullName}
                    <small className="text-muted ms-2">
                      ID: #{selectedPatient.id}
                    </small>
                  </div>
                  <small className="text-muted">
                    📧 {selectedPatient.email}
                    {selectedPatient.bloodGroup && (
                      <> | 🩸 {selectedPatient.bloodGroup}</>
                    )}
                    {selectedPatient.age && (
                      <> | 🎂 {selectedPatient.age} yrs</>
                    )}
                  </small>
                </div>
              </div>
            </div>
          )}

          {/* Diagnosis */}
          <div className="mb-3">
            <label className="form-label fw-semibold">
              Diagnosis
              <span className="text-danger ms-1">*</span>
            </label>
            <input
              type="text"
              className="form-control"
              name="diagnosis"
              placeholder="Enter diagnosis"
              value={formData.diagnosis}
              onChange={handleChange}
              required
            />
          </div>

          {/* Prescription with Medicine Checkboxes */}
          <div className="mb-3">
            <div className="d-flex justify-content-between
                            align-items-center mb-2">
              <label className="form-label fw-semibold mb-0">
                💊 Prescription / Medicines
              </label>
              <button
                type="button"
                className="btn btn-sm btn-outline-success"
                onClick={addMedicine}>
                + Add Medicine
              </button>
            </div>

            {medicines.map((medicine, index) => (
              <div
                key={index}
                className="card border mb-3">
                <div className="card-body p-3">

                  {/* Medicine Header */}
                  <div className="d-flex justify-content-between
                                  align-items-center mb-2">
                    <span className="fw-semibold text-primary">
                      Medicine #{index + 1}
                    </span>
                    {medicines.length > 1 && (
                      <button
                        type="button"
                        className="btn btn-sm btn-outline-danger"
                        onClick={() => removeMedicine(index)}>
                        🗑️ Remove
                      </button>
                    )}
                  </div>

                  <div className="row g-2 mb-3">

                    {/* Medicine Name */}
                    <div className="col-md-4">
                      <label className="form-label small
                                        fw-semibold">
                        Medicine Name *
                      </label>
                      <input
                        type="text"
                        className="form-control form-control-sm"
                        placeholder="e.g. Paracetamol"
                        value={medicine.name}
                        onChange={(e) =>
                          updateMedicine(
                            index, 'name', e.target.value
                          )
                        }
                      />
                    </div>

                    {/* Dosage */}
                    <div className="col-md-4">
                      <label className="form-label small
                                        fw-semibold">
                        Dosage
                      </label>
                      <input
                        type="text"
                        className="form-control form-control-sm"
                        placeholder="e.g. 500mg"
                        value={medicine.dosage}
                        onChange={(e) =>
                          updateMedicine(
                            index, 'dosage', e.target.value
                          )
                        }
                      />
                    </div>

                    {/* Duration */}
                    <div className="col-md-4">
                      <label className="form-label small
                                        fw-semibold">
                        Duration
                      </label>
                      <select
                        className="form-select form-select-sm"
                        value={medicine.duration}
                        onChange={(e) =>
                          updateMedicine(
                            index, 'duration', e.target.value
                          )
                        }>
                        <option value="">Select duration</option>
                        <option value="1 day">1 day</option>
                        <option value="3 days">3 days</option>
                        <option value="5 days">5 days</option>
                        <option value="7 days">7 days</option>
                        <option value="10 days">10 days</option>
                        <option value="14 days">14 days</option>
                        <option value="1 month">1 month</option>
                        <option value="2 months">2 months</option>
                        <option value="3 months">3 months</option>
                        <option value="Ongoing">Ongoing</option>
                        <option value="As needed">As needed</option>
                      </select>
                    </div>

                  </div>

                  {/* Timing Checkboxes */}
                  <div className="mb-2">
                    <label className="form-label small
                                      fw-semibold">
                      When to Take:
                    </label>
                    <div className="row g-2">
                      {timingOptions.map(timing => (
                        <div
                          key={timing.id}
                          className="col-6 col-md-4 col-lg-3">
                          <div
                            className={`p-2 rounded border
                              text-center cursor-pointer
                              ${medicine.timings.includes(
                                timing.id
                              )
                                ? 'bg-success text-white border-success'
                                : 'bg-white'}`}
                            style={{ cursor: 'pointer' }}
                            onClick={() =>
                              toggleTiming(index, timing.id)
                            }>
                            <div className="small fw-semibold">
                              {timing.label}
                            </div>
                            <div
                              className="small opacity-75"
                              style={{ fontSize: '10px' }}>
                              {timing.time}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Special Note */}
                  <div>
                    <label className="form-label small
                                      fw-semibold">
                      Special Note (Optional)
                    </label>
                    <input
                      type="text"
                      className="form-control form-control-sm"
                      placeholder="e.g. Do not take with milk"
                      value={medicine.specialNote}
                      onChange={(e) =>
                        updateMedicine(
                          index,
                          'specialNote',
                          e.target.value
                        )
                      }
                    />
                  </div>

                </div>
              </div>
            ))}
          </div>

          {/* Notes */}
          <div className="mb-3">
            <label className="form-label fw-semibold">
              Doctor Notes
            </label>
            <textarea
              className="form-control"
              name="notes"
              rows="3"
              placeholder="Additional notes for the patient"
              value={formData.notes}
              onChange={handleChange}
            />
          </div>

          {/* Lab Results */}
          <div className="mb-4">
            <label className="form-label fw-semibold">
              Lab Results
            </label>
            <textarea
              className="form-control"
              name="labResults"
              rows="2"
              placeholder="Enter lab results if any"
              value={formData.labResults}
              onChange={handleChange}
            />
          </div>

          <button
            type="submit"
            className="btn btn-success btn-lg w-100"
            disabled={loading}>
            {loading ? (
              <span>
                <span className="spinner-border
                                 spinner-border-sm me-2">
                </span>
                Creating...
              </span>
            ) : (
              '📋 Create Medical Record'
            )}
          </button>

        </form>
      </div>
    </div>
  );
}

export default CreateMedicalRecord;