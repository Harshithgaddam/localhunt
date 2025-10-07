// // // import React, { useState, useEffect } from 'react';
// // // import { FiMapPin, FiSearch, FiStar, FiPhone, FiFilter, FiBookmark } from 'react-icons/fi';

// // // const CustomerDashboard = ({ user }) => {
// // //   const [vendors, setVendors] = useState([]);
// // //   const [searchQuery, setSearchQuery] = useState('');
// // //   const [selectedCategory, setSelectedCategory] = useState('all');

// // //   useEffect(() => {
// // //     // Mock vendor data. In a real app, you would fetch this from your backend API.
// // //     const mockVendors = [
// // //       { id: '1', businessName: 'Fresh Fruits Corner', description: 'Fresh organic fruits and vegetables', category: 'Grocery', location: { address: '123 Main St, New York, NY' }, contact: { phone: '+1234567890' }, images: ['/img/vendor1.png'], rating: 4.5, reviewCount: 128, isVerified: true, isOpen: false },
// // //       { id: '2', businessName: 'Tech Repair Hub', description: 'Professional electronics repair services', category: 'Electronics', location: { address: '456 Tech Ave, New York, NY' }, contact: { phone: '+1234567891' }, images: ['/img/vendor2.png'], rating: 4.8, reviewCount: 89, isVerified: true, isOpen: true },
// // //       { id: '3', businessName: 'Cozy Coffee Corner', description: 'Artisan coffee and fresh pastries', category: 'Food & Beverage', location: { address: '789 Coffee St, New York, NY' }, contact: { phone: '+1234567892' }, images: ['/img/vendor3.png'], rating: 4.3, reviewCount: 203, isVerified: true, isOpen: true },
// // //     ];
// // //     setVendors(mockVendors);
// // //   }, []);

// // //   const categories = ['all', 'Grocery', 'Electronics', 'Food & Beverage'];

// // //   const filteredVendors = vendors.filter(vendor => {
// // //     const matchesSearch = vendor.businessName.toLowerCase().includes(searchQuery.toLowerCase());
// // //     const matchesCategory = selectedCategory === 'all' || vendor.category === selectedCategory;
// // //     return matchesSearch && matchesCategory;
// // //   });

// // //   return (
// // //     <div>
// // //       <header className="dashboard-header">
// // //         <div className="customer-header-top">
// // //             <div>
// // //                 <h1>Welcome back, {user?.name}!</h1>
// // //                 <p>Discover amazing local vendors in your area</p>
// // //             </div>
// // //             <button className="map-view-btn"><FiMapPin size={16}/> Map View</button>
// // //         </div>
// // //         <div className="search-filter-container">
// // //           <div className="search-bar">
// // //             <FiSearch />
// // //             <input type="text" placeholder="Search for vendors, products, or services..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
// // //           </div>
// // //            <div className="filter-bar">
// // //              <select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)}>
// // //                {categories.map(cat => <option key={cat} value={cat}>{cat === 'all' ? 'All Categories' : cat}</option>)}
// // //              </select>
// // //            </div>
// // //            <button className="map-view-btn"><FiFilter size={16}/></button>
// // //         </div>
// // //       </header>

// // //       <div className="vendor-grid">
// // //         {filteredVendors.map((vendor) => (
// // //           <div key={vendor.id} className="vendor-card">
// // //             <div className="vendor-card-image-container">
// // //                 <img src={vendor.images[0]} alt={vendor.businessName} className="vendor-card-image"/>
// // //                 {vendor.isVerified && <span className="badge verified">Verified</span>}
// // //                 {vendor.isOpen ? (
// // //                     <span className="badge open">Open</span>
// // //                 ) : (
// // //                     <span className="badge closed">Closed</span>
// // //                 )}
// // //             </div>
// // //             <div className="vendor-card-content">
// // //               <div className="vendor-card-header">
// // //                 <h3>{vendor.businessName}</h3>
// // //                 <span className="vendor-card-rating">
// // //                   <FiStar style={{ fill: '#facc15', color: '#facc15' }}/> 
// // //                   {vendor.rating} ({vendor.reviewCount})
// // //                 </span>
// // //               </div>
// // //               <p>{vendor.description}</p>
// // //               <div className="vendor-card-info">
// // //                 <FiMapPin /> <span>{vendor.location.address}</span>
// // //               </div>
// // //               <div className="vendor-card-info">
// // //                 <FiPhone /> <span>{vendor.contact.phone}</span>
// // //               </div>
// // //               <div className="vendor-card-actions">
// // //                 <button className="view-shop-btn">View Shop</button>
// // //                 <button className="bookmark-btn"><FiBookmark /></button>
// // //               </div>
// // //             </div>
// // //           </div>
// // //         ))}
// // //       </div>
// // //     </div>
// // //   );
// // // };

// // // export default CustomerDashboard;
// // import React, { useState } from 'react';
// // import axios from 'axios';
// // import { Link } from 'react-router-dom';
// // import { FiMapPin, FiSearch, FiStar, FiPhone } from 'react-icons/fi';
// // import RateVendorModal from './RateVendorModal'; 
// // const CustomerDashboard = ({ user }) => {
// //   const [locationQuery, setLocationQuery] = useState('');
// //   const [vendors, setVendors] = useState([]);
// //   const [loading, setLoading] = useState(false);
// //   const [searched, setSearched] = useState(false);
// // const [isRatingModalOpen, setIsRatingModalOpen] = useState(false);
// //   const [selectedVendor, setSelectedVendor] = useState(null);

// //   const handleLocationSearch = async (e) => {
// //     e.preventDefault();
// //     if (!locationQuery) return;
// //     setLoading(true);
// //     setVendors([]);
// //     setSearched(true);
// //     try {
// //       const response = await axios.get(`/api/vendors?location=${locationQuery}`);
// //       setVendors(response.data);
// //     } catch (error) {
// //       alert("Could not fetch vendors. Please try a different location.");
// //     }
// //     setLoading(false);
// //   };
// //   const openRatingModal = (vendor) => {
// //     setSelectedVendor(vendor);
// //     setIsRatingModalOpen(true);
// //   };
  
// //   const handleRateVendor = async (reviewData) => {
// //     if (!selectedVendor) return;
// //     try {
// //       const token = localStorage.getItem('token');
// //       await axios.post(`/api/reviews/${selectedVendor._id}`, reviewData, {
// //         headers: { Authorization: `Bearer ${token}` }
// //       });
// //       alert("Thank you for your review!");
// //       // Optionally, refresh the vendor list to show the new average rating
// //       handleLocationSearch({ preventDefault: () => {} }); // Re-run the search
// //     } catch (error) {
// //       alert("Failed to submit review. You may have already reviewed this vendor.");
// //     }
// //   };

// //   return (
// //     <div>
// //       <header className="dashboard-header">
// //         <h1>Welcome back, {user?.name}!</h1>
// //         <p>Enter a location to find vendors registered on Local Hunt.</p>
// //         <form onSubmit={handleLocationSearch} className="search-filter-container">
// //           <div className="search-bar">
// //             <FiMapPin />
// //             <input
// //               type="text"
// //               placeholder="Enter your city or address..."
// //               value={locationQuery}
// //               onChange={(e) => setLocationQuery(e.target.value)}
// //               required
// //             />
// //           </div>
// //           <button type="submit" className="view-shop-btn" style={{ width: 'auto' }}>Find Vendors</button>
// //         </form>
// //       </header>

// //       {loading && <p className="info-text">Searching for vendors...</p>}
      
// //       {!loading && searched && (
// //         <div className="vendor-grid">
// //           {vendors.length > 0 ? (
// //             vendors.map((vendor) => (
// //               // ✅ FIX: The vendor card JSX is now much simpler
              
// //               <div key={vendor._id} className="vendor-card simple-vendor-card">
// //                 <div className="vendor-card-header">
// //                   <h3>{vendor.businessName}</h3>
// //                   <span className="vendor-card-rating">
// //                     <FiStar style={{ fill: '#facc15', color: '#facc15' }}/>  {vendor.rating.toFixed(1)} ({vendor.numReviews})
// //                   </span>
// //                 </div>
// //                 <p className="vendor-owner-name">Operated by: {vendor.owner?.name || 'N/A'}</p>
// //                 <div className="vendor-card-info">
// //                   <FiPhone /> <span>{vendor.contactInfo?.phone || 'No phone number provided'}</span>
// //                 </div>
// //                 <Link to={`/vendors/${vendor._id}`} className="view-shop-btn" style={{marginTop: '1rem'}}>View Products</Link>
// //             <button className="rate-vendor-btn" onClick={() => openRatingModal(vendor)}>Rate Vendor</button>
// //                 <Link to={`/vendors/${vendor._id}`} className="view-shop-btn" style={{marginTop: '1rem'}}>
// //                   View Products
// //                 </Link>
// //               </div>
// //             ))
// //           ) : (
// //             <p className="info-text">No vendors found for this location.</p>
// //           )}
// //         </div>
// //       )}
// //       {selectedVendor && (
// //          <RateVendorModal 
// //             isOpen={isRatingModalOpen}
// //             onClose={() => setIsRatingModalOpen(false)}
// //             onSubmit={handleRateVendor}
// //             vendorName={selectedVendor.businessName}
// //          />
// //       )}
// //     </div>
// //   );
// // };

// // export default CustomerDashboard;
import React, { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { FiMapPin, FiSearch, FiStar, FiPhone } from 'react-icons/fi';
import { fetchOSMShops } from "../../../../backend/utils/osm";

const CustomerDashboard = ({ user }) => {
  const [locationQuery, setLocationQuery] = useState('');
  const [vendors, setVendors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  const handleLocationSearch = async (e) => {
    e.preventDefault();
    if (!locationQuery) return;

    setLoading(true);
    setVendors([]);
    setSearched(true);
    try {
      const response = await axios.get(`/api/vendors?location=${locationQuery}`);
      const dbVendors = response.data;
      const geoRes = await axios.get("https://nominatim.openstreetmap.org/search", {
      params: { q: locationQuery, format: "json", limit: 1 },  });
      let osmShops = [];
    if (geoRes.data.length > 0) {
      const { lat, lon } = geoRes.data[0];
      osmShops = await fetchOSMShops(lat, lon, 500); // 500m radius
    }
    setVendors([...dbVendors, ...osmShops]);
    } catch (error) {
      alert("Could not fetch vendors. Please try a different location.");
    }
    setLoading(false);
  };

  return (
    <div>
      <header className="dashboard-header">
        <h1>Welcome back, {user?.name}!</h1>
        <p>Enter a location to find vendors registered on Local Hunt.</p>
        <form onSubmit={handleLocationSearch} className="search-filter-container">
          <div className="search-bar">
            <FiMapPin />
            <input
              type="text"
              placeholder="Enter your city or address..."
              value={locationQuery}
              onChange={(e) => setLocationQuery(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="view-shop-btn" style={{ width: 'auto', backgroundColor: '#4f46e5' }}>Find Vendors</button>
        </form>
      </header>

      {loading && <p className="info-text">Searching for vendors...</p>}
      
      {!loading && searched && (
        <div className="vendor-grid">
          {vendors.length > 0 ? (
  vendors.map((vendor) => (
    <div key={vendor._id || vendor.id} className="vendor-card simple-vendor-card">
      <div className="vendor-card-header">
        <h3>{vendor.businessName}</h3>
        {vendor.source === "OSM" && <span className="vendor-tag">[From Map]</span>}
      </div>

      <p><strong>Address:</strong> {vendor.address}</p>

      {vendor.category && (
        <p><strong>Category:</strong> {vendor.category}</p>
      )}

      {vendor.brand && (
        <p><strong>Brand:</strong> {vendor.brand}</p>
      )}

      {vendor.phone && (
        <p className="vendor-card-info">
          <FiPhone /> {vendor.phone}
        </p>
      )}

      {vendor.website && (
        <p>
          🌐 <a href={vendor.website} target="_blank" rel="noopener noreferrer">{vendor.website}</a>
        </p>
      )}

      {vendor.email && (
        <p>✉️ {vendor.email}</p>
      )}

      {vendor.openingHours && (
        <p><strong>Hours:</strong> {vendor.openingHours}</p>
      )}
    </div>
  ))
) : (
  <p className="info-text">No vendors found for this location.</p>
)}
        </div>
      )}
    </div>
  );
};

export default CustomerDashboard;
// import React, { useState } from "react";
// import axios from "axios";
// import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
// import { FiMapPin, FiPhone, FiStar } from "react-icons/fi";

// const CustomerDashboard = ({ user }) => {
//   const [locationQuery, setLocationQuery] = useState("");
//   const [businesses, setBusinesses] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [mapCenter, setMapCenter] = useState([20.5937, 78.9629]); // Default to India
//   const [searched, setSearched] = useState(false);

//   const handleLocationSearch = async (e) => {
//     e.preventDefault();
//     if (!locationQuery) return;

//     setLoading(true);
//     setBusinesses([]);
//     setSearched(true);

//     try {
//       // Step 1: Geocode location with OpenStreetMap
//       const geoRes = await axios.get("https://nominatim.openstreetmap.org/search", {
//         params: { q: locationQuery, format: "json", limit: 1 },
//       });

//       if (geoRes.data.length === 0) {
//         alert("Location not found");
//         setLoading(false);
//         return;
//       }

//       const { lat, lon } = geoRes.data[0];
//       setMapCenter([parseFloat(lat), parseFloat(lon)]);

//       // Step 2: Fetch businesses from backend (Foursquare Places API)
//       const res = await axios.get(`/api/vendors?lat=${lat}&lon=${lon}`);
//           setBusinesses(Array.isArray(res.data) ? res.data : []);

//     } catch (error) {
//       console.error(error);
//       alert("Could not fetch businesses. Please try again.");
//     }

//     setLoading(false);
//   };

//   return (
//     <div>
//       <header className="dashboard-header">
//         <h1>Welcome back, {user?.name}!</h1>
//         <p>Enter a location to find vendors nearby.</p>
//         <form onSubmit={handleLocationSearch} className="search-filter-container">
//           <div className="search-bar">
//             <FiMapPin />
//             <input
//               type="text"
//               placeholder="Enter city or address..."
//               value={locationQuery}
//               onChange={(e) => setLocationQuery(e.target.value)}
//               required
//             />
//           </div>
//           <button type="submit" className="view-shop-btn">
//             Find Vendors
//           </button>
//         </form>
//       </header>

//       {loading && <p className="info-text">Searching for vendors...</p>}

//       {!loading && searched && businesses.length === 0 && (
//         <p className="info-text">No vendors found for this location.</p>
//       )}
// {console.log(businesses)}
//       {!loading && businesses.length > 0 && (
//         <div style={{ height: "500px", marginTop: "2rem" }}>
//           <MapContainer center={mapCenter} zoom={15} style={{ height: "100%" }}>
//             <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            
//             {businesses.map((b) => (
//               <Marker key={b.id} position={[b.lat, b.lon]}>
//                 <Popup>
//                   <strong>{b.name}</strong>
//                   <br />
//                   {b.address}
//                   <br />
//                   Category: {b.category}
//                   <br />
//                   {b.phone && (
//                     <span>
//                       <FiPhone /> {b.phone}
//                       <br />
//                     </span>
//                   )}
//                   {b.website && (
//                     <span>
//                       Website:{" "}
//                       <a href={b.website} target="_blank" rel="noreferrer">
//                         {b.website}
//                       </a>
//                       <br />
//                     </span>
//                   )}
//                   {b.rating && (
//                     <span>
//                       <FiStar /> {b.rating}
//                     </span>
//                   )}
//                 </Popup>
//               </Marker>
//             ))}
//           </MapContainer>
//         </div>
//       )}
//     </div>
//   );
// };

// export default CustomerDashboard;
