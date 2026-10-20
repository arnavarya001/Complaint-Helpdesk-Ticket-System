import React from 'react';

export default function Alert({ type = 'error', message, onClose }) {
  if (!message) return null;

  return (
    <div className={`alert-box alert-${type}`}>
      <div className="alert-content">
        <span className="alert-icon">
          {type === 'error' && '⚠️'}
          {type === 'success' && '✅'}
          {type === 'info' && 'ℹ️'}
        </span>
        <span className="alert-message">{message}</span>
      </div>
      {onClose && (
        <button
          type="button"
          onClick={onClose}
          className="alert-close-btn"
          aria-label="Dismiss alert"
        >
          &times;
        </button>
      )}
    </div>
  );
}
