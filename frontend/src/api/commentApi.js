import { api } from './client';

export const getComments = async (ticketId) => api.get(`/comments/ticket/${ticketId}`);
export const addComment = async (ticketId, text) => api.post(`/comments/ticket/${ticketId}`, { text });
