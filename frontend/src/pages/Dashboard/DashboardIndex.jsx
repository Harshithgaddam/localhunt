// In DashboardIndex.jsx
import React, { useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';
import CustomerDashboard from './CustomerDashboard';
import VendorDashboard from './VendorDashboard';
import AdminDashboard from './AdminDashboard';

// Helper hook to get the user from the token
const useUserFromToken = () => {
  const [user, setUser] = useState(null);
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setUser(jwtDecode(token));
    }
  }, []);
  return user;
};

const DashboardIndex = () => {
  const user = useUserFromToken();

  if (!user) {
    return <div>Loading...</div>;
  }

  // Your original logic now lives here
  switch (user.accountType) {
    case 'customer':
      return <CustomerDashboard user={user} />;
    case 'admin':
      return <AdminDashboard user={user} />;
    case 'vendor':
      return <VendorDashboard user={user} />;
    default:
      return <div>Welcome to your dashboard!</div>; // Fallback
  }
};

export default DashboardIndex;