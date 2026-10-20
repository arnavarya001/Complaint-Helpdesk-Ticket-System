import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { getTicketById, updateTicket, reopenTicket, deleteTicket } from '../api/ticketApi';
import { getComments, addComment } from '../api/commentApi';
import { getDepartments } from '../api/departmentApi';
import StatusBadge from '../components/StatusBadge';
import PriorityBadge from '../components/PriorityBadge';
import LoadingSpinner from '../components/LoadingSpinner';
import Alert from '../components/Alert';

export default function TicketDetails({ user }) {
  const { id } = useParams();
  const navigate = useNavigate();

  const [ticket, setTicket] = useState(null);
  const [comments, setComments] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Admin controls state
  const [selectedStatus, setSelectedStatus] = useState('');
  const [selectedDept, setSelectedDept] = useState('');
  const [updatingAdmin, setUpdatingAdmin] = useState(false);

  // Reopen action state
  const [reopening, setReopening] = useState(false);

  // New comment state
  const [newComment, setNewComment] = useState('');
  const [submittingComment, setSubmittingComment] = useState(false);

  const workflowSteps = ['Open', 'In Progress', 'Resolved', 'Closed'];

  const fetchTicketData = async () => {
    try {
      setLoading(true);
      setError('');

      const [ticketData, commentList] = await Promise.all([
        getTicketById(id),
        getComments(id),
      ]);

      setTicket(ticketData);
      setComments(commentList);
      setSelectedStatus(ticketData.status);
      setSelectedDept(ticketData.department ? ticketData.department._id : '');

      // If user is admin, also fetch departments for assignment dropdown
      if (user && user.role === 'admin') {
        const deptList = await getDepartments();
        setDepartments(deptList);
      }
    } catch (err) {
      setError(err.message || 'Could not load ticket details.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTicketData();
  }, [id, user]);

  // Admin status/dept update
  const handleAdminUpdate = async (e) => {
    e.preventDefault();
    setUpdatingAdmin(true);
    setError('');
    setSuccessMsg('');

    try {
      const updated = await updateTicket(id, {
        status: selectedStatus,
        department: selectedDept || null,
      });
      setTicket(updated);
      setSuccessMsg('Ticket updated successfully by administrator.');
      setTimeout(() => setSuccessMsg(''), 4000);
    } catch (err) {
      setError(err.message || 'Failed to update ticket.');
      setTimeout(() => setError(''), 4000);
    } finally {
      setUpdatingAdmin(false);
    }
  };

  // Reopen ticket action
  const handleReopen = async () => {
    if (!window.confirm('Do you want to reopen this resolved ticket? Note: Tickets can only be reopened once.')) {
      return;
    }

    setReopening(true);
    setError('');
    setSuccessMsg('');

    try {
      const updated = await reopenTicket(id);
      setTicket(updated);
      setSelectedStatus(updated.status);
      setSuccessMsg('Ticket has been reopened and set back to Open.');
      // Refresh comments to see reopening log
      const refreshedComments = await getComments(id);
      setComments(refreshedComments);
      setTimeout(() => setSuccessMsg(''), 4000);
    } catch (err) {
      setError(err.message || 'Failed to reopen ticket.');
      setTimeout(() => setError(''), 4000);
    } finally {
      setReopening(false);
    }
  };

  // Customer delete open ticket
  const handleDelete = async () => {
    if (!window.confirm(`Are you sure you want to permanently delete ticket ${ticket.ticketId}?`)) {
      return;
    }

    try {
      await deleteTicket(id);
      navigate(user.role === 'admin' ? '/admin/tickets' : '/tickets');
    } catch (err) {
      setError(err.message || 'Failed to delete ticket.');
    }
  };

  // Add comment
  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    setSubmittingComment(true);
    setError('');

    try {
      const added = await addComment(id, newComment.trim());
      setComments((prev) => [...prev, added]);
      setNewComment('');
    } catch (err) {
      setError(err.message || 'Failed to post comment.');
    } finally {
      setSubmittingComment(false);
    }
  };

  if (loading) {
    return (
      <div className="page-container">
        <LoadingSpinner message="Loading ticket and comments..." />
      </div>
    );
  }

  if (!ticket) {
    return (
      <div className="page-container">
        <Alert type="error" message={error || 'Ticket not found'} />
        <Link to={user.role === 'admin' ? '/admin/tickets' : '/tickets'} className="btn btn-secondary">
          Back to Tickets
        </Link>
      </div>
    );
  }

  const currentStepIndex = workflowSteps.indexOf(ticket.status);

  return (
    <div className="page-container">
      {/* Back button and breadcrumb */}
      <div className="details-top-bar">
        <Link
          to={user.role === 'admin' ? '/admin/tickets' : '/tickets'}
          className="back-link"
        >
          &larr; Back to {user.role === 'admin' ? 'All Tickets' : 'My Tickets'}
        </Link>
        <div className="details-header-badges">
          <PriorityBadge priority={ticket.priority} />
          <StatusBadge status={ticket.status} />
        </div>
      </div>

      {successMsg && <Alert type="success" message={successMsg} onClose={() => setSuccessMsg('')} />}
      {error && <Alert type="error" message={error} onClose={() => setError('')} />}

      {/* Main Ticket Card */}
      <div className="ticket-detail-card card">
        <div className="ticket-header-row">
          <div>
            <span className="detail-ticket-id">{ticket.ticketId}</span>
            <h1 className="detail-ticket-title">{ticket.title}</h1>
          </div>
          <div className="detail-header-actions">
            {ticket.status === 'Open' && (
              <>
                <Link to={`/tickets/${ticket._id}/edit`} className="btn btn-secondary btn-sm">
                  ✏️ Edit Ticket
                </Link>
                <button
                  type="button"
                  onClick={handleDelete}
                  className="btn btn-danger-outline btn-sm"
                >
                  🗑️ Delete
                </button>
              </>
            )}

            {ticket.status === 'Resolved' && ticket.reopenCount === 0 && (
              <button
                type="button"
                onClick={handleReopen}
                disabled={reopening}
                className="btn btn-warning btn-sm"
              >
                {reopening ? 'Reopening...' : '🔄 Reopen Ticket'}
              </button>
            )}
          </div>
        </div>

        {/* Visual Workflow Steps */}
        <div className="workflow-container">
          <div className="workflow-title">Ticket Lifecycle:</div>
          <div className="workflow-steps">
            {workflowSteps.map((step, idx) => {
              const isPast = idx < currentStepIndex;
              const isCurrent = idx === currentStepIndex;
              return (
                <div
                  key={step}
                  className={`workflow-step ${isPast ? 'step-past' : ''} ${
                    isCurrent ? 'step-current' : ''
                  }`}
                >
                  <div className="step-circle">
                    {isPast ? '✓' : idx + 1}
                  </div>
                  <span className="step-label">{step}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Reopen note if previously reopened */}
        {ticket.reopenCount > 0 && (
          <div className="reopen-notice-banner">
            ℹ️ This ticket was reopened once by the customer. Further reopening is restricted.
          </div>
        )}

        {/* Closed note if closed */}
        {ticket.status === 'Closed' && (
          <div className="closed-notice-banner">
            🔒 This ticket is Closed and marked as read-only. No further modifications or comments are accepted.
          </div>
        )}

        {/* Meta Attributes Grid */}
        <div className="ticket-metadata-grid">
          <div className="meta-card">
            <span className="meta-card-label">Category</span>
            <span className="meta-card-value">{ticket.category}</span>
          </div>

          <div className="meta-card">
            <span className="meta-card-label">Assigned Department</span>
            <span className="meta-card-value">
              {ticket.department ? ticket.department.name : 'Not yet assigned'}
            </span>
          </div>

          <div className="meta-card">
            <span className="meta-card-label">Reported By</span>
            <span className="meta-card-value">
              {ticket.customer ? `${ticket.customer.name} (${ticket.customer.email})` : 'Unknown'}
            </span>
          </div>

          <div className="meta-card">
            <span className="meta-card-label">Created At</span>
            <span className="meta-card-value">
              {new Date(ticket.createdAt).toLocaleString()}
            </span>
          </div>

          {ticket.resolvedAt && (
            <div className="meta-card">
              <span className="meta-card-label">Resolved At</span>
              <span className="meta-card-value">
                {new Date(ticket.resolvedAt).toLocaleString()}
              </span>
            </div>
          )}
        </div>

        {/* Ticket Description */}
        <div className="ticket-description-section">
          <h3 className="section-title">Complaint Description</h3>
          <div className="description-text-box">
            <p>{ticket.description}</p>
          </div>
        </div>

        {/* Screenshot preview if available */}
        {ticket.screenshotUrl && (
          <div className="ticket-attachment-section">
            <h3 className="section-title">Attached Screenshot</h3>
            <div className="attachment-frame">
              <img
                src={ticket.screenshotUrl}
                alt={`Screenshot for ticket ${ticket.ticketId}`}
                className="attachment-img"
              />
              <a
                href={ticket.screenshotUrl}
                target="_blank"
                rel="noreferrer"
                className="btn btn-outline btn-sm attachment-external-link"
              >
                Open Original Image ↗
              </a>
            </div>
          </div>
        )}
      </div>

      {/* Admin Action Panel (Only visible to admin users) */}
      {user && user.role === 'admin' && (
        <div className="admin-management-card card">
          <div className="admin-panel-header">
            <h3>🛡️ Administrative Management</h3>
            <span className="admin-tag">Staff Controls</span>
          </div>

          {ticket.status === 'Closed' ? (
            <p className="admin-disabled-text">
              Ticket is Closed and read-only. Status and department cannot be altered.
            </p>
          ) : (
            <form onSubmit={handleAdminUpdate} className="admin-control-form">
              <div className="form-row-2">
                <div className="form-group">
                  <label htmlFor="admin-status" className="form-label">
                    Update Status
                  </label>
                  <select
                    id="admin-status"
                    value={selectedStatus}
                    onChange={(e) => setSelectedStatus(e.target.value)}
                    className="form-select"
                  >
                    <option value="Open">Open</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Resolved">Resolved</option>
                    <option value="Closed">Closed</option>
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor="admin-dept" className="form-label">
                    Assign Department
                  </label>
                  <select
                    id="admin-dept"
                    value={selectedDept}
                    onChange={(e) => setSelectedDept(e.target.value)}
                    className="form-select"
                  >
                    <option value="">-- Unassigned --</option>
                    {departments.map((dept) => (
                      <option key={dept._id} value={dept._id}>
                        {dept.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <button
                type="submit"
                disabled={updatingAdmin}
                className="btn btn-primary"
              >
                {updatingAdmin ? 'Saving Changes...' : 'Update Ticket Status & Department'}
              </button>
            </form>
          )}
        </div>
      )}

      {/* Comments & Discussion Thread */}
      <div className="comments-section card">
        <div className="comments-header">
          <h2 className="section-title">
            Discussion & Support Replies ({comments.length})
          </h2>
          <span className="comments-subtitle">
            Communicate directly with the support team regarding this complaint
          </span>
        </div>

        {/* Comments List */}
        <div className="comments-list">
          {comments.length === 0 ? (
            <p className="no-comments-msg">
              No replies yet. Use the message box below to post a response or question.
            </p>
          ) : (
            comments.map((comment) => {
              const isSupport = comment.user && comment.user.role === 'admin';
              return (
                <div
                  key={comment._id}
                  className={`comment-bubble ${isSupport ? 'comment-support' : 'comment-customer'}`}
                >
                  <div className="comment-header">
                    <div className="comment-author-info">
                      <div className="comment-avatar">
                        {comment.user ? comment.user.name.charAt(0).toUpperCase() : 'U'}
                      </div>
                      <span className="comment-author-name">
                        {comment.user ? comment.user.name : 'User'}
                      </span>
                      <span
                        className={`comment-role-badge ${
                          isSupport ? 'role-admin' : 'role-customer'
                        }`}
                      >
                        {isSupport ? 'Support Agent' : 'Customer'}
                      </span>
                    </div>
                    <span className="comment-timestamp">
                      {new Date(comment.createdAt).toLocaleString()}
                    </span>
                  </div>
                  <div className="comment-body">
                    <p>{comment.text}</p>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Add Comment Input */}
        {ticket.status === 'Closed' ? (
          <div className="comment-locked-box">
            🔒 Comments are disabled because this ticket is marked as Closed.
          </div>
        ) : (
          <form onSubmit={handleAddComment} className="comment-input-form">
            <div className="form-group">
              <label htmlFor="new-comment-text" className="form-label">
                Add a Comment or Reply
              </label>
              <textarea
                id="new-comment-text"
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Type your message, query, or update here..."
                rows={3}
                required
                className="form-textarea"
              ></textarea>
            </div>
            <button
              type="submit"
              disabled={submittingComment || !newComment.trim()}
              className="btn btn-primary"
            >
              {submittingComment ? 'Sending...' : 'Send Reply'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
