import { api } from './client';

export const getDepartments = async () => {
  return await api.get('/departments');
};

export const createDepartment = async (departmentData) => {
  return await api.post('/departments', departmentData);
};

export const updateDepartment = async (id, departmentData) => {
  return await api.put(`/departments/${id}`, departmentData);
};

export const deleteDepartment = async (id) => {
  return await api.delete(`/departments/${id}`);
};
