import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getDashboardStats } from '../api/dashboardApi';

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadStats = async () => {
    try {
      setLoading(true);
      const data = await getDashboardStats();
      setStats(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadStats(); }, []);

  if (loading) return <div className="page-container"><p>Loading dashboard...</p></div>;
  if (!stats) return <div className="page-container"><p>Failed to load metrics.</p></div>;

  const { summary, priorityBreakdown, categoryBreakdown, recentTickets } = stats;

  return (
    <div className="page-container">
      <div className="page-header">
        <h1 className="page-title">Admin Support Dashboard</h1>
        <button onClick={loadStats} className="btn btn-secondary btn-sm">Refresh</button>
      </div>

      <div className="metrics-grid">
        <div className="metric-card card">
          <span className="metric-title">Total Tickets</span>
          <div className="metric-value">{summary.totalTickets}</div>
        </div>
        <div className="metric-card card card-blue">
          <span className="metric-title">Open Tickets</span>
          <div className="metric-value text-blue">{summary.openCount}</div>
        </div>
        <div className="metric-card card card-amber">
          <span className="metric-title">In Progress</span>
          <div className="metric-value text-amber">{summary.inProgressCount}</div>
        </div>
        <div className="metric-card card card-green">
          <span className="metric-title">Resolved</span>
          <div className="metric-value text-green">{summary.resolvedCount}</div>
        </div>
        <div className="metric-card card card-purple">
          <span className="metric-title">Avg Resolution</span>
          <div className="metric-value text-purple">{summary.avgResolutionHours} hrs</div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px', marginTop: '20px' }}>
        <div className="card">
          <h3>Priority Breakdown</h3>
          <ul style={{ listStyle: 'none', padding: 0, marginTop: '10px' }}>
            <li><strong>High:</strong> {priorityBreakdown['High'] || 0} tickets</li>
            <li><strong>Medium:</strong> {priorityBreakdown['Medium'] || 0} tickets</li>
            <li><strong>Low:</strong> {priorityBreakdown['Low'] || 0} tickets</li>
          </ul>
        </div>
        <div className="card">
          <h3>Category Breakdown</h3>
          <ul style={{ listStyle: 'none', padding: 0, marginTop: '10px' }}>
            {Object.entries(categoryBreakdown).map(([cat, count]) => (
              <li key={cat}><strong>{cat}:</strong> {count} tickets</li>
            ))}
          </ul>
        </div>
      </div>

      <div className="card" style={{ marginTop: '20px' }}>
        <h3>Recent Complaints</h3>
        <table className="data-table" style={{ marginTop: '10px' }}>
          <thead>
            <tr>
              <th>ID</th>
              <th>Title</th>
              <th>Customer</th>
              <th>Priority</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {recentTickets.map((t) => (
              <tr key={t._id}>
                <td><Link to={`/tickets/${t._id}`}>{t.ticketId}</Link></td>
                <td>{t.title}</td>
                <td>{t.customer ? t.customer.name : 'Unknown'}</td>
                <td>{t.priority}</td>
                <td><span className={`status-badge badge-status-${t.status.toLowerCase().replace(' ', '-')}`}>{t.status}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
