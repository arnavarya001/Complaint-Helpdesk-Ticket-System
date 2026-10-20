import React, { useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './pages/Login';
import Register from './pages/Register';
import Tickets from './pages/Tickets';
import NewTicket from './pages/NewTicket';
import TicketDetails from './pages/TicketDetails';
import EditTicket from './pages/EditTicket';
import AdminTickets from './pages/AdminTickets';
import Departments from './pages/Departments';
import Dashboard from './pages/Dashboard';
import NotFound from './pages/NotFound';
import './App.css';

export default function App() {
  const [user, setUser] = useState(() => {
    try {
      const stored = localStorage.getItem('user');
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  const handleLoginSuccess = (userData, token) => {
    localStorage.setItem('user', JSON.stringify(userData));
    localStorage.setItem('token', token);
    setUser(userData);
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    setUser(null);
  };

  return (
    <div className="app-layout">
      <Navbar user={user} onLogout={handleLogout} />
      <main className="main-content">
        <Routes>
          <Route path="/" element={user ? (user.role === 'admin' ? <Navigate to="/admin/dashboard" replace /> : <Navigate to="/tickets" replace />) : <Navigate to="/login" replace />} />
          <Route path="/login" element={user ? <Navigate to={user.role === 'admin' ? '/admin/dashboard' : '/tickets'} replace /> : <Login onLoginSuccess={handleLoginSuccess} />} />
          <Route path="/register" element={user ? <Navigate to={user.role === 'admin' ? '/admin/dashboard' : '/tickets'} replace /> : <Register onLoginSuccess={handleLoginSuccess} />} />
          <Route path="/tickets" element={<ProtectedRoute user={user}><Tickets user={user} /></ProtectedRoute>} />
          <Route path="/tickets/new" element={<ProtectedRoute user={user}><NewTicket user={user} /></ProtectedRoute>} />
          <Route path="/tickets/:id" element={<ProtectedRoute user={user}><TicketDetails user={user} /></ProtectedRoute>} />
          <Route path="/tickets/:id/edit" element={<ProtectedRoute user={user}><EditTicket user={user} /></ProtectedRoute>} />
          <Route path="/admin/dashboard" element={<ProtectedRoute user={user} requiredRole="admin"><Dashboard user={user} /></ProtectedRoute>} />
          <Route path="/admin/tickets" element={<ProtectedRoute user={user} requiredRole="admin"><AdminTickets user={user} /></ProtectedRoute>} />
          <Route path="/admin/departments" element={<ProtectedRoute user={user} requiredRole="admin"><Departments user={user} /></ProtectedRoute>} />
          <Route path="*" element={<NotFound user={user} />} />
        </Routes>
      </main>
      <footer className="site-footer">
        <div className="footer-content">
          <p>HelpDesk Complaint Management System &bull; Assignment 6 individual project</p>
          <p className="footer-sub">Built with MongoDB Atlas, Express.js, React.js, and Node.js (MERN)</p>
        </div>
      </footer>
    </div>
  );
}
