import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createTicket } from '../api/ticketApi';
import TicketForm from '../components/TicketForm';

export default function NewTicket() {
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleCreate = async (formData) => {
    setSubmitting(true);
    setError('');

    try {
      const created = await createTicket(formData);
      navigate(`/tickets/${created._id}`);
    } catch (err) {
      setError(err.message || 'Failed to submit ticket. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="page-container page-narrow">
      <div className="page-header">
        <div>
          <h1 className="page-title">Submit New Complaint / Ticket</h1>
          <p className="page-subtitle">
            Provide details of your problem so our support team can investigate and assist.
          </p>
        </div>
      </div>

      <TicketForm
        onSubmit={handleCreate}
        isSubmitting={submitting}
        submitLabel="Submit Complaint"
        onCancel={() => navigate('/tickets')}
        errorMessage={error}
      />
    </div>
  );
}
