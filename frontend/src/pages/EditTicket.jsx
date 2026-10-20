import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getTicketById, updateTicket } from '../api/ticketApi';
import TicketForm from '../components/TicketForm';

export default function EditTicket() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [ticket, setTicket] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    getTicketById(id).then(setTicket).catch((err) => setError(err.message));
  }, [id]);

  const handleUpdate = async (formData) => {
    try {
      await updateTicket(id, formData);
      navigate(`/tickets/${id}`);
    } catch (err) {
      setError(err.message || 'Update failed');
    }
  };

  if (!ticket) return <div className="page-container"><p>Loading...</p></div>;
  if (ticket.status !== 'Open') {
    return (
      <div className="page-container">
        <p style={{ color: 'red' }}>Only Open tickets can be edited.</p>
        <button onClick={() => navigate(`/tickets/${id}`)} className="btn btn-secondary">Back</button>
      </div>
    );
  }

  return (
    <div className="page-container">
      <h2>Edit Ticket ({ticket.ticketId})</h2>
      <TicketForm
        initialData={ticket}
        onSubmit={handleUpdate}
        submitLabel="Save Changes"
        onCancel={() => navigate(`/tickets/${id}`)}
        errorMessage={error}
      />
    </div>
  );
}
