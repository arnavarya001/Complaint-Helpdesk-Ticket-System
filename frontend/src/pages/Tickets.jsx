import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getTickets } from '../api/ticketApi';

export default function Tickets({ user }) {
  const [tickets, setTickets] = useState([]);
  const [status, setStatus] = useState('All');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  const loadTickets = async () => {
    try {
      setLoading(true);
      const data = await getTickets({ status, search });
      setTickets(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadTickets(); }, [status]);

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1 className="page-title">My Tickets</h1>
          <p>Welcome, {user ? user.name : 'Customer'}! Track your submitted complaints below.</p>
        </div>
        <Link to="/tickets/new" className="btn btn-primary btn-sm">+ New Ticket</Link>
      </div>

      <div className="filter-bar card" style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by title or ID..."
          className="form-input"
          style={{ maxWidth: '250px' }}
        />
        <button onClick={loadTickets} className="btn btn-secondary btn-sm">Search</button>

        <select value={status} onChange={(e) => setStatus(e.target.value)} className="form-select" style={{ maxWidth: '150px' }}>
          <option value="All">All Status</option>
          <option value="Open">Open</option>
          <option value="In Progress">In Progress</option>
          <option value="Resolved">Resolved</option>
          <option value="Closed">Closed</option>
        </select>
      </div>

      <div className="card" style={{ marginTop: '15px' }}>
        {loading ? (
          <p>Loading tickets...</p>
        ) : tickets.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '30px' }}>
            <p>No tickets found.</p>
            <Link to="/tickets/new" className="btn btn-primary btn-sm" style={{ marginTop: '10px' }}>Submit Your First Ticket</Link>
          </div>
        ) : (
          <table className="data-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Title</th>
                <th>Category</th>
                <th>Priority</th>
                <th>Status</th>
                <th>Created</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {tickets.map((t) => (
                <tr key={t._id}>
                  <td><strong>{t.ticketId}</strong></td>
                  <td><Link to={`/tickets/${t._id}`}>{t.title}</Link></td>
                  <td>{t.category}</td>
                  <td>{t.priority}</td>
                  <td>
                    <span className={`status-badge badge-status-${t.status.toLowerCase().replace(' ', '-')}`}>
                      {t.status}
                    </span>
                  </td>
                  <td>{new Date(t.createdAt).toLocaleDateString()}</td>
                  <td>
                    <Link to={`/tickets/${t._id}`} className="btn btn-outline btn-xs">Details</Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
