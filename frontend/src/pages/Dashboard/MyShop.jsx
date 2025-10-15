import React from 'react';
import { useOutletContext } from 'react-router-dom';
const MyShop = () => {
      const { user } = useOutletContext() || {};
       if (!user) {
    return <div>Loading user data...</div>;
  }

  return (
    <div className="page-container">
      <h2>🛍 My Shop</h2>
      <p>Welcome, {user.name}. Here you can manage your shops, products, and vendor details.</p>
    </div>
  );
};

export default MyShop;
