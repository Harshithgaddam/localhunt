import React, { useState, useEffect } from 'react';
import { FiMapPin, FiSearch, FiStar, FiPhone, FiFilter, FiBookmark } from 'react-icons/fi';

const CustomerDashboard = ({ user }) => {
  const [vendors, setVendors] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  useEffect(() => {
    // Mock vendor data. In a real app, you would fetch this from your backend API.
    const mockVendors = [
      { id: '1', businessName: 'Fresh Fruits Corner', description: 'Fresh organic fruits and vegetables', category: 'Grocery', location: { address: '123 Main St, New York, NY' }, contact: { phone: '+1234567890' }, images: ['/img/vendor1.png'], rating: 4.5, reviewCount: 128, isVerified: true, isOpen: false },
      { id: '2', businessName: 'Tech Repair Hub', description: 'Professional electronics repair services', category: 'Electronics', location: { address: '456 Tech Ave, New York, NY' }, contact: { phone: '+1234567891' }, images: ['/img/vendor2.png'], rating: 4.8, reviewCount: 89, isVerified: true, isOpen: true },
      { id: '3', businessName: 'Cozy Coffee Corner', description: 'Artisan coffee and fresh pastries', category: 'Food & Beverage', location: { address: '789 Coffee St, New York, NY' }, contact: { phone: '+1234567892' }, images: ['/img/vendor3.png'], rating: 4.3, reviewCount: 203, isVerified: true, isOpen: true },
    ];
    setVendors(mockVendors);
  }, []);

  const categories = ['all', 'Grocery', 'Electronics', 'Food & Beverage'];

  const filteredVendors = vendors.filter(vendor => {
    const matchesSearch = vendor.businessName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || vendor.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div>
      <header className="dashboard-header">
        <div className="customer-header-top">
            <div>
                <h1>Welcome back, {user?.name}!</h1>
                <p>Discover amazing local vendors in your area</p>
            </div>
            <button className="map-view-btn"><FiMapPin size={16}/> Map View</button>
        </div>
        <div className="search-filter-container">
          <div className="search-bar">
            <FiSearch />
            <input type="text" placeholder="Search for vendors, products, or services..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
          </div>
           <div className="filter-bar">
             <select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)}>
               {categories.map(cat => <option key={cat} value={cat}>{cat === 'all' ? 'All Categories' : cat}</option>)}
             </select>
           </div>
           <button className="map-view-btn"><FiFilter size={16}/></button>
        </div>
      </header>

      <div className="vendor-grid">
        {filteredVendors.map((vendor) => (
          <div key={vendor.id} className="vendor-card">
            <div className="vendor-card-image-container">
                <img src={vendor.images[0]} alt={vendor.businessName} className="vendor-card-image"/>
                {vendor.isVerified && <span className="badge verified">Verified</span>}
                {vendor.isOpen ? (
                    <span className="badge open">Open</span>
                ) : (
                    <span className="badge closed">Closed</span>
                )}
            </div>
            <div className="vendor-card-content">
              <div className="vendor-card-header">
                <h3>{vendor.businessName}</h3>
                <span className="vendor-card-rating">
                  <FiStar style={{ fill: '#facc15', color: '#facc15' }}/> 
                  {vendor.rating} ({vendor.reviewCount})
                </span>
              </div>
              <p>{vendor.description}</p>
              <div className="vendor-card-info">
                <FiMapPin /> <span>{vendor.location.address}</span>
              </div>
              <div className="vendor-card-info">
                <FiPhone /> <span>{vendor.contact.phone}</span>
              </div>
              <div className="vendor-card-actions">
                <button className="view-shop-btn">View Shop</button>
                <button className="bookmark-btn"><FiBookmark /></button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CustomerDashboard;