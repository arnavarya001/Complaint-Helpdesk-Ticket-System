import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getTicketById, updateTicket } from '../api/ticketApi';
import TicketForm from '../components/TicketForm';
import LoadingSpinner from '../components/LoadingSpinner';
import Alert from '../components/Alert';

export default function EditTicket() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [ticket, setTicket] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchTicket = async () => {
      try {
        setLoading(true);
        const data = await getTicketById(id);
        if (data.status !== 'Open') {
          setError('Only Open tickets can be edited by customers.');
        }
        setTicket(data);
      } catch (err) {
        setError(err.message || 'Failed to load ticket for editing.');
      } finally {
        setLoading(false);
      }
    };

    fetchTicket();
  }, [id]);

  const handleUpdate = async (formData) => {
    setSubmitting(true);
    setError('');

    try {
      await updateTicket(id, formData);
      navigate(`/tickets/${id}`);
    } catch (err) {
      setError(err.message || 'Failed to update ticket.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="page-container page-narrow">
        <LoadingSpinner message="Loading ticket details..." />
      </div>
    );
  }

  if (ticket && ticket.status !== 'Open') {
    return (
      <div className="page-container page-narrow">
        <div className="card">
          <Alert
            type="error"
            message={`Ticket ${ticket.ticketId} is currently "${ticket.status}". Only "Open" tickets can be modified.`}
          />
          <div className="form-actions" style={{ marginTop: '1.5rem' }}>
            <button
              type="button"
              onClick={() => navigate(`/tickets/${id}`)}
              className="btn btn-primary"
            >
              Return to Ticket Details
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container page-narrow">
      <div className="page-header">
        <div>
          <h1 className="page-title">Edit Ticket {ticket ? ticket.ticketId : ''}</h1>
          <p className="page-subtitle">
            Update your complaint details while the ticket is still in Open status.
          </p>
        </div>
      </div>

      {ticket && (
        <TicketForm
          initialData={{
            title: ticket.title,
            category: ticket.category,
            priority: ticket.priority,
            description: ticket.description,
            screenshotUrl: ticket.screenshotUrl || '',
          }}
          onSubmit={handleUpdate}
          isSubmitting={submitting}
          submitLabel="Save Changes"
          onCancel={() => navigate(`/tickets/${id}`)}
          errorMessage={error}
        />
      )}
    </div>
  );
}
