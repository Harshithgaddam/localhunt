import React, { useState ,useEffect,Suspense} from 'react';
import api from '../../api';
import { Link } from 'react-router-dom';
import { FiMapPin, FiSearch, FiStar, FiPhone,FiShoppingBag,FiMap} from 'react-icons/fi';
import AddReviewModal from './AddReviewModal';
import { fetchOSMShops } from "../../utils/osm";
import styles from './CustomerDashboard.module.css';
//import RouteMap from './RouteMap';
const RouteMap = React.lazy(() => import('./RouteMap'));
import { PieChart, Pie, Cell, Tooltip, Legend, BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from 'recharts';


const CustomerDashboard = ({ user }) => {
  const [locationQuery, setLocationQuery] = useState('');
  const [vendors, setVendors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [error, setError] = useState('');
  const [isMapOpen, setIsMapOpen] = useState(false);
  const [selectedVendor, setSelectedVendor] = useState(null);
  const [userLocation, setUserLocation] = useState(null);
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [selectedVendorProducts, setSelectedVendorProducts] = useState([]);
  const [selectedVendorName, setSelectedVendorName] = useState('');
  const [productsLoading, setProductsLoading] = useState(false);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
const [isReviewsListOpen, setIsReviewsListOpen] = useState(false);
const [reviewsForProduct, setReviewsForProduct] = useState([]);
const [reviewsLoading, setReviewsLoading] = useState(false);


  const openReviewModal = (product) => {
    setSelectedProduct(product);
    setIsReviewModalOpen(true);
  };
  const closeReviewModal = () => {
    setIsReviewModalOpen(false);
    setSelectedProduct(null);
  };

  useEffect(() => {
        // Ask for user's permission to get their location
        navigator.geolocation.getCurrentPosition(
            async (position) => {
                const { latitude, longitude } = position.coords;
                setLoading(true);
                setSearched(true); // Treat this as a search
                try {
          // Use the coordinates to fetch vendors from your backend
                    const response = await api.get(`/api/vendors/nearby?lat=${latitude}&lon=${longitude}`);
          const dbVendors = response.data;
          let osmShops = [];
          let normalizedOsmShops = [];

          osmShops = await fetchOSMShops(latitude, longitude, 500); // 500m radius
          console.log(osmShops);
                    setVendors([...dbVendors, ...osmShops]);
                } catch (err) {
                    setError('Could not fetch nearby shops.');
                    console.error(err);
                }
                setLoading(false);
            },
            (err) => {
                setError('Please enable location or use the search bar to find vendors.');
                console.error(err);
            }
        );
    }, []);

    const categories = ['all', 'supermarket', 'convenience', 'bakery', 'restaurant', 'electronics', 'hardware','pet','motorcycle','florist'];
  //filter vendors
    const filteredVendors = vendors.filter(vendor => {
    // If 'all' is selected, the vendor always passes the category filter
    const matchesCategory = selectedCategory === 'all' || vendor.category === selectedCategory;
    return matchesCategory;
  });
// 📊 Dashboard stats
  const totalVendors = vendors.length;
  const categoriesFound = [...new Set(vendors.map(v => v.category || 'Uncategorized'))];

  const chartData = categoriesFound.map(cat => ({
    name: cat,
    value: vendors.filter(v => v.category === cat).length || 1,
  }));

  const COLORS = [
    '#4f46e5', '#10b981', '#f59e0b', '#3b82f6', '#ef4444',
    '#ec4899', '#14b8a6', '#8b5cf6', '#f97316', '#22c55e',
    '#06b6d4', '#a855f7', '#64748b', '#84cc16', '#f43f5e'
  ];
  
  const openMapModal = (vendor) => {
    // First, get the user's most current location
    console.log('Clicked OSM Vendor Object:', vendor);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setUserLocation([latitude, longitude]);
        setSelectedVendor(vendor);
        setIsMapOpen(true);
      },
      (error) => {
        alert("Could not get your location to calculate the route.");
        console.error(error);
      }
    );
  };
  
  const closeMapModal = () => {
    setIsMapOpen(false);
    setSelectedVendor(null);
    setUserLocation(null);
  };

  const handleSubmitReview = async (reviewData) => {
    if (!selectedProduct) return;
    try {
      const token = localStorage.getItem('token');
      console.log("recieved token and calling backend route");
      // Make the API call to your backend review route
      await api.post(`/api/reviews/${selectedProduct._id}`, reviewData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert("Thank you for your review!");
      
      // OPTIONAL: Refresh products to show the updated rating immediately
      // Find the vendor object (needed for handleViewProducts)
      const currentVendor = vendors.find(v => v._id === selectedProduct.vendorId);
      if (currentVendor) {
         handleViewProducts(currentVendor); 
      }
      closeReviewModal();

    } catch (error) {
      console.error("Failed to submit review:", error);
      // Show specific error from backend if available
      alert(error.response?.data?.message || "Failed to submit review.");
    }
  };

  const handleShowReviews = async (product) => {
  setSelectedProduct(product); // Re-use this state to know which product we're viewing
  setIsReviewsListOpen(true);
  setReviewsLoading(true);
  try {
    // Call the new GET route you just created
    const response = await api.get(`/api/reviews/${product._id}`);
    setReviewsForProduct(Array.isArray(response.data) ? response.data : []);
  } catch (error) {
    console.error("Failed to fetch reviews:", error);
    setReviewsForProduct([]);
  } finally {
    setReviewsLoading(false);
  }
};

const closeReviewsList = () => {
  setIsReviewsListOpen(false);
  setReviewsForProduct([]);
  setSelectedProduct(null); // Clear the selected product
};
  const handleViewProducts = async (vendor) => {
    // We don't need to show a map for OSM vendors without products
    console.log(vendor.source);
    if (vendor.source === 'OSM') {
    setSelectedVendorProducts([]); // Ensure the product list is empty
    setProductsLoading(false);
    alert("please visit the store to view products");// Make sure loading is false
    return;
    }
    console.log("in handleViewProducts");
    setSelectedVendorName(vendor.businessName);
    setIsProductModalOpen(true);
    setProductsLoading(true);
    try {
      const response = await api.get(`/api/products/vendor/${vendor._id}`);
      setSelectedVendorProducts(response.data);
    } catch (error) {
      console.error("Failed to fetch products for vendor:", error);
      setSelectedVendorProducts([]); // Ensure it's an empty array on error
    } finally {
      setProductsLoading(false);
      console.log(selectedVendorProducts);
    }
  };
  
  const handleLocationSearch = async (e) => {
    e.preventDefault();
    if (!locationQuery) return;
    
    setLoading(true);
    setVendors([]);
    setSearched(true);
    try {
      const response = await api.get(`/api/vendors?location=${locationQuery}`);
      const dbVendors = response.data;
      console.log(dbVendors);
      const geoRes = await api.get("https://nominatim.openstreetmap.org/search", {
        params: { q: locationQuery, format: "json", limit: 1 },  });
        let osmShops = [];
        if (geoRes.data.length > 0) {
          const { lat, lon } = geoRes.data[0];
          osmShops = await fetchOSMShops(lat, lon, 500); // 500m radius
        }
        console.log(osmShops);
        setVendors([...dbVendors, ...osmShops]);
      } catch (error) {
        alert("Could not fetch vendors. Please try a different location.");
      }
      setLoading(false);
    };
    const closeProductModal = () => {
    setIsProductModalOpen(false);
    setSelectedVendorProducts([]);
    setSelectedVendorName('');
  };
    
return (
    <div className={styles.pageContainer}>
      <header className="dashboard-header"> {/* Assuming global style */}
        <h1>Welcome back, {user?.name}!</h1>
        <p>Enter a location to find vendors registered on Local Hunt.</p>
        <form onSubmit={handleLocationSearch} className="search-filter-container"> {/* Assuming global style */}
          <div className="search-bar"> {/* Assuming global style */}
            <FiMapPin />
            <input
              type="text"
              placeholder="Enter your city or address..."
              value={locationQuery}
              onChange={(e) => setLocationQuery(e.target.value)}
              required
            />
          </div>
          <div className="filter-bar"> {/* Assuming global style */}
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              {categories.map(cat => (
                <option key={cat} value={cat}>
                  {cat.charAt(0).toUpperCase() + cat.slice(1)}
                </option>
              ))}
            </select>
          </div>
          <button type="submit" className="view-shop-btn" style={{ width: 'auto', backgroundColor: '#4f46e5' }}>Find Vendors</button> {/* Assuming global style */}
        </form>
      </header>

      {loading && <p className="info-text">Searching for vendors...</p>} {/* Assuming global style */}
      {error && <p className="error-text">{error}</p>} {/* Assuming global style */}

      {/* Summary Section */}
      {vendors.length > 0 && (
        <section className="summary-section"> {/* Assuming global style */}
          <div className="summary-card"> {/* Assuming global style */}
            <h4>Total Vendors</h4>
            <p>{totalVendors}</p>
          </div>
          <div className="summary-card"> {/* Assuming global style */}
            <h4>Categories Found</h4>
            <p>{categoriesFound.length}</p>
          </div>
          <div className="summary-card"> {/* Assuming global style */}
            <h4>Messages</h4>
            <p>8</p> {/* Placeholder */}
          </div>
          <div className="chart-wrapper"> {/* Assuming global style */}
            <div className="chart-card"> {/* Assuming global style */}
              <h4>Vendors by Category (Pie)</h4>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie data={chartData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} label>
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend layout="horizontal" verticalAlign="bottom" align="center" />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="chart-card"> {/* Assuming global style */}
              <h4>Vendors by Category (Bar)</h4>
               <ResponsiveContainer width="100%" height={300}>
                 <BarChart data={chartData}>
                   <CartesianGrid strokeDasharray="3 3" />
                   <XAxis dataKey="name" tick={{ fontSize: 11 }} angle={-45} textAnchor="end" interval={0} />
                   <YAxis allowDecimals={false} />
                   <Tooltip />
                   <Bar dataKey="value" fill="#4f46e5" radius={[6, 6, 0, 0]} />
                 </BarChart>
               </ResponsiveContainer>
            </div>
          </div>
        </section>
      )}

      {/* Vendor Grid */}
      {!loading && searched && (
        <div className="vendor-grid"> {/* Assuming global style */}
          {filteredVendors.length > 0 ? (
            filteredVendors.map((vendor) => (
              <div key={vendor._id || vendor.id} className={styles.vendorCard} style={{ cursor: 'pointer' }} >
                <div className="vendor-card-header">
                  <h3>{vendor.businessName}</h3>
                  {vendor.source === "OSM" && <span className={styles.vendorTag}>From OSM</span>}
                </div>
                <p><strong>Address:</strong> {vendor.address}</p>
                {vendor.category && (<p><strong>Category:</strong> {vendor.category}</p>)}
                {/* Simplified conditional rendering */}
                {vendor.phone && (<p className={styles.vendorCardInfo}><FiPhone /> {vendor.phone}</p>)}
                <div className="vendor-card-actions">
                  <button className="vendor-action-btn" onClick={() => handleViewProducts(vendor)}>
                    <FiShoppingBag /> View Products
                  </button>
                  <button className="vendor-action-btn" onClick={() => openMapModal(vendor)}>
                    <FiMap /> View Map
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p className="info-text">No vendors found for this location.</p>
          )}
        </div>
      )}

      {/* Map Modal */}
      {isMapOpen && selectedVendor && (
        <div className={styles.modalOverlay} onClick={closeMapModal}>
          <div className={`${styles.modalContent} map-modal-content`}>
            <Suspense fallback={<div>Loading map...</div>}> {/* Added Suspense for lazy loading */}
                <RouteMap
                userLocation={userLocation}
                // Ensure coordinates exist before accessing them
                vendorLocation={selectedVendor?.location?.coordinates ? [selectedVendor.location.coordinates[1], selectedVendor.location.coordinates[0]] : null}
                />
            </Suspense>
          </div>
          <button onClick={closeMapModal} className={styles.modalCloseBtn}>&times;</button>
        </div>
      )}

      {/* Product Modal */}
      {isProductModalOpen && (
        <div className={styles.modalOverlay} onClick={closeProductModal}>
          <div className={`${styles.modalContent} ${styles.productModal}`} onClick={(e) => e.stopPropagation()}>
            <button onClick={closeProductModal} className={styles.modalCloseBtn}>&times;</button>
            <h2>Products from {selectedVendorName}</h2>
            <div className="product-list">
              {productsLoading ? (
                <p>Loading products...</p>
              ) : selectedVendorProducts.length > 0 ? (
                selectedVendorProducts.map(product => (
                  <div key={product._id} className="product-item-card">
                    <img
                      src={product.images[0] ? `${import.meta.env.VITE_API_URL}${product.images[0]}` : 'https://placehold.co/300x200?text=Image'}
                      alt={product.name}
                      className="product-item-image"
                    />
                    <div className={styles.productItemDetails}>
                      <h4>{product.name}</h4>
                      <p>{product.description}</p>
                      <span className={styles.productItemPrice}>${(product.price || 0).toFixed(2)}</span>
                    </div>
                    <div className={styles.productItemFooter}>
                      <div className={styles.productItemRating}>
                        <FiStar style={{ fill: '#facc15', color: '#facc15' }} />
                        <span>{product.rating ? product.rating.toFixed(1) : 'New'} ({product.numReviews || 0})</span>
                      </div>
                      <div className={styles.productItemActions}>
                        <button className={styles.showReviewsBtn} onClick={() => handleShowReviews(product)}>
                          Show Reviews
                        </button>
                        <button className={styles.addReviewBtn} onClick={() => openReviewModal(product)}>
                          Add Review
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <p className={styles.noProductsMessage}>This vendor has not uploaded products yet. You can physically visit the store to see products.</p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* AddReview Modal */}
      {selectedProduct && (
        <AddReviewModal
          isOpen={isReviewModalOpen}
          onClose={closeReviewModal}
          onSubmit={handleSubmitReview}
          productName={selectedProduct.name}
        />
      )}

      {/* Reviews List Modal */}
      {isReviewsListOpen && (
        <div className={styles.modalOverlay} onClick={closeReviewsList}>
          <div className={`${styles.modalContent} ${styles.reviewsListModal}`} onClick={(e) => e.stopPropagation()}>
            <button onClick={closeReviewsList} className={styles.modalCloseBtn}>&times;</button>
            <h2>Reviews for {selectedProduct?.name}</h2>
            <div className="reviews-list-container">
              {reviewsLoading ? (
                <p>Loading reviews...</p>
              ) : reviewsForProduct.length > 0 ? (
                reviewsForProduct.map(review => (
                  <div key={review._id} className={styles.reviewCard}>
                    <div className={styles.reviewCardHeader}>
                      <span className={styles.reviewerName}>{review.userId?.name || 'Anonymous'}</span>
                      <div className={styles.reviewCardStars}>
                        {[...Array(5)].map((_, i) => (
                          <FiStar key={i} style={{ fill: i < review.rating ? '#facc15' : 'none', color: '#facc15' }} />
                        ))}
                      </div>
                    </div>
                    <p className={styles.reviewComment}>"{review.comment}"</p>
                    <span className={styles.reviewDate}>{new Date(review.createdAt).toLocaleDateString()}</span>
                  </div>
                ))
              ) : (
                <p className={styles.noReviewsMessage}>This product has no reviews yet.</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
  };
  
  export default CustomerDashboard;
