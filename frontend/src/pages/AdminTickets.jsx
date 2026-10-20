import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getTickets, updateTicket, deleteTicket } from '../api/ticketApi';
import { getDepartments } from '../api/departmentApi';
import StatusBadge from '../components/StatusBadge';
import PriorityBadge from '../components/PriorityBadge';
import LoadingSpinner from '../components/LoadingSpinner';
import EmptyState from '../components/EmptyState';
import Alert from '../components/Alert';

export default function AdminTickets() {
  const [tickets, setTickets] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [priorityFilter, setPriorityFilter] = useState('All');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const fetchData = async () => {
    try {
      setLoading(true);
      setError('');
      const [ticketList, deptList] = await Promise.all([
        getTickets({
          status: statusFilter,
          priority: priorityFilter,
          category: categoryFilter,
          search: searchQuery,
        }),
        getDepartments(),
      ]);
      setTickets(ticketList);
      setDepartments(deptList);
    } catch (err) {
      setError(err.message || 'Failed to fetch tickets.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [statusFilter, priorityFilter, categoryFilter]);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchData();
  };

  const handleQuickStatusChange = async (ticketId, newStatus) => {
    try {
      await updateTicket(ticketId, { status: newStatus });
      setTickets((prev) =>
        prev.map((t) => (t._id === ticketId ? { ...t, status: newStatus } : t))
      );
      setSuccessMsg(`Status updated to "${newStatus}".`);
      setTimeout(() => setSuccessMsg(''), 3000);
    } catch (err) {
      setError(err.message || 'Could not change status.');
      setTimeout(() => setError(''), 4000);
    }
  };

  const handleQuickDeptChange = async (ticketId, newDeptId) => {
    try {
      const updated = await updateTicket(ticketId, { department: newDeptId || null });
      setTickets((prev) =>
        prev.map((t) => (t._id === ticketId ? updated : t))
      );
      setSuccessMsg('Department assigned successfully.');
      setTimeout(() => setSuccessMsg(''), 3000);
    } catch (err) {
      setError(err.message || 'Could not assign department.');
      setTimeout(() => setError(''), 4000);
    }
  };

  const handleDelete = async (ticketId, id) => {
    if (!window.confirm(`Delete ticket ${ticketId}?`)) return;
    try {
      await deleteTicket(id);
      setTickets((prev) => prev.filter((t) => t._id !== id));
      setSuccessMsg(`Ticket ${ticketId} deleted.`);
      setTimeout(() => setSuccessMsg(''), 3000);
    } catch (err) {
      setError(err.message || 'Failed to delete ticket.');
      setTimeout(() => setError(''), 4000);
    }
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1 className="page-title">Admin Ticket Management</h1>
          <p className="page-subtitle">View, filter, triage, assign departments, and resolve customer support complaints</p>
        </div>
        <div className="header-meta-badge">
          Total Matching: <strong>{tickets.length}</strong>
        </div>
      </div>
      {successMsg && <Alert type="success" message={successMsg} onClose={() => setSuccessMsg('')} />}
      {error && <Alert type="error" message={error} onClose={() => setError('')} />}
      <div className="filter-bar card">
        <form onSubmit={handleSearch} className="search-box">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search title, ID, or user..."
            className="form-input search-input"
          />
          <button type="submit" className="btn btn-secondary btn-sm">Search</button>
        </form>
        <div className="filter-group">
          <label htmlFor="admin-filter-status" className="filter-label">Status:</label>
          <select
            id="admin-filter-status"
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
          <label htmlFor="admin-filter-priority" className="filter-label">Priority:</label>
          <select
            id="admin-filter-priority"
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
        <div className="filter-group">
          <label htmlFor="admin-filter-cat" className="filter-label">Category:</label>
          <select
            id="admin-filter-cat"
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="form-select filter-select"
          >
            <option value="All">All Categories</option>
            <option value="Technical">Technical</option>
            <option value="Billing">Billing</option>
            <option value="Account">Account</option>
            <option value="Hardware">Hardware</option>
            <option value="General">General</option>
          </select>
        </div>
      </div>
      {loading ? (
        <LoadingSpinner message="Loading all tickets..." />
      ) : tickets.length === 0 ? (
        <EmptyState
          title="No Tickets Found"
          description="No complaints match the specified search or filter criteria."
          icon="📋"
        />
      ) : (
        <div className="table-wrapper card">
          <table className="data-table">
            <thead>
              <tr>
                <th>Ticket ID</th>
                <th>Subject & Customer</th>
                <th>Category</th>
                <th>Priority</th>
                <th>Status</th>
                <th>Assigned Dept</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {tickets.map((t) => (
                <tr key={t._id}>
                  <td className="table-id-cell">
                    <span className="table-ticket-id">{t.ticketId}</span>
                    <span className="table-date">{new Date(t.createdAt).toLocaleDateString()}</span>
                  </td>
                  <td className="table-subject-cell">
                    <Link to={`/tickets/${t._id}`} className="table-ticket-title">{t.title}</Link>
                    <div className="table-customer-meta">
                      👤 {t.customer ? t.customer.name : 'Unknown'}{' '}
                      <span className="table-customer-email">({t.customer ? t.customer.email : ''})</span>
                    </div>
                  </td>
                  <td><span className="category-chip">{t.category}</span></td>
                  <td><PriorityBadge priority={t.priority} /></td>
                  <td>
                    {t.status === 'Closed' ? (
                      <StatusBadge status="Closed" />
                    ) : (
                      <select
                        value={t.status}
                        onChange={(e) => handleQuickStatusChange(t._id, e.target.value)}
                        className="form-select table-quick-select"
                      >
                        <option value="Open">Open</option>
                        <option value="In Progress">In Progress</option>
                        <option value="Resolved">Resolved</option>
                        <option value="Closed">Closed</option>
                      </select>
                    )}
                  </td>
                  <td>
                    {t.status === 'Closed' ? (
                      <span className="dept-tag">{t.department ? t.department.name : 'Unassigned'}</span>
                    ) : (
                      <select
                        value={t.department ? t.department._id : ''}
                        onChange={(e) => handleQuickDeptChange(t._id, e.target.value)}
                        className="form-select table-quick-select"
                      >
                        <option value="">Unassigned</option>
                        {departments.map((dept) => (
                          <option key={dept._id} value={dept._id}>{dept.name}</option>
                        ))}
                      </select>
                    )}
                  </td>
                  <td className="table-actions-cell">
                    <Link to={`/tickets/${t._id}`} className="btn btn-outline btn-xs">Manage</Link>
                    <button
                      type="button"
                      onClick={() => handleDelete(t.ticketId, t._id)}
                      className="btn btn-danger-outline btn-xs"
                      title="Delete ticket"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
