import React, { useState, useEffect } from 'react';
import { getDepartments, createDepartment, updateDepartment, deleteDepartment } from '../api/departmentApi';
import LoadingSpinner from '../components/LoadingSpinner';
import EmptyState from '../components/EmptyState';
import Alert from '../components/Alert';

export default function Departments() {
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);
  const [formData, setFormData] = useState({ name: '', description: '' });
  const [submitting, setSubmitting] = useState(false);

  const fetchDeptList = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await getDepartments();
      setDepartments(data);
    } catch (err) {
      setError(err.message || 'Failed to fetch departments.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDeptList();
  }, []);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    if (error) setError('');
  };

  const handleStartEdit = (dept) => {
    setIsEditing(true);
    setEditId(dept._id);
    setFormData({ name: dept.name, description: dept.description || '' });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditId(null);
    setFormData({ name: '', description: '' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim()) return;
    setSubmitting(true);
    setError('');
    try {
      if (isEditing) {
        await updateDepartment(editId, formData);
        setSuccessMsg(`Department "${formData.name}" updated successfully.`);
      } else {
        await createDepartment(formData);
        setSuccessMsg(`Department "${formData.name}" created successfully.`);
      }
      handleCancel();
      await fetchDeptList();
      setTimeout(() => setSuccessMsg(''), 3500);
    } catch (err) {
      setError(err.message || 'Failed to save department.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (dept) => {
    if (!window.confirm(`Are you sure you want to delete "${dept.name}"? Any tickets assigned to this department will be marked as unassigned.`)) {
      return;
    }
    try {
      await deleteDepartment(dept._id);
      setSuccessMsg(`Department "${dept.name}" deleted.`);
      setDepartments((prev) => prev.filter((d) => d._id !== dept._id));
      setTimeout(() => setSuccessMsg(''), 3500);
    } catch (err) {
      setError(err.message || 'Failed to delete department.');
      setTimeout(() => setError(''), 4000);
    }
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1 className="page-title">Department Management</h1>
          <p className="page-subtitle">Create, update, and manage support departments used for categorizing and dispatching tickets</p>
        </div>
      </div>
      {successMsg && <Alert type="success" message={successMsg} onClose={() => setSuccessMsg('')} />}
      {error && <Alert type="error" message={error} onClose={() => setError('')} />}
      <div className="dept-form-card card">
        <h3 className="section-title">{isEditing ? '✏️ Edit Department' : '➕ Create New Department'}</h3>
        <form onSubmit={handleSubmit} className="dept-form">
          <div className="form-row-2">
            <div className="form-group">
              <label htmlFor="dept-name" className="form-label">
                Department Name <span className="required">*</span>
              </label>
              <input
                id="dept-name"
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="e.g. Technical Support, Billing & Accounts"
                required
                className="form-input"
              />
            </div>
            <div className="form-group">
              <label htmlFor="dept-desc" className="form-label">Description</label>
              <input
                id="dept-desc"
                type="text"
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Brief description of department scope"
                className="form-input"
              />
            </div>
          </div>
          <div className="form-actions">
            <button type="submit" disabled={submitting} className="btn btn-primary">
              {submitting ? 'Saving...' : isEditing ? 'Update Department' : 'Create Department'}
            </button>
            {isEditing && (
              <button type="button" onClick={handleCancel} className="btn btn-secondary">
                Cancel Edit
              </button>
            )}
          </div>
        </form>
      </div>
      <div className="dept-section-header">
        <h2>Active Support Departments ({departments.length})</h2>
      </div>
      {loading ? (
        <LoadingSpinner message="Loading departments..." />
      ) : departments.length === 0 ? (
        <EmptyState
          title="No Departments Created"
          description="Create your first department above to start assigning tickets."
          icon="🏢"
        />
      ) : (
        <div className="dept-grid">
          {departments.map((dept) => (
            <div key={dept._id} className="dept-card card">
              <div className="dept-card-top">
                <div className="dept-icon">🏢</div>
                <div className="dept-ticket-count-badge">
                  {dept.ticketCount || 0} active ticket{dept.ticketCount === 1 ? '' : 's'}
                </div>
              </div>
              <h3 className="dept-card-name">{dept.name}</h3>
              <p className="dept-card-desc">{dept.description || 'No description provided.'}</p>
              <div className="dept-card-footer">
                <span className="dept-date">Created: {new Date(dept.createdAt).toLocaleDateString()}</span>
                <div className="dept-actions">
                  <button type="button" onClick={() => handleStartEdit(dept)} className="btn btn-secondary btn-xs">
                    Edit
                  </button>
                  <button type="button" onClick={() => handleDelete(dept)} className="btn btn-danger-outline btn-xs">
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
