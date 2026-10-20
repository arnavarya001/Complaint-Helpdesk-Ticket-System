import React from 'react';
import { Link } from 'react-router-dom';

export default function EmptyState({
  title = 'No records found',
  description = 'There are no items to display at this moment.',
  actionText,
  actionLink,
  icon = '📂',
}) {
  return (
    <div className="empty-state-card">
      <div className="empty-state-icon">{icon}</div>
      <h3 className="empty-state-title">{title}</h3>
      <p className="empty-state-desc">{description}</p>
      {actionText && actionLink && (
        <Link to={actionLink} className="btn btn-primary empty-state-btn">
          {actionText}
        </Link>
      )}
    </div>
  );
}
