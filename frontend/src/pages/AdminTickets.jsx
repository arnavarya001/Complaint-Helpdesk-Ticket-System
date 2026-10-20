import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getTickets, updateTicket, deleteTicket } from '../api/ticketApi';
import { getDepartments } from '../api/departmentApi';

export default function AdminTickets() {
  const [tickets, setTickets] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [status, setStatus] = useState('All');
  const [priority, setPriority] = useState('All');
  const [search, setSearch] = useState('');

  const loadData = async () => {
    try {
      const [tList, dList] = await Promise.all([
        getTickets({ status, priority, search }),
        getDepartments(),
      ]);
      setTickets(tList);
      setDepartments(dList);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => { loadData(); }, [status, priority]);

  const handleStatusChange = async (id, newStatus) => {
    try {
      await updateTicket(id, { status: newStatus });
      setTickets(tickets.map((t) => (t._id === id ? { ...t, status: newStatus } : t)));
    } catch (err) {
      alert(err.message || 'Error updating status');
    }
  };

  const handleDeptChange = async (id, newDept) => {
    try {
      await updateTicket(id, { department: newDept || null });
      loadData();
    } catch (err) {
      alert(err.message || 'Error assigning department');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this ticket?')) return;
    try {
      await deleteTicket(id);
      setTickets(tickets.filter((t) => t._id !== id));
    } catch (err) {
      alert(err.message || 'Failed to delete');
    }
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <h1 className="page-title">Manage Tickets</h1>
        <span>Total: {tickets.length}</span>
      </div>

      <div className="filter-bar card" style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search ticket or user..."
          className="form-input"
          style={{ maxWidth: '250px' }}
        />
        <button onClick={loadData} className="btn btn-secondary btn-sm">Search</button>

        <select value={status} onChange={(e) => setStatus(e.target.value)} className="form-select" style={{ maxWidth: '150px' }}>
          <option value="All">All Status</option>
          <option value="Open">Open</option>
          <option value="In Progress">In Progress</option>
          <option value="Resolved">Resolved</option>
          <option value="Closed">Closed</option>
        </select>

        <select value={priority} onChange={(e) => setPriority(e.target.value)} className="form-select" style={{ maxWidth: '150px' }}>
          <option value="All">All Priority</option>
          <option value="High">High</option>
          <option value="Medium">Medium</option>
          <option value="Low">Low</option>
        </select>
      </div>

      <div className="card" style={{ marginTop: '15px' }}>
        <table className="data-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Title</th>
              <th>Customer</th>
              <th>Priority</th>
              <th>Status</th>
              <th>Department</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {tickets.map((t) => (
              <tr key={t._id}>
                <td>{t.ticketId}</td>
                <td><Link to={`/tickets/${t._id}`}>{t.title}</Link></td>
                <td>{t.customer ? t.customer.name : 'Unknown'}</td>
                <td>{t.priority}</td>
                <td>
                  <select value={t.status} onChange={(e) => handleStatusChange(t._id, e.target.value)} className="form-select">
                    <option value="Open">Open</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Resolved">Resolved</option>
                    <option value="Closed">Closed</option>
                  </select>
                </td>
                <td>
                  <select value={t.department ? t.department._id : ''} onChange={(e) => handleDeptChange(t._id, e.target.value)} className="form-select">
                    <option value="">Unassigned</option>
                    {departments.map((d) => <option key={d._id} value={d._id}>{d.name}</option>)}
                  </select>
                </td>
                <td>
                  <Link to={`/tickets/${t._id}`} className="btn btn-outline btn-xs" style={{ marginRight: '5px' }}>View</Link>
                  <button onClick={() => handleDelete(t._id)} className="btn btn-danger-outline btn-xs">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
