import React, { useState, useEffect } from 'react';
import {
    addLeave,
    getMyLeaves,
    cancelLeave
} from '../../services/doctorLeaveService';
import { showToast } from '../../components/Toast';
import ConfirmDialog from
    '../../components/ConfirmDialog';

function DoctorLeaveCalendar() {

    // All upcoming leaves from database
    const [leaves, setLeaves] = useState([]);

    // Loading state for the list
    const [loading, setLoading] = useState(true);

    // Loading state for add button
    const [adding, setAdding] = useState(false);

    // Form fields
    const [leaveDate, setLeaveDate] = useState('');
    const [reason, setReason] = useState('');

    // Form error messages
    const [dateError, setDateError] = useState('');

    // Confirm dialog for cancel
    const [confirmDialog, setConfirmDialog] =
        useState({
            isOpen: false,
            leaveId: null,
            leaveDate: ''
        });

    // Load leaves when page opens
    useEffect(() => {
        loadLeaves();
    }, []);

    // Fetch all upcoming leaves from backend
    const loadLeaves = async () => {
        try {
            setLoading(true);
            const data = await getMyLeaves();
            // Sort by date ascending
            // nearest leave shown first
            const sorted = Array.isArray(data)
                ? [...data].sort((a, b) =>
                    new Date(a.leaveDate) -
                    new Date(b.leaveDate)
                )
                : [];
            setLeaves(sorted);
        } catch (err) {
            console.error('Error loading leaves:', err);
            showToast(
                'Failed to load leaves!',
                'error'
            );
        } finally {
            setLoading(false);
        }
    };

    // Validate and submit new leave
    const handleAddLeave = async () => {
        setDateError('');

        // Validation 1 — date must be selected
        if (!leaveDate) {
            setDateError(
                'Please select a leave date!'
            );
            return;
        }

        // Validation 2 — date cannot be in the past
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const selected = new Date(leaveDate);

        if (selected < today) {
            setDateError(
                'Cannot add leave for past dates!'
            );
            return;
        }

        // Validation 3 — check if already in list
        const alreadyExists = leaves.some(
            leave => leave.leaveDate === leaveDate
        );

        if (alreadyExists) {
            setDateError(
                'You already have leave on ' +
                formatDate(leaveDate) + '!'
            );
            return;
        }

        setAdding(true);
        try {
            await addLeave(leaveDate, reason);
            showToast(
                'Leave added for ' +
                formatDate(leaveDate) + '!',
                'success'
            );
            // Reset form
            setLeaveDate('');
            setReason('');
            // Reload the list
            loadLeaves();
        } catch (err) {
            const msg =
                err.response?.data?.message ||
                'Failed to add leave!';
            showToast(msg, 'error');
        } finally {
            setAdding(false);
        }
    };

    // Open confirm dialog before cancelling
    const handleCancelClick = (leave) => {
        setConfirmDialog({
            isOpen: true,
            leaveId: leave.id,
            leaveDate: leave.leaveDate
        });
    };

    // Actually cancel the leave after confirmation
    const handleConfirmCancel = async () => {
        try {
            await cancelLeave(confirmDialog.leaveId);
            showToast(
                'Leave on ' +
                formatDate(confirmDialog.leaveDate) +
                ' cancelled!',
                'success'
            );
            setConfirmDialog({
                isOpen: false,
                leaveId: null,
                leaveDate: ''
            });
            loadLeaves();
        } catch (err) {
            const msg =
                err.response?.data?.message ||
                'Failed to cancel leave!';
            showToast(msg, 'error');
        }
    };

    // Format date for display
    // "2026-06-25" becomes "June 25, 2026"
    const formatDate = (dateStr) => {
        if (!dateStr) return '';
        const date = new Date(dateStr + 'T00:00:00');
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    // How many days until this leave
    const getDaysUntil = (dateStr) => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const leaveDay =
            new Date(dateStr + 'T00:00:00');
        const diff = Math.ceil(
            (leaveDay - today) /
            (1000 * 60 * 60 * 24)
        );
        if (diff === 0) return 'Today';
        if (diff === 1) return 'Tomorrow';
        return 'In ' + diff + ' days';
    };

    // Get today's date in YYYY-MM-DD format
    // for the min attribute of date picker
    const getTodayString = () => {
        const today = new Date();
        const year = today.getFullYear();
        const month = String(
            today.getMonth() + 1
        ).padStart(2, '0');
        const day = String(
            today.getDate()
        ).padStart(2, '0');
        return year + '-' + month + '-' + day;
    };

    // Reason options for dropdown
    const reasonOptions = [
        'Personal',
        'Medical',
        'Family Emergency',
        'Training / Conference',
        'Holiday',
        'Other'
    ];

    return (
        <div>

            {/* Confirm Cancel Dialog */}
            <ConfirmDialog
                isOpen={confirmDialog.isOpen}
                title="Cancel Leave?"
                message={
                    'Are you sure you want to cancel ' +
                    'your leave on ' +
                    formatDate(confirmDialog.leaveDate) +
                    '? Patients will be able to book ' +
                    'appointments on this date again.'
                }
                confirmText="Yes, Cancel Leave"
                cancelText="Keep Leave"
                confirmColor="#ef4444"
                onConfirm={handleConfirmCancel}
                onCancel={() => setConfirmDialog({
                    isOpen: false,
                    leaveId: null,
                    leaveDate: ''
                })}
            />

            {/* Page Header */}
            <div style={{ marginBottom: '24px' }}>
                <h4 style={{
                    fontWeight: '700',
                    color: '#1e293b',
                    margin: '0 0 4px'
                }}>
                    My Leave Calendar
                </h4>
                <p style={{
                    color: '#64748b',
                    margin: 0,
                    fontSize: '14px'
                }}>
                    Mark dates when you are not
                    available. Patients cannot book
                    appointments on these dates.
                </p>
            </div>

            {/* Add Leave Card */}
            <div style={{
                background: 'white',
                borderRadius: '16px',
                padding: '24px',
                marginBottom: '24px',
                boxShadow:
                    '0 2px 10px rgba(0,0,0,0.05)',
                border: '1px solid #f1f5f9'
            }}>

                <h5 style={{
                    fontWeight: '700',
                    color: '#1e293b',
                    margin: '0 0 20px',
                    fontSize: '15px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                }}>
                    Add New Leave Date
                </h5>

                <div style={{
                    display: 'grid',
                    gridTemplateColumns:
                        '1fr 1fr auto',
                    gap: '16px',
                    alignItems: 'flex-end'
                }}>

                    {/* Date Picker */}
                    <div>
                        <label style={{
                            display: 'block',
                            fontSize: '13px',
                            fontWeight: '600',
                            color: '#374151',
                            marginBottom: '6px'
                        }}>
                            Leave Date
                            <span style={{
                                color: '#ef4444'
                            }}>
                                {' '}*
                            </span>
                        </label>
                        <input
                            type="date"
                            value={leaveDate}
                            min={getTodayString()}
                            onChange={(e) => {
                                setLeaveDate(
                                    e.target.value
                                );
                                setDateError('');
                            }}
                            style={{
                                width: '100%',
                                padding: '10px 14px',
                                border: dateError
                                    ? '1px solid #ef4444'
                                    : '1px solid #e2e8f0',
                                borderRadius: '10px',
                                fontSize: '14px',
                                outline: 'none',
                                boxSizing: 'border-box',
                                background: 'white'
                            }}
                        />
                        {dateError && (
                            <p style={{
                                color: '#ef4444',
                                fontSize: '12px',
                                margin: '4px 0 0'
                            }}>
                                {dateError}
                            </p>
                        )}
                    </div>

                    {/* Reason Dropdown */}
                    <div>
                        <label style={{
                            display: 'block',
                            fontSize: '13px',
                            fontWeight: '600',
                            color: '#374151',
                            marginBottom: '6px'
                        }}>
                            Reason
                            <span style={{
                                color: '#94a3b8',
                                fontWeight: '400'
                            }}>
                                {' '}(Optional)
                            </span>
                        </label>
                        <select
                            value={reason}
                            onChange={(e) =>
                                setReason(e.target.value)
                            }
                            style={{
                                width: '100%',
                                padding: '10px 14px',
                                border:
                                    '1px solid #e2e8f0',
                                borderRadius: '10px',
                                fontSize: '14px',
                                outline: 'none',
                                background: 'white',
                                cursor: 'pointer',
                                boxSizing: 'border-box'
                            }}>
                            <option value="">
                                Select reason...
                            </option>
                            {reasonOptions.map(
                                (opt, i) => (
                                    <option
                                        key={i}
                                        value={opt}>
                                        {opt}
                                    </option>
                                )
                            )}
                        </select>
                    </div>

                    {/* Add Button */}
                    <button
                        onClick={handleAddLeave}
                        disabled={adding}
                        style={{
                            padding: '10px 24px',
                            border: 'none',
                            borderRadius: '10px',
                            background: adding
                                ? '#a7f3d0'
                                : 'linear-gradient(' +
                                  '135deg, #10b981, ' +
                                  '#059669)',
                            color: 'white',
                            fontSize: '14px',
                            fontWeight: '600',
                            cursor: adding
                                ? 'not-allowed'
                                : 'pointer',
                            boxShadow: adding
                                ? 'none'
                                : '0 4px 12px rgba(' +
                                  '16,185,129,0.3)',
                            whiteSpace: 'nowrap',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            height: '42px'
                        }}>
                        {adding ? (
                            <>
                                <span
                                    className="spinner-border spinner-border-sm"
                                />
                                Adding...
                            </>
                        ) : (
                            '+ Add Leave'
                        )}
                    </button>
                </div>
            </div>

            {/* Leaves List */}
            <div style={{
                background: 'white',
                borderRadius: '16px',
                padding: '24px',
                boxShadow:
                    '0 2px 10px rgba(0,0,0,0.05)',
                border: '1px solid #f1f5f9'
            }}>

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
                        fontSize: '15px'
                    }}>
                        Upcoming Leaves
                    </h5>

                    {/* Count Badge */}
                    {leaves.length > 0 && (
                        <span style={{
                            background: '#fee2e2',
                            color: '#dc2626',
                            padding: '3px 12px',
                            borderRadius: '20px',
                            fontSize: '12px',
                            fontWeight: '700'
                        }}>
                            {leaves.length} leave
                            {leaves.length > 1
                                ? 's' : ''}
                        </span>
                    )}
                </div>

                {/* Loading State */}
                {loading ? (
                    <div style={{
                        textAlign: 'center',
                        padding: '40px',
                        color: '#64748b'
                    }}>
                        <div
                            className="spinner-border text-success"
                            role="status"
                        />
                        <p style={{
                            marginTop: '12px',
                            fontSize: '14px'
                        }}>
                            Loading leaves...
                        </p>
                    </div>

                ) : leaves.length === 0 ? (

                    /* Empty State */
                    <div style={{
                        textAlign: 'center',
                        padding: '48px 20px'
                    }}>
                        <div style={{
                            fontSize: '52px',
                            marginBottom: '12px'
                        }}>
                            📅
                        </div>
                        <h6 style={{
                            color: '#64748b',
                            fontWeight: '600',
                            marginBottom: '6px'
                        }}>
                            No Upcoming Leaves
                        </h6>
                        <p style={{
                            color: '#94a3b8',
                            fontSize: '13px',
                            margin: 0
                        }}>
                            You have no leave dates
                            scheduled. Add a date above
                            when you are not available.
                        </p>
                    </div>

                ) : (

                    /* Leave Cards List */
                    <div style={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '12px'
                    }}>
                        {leaves.map(leave => (
                            <div
                                key={leave.id}
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent:
                                        'space-between',
                                    padding: '16px 20px',
                                    borderRadius: '12px',
                                    background: '#fef2f2',
                                    border:
                                        '1px solid #fecaca',
                                    gap: '12px'
                                }}>

                                {/* Left Side — Icon + Date */}
                                <div style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '14px'
                                }}>
                                    <div style={{
                                        width: '44px',
                                        height: '44px',
                                        borderRadius: '10px',
                                        background: '#fee2e2',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent:
                                            'center',
                                        fontSize: '20px',
                                        flexShrink: 0
                                    }}>
                                        🔴
                                    </div>

                                    <div>
                                        {/* Formatted Date */}
                                        <p style={{
                                            fontWeight: '700',
                                            color: '#1e293b',
                                            margin: '0 0 3px',
                                            fontSize: '15px'
                                        }}>
                                            {formatDate(
                                                leave.leaveDate
                                            )}
                                        </p>

                                        {/* Reason + Days Until */}
                                        <div style={{
                                            display: 'flex',
                                            gap: '10px',
                                            alignItems:
                                                'center'
                                        }}>
                                            {leave.reason && (
                                                <span style={{
                                                    background:
                                                        'white',
                                                    color:
                                                        '#64748b',
                                                    padding:
                                                        '2px 10px',
                                                    borderRadius:
                                                        '20px',
                                                    fontSize:
                                                        '12px',
                                                    border:
                                                        '1px solid #e2e8f0'
                                                }}>
                                                    {leave.reason}
                                                </span>
                                            )}
                                            <span style={{
                                                color:
                                                    '#94a3b8',
                                                fontSize: '12px'
                                            }}>
                                                {getDaysUntil(
                                                    leave.leaveDate
                                                )}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {/* Right Side — Cancel Button */}
                                <button
                                    onClick={() =>
                                        handleCancelClick(
                                            leave
                                        )
                                    }
                                    style={{
                                        padding:
                                            '7px 16px',
                                        border:
                                            '1px solid #fecaca',
                                        borderRadius: '8px',
                                        background: 'white',
                                        color: '#dc2626',
                                        fontSize: '13px',
                                        fontWeight: '600',
                                        cursor: 'pointer',
                                        whiteSpace:
                                            'nowrap',
                                        flexShrink: 0
                                    }}
                                    onMouseEnter={(e) => {
                                        e.currentTarget
                                            .style
                                            .background =
                                            '#fee2e2';
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget
                                            .style
                                            .background =
                                            'white';
                                    }}>
                                    Cancel Leave
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

export default DoctorLeaveCalendar;