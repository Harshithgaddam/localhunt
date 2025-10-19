import React, { useState, useEffect } from 'react';
import api from '../../api';
import { FiUsers, FiShoppingBag, FiBarChart2, FiArrowLeft } from 'react-icons/fi';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const [stats, setStats] = useState({ totalUsers: 0, totalVendors: 0 });
  const [users, setUsers] = useState([]);
  const [vendors, setVendors] = useState([]);
  const [view, setView] = useState('stats'); // 'stats', 'users', or 'vendors'

  const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    return { headers: { Authorization: `Bearer ${token}` } };
  };

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await api.get('/api/admin/stats', getAuthHeaders());
        setStats(response.data);
      } catch (error) {
        console.error("Failed to fetch stats:", error);
      }
    };
    fetchStats();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await api.get('/api/admin/users', getAuthHeaders());
      setUsers(response.data);
      console.log(users);
      setView('users');
    } catch (error) {
      console.error("Failed to fetch users:", error);
    }
  };

  const fetchVendors = async () => {
    try {
      const response = await api.get('/api/admin/vendors', getAuthHeaders());
      setVendors(response.data);
      console.log(vendors);
      setView('vendors');
    } catch (error) {
      console.error("Failed to fetch vendors:", error);
    }
  };

  const handleBanUser = async (userId) => {
    if (window.confirm('Are you sure you want to change the ban status for this user?')) {
      try {
        await api.put(`/api/admin/users/${userId}/ban`, {}, getAuthHeaders());
        fetchUsers(); // Refresh the list
      } catch (error) {
        console.error("Failed to ban user:", error);
      }
    }
  };

  const handleBanVendor = async (vendorId) => {
    if (window.confirm('Are you sure you want to change the ban status for this vendor?')) {
      try {
        await api.put(`/api/admin/vendors/${vendorId}/ban`, {}, getAuthHeaders());
        fetchVendors(); // Refresh the list
      } catch (error) {
        console.error("Failed to ban vendor:", error);
      }
    }
  };

  const renderStatsView = () => (
    <>
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-card-icon icon-users"><FiUsers size={24} /></div>
          <div className="stat-card-info">
            <p className="stat-label">Total Users</p>
            <p className="stat-value">{stats.totalUsers}</p>
          </div>
          <button className="manage-btn" onClick={fetchUsers}>Manage Users</button>
        </div>
        <div className="stat-card">
          <div className="stat-card-icon icon-vendors"><FiShoppingBag size={24} /></div>
          <div className="stat-card-info">
            <p className="stat-label">Total Vendors</p>
            <p className="stat-value">{stats.totalVendors}</p>
          </div>
          <button className="manage-btn" onClick={fetchVendors}>Manage Vendors</button>
        </div>
      </div>
      <div className="dashboard-section">
        <h2>Recent Activity</h2>
        <p className="placeholder-text"><FiBarChart2 /> Charts and logs will be here.</p>
      </div>
    </>
  );

  const renderUsersView = () => (
    <div className="management-view">
      <button className="back-btn" onClick={() => setView('stats')}><FiArrowLeft /> Back to Dashboard</button>
      <h2>Manage Users</h2>
      <table>
        <thead><tr><th>Name</th><th>Email</th><th>Status</th><th>Action</th></tr></thead>
        <tbody>
          {users.map(user => (
            <tr key={user._id}>
              <td>{user.name}</td>
              <td>{user.email}</td>
              <td><span className={user.isBanned ? 'status-banned' : 'status-active'}>{user.isBanned ? 'Banned' : 'Active'}</span></td>
              <td><button className="ban-btn" onClick={() => handleBanUser(user._id)}>{user.isBanned ? 'Unban' : 'Ban'}</button></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  const renderVendorsView = () => (
    <div className="management-view">
      <button className="back-btn" onClick={() => setView('stats')}><FiArrowLeft /> Back to Dashboard</button>
      <h2>Manage Vendors</h2>
      <table>
        <thead><tr><th>Business Name</th><th>Owner</th><th>Status</th><th>Action</th></tr></thead>
        <tbody>
          {vendors.map(vendor => (
            <tr key={vendor._id}>
              <td>{vendor.businessName}</td>
              <td>{vendor.owner?.name || 'N/A'}</td>
              <td><span className={vendor.isBanned ? 'status-banned' : 'status-active'}>{vendor.isBanned ? 'Banned' : 'Active'}</span></td>
              <td><button className="ban-btn" onClick={() => handleBanVendor(vendor._id)}>{vendor.isBanned ? 'Unban' : 'Ban'}</button></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  return (
    <div className="admin-dashboard">
      <header className="dashboard-header">
        <h1>Admin Dashboard</h1>
        <p>Overview of your platform's activity.</p>
      </header>
      {view === 'stats' && renderStatsView()}
      {view === 'users' && renderUsersView()}
      {view === 'vendors' && renderVendorsView()}
    </div>
  );
};

export default AdminDashboard;