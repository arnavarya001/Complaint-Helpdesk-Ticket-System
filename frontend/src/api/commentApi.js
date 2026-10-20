import { api } from './client';

export const getComments = async (ticketId) => {
  return await api.get(`/comments/ticket/${ticketId}`);
};

export const addComment = async (ticketId, text) => {
  return await api.post(`/comments/ticket/${ticketId}`, { text });
};
