import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getDashboardStats } from '../api/dashboardApi';
import StatusBadge from '../components/StatusBadge';
import PriorityBadge from '../components/PriorityBadge';
import LoadingSpinner from '../components/LoadingSpinner';
import Alert from '../components/Alert';

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchStats = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await getDashboardStats();
      setStats(data);
    } catch (err) {
      setError(err.message || 'Failed to load dashboard metrics.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="page-container">
        <LoadingSpinner message="Calculating dashboard statistics from database records..." />
      </div>
    );
  }

  if (error || !stats) {
    return (
      <div className="page-container">
        <Alert type="error" message={error || 'Unable to load statistics.'} />
        <button type="button" onClick={fetchStats} className="btn btn-primary">
          Retry
        </button>
      </div>
    );
  }

  const {
    summary,
    statusBreakdown,
    priorityBreakdown,
    categoryBreakdown,
    recentTickets,
  } = stats;

  const total = summary.totalTickets || 1; // Prevent division by zero

  return (
    <div className="page-container">
      {/* Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">Admin Support Dashboard</h1>
          <p className="page-subtitle">
            Real-time analytics, queue distribution, and SLA resolution performance
          </p>
        </div>
        <button
          type="button"
          onClick={fetchStats}
          className="btn btn-secondary btn-sm"
        >
          🔄 Refresh Metrics
        </button>
      </div>

      {/* Primary KPI Metric Cards */}
      <div className="metrics-grid">
        <div className="metric-card card">
          <div className="metric-header">
            <span className="metric-title">Total Complaints</span>
            <span className="metric-icon">📑</span>
          </div>
          <div className="metric-value">{summary.totalTickets}</div>
          <div className="metric-sub">Across all customer accounts</div>
        </div>

        <div className="metric-card card card-blue">
          <div className="metric-header">
            <span className="metric-title">Open Tickets</span>
            <span className="metric-icon">📬</span>
          </div>
          <div className="metric-value text-blue">{summary.openCount}</div>
          <div className="metric-sub">
            {((summary.openCount / total) * 100).toFixed(0)}% of total complaints
          </div>
        </div>

        <div className="metric-card card card-amber">
          <div className="metric-header">
            <span className="metric-title">In Progress</span>
            <span className="metric-icon">⏳</span>
          </div>
          <div className="metric-value text-amber">{summary.inProgressCount}</div>
          <div className="metric-sub">Currently under investigation</div>
        </div>

        <div className="metric-card card card-green">
          <div className="metric-header">
            <span className="metric-title">Resolved Tickets</span>
            <span className="metric-icon">✅</span>
          </div>
          <div className="metric-value text-green">{summary.resolvedCount}</div>
          <div className="metric-sub">
            {((summary.resolvedCount / total) * 100).toFixed(0)}% resolution rate
          </div>
        </div>

        <div className="metric-card card card-purple">
          <div className="metric-header">
            <span className="metric-title">Avg Resolution Time</span>
            <span className="metric-icon">⚡</span>
          </div>
          <div className="metric-value text-purple">
            {summary.avgResolutionHours} <span className="metric-unit">hrs</span>
          </div>
          <div className="metric-sub">From ticket creation to resolution</div>
        </div>

        <div className="metric-card card">
          <div className="metric-header">
            <span className="metric-title">Closed (Archived)</span>
            <span className="metric-icon">📁</span>
          </div>
          <div className="metric-value text-muted">{summary.closedCount}</div>
          <div className="metric-sub">Read-only finished tickets</div>
        </div>
      </div>

      {/* Analytics Breakdown Grid */}
      <div className="analytics-charts-grid">
        {/* Status Breakdown Bar Card */}
        <div className="chart-card card">
          <h3 className="section-title">Status Breakdown (Open vs Resolved)</h3>
          <p className="chart-subtitle">Distribution of complaints across ticket lifecycle</p>

          <div className="chart-bars-list">
            <div className="chart-bar-item">
              <div className="bar-labels">
                <span className="bar-label-name">Open</span>
                <span className="bar-label-val">
                  {statusBreakdown['Open']} ({((statusBreakdown['Open'] / total) * 100).toFixed(0)}%)
                </span>
              </div>
              <div className="bar-track">
                <div
                  className="bar-fill bg-cyan"
                  style={{ width: `${(statusBreakdown['Open'] / total) * 100}%` }}
                ></div>
              </div>
            </div>

            <div className="chart-bar-item">
              <div className="bar-labels">
                <span className="bar-label-name">In Progress</span>
                <span className="bar-label-val">
                  {statusBreakdown['In Progress']} ({((statusBreakdown['In Progress'] / total) * 100).toFixed(0)}%)
                </span>
              </div>
              <div className="bar-track">
                <div
                  className="bar-fill bg-amber"
                  style={{ width: `${(statusBreakdown['In Progress'] / total) * 100}%` }}
                ></div>
              </div>
            </div>

            <div className="chart-bar-item">
              <div className="bar-labels">
                <span className="bar-label-name">Resolved</span>
                <span className="bar-label-val">
                  {statusBreakdown['Resolved']} ({((statusBreakdown['Resolved'] / total) * 100).toFixed(0)}%)
                </span>
              </div>
              <div className="bar-track">
                <div
                  className="bar-fill bg-emerald"
                  style={{ width: `${(statusBreakdown['Resolved'] / total) * 100}%` }}
                ></div>
              </div>
            </div>

            <div className="chart-bar-item">
              <div className="bar-labels">
                <span className="bar-label-name">Closed</span>
                <span className="bar-label-val">
                  {statusBreakdown['Closed']} ({((statusBreakdown['Closed'] / total) * 100).toFixed(0)}%)
                </span>
              </div>
              <div className="bar-track">
                <div
                  className="bar-fill bg-slate"
                  style={{ width: `${(statusBreakdown['Closed'] / total) * 100}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>

        {/* Priority Breakdown Card */}
        <div className="chart-card card">
          <h3 className="section-title">Priority Breakdown</h3>
          <p className="chart-subtitle">Urgency levels of customer complaints</p>

          <div className="chart-bars-list">
            <div className="chart-bar-item">
              <div className="bar-labels">
                <span className="bar-label-name text-red">High Priority</span>
                <span className="bar-label-val font-semibold">
                  {priorityBreakdown['High'] || 0} tickets
                </span>
              </div>
              <div className="bar-track">
                <div
                  className="bar-fill bg-rose"
                  style={{ width: `${((priorityBreakdown['High'] || 0) / total) * 100}%` }}
                ></div>
              </div>
            </div>

            <div className="chart-bar-item">
              <div className="bar-labels">
                <span className="bar-label-name text-amber">Medium Priority</span>
                <span className="bar-label-val font-semibold">
                  {priorityBreakdown['Medium'] || 0} tickets
                </span>
              </div>
              <div className="bar-track">
                <div
                  className="bar-fill bg-amber"
                  style={{ width: `${((priorityBreakdown['Medium'] || 0) / total) * 100}%` }}
                ></div>
              </div>
            </div>

            <div className="chart-bar-item">
              <div className="bar-labels">
                <span className="bar-label-name text-blue">Low Priority</span>
                <span className="bar-label-val font-semibold">
                  {priorityBreakdown['Low'] || 0} tickets
                </span>
              </div>
              <div className="bar-track">
                <div
                  className="bar-fill bg-blue"
                  style={{ width: `${((priorityBreakdown['Low'] || 0) / total) * 100}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>

        {/* Category Breakdown Card */}
        <div className="chart-card card">
          <h3 className="section-title">Category Breakdown</h3>
          <p className="chart-subtitle">Complaint volume categorized by problem domain</p>

          <div className="category-tags-grid">
            {Object.entries(categoryBreakdown).map(([cat, count]) => (
              <div key={cat} className="category-stat-pill">
                <span className="cat-pill-name">{cat}</span>
                <span className="cat-pill-count">{count}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Department & Operational Overview */}
        <div className="chart-card card">
          <h3 className="section-title">System Infrastructure</h3>
          <p className="chart-subtitle">Operational departments and userbase stats</p>

          <div className="infra-stats-grid">
            <div className="infra-box">
              <span className="infra-num">{summary.totalDepartments}</span>
              <span className="infra-label">Active Departments</span>
              <Link to="/admin/departments" className="infra-link">
                Manage Departments &rarr;
              </Link>
            </div>
            <div className="infra-box">
              <span className="infra-num">{summary.totalCustomers}</span>
              <span className="infra-label">Registered Customers</span>
              <span className="infra-sub">Active Portal Users</span>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Tickets Table */}
      <div className="recent-tickets-section card">
        <div className="recent-header">
          <div>
            <h3 className="section-title">Recent Tickets</h3>
            <span className="recent-subtitle">Latest complaints received in the system</span>
          </div>
          <Link to="/admin/tickets" className="btn btn-outline btn-sm">
            View All {summary.totalTickets} Tickets &rarr;
          </Link>
        </div>

        <div className="table-wrapper">
          <table className="data-table">
            <thead>
              <tr>
                <th>Ticket ID</th>
                <th>Subject</th>
                <th>Customer</th>
                <th>Department</th>
                <th>Priority</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {recentTickets.map((t) => (
                <tr key={t._id}>
                  <td>
                    <span className="table-ticket-id">{t.ticketId}</span>
                  </td>
                  <td>
                    <Link to={`/tickets/${t._id}`} className="table-ticket-title">
                      {t.title}
                    </Link>
                  </td>
                  <td>{t.customer ? t.customer.name : 'Unknown'}</td>
                  <td>{t.department ? t.department.name : 'Unassigned'}</td>
                  <td>
                    <PriorityBadge priority={t.priority} />
                  </td>
                  <td>
                    <StatusBadge status={t.status} />
                  </td>
                  <td>
                    <Link to={`/tickets/${t._id}`} className="btn btn-outline btn-xs">
                      View
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
