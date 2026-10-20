import { api } from './client';

export const getDashboardStats = async () => api.get('/dashboard/stats');
