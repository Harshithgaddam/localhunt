import React, { useState, useEffect } from 'react';
import api from '../../api';
import AddProductModal from './AddProductModal';
import styles from './VendorDashboard.module.css';
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
<div>
      <div className={styles.productsHeader}>
        <h2>My Products</h2>
        <button className={styles.addProductBtn} onClick={() => setIsModalOpen(true)}>
          <FiPlus size={16} />
          Add Product
        </button>
      </div>
      <div className={styles.productsGrid}>
        {/* Ensure products is an array before mapping */}
        {Array.isArray(products) && products.map(product => (
          <div key={product._id} className={styles.productCard}>
            <img
              src={product.images && product.images[0] ? `${import.meta.env.VITE_API_URL}${product.images[0]}` : 'https://placehold.co/300x200?text=Image'}
              alt={product.name}
              className={styles.productCardImage}
            />
            <div className={styles.productCardContent}>
              <div className={styles.productCardHeader}>
                <h3>{product.name}</h3>
                {product.isAvailable && <span className={styles.statusBadge}>Available</span>}
              </div>
              <p>{product.description}</p>
              <div className={styles.productCardFooter}>
                <span className={styles.productPrice}>${(product.price || 0).toFixed(2)}</span>
                <span className={styles.productStock}>Stock: {product.stock || 0}</span>
              </div>
              <div className={styles.productActions}>
                {/* Ensure styles.editBtn is defined in your CSS Module or remove styles. prefix */}
                <button className={styles.editBtn || ''}><FiEdit3 size={14}/> Edit</button>
                <button className={styles.deleteBtn} onClick={() => handleDeleteProduct(product._id)}>
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
     // Apply CSS module class names here
     <div className={styles.dashboardSection}>
       <h2>Overview</h2>
       <p className={styles.placeholderText}>
         <FiBarChart2 /> Overview of sales and stats coming soon...
       </p>
     </div>
   );

  return (
    // Use pageContainer from the module for overall padding/layout
    <div className={styles.pageContainer}>
      <div className={styles.contentHeader}>
        <div className={styles.contentHeaderIcon}><FiHome size={24}/></div>
        <div><h1>Vendor Dashboard</h1><p>Manage your shop, products, and sales</p></div>
      </div>
      <div className={styles.tabsNav}>
        <button
          className={activeTab === 'overview' ? styles.active : ''}
          onClick={() => setActiveTab('overview')}
        >
          Overview
        </button>
        <button
           className={activeTab === 'products' ? styles.active : ''}
           onClick={() => setActiveTab('products')}
        >
          Products
        </button>
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