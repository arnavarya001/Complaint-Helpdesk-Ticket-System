import React, { useState } from 'react';
import Alert from './Alert';

export default function TicketForm({
  initialData = {
    title: '',
    category: 'General',
    priority: 'Medium',
    description: '',
    screenshotUrl: '',
  },
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

  const categories = ['General', 'Technical', 'Billing', 'Account', 'Hardware'];
  const priorities = ['Low', 'Medium', 'High'];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="ticket-form card">
      {errorMessage && <Alert type="error" message={errorMessage} />}
      <div className="form-group">
        <label htmlFor="ticket-title" className="form-label">
          Ticket Title <span className="required">*</span>
        </label>
        <input
          id="ticket-title"
          type="text"
          name="title"
          value={formData.title}
          onChange={handleChange}
          required
          maxLength={120}
          placeholder="Brief summary of the issue (e.g. Cannot access dashboard)"
          className="form-input"
        />
        <small className="form-hint">Keep the title clear and concise (max 120 chars).</small>
      </div>
      <div className="form-row-2">
        <div className="form-group">
          <label htmlFor="ticket-category" className="form-label">
            Category <span className="required">*</span>
          </label>
          <select
            id="ticket-category"
            name="category"
            value={formData.category}
            onChange={handleChange}
            className="form-select"
          >
            {categories.map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>
        <div className="form-group">
          <label htmlFor="ticket-priority" className="form-label">
            Priority <span className="required">*</span>
          </label>
          <select
            id="ticket-priority"
            name="priority"
            value={formData.priority}
            onChange={handleChange}
            className="form-select"
          >
            {priorities.map((p) => (
              <option key={p} value={p}>{p} Priority</option>
            ))}
          </select>
        </div>
      </div>
      <div className="form-group">
        <label htmlFor="ticket-desc" className="form-label">
          Detailed Description <span className="required">*</span>
        </label>
        <textarea
          id="ticket-desc"
          name="description"
          value={formData.description}
          onChange={handleChange}
          required
          rows={5}
          placeholder="Please describe what happened, steps to reproduce, error codes, and what you expected to see..."
          className="form-textarea"
        ></textarea>
      </div>
      <div className="form-group">
        <label htmlFor="ticket-screenshot" className="form-label">
          Screenshot or Image URL (Optional)
        </label>
        <input
          id="ticket-screenshot"
          type="url"
          name="screenshotUrl"
          value={formData.screenshotUrl}
          onChange={handleChange}
          placeholder="https://example.com/screenshot.png"
          className="form-input"
        />
        <small className="form-hint">Provide a direct link to an uploaded screenshot or image if relevant.</small>
      </div>
      {formData.screenshotUrl && (
        <div className="screenshot-preview-box">
          <span className="preview-label">Image Preview:</span>
          <img
            src={formData.screenshotUrl}
            alt="Ticket attachment preview"
            className="preview-img"
            onError={(e) => { e.target.style.display = 'none'; }}
          />
        </div>
      )}
      <div className="form-actions">
        <button type="submit" disabled={isSubmitting} className="btn btn-primary">
          {isSubmitting ? 'Saving...' : submitLabel}
        </button>
        {onCancel && (
          <button type="button" onClick={onCancel} disabled={isSubmitting} className="btn btn-secondary">
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}
