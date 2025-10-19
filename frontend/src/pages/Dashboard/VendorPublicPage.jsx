import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from './api';
import './Dashboard.css';
import { FiMapPin, FiArrowLeft, FiShoppingBag, FiMessageSquare, FiSettings, FiGrid, FiLogOut,FiStar } from 'react-icons/fi';

const VendorPublicPage = () => {
  const { id } = useParams(); // Gets vendor ID from the URL (e.g., /vendors/12345)
  const [vendor, setVendor] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const [showModal, setShowModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState("");

  useEffect(() => {
    const fetchVendorData = async () => {
      try {
        const response = await api.get(`/api/vendors/${id}`);
        setVendor(response.data.vendor);
        setProducts(response.data.products);
      } catch (error) {
        console.error("Failed to fetch vendor data:", error);
      }
      setLoading(false);
    };
    fetchVendorData();
  }, [id]);

    const handleOpenModal = (product) => {
    setSelectedProduct(product);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setRating(0);
    setReview("");
  };

  const handleSubmitReview = async () => {
    if (!rating) {
      alert("Please select a star rating!");
      return;
    }
    const token = localStorage.getItem("token"); // ✅ get token

  if (!token) {
    alert("You must be logged in to submit a review!");
    return;
  }
    try {
      await api.post(`/api/reviews/${selectedProduct._id}`, {
        rating,
        comment:review,
      },{headers: { Authorization: `Bearer ${token}` }});
      alert("Review submitted successfully!");
      handleCloseModal();
    } catch (err) {
      console.error("Error submitting review:", err);
      alert("Error submitting review.");
    }
  };


  if (loading) return <div className="info-text">Loading Shop...</div>;
  if (!vendor) return <div className="info-text">Vendor not found.</div>;

  return (
    <div className="app-layout">
      {/* For simplicity, we're repeating the sidebar/topbar. In a larger app, this would be a shared Layout component. */}
      <aside className="sidebar">
        <div className="sidebar-header"><FiMapPin /><span>Local Hunt</span></div>
        <nav className="sidebar-nav">
          <Link to="/dashboard"><FiGrid /> Dashboard</Link>
          <Link to="/my-shop"><FiShoppingBag /> My Shop</Link>
          <Link to="/messages"><FiMessageSquare /> Messages</Link>
          <Link to="/settings"><FiSettings /> Settings</Link>
        </nav>
      </aside>
      
      <main className="main-content">
        <header className="top-bar">
          <div className="user-info">
             <span>Welcome, Customer</span>
             <div className="user-avatar">C</div>
             <button className="logout-btn" title="Logout"><FiLogOut size={20}/></button>
          </div>
        </header>

        <div className="dashboard-content">
          <Link to="/dashboard" className="back-link"><FiArrowLeft size={16}/> Back to Search</Link>
          
          <div className="vendor-page-header">
            <div>
              <h1>{vendor.businessName}</h1>
              <p>{vendor.description || "The best local goods, right in your neighborhood."}</p>
              <div className="vendor-card-info" style={{marginTop: '0.5rem'}}><FiMapPin /> <span>{vendor.address}</span></div>
            </div>
          </div>
          
          <h2 className="products-title">Products</h2>
          <div className="products-grid">
            {products.length > 0 ? (
              products.map((product) => (
                <div key={product._id} className="product-card">
                  <img src={product.images[0] || '/img/placeholder.jpg'} alt={product.name} className="product-card-image"/>
                  <div className="product-card-content">
                    <div className="product-card-header"><h3>{product.name}</h3></div>
                    <div className="product-card-footer">
                      <span className="product-price">${product.price.toFixed(2)}</span>
                      <span className="product-stock">Stock: {product.stock}</span>
                      
                    </div>
                    <button className="rate-btn"onClick={() => handleOpenModal(product)}>
                         ⭐ Rate Product
                      </button>
                  </div>
                </div>
              ))
            ) : (
              <p>This vendor has not added any products yet.</p>
            )}
          </div>
        </div>
        {showModal && (
  <div className="modal-overlay">
    <div className="modal">
      <h2>Rate {selectedProduct?.name}</h2>

      {/* Stars */}
      <div className="stars">
        {[1, 2, 3, 4, 5].map((star) => (
          <FiStar
            key={star}
            size={28}
            onClick={() => setRating(star)}
            className={star <= rating ? "star selected" : "star"}
          />
        ))}
      </div>

      {/* Review Input */}
      <textarea
        placeholder="Write your review..."
        value={review}
        onChange={(e) => setReview(e.target.value)}
        rows="4"
      />

      {/* Buttons */}
      <div className="modal-actions">
        <button onClick={handleSubmitReview} className="submit-btn">
          Submit
        </button>
        <button onClick={handleCloseModal} className="cancel-btn">
          Cancel
        </button>
      </div>
    </div>
  </div>
)}

      </main>
    </div>
  );
};

export default VendorPublicPage;