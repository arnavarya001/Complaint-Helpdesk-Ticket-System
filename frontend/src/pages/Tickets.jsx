import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getTickets, deleteTicket } from '../api/ticketApi';
import StatusBadge from '../components/StatusBadge';
import PriorityBadge from '../components/PriorityBadge';
import LoadingSpinner from '../components/LoadingSpinner';
import EmptyState from '../components/EmptyState';
import Alert from '../components/Alert';

export default function Tickets({ user }) {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [priorityFilter, setPriorityFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const fetchUserTickets = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await getTickets({
        status: statusFilter,
        priority: priorityFilter,
        search: searchQuery,
      });
      setTickets(data);
    } catch (err) {
      setError(err.message || 'Could not fetch your tickets.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserTickets();
  }, [statusFilter, priorityFilter]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchUserTickets();
  };

  const handleDelete = async (ticketId, id) => {
    if (!window.confirm(`Are you sure you want to delete ticket ${ticketId}? This action cannot be undone.`)) {
      return;
    }
    try {
      await deleteTicket(id);
      setSuccessMsg(`Ticket ${ticketId} deleted successfully.`);
      setTickets((prev) => prev.filter((t) => t._id !== id));
      setTimeout(() => setSuccessMsg(''), 4000);
    } catch (err) {
      setError(err.message || 'Failed to delete ticket.');
      setTimeout(() => setError(''), 4000);
    }
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1 className="page-title">My Support Tickets</h1>
          <p className="page-subtitle">Track, manage, and communicate on your submitted complaints</p>
        </div>
        <Link to="/tickets/new" className="btn btn-primary">+ Submit New Ticket</Link>
      </div>

      {successMsg && <Alert type="success" message={successMsg} onClose={() => setSuccessMsg('')} />}
      {error && <Alert type="error" message={error} onClose={() => setError('')} />}

      <div className="filter-bar card">
        <form onSubmit={handleSearchSubmit} className="search-box">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by ticket ID or title..."
            className="form-input search-input"
          />
          <button type="submit" className="btn btn-secondary btn-sm">Search</button>
        </form>

        <div className="filter-group">
          <label htmlFor="status-filter" className="filter-label">Status:</label>
          <select
            id="status-filter"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="form-select filter-select"
          >
            <option value="All">All Statuses</option>
            <option value="Open">Open</option>
            <option value="In Progress">In Progress</option>
            <option value="Resolved">Resolved</option>
            <option value="Closed">Closed</option>
          </select>
        </div>

        <div className="filter-group">
          <label htmlFor="priority-filter" className="filter-label">Priority:</label>
          <select
            id="priority-filter"
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            className="form-select filter-select"
          >
            <option value="All">All Priorities</option>
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </select>
        </div>
      </div>

      {loading ? (
        <LoadingSpinner message="Fetching your tickets..." />
      ) : tickets.length === 0 ? (
        <EmptyState
          title="No Tickets Found"
          description={
            searchQuery || statusFilter !== 'All' || priorityFilter !== 'All'
              ? 'No tickets match the selected filters. Try resetting the filters.'
              : "You haven't submitted any complaints or support tickets yet."
          }
          actionText="+ Submit a Ticket"
          actionLink="/tickets/new"
          icon="🎫"
        />
      ) : (
        <div className="tickets-grid">
          {tickets.map((ticket) => (
            <div key={ticket._id} className="ticket-card card">
              <div className="ticket-card-header">
                <div className="ticket-id-tag">{ticket.ticketId}</div>
                <div className="ticket-badges">
                  <PriorityBadge priority={ticket.priority} />
                  <StatusBadge status={ticket.status} />
                </div>
              </div>

              <h3 className="ticket-card-title">
                <Link to={`/tickets/${ticket._id}`}>{ticket.title}</Link>
              </h3>

              <p className="ticket-card-desc">
                {ticket.description.length > 120
                  ? `${ticket.description.substring(0, 120)}...`
                  : ticket.description}
              </p>

              <div className="ticket-card-meta">
                <span className="meta-item"><span className="meta-label">Category:</span> {ticket.category}</span>
                <span className="meta-item"><span className="meta-label">Dept:</span> {ticket.department ? ticket.department.name : 'Unassigned'}</span>
                <span className="meta-item"><span className="meta-label">Submitted:</span> {new Date(ticket.createdAt).toLocaleDateString()}</span>
              </div>

              <div className="ticket-card-footer">
                <Link to={`/tickets/${ticket._id}`} className="btn btn-outline btn-sm">View Details & Discussion</Link>
                <div className="ticket-card-actions">
                  {ticket.status === 'Open' && (
                    <>
                      <Link to={`/tickets/${ticket._id}/edit`} className="btn btn-secondary btn-sm">Edit</Link>
                      <button
                        type="button"
                        onClick={() => handleDelete(ticket.ticketId, ticket._id)}
                        className="btn btn-danger-outline btn-sm"
                      >
                        Delete
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
