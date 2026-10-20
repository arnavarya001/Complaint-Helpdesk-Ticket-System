import React from 'react';

export default function StatusBadge({ status }) {
  const getStatusClass = (st) => {
    switch (st) {
      case 'Open':
        return 'badge-status-open';
      case 'In Progress':
        return 'badge-status-progress';
      case 'Resolved':
        return 'badge-status-resolved';
      case 'Closed':
        return 'badge-status-closed';
      default:
        return 'badge-status-default';
    }
  };

  return (
    <span className={`status-badge ${getStatusClass(status)}`}>
      <span className="badge-dot"></span>
      {status}
    </span>
  );
}
