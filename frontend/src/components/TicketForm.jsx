import React, { useState } from 'react';

export default function TicketForm({
  initialData = { title: '', category: 'General', priority: 'Medium', description: '', screenshotUrl: '' },
  onSubmit,
  isSubmitting = false,
  submitLabel = 'Submit Ticket',
  onCancel,
  errorMessage = '',
}) {
  const [formData, setFormData] = useState({
    title: initialData.title || '',
    category: initialData.category || 'General',
    priority: initialData.priority || 'Medium',
    description: initialData.description || '',
    screenshotUrl: initialData.screenshotUrl || '',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="card" style={{ maxWidth: '600px', margin: '0 auto' }}>
      {errorMessage && <p style={{ color: 'red', marginBottom: '10px' }}>{errorMessage}</p>}

      <div className="form-group">
        <label className="form-label">Title:</label>
        <input type="text" name="title" value={formData.title} onChange={handleChange} required className="form-input" />
      </div>

      <div style={{ display: 'flex', gap: '10px' }}>
        <div className="form-group" style={{ flex: 1 }}>
          <label className="form-label">Category:</label>
          <select name="category" value={formData.category} onChange={handleChange} className="form-select">
            <option value="General">General</option>
            <option value="Technical">Technical</option>
            <option value="Billing">Billing</option>
            <option value="Account">Account</option>
            <option value="Hardware">Hardware</option>
          </select>
        </div>

        <div className="form-group" style={{ flex: 1 }}>
          <label className="form-label">Priority:</label>
          <select name="priority" value={formData.priority} onChange={handleChange} className="form-select">
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
          </select>
        </div>
      </div>

      <div className="form-group">
        <label className="form-label">Description:</label>
        <textarea name="description" value={formData.description} onChange={handleChange} rows={4} required className="form-textarea" />
      </div>

      <div className="form-group">
        <label className="form-label">Screenshot Link (Optional):</label>
        <input type="url" name="screenshotUrl" value={formData.screenshotUrl} onChange={handleChange} placeholder="https://..." className="form-input" />
      </div>

      <div style={{ display: 'flex', gap: '10px', marginTop: '15px' }}>
        <button type="submit" disabled={isSubmitting} className="btn btn-primary">
          {isSubmitting ? 'Saving...' : submitLabel}
        </button>
        {onCancel && (
          <button type="button" onClick={onCancel} className="btn btn-secondary">Cancel</button>
        )}
      </div>
    </form>
  );
}
