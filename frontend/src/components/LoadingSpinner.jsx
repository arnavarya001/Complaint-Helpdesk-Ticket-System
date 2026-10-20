import React from 'react';

export default function LoadingSpinner({ message = 'Loading details...' }) {
  return (
    <div className="spinner-container">
      <div className="spinner-ring"></div>
      <p className="spinner-text">{message}</p>
    </div>
  );
}
