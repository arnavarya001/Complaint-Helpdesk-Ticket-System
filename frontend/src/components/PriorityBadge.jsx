import React from 'react';

export default function PriorityBadge({ priority }) {
  const getPriorityClass = (pr) => {
    switch (pr) {
      case 'High':
        return 'badge-priority-high';
      case 'Medium':
        return 'badge-priority-medium';
      case 'Low':
        return 'badge-priority-low';
      default:
        return 'badge-priority-default';
    }
  };

  return (
    <span className={`priority-badge ${getPriorityClass(priority)}`}>
      {priority}
    </span>
  );
}
