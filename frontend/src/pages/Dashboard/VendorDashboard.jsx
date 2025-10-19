import React, { useState, useEffect } from 'react';
import api from './api';
import AddProductModal from './AddProductModal';
import { 
  FiDollarSign, FiBarChart2, FiPackage, FiMessageCircle, FiHome, 
  FiPlus, FiEdit3, FiTrash2 
} from 'react-icons/fi';

const VendorDashboard = ({ user }) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [products, setProducts] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Function to get the auth token from localStorage
  const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    return {
      headers: {
        Authorization: `Bearer ${token}`
      }
    };
  };

  // Fetch products from the database when the component loads
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await api.get('/api/products', getAuthHeaders());
        setProducts(response.data);
      } catch (error) {
        console.error("Failed to fetch products:", error);
      }
    };
    fetchProducts();
  }, []);
  
  // Save a new product to the database
  const handleAddProduct = async (productFormData) => {
  try {
    const response = await api.post('/api/products', productFormData, getAuthHeaders());
    setProducts(prevProducts => [...prevProducts, response.data]);
  } catch (error) {
    console.error("Failed to add product:", error);
    alert("Error: Could not add product.");
  }
};
  // Delete a product from the database
  const handleDeleteProduct = async (productIdToDelete) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await api.delete(`/api/products/${productIdToDelete}`, getAuthHeaders());
        setProducts(prevProducts => prevProducts.filter(p => p._id !== productIdToDelete));
      } catch (error) {
        console.error("Failed to delete product:", error);
        alert("Error: Could not delete product.");
      }
    }
  };

  const renderProducts = () => (
  // This is now the single root element
  <div>
    <div className="products-header">
      <h2>My Products</h2>
      <button className="add-product-btn" onClick={() => setIsModalOpen(true)}>
        <FiPlus size={16} />
        Add Product
      </button>
    </div>
    {/* {console.log(products)} */}
    <div className="products-grid">
      {products.map(product => (
        <div key={product._id} className="product-card">
          <img src={product.images[0] || '/img/placeholder.jpg'} alt={product.name} className="product-card-image"/>
          <div className="product-card-content">
            <div className="product-card-header">
              <h3>{product.name}</h3>
              {product.isAvailable && <span className="status-badge">Available</span>}
            </div>
            <p>{product.description}</p>
            <div className="product-card-footer">
              <span className="product-price">${product.price.toFixed(2)}</span>
              <span className="product-stock">Stock: {product.stock}</span>
            </div>
            <div className="product-actions">
              <button className="edit-btn"><FiEdit3 size={14}/> Edit</button>
              <button className="delete-btn" onClick={() => handleDeleteProduct(product._id)}>
                <FiTrash2 size={14}/>
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>

    {/* ✅ FIX: The "no products" message is now INSIDE the main div */}
    {products.length === 0 && <p>You haven't added any products yet.</p>}
  </div>
);
  
  const renderOverview = () => (
     <div>Overview of sales and stats coming soon...</div>
  );

  return (
    <div>
      <div className="content-header">
        <div className="content-header-icon"><FiHome size={24}/></div>
        <div><h1>Vendor Dashboard</h1><p>Manage your shop, products, and sales</p></div>
      </div>
      <div className="tabs-nav">
        <button className={activeTab === 'overview' ? 'active' : ''} onClick={() => setActiveTab('overview')}>Overview</button>
        <button className={activeTab === 'products' ? 'active' : ''} onClick={() => setActiveTab('products')}>Products</button>
        {/* Other tabs can be added here */}
      </div>
      <div>
        {activeTab === 'overview' && renderOverview()}
        {activeTab === 'products' && renderProducts()}
      </div>
      <AddProductModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)}
        onAddProduct={handleAddProduct}
      />
    </div>
  );
};

export default VendorDashboard;