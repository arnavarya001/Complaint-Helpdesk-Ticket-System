import { api } from './client';

export const loginUser = async (credentials) => api.post('/auth/login', credentials);
export const registerUser = async (userData) => api.post('/auth/register', userData);
export const getMe = async () => api.get('/auth/me');
