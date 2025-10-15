import React, { useState, useEffect } from 'react';
import { useNavigate, Link ,} from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import CustomerDashboard from './CustomerDashboard';
import VendorDashboard from './VendorDashboard';
import AdminDashboard from './AdminDashboard';
import './AdminDashboard.css'
import './Dashboard.css';
import { FiGrid, FiShoppingBag, FiMessageSquare, FiSettings, FiLogOut, FiMapPin } from 'react-icons/fi';

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate(); 
  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        setUser(decodedToken);
      } catch (error) {
        handleLogout();
      }
    } else {
      navigate('/login');
    }
  }, [navigate]);
  
  
  
  if (!user) {
    return <div>Loading...</div>; 
  }
  
  return (
    <div className="app-layout">
    {/* Sidebar */}
    <aside className="sidebar">
    <div className="sidebar-header">
    <FiMapPin />
    <span>Local Hunt</span>
    </div>
    <nav className="sidebar-nav">
    <Link to="/dashboard" className="active"><FiGrid /> Dashboard</Link>
     <Link to="/dashboard/myshop"><FiShoppingBag /> My Shop</Link>
  <Link to="/dashboard/messages"><FiMessageSquare /> Messages</Link>
  <Link to="/dashboard/settings"><FiSettings /> Settings</Link>
    </nav>
    </aside>
    
    {/* Main Content */}
    <main className="main-content">
    <header className="top-bar">
    <div className="user-info">
    <div className="top-bar-welcome">
    <span>Welcome, {user.name}</span>
    </div>
    <div className="user-avatar">{user?.name?.charAt(0)||'?'}</div>
    <button onClick={handleLogout} className="logout-btn" title="Logout">
    <FiLogOut size={20}/>
    </button>
    </div>
    </header>
    
    <div className="dashboard-content">
    
     {user.accountType === 'customer' ? (
      <CustomerDashboard user={user} />
      ) : (user.accountType === 'admin' ? (<AdminDashboard user={user}/>):(
      <VendorDashboard user={user} />
      ))} 
     
      </div>
      </main>
      </div>
    );
  };
  
  export default Dashboard;