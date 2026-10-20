import { api } from './client';

export const getDepartments = async () => api.get('/departments');
export const createDepartment = async (data) => api.post('/departments', data);
export const updateDepartment = async (id, data) => api.put(`/departments/${id}`, data);
export const deleteDepartment = async (id) => api.delete(`/departments/${id}`);
