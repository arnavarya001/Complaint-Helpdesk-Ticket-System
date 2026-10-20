import { api } from './client';

export const getTickets = async (filters = {}) => {
  const query = new URLSearchParams();
  if (filters.status && filters.status !== 'All') query.append('status', filters.status);
  if (filters.priority && filters.priority !== 'All') query.append('priority', filters.priority);
  if (filters.category && filters.category !== 'All') query.append('category', filters.category);
  if (filters.search) query.append('search', filters.search);
  const queryString = query.toString() ? `?${query.toString()}` : '';
  return api.get(`/tickets${queryString}`);
};

export const getTicketById = async (id) => api.get(`/tickets/${id}`);
export const createTicket = async (data) => api.post('/tickets', data);
export const updateTicket = async (id, data) => api.put(`/tickets/${id}`, data);
export const reopenTicket = async (id) => api.post(`/tickets/${id}/reopen`, {});
export const deleteTicket = async (id) => api.delete(`/tickets/${id}`);
