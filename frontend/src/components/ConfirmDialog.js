import React from 'react';

function ConfirmDialog({
  isOpen,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  confirmColor = '#ef4444',
  onConfirm,
  onCancel
}) {

  if (!isOpen) return null;

  return (
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
        padding: '32px',
        maxWidth: '420px',
        width: '100%',
        boxShadow:
          '0 25px 50px rgba(0,0,0,0.3)',
        animation: 'popIn 0.2s ease-out'
      }}>

        {/* Icon */}
        <div style={{
          width: '56px',
          height: '56px',
          borderRadius: '50%',
          background: '#fee2e2',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '26px',
          margin: '0 auto 20px'
        }}>
          ⚠️
        </div>

        {/* Title */}
        <h5 style={{
          textAlign: 'center',
          fontWeight: '700',
          color: '#1e293b',
          margin: '0 0 10px',
          fontSize: '18px'
        }}>
          {title}
        </h5>

        {/* Message */}
        <p style={{
          textAlign: 'center',
          color: '#64748b',
          margin: '0 0 28px',
          fontSize: '14px',
          lineHeight: '1.6'
        }}>
          {message}
        </p>

        {/* Buttons */}
        <div style={{
          display: 'flex',
          gap: '12px'
        }}>
          <button
            onClick={onCancel}
            style={{
              flex: 1,
              padding: '12px',
              border: '1px solid #e2e8f0',
              borderRadius: '10px',
              background: 'white',
              color: '#64748b',
              fontSize: '14px',
              fontWeight: '600',
              cursor: 'pointer'
            }}>
            {cancelText}
          </button>
          <button
            onClick={onConfirm}
            style={{
              flex: 1,
              padding: '12px',
              border: 'none',
              borderRadius: '10px',
              background: confirmColor,
              color: 'white',
              fontSize: '14px',
              fontWeight: '600',
              cursor: 'pointer',
              boxShadow:
                `0 4px 12px ${confirmColor}50`
            }}>
            {confirmText}
          </button>
        </div>

      </div>
      <style>{`
        @keyframes popIn {
          from {
            opacity: 0;
            transform: scale(0.8);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
      `}</style>
    </div>
  );
}

export default ConfirmDialog;