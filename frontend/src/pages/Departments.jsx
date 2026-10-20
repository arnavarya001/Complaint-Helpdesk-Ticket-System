import React, { useState, useEffect } from 'react';
import { getDepartments, createDepartment, deleteDepartment } from '../api/departmentApi';

export default function Departments() {
  const [departments, setDepartments] = useState([]);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [msg, setMsg] = useState('');

  const loadDepts = async () => {
    try {
      const data = await getDepartments();
      setDepartments(data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => { loadDepts(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) return;
    try {
      await createDepartment({ name, description });
      setName('');
      setDescription('');
      setMsg('Department created successfully!');
      loadDepts();
    } catch (err) {
      setMsg(err.message || 'Creation failed');
    }
  };

  const handleDelete = async (id, dName) => {
    if (!window.confirm(`Delete department "${dName}"?`)) return;
    try {
      await deleteDepartment(id);
      setDepartments(departments.filter((d) => d._id !== id));
      setMsg('Department deleted');
    } catch (err) {
      setMsg(err.message || 'Delete failed');
    }
  };

  return (
    <div className="page-container">
      <h1 className="page-title">Departments</h1>
      {msg && <p style={{ color: msg.includes('fail') ? 'red' : 'green', margin: '10px 0' }}>{msg}</p>}

      <div className="card" style={{ marginTop: '15px' }}>
        <h3>Create New Department</h3>
        <form onSubmit={handleSubmit} style={{ display: 'flex', gap: '10px', marginTop: '10px', flexWrap: 'wrap' }}>
          <input
            type="text"
            placeholder="Department Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="form-input"
            required
            style={{ maxWidth: '250px' }}
          />
          <input
            type="text"
            placeholder="Description (optional)"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="form-input"
            style={{ maxWidth: '300px' }}
          />
          <button type="submit" className="btn btn-primary btn-sm">Add Department</button>
        </form>
      </div>

      <div className="card" style={{ marginTop: '20px' }}>
        <h3>Active Departments ({departments.length})</h3>
        <table className="data-table" style={{ marginTop: '10px' }}>
          <thead>
            <tr>
              <th>Name</th>
              <th>Description</th>
              <th>Active Tickets</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {departments.map((d) => (
              <tr key={d._id}>
                <td><strong>{d.name}</strong></td>
                <td>{d.description || 'N/A'}</td>
                <td>{d.ticketCount || 0}</td>
                <td>
                  <button onClick={() => handleDelete(d._id, d.name)} className="btn btn-danger-outline btn-xs">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
