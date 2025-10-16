// import React, { useState, useEffect } from 'react';
// import AddProductModal from './AddProductModal';
// import { 
//   FiDollarSign, FiBarChart2, FiPackage, FiMessageCircle, FiHome, 
//   FiPlus, FiEdit3, FiTrash2 
// } from 'react-icons/fi';

// const VendorDashboard = ({ user }) => {
//   const [activeTab, setActiveTab] = useState('overview');
//   const [sales, setSales] = useState([]);
//   const [products, setProducts] = useState([]);
//   const [isModalOpen, setIsModalOpen] = useState(false);

//   useEffect(() => {
//     const allProducts = JSON.parse(localStorage.getItem('allProducts')) || [];
//     const vendorProducts = allProducts.filter(product => product.vendorId === user.id);
//     setProducts(vendorProducts);

//     const mockSales = [
//       { id: 1, name: 'Fresh Apples', date: '8/27/2025', total: 7.98, status: 'completed' },
//       { id: 2, name: 'Banana Bundle', date: '8/28/2025', total: 7.47, status: 'pending' },
//     ];
//     setSales(mockSales);
//   }, [user.id]);

//   const handleAddProduct = (newProductData) => {
//     const allProducts = JSON.parse(localStorage.getItem('allProducts')) || [];
//     const newProduct = {
//       ...newProductData,
//       id: (allProducts.length > 0 ? Math.max(...allProducts.map(p => p.id)) : 0) + 1,
//       vendorId: user.id
//     };
//     const updatedAllProducts = [...allProducts, newProduct];
//     localStorage.setItem('allProducts', JSON.stringify(updatedAllProducts));
//     setProducts(prevProducts => [...prevProducts, newProduct]);
//   };

//   const handleDeleteProduct = (productIdToDelete) => {
//     if (window.confirm('Are you sure you want to delete this product?')) {
//       const allProducts = JSON.parse(localStorage.getItem('allProducts')) || [];
//       const updatedAllProducts = allProducts.filter(p => p.id !== productIdToDelete);
//       localStorage.setItem('allProducts', JSON.stringify(updatedAllProducts));
//       setProducts(prevProducts => prevProducts.filter(p => p.id !== productIdToDelete));
//     }
//   };

//   // ✅ FIX #1: The renderOverview function has been moved INSIDE the component
//   const renderOverview = () => (
//     <>
//       <div className="stats-grid">
//         <div className="stat-card">
//           <div className="stat-card-info"><p>Total Revenue</p><p>$15.45</p></div>
//           <div className="stat-card-icon icon-green"><FiDollarSign size={20}/></div>
//         </div>
//         <div className="stat-card">
//           <div className="stat-card-info"><p>Total Sales</p><p>2</p></div>
//           <div className="stat-card-icon icon-blue"><FiBarChart2 size={20}/></div>
//         </div>
//         <div className="stat-card">
//           <div className="stat-card-info"><p>Active Products</p><p>{products.length}</p></div>
//           <div className="stat-card-icon icon-purple"><FiPackage size={20}/></div>
//         </div>
//         <div className="stat-card">
//           <div className="stat-card-info"><p>Messages</p><p>12</p></div>
//           <div className="stat-card-icon icon-orange"><FiMessageCircle size={20}/></div>
//         </div>
//       </div>
//       <div className="recent-sales-card">
//         <h2>Recent Sales</h2>
//         <div>
//           {sales.map(sale => (
//             <div key={sale.id} className="sales-item">
//               <div className="sales-item-info"><p>{sale.name}</p><p>{sale.date}</p></div>
//               <div className="sales-item-price"><p>${sale.total.toFixed(2)}</p><span className={`status status-${sale.status}`}>{sale.status}</span></div>
//             </div>
//           ))}
//         </div>
//       </div>
//     </>
//   );
  
//   const renderProducts = () => (
//     <div>
//       <div className="products-header">
//         <h2>My Products</h2>
//         <button className="add-product-btn" onClick={() => setIsModalOpen(true)}>
//           <FiPlus size={16} /> Add Product
//         </button>
//       </div>
//       <div className="products-grid">
//         {products.map(product => (
//           <div key={product.id} className="product-card">
//             <img src={product.images[0]} alt={product.name} className="product-card-image"/>
//             <div className="product-card-content">
//               <div className="product-card-header"><h3>{product.name}</h3>{product.isAvailable && <span className="status-badge">Available</span>}</div>
//               <p>{product.description}</p>
//               <div className="product-card-footer">
//                 <span className="product-price">${product.price.toFixed(2)}</span>
//                 <span className="product-stock">Stock: {product.stock}</span>
//               </div>
//               <div className="product-actions">
//                 <button className="edit-btn"><FiEdit3 size={14}/> Edit</button>
//                 {/* ✅ FIX #2: The onClick handler has been added to the delete button */}
//                 <button className="delete-btn" onClick={() => handleDeleteProduct(product.id)}>
//                   <FiTrash2 size={14}/>
//                 </button>
//               </div>
//             </div>
//           </div>
//         ))}
//         {products.length === 0 && <p>You haven't added any products yet.</p>}
//       </div>
//     </div>
//   );

//   return (
//     <div>
//       <div className="content-header">
//         <div className="content-header-icon"><FiHome size={24}/></div>
//         <div><h1>Vendor Dashboard</h1><p>Manage your shop, products, and sales</p></div>
//       </div>
//       <div className="tabs-nav">
//         <button className={activeTab === 'overview' ? 'active' : ''} onClick={() => setActiveTab('overview')}>Overview</button>
//         <button className={activeTab === 'products' ? 'active' : ''} onClick={() => setActiveTab('products')}>Products</button>
//         <button className={activeTab === 'sales' ? 'active' : ''} onClick={() => setActiveTab('sales')}>Sales</button>
//         <button className={activeTab === 'messages' ? 'active' : ''} onClick={() => setActiveTab('messages')}>Messages</button>
//       </div>
//       <div>
//         {activeTab === 'overview' && renderOverview()}
//         {activeTab === 'products' && renderProducts()}
//         {activeTab === 'sales' && <div>Sales History Page Coming Soon...</div>}
//         {activeTab === 'messages' && <div>Messages Page Coming Soon...</div>}
//       </div>
//       <AddProductModal 
//         isOpen={isModalOpen} 
//         onClose={() => setIsModalOpen(false)}
//         onAddProduct={handleAddProduct}
//       />
//     </div>
//   );
// };

// export default VendorDashboard;

import React, { useState, useEffect } from 'react';
import axios from 'axios';
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
        const response = await axios.get('/api/products', getAuthHeaders());
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
    // Axios will automatically set the correct headers for FormData
    const response = await axios.post('/api/products', productFormData, getAuthHeaders());
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
        await axios.delete(`/api/products/${productIdToDelete}`, getAuthHeaders());
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