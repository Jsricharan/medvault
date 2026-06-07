import React, { useState, useEffect, useCallback } from 'react';

// Global toast state
let toastCallback = null;

export const showToast = (message, type = 'success', duration = 3000) => {
  if (toastCallback) {
    toastCallback({ message, type, duration });
  }
};

function Toast() {

  const [toasts, setToasts] = useState([]);

  const addToast = useCallback(({ message, type, duration }) => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, duration || 3000);
  }, []);

  useEffect(() => {
    toastCallback = addToast;
    return () => { toastCallback = null; };
  }, [addToast]);

  const getToastStyle = (type) => {
    const styles = {
      success: {
        background: '#d1fae5',
        border: '1px solid #a7f3d0',
        color: '#065f46',
        icon: '✅'
      },
      error: {
        background: '#fee2e2',
        border: '1px solid #fecaca',
        color: '#7f1d1d',
        icon: '❌'
      },
      warning: {
        background: '#fef3c7',
        border: '1px solid #fde68a',
        color: '#78350f',
        icon: '⚠️'
      },
      info: {
        background: '#dbeafe',
        border: '1px solid #bfdbfe',
        color: '#1e3a8a',
        icon: 'ℹ️'
      }
    };
    return styles[type] || styles.success;
  };

  return (
    <div style={{
      position: 'fixed',
      top: '80px',
      right: '20px',
      zIndex: 9999,
      display: 'flex',
      flexDirection: 'column',
      gap: '10px',
      maxWidth: '350px'
    }}>
      {toasts.map(toast => {
        const style = getToastStyle(toast.type);
        return (
          <div
            key={toast.id}
            style={{
              background: style.background,
              border: style.border,
              borderRadius: '12px',
              padding: '14px 18px',
              display: 'flex',
              alignItems: 'flex-start',
              gap: '10px',
              boxShadow:
                '0 8px 25px rgba(0,0,0,0.15)',
              animation:
                'slideIn 0.3s ease-out',
              color: style.color,
              fontSize: '14px',
              fontWeight: '500'
            }}>
            <span style={{ fontSize: '18px' }}>
              {style.icon}
            </span>
            <span style={{ lineHeight: '1.5' }}>
              {toast.message}
            </span>
          </div>
        );
      })}
      <style>{`
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateX(100px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
      `}</style>
    </div>
  );
}

export default Toast;