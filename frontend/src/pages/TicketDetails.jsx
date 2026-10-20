import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { getTicketById, updateTicket, reopenTicket, deleteTicket } from '../api/ticketApi';
import { getComments, addComment } from '../api/commentApi';
import { getDepartments } from '../api/departmentApi';

export default function TicketDetails({ user }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const [ticket, setTicket] = useState(null);
  const [comments, setComments] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [status, setStatus] = useState('');
  const [department, setDepartment] = useState('');
  const [msg, setMsg] = useState('');

  const loadData = async () => {
    try {
      const [tData, cData] = await Promise.all([getTicketById(id), getComments(id)]);
      setTicket(tData);
      setComments(cData);
      setStatus(tData.status);
      setDepartment(tData.department ? tData.department._id : '');
      if (user && user.role === 'admin') {
        const depts = await getDepartments();
        setDepartments(depts);
      }
    } catch (err) {
      setMsg(err.message || 'Error loading ticket');
    }
  };

  useEffect(() => { loadData(); }, [id]);

  const handleAdminSave = async (e) => {
    e.preventDefault();
    try {
      const updated = await updateTicket(id, { status, department: department || null });
      setTicket(updated);
      setMsg('Ticket updated successfully!');
    } catch (err) {
      setMsg(err.message || 'Update failed');
    }
  };

  const handleReopen = async () => {
    try {
      const updated = await reopenTicket(id);
      setTicket(updated);
      setStatus(updated.status);
      setMsg('Ticket reopened successfully');
      loadData();
    } catch (err) {
      setMsg(err.message || 'Could not reopen');
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Delete this ticket?')) return;
    try {
      await deleteTicket(id);
      navigate(user.role === 'admin' ? '/admin/tickets' : '/tickets');
    } catch (err) {
      setMsg(err.message || 'Delete failed');
    }
  };

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    try {
      const c = await addComment(id, newComment.trim());
      setComments([...comments, c]);
      setNewComment('');
    } catch (err) {
      setMsg(err.message || 'Comment failed');
    }
  };

  if (!ticket) return <div className="page-container"><p>Loading ticket...</p></div>;

  return (
    <div className="page-container">
      <Link to={user.role === 'admin' ? '/admin/tickets' : '/tickets'} className="btn btn-secondary btn-sm">&larr; Back</Link>
      {msg && <p style={{ color: msg.includes('fail') || msg.includes('Error') ? 'red' : 'green', margin: '10px 0' }}>{msg}</p>}

      <div className="card" style={{ marginTop: '15px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2>{ticket.ticketId}: {ticket.title}</h2>
          <div>
            <span className={`status-badge badge-status-${ticket.status.toLowerCase().replace(' ', '-')}`}>{ticket.status}</span>
            <span className="priority-badge" style={{ marginLeft: '8px' }}>{ticket.priority}</span>
          </div>
        </div>

        <p style={{ marginTop: '10px' }}><strong>Category:</strong> {ticket.category} | <strong>Assigned Dept:</strong> {ticket.department ? ticket.department.name : 'Unassigned'}</p>
        <p><strong>Customer:</strong> {ticket.customer ? ticket.customer.name : 'User'} ({ticket.customer ? ticket.customer.email : ''})</p>
        <p><strong>Created:</strong> {new Date(ticket.createdAt).toLocaleString()}</p>
        <div style={{ background: '#1e293b', padding: '12px', borderRadius: '6px', margin: '15px 0' }}>
          <h4>Description:</h4>
          <p>{ticket.description}</p>
        </div>

        {ticket.screenshotUrl && (
          <div style={{ marginBottom: '15px' }}>
            <p><strong>Attachment:</strong></p>
            <img src={ticket.screenshotUrl} alt="Screenshot" style={{ maxWidth: '300px', maxHeight: '200px', borderRadius: '6px' }} />
          </div>
        )}

        <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
          {ticket.status === 'Open' && (
            <>
              <Link to={`/tickets/${ticket._id}/edit`} className="btn btn-secondary btn-sm">Edit</Link>
              <button onClick={handleDelete} className="btn btn-danger-outline btn-sm">Delete</button>
            </>
          )}
          {ticket.status === 'Resolved' && ticket.reopenCount === 0 && (
            <button onClick={handleReopen} className="btn btn-warning btn-sm">Reopen Ticket</button>
          )}
        </div>
      </div>

      {user.role === 'admin' && ticket.status !== 'Closed' && (
        <div className="card" style={{ marginTop: '15px' }}>
          <h3>Admin Controls</h3>
          <form onSubmit={handleAdminSave} style={{ display: 'flex', gap: '10px', alignItems: 'center', marginTop: '10px' }}>
            <select value={status} onChange={(e) => setStatus(e.target.value)} className="form-select">
              <option value="Open">Open</option>
              <option value="In Progress">In Progress</option>
              <option value="Resolved">Resolved</option>
              <option value="Closed">Closed</option>
            </select>
            <select value={department} onChange={(e) => setDepartment(e.target.value)} className="form-select">
              <option value="">Unassigned</option>
              {departments.map((d) => <option key={d._id} value={d._id}>{d.name}</option>)}
            </select>
            <button type="submit" className="btn btn-primary btn-sm">Update</button>
          </form>
        </div>
      )}

      <div className="card" style={{ marginTop: '15px' }}>
        <h3>Comments ({comments.length})</h3>
        <div style={{ margin: '15px 0' }}>
          {comments.map((c) => (
            <div key={c._id} style={{ background: '#1e293b', padding: '10px', borderRadius: '6px', marginBottom: '8px' }}>
              <div style={{ fontSize: '13px', color: '#94a3b8' }}>
                <strong>{c.user ? c.user.name : 'User'}</strong> ({c.user && c.user.role === 'admin' ? 'Support' : 'Customer'}) - {new Date(c.createdAt).toLocaleTimeString()}
              </div>
              <p style={{ marginTop: '5px' }}>{c.text}</p>
            </div>
          ))}
          {comments.length === 0 && <p style={{ color: '#94a3b8' }}>No comments yet.</p>}
        </div>

        {ticket.status !== 'Closed' ? (
          <form onSubmit={handleAddComment} style={{ display: 'flex', gap: '10px' }}>
            <input
              type="text"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Write a comment..."
              className="form-input"
              required
            />
            <button type="submit" className="btn btn-primary btn-sm">Send</button>
          </form>
        ) : (
          <p style={{ color: '#94a3b8' }}>Ticket is closed. Comments disabled.</p>
        )}
      </div>
    </div>
  );
}
