import React, { useState } from 'react';
import { FiX } from 'react-icons/fi';

const AddProductModal = ({ isOpen, onClose, onAddProduct }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [stock, setStock] = useState('');
  const [category, setCategory] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [isAvailable, setIsAvailable] = useState(true);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Use FormData to package the form data and the image file
    const formData = new FormData();
    formData.append('name', name);
    formData.append('description', description);
    formData.append('price', price);
    formData.append('stock', stock);
    formData.append('category', category);
    formData.append('isAvailable', isAvailable);
    if (imageFile) {
      formData.append('image', imageFile);
    }
    
    onAddProduct(formData);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h2>Add New Product</h2>
          <button onClick={onClose} className="close-btn"><FiX size={24} /></button>
        </div>
        <form onSubmit={handleSubmit} className="modal-form">
          <div className="form-group">
            <label htmlFor="name">Product Name</label>
            <input id="name" type="text" value={name} onChange={(e) => setName(e.target.value)} required />
          </div>
          <div className="form-group">
            <label htmlFor="category">Category</label>
            <input id="category" type="text" value={category} onChange={(e) => setCategory(e.target.value)} placeholder="e.g., Fruits, Electronics" required />
          </div>
          <div className="form-group">
            <label htmlFor="description">Description</label>
            <textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} />
          </div>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="price">Price ($)</label>
              <input id="price" type="number" step="0.01" value={price} onChange={(e) => setPrice(e.target.value)} required />
            </div>
            <div className="form-group">
              <label htmlFor="stock">Stock</label>
              <input id="stock" type="number" value={stock} onChange={(e) => setStock(e.target.value)} required />
            </div>
          </div>
          <div className="form-group">
            <label htmlFor="image">Product Image</label>
            <input 
              id="image" 
              type="file" 
              accept="image/*"
              onChange={(e) => setImageFile(e.target.files[0])} 
              className="input-field"
            />
          </div>
          <div className="form-group-checkbox">
            <input id="isAvailable" type="checkbox" checked={isAvailable} onChange={(e) => setIsAvailable(e.target.checked)} />
            <label htmlFor="isAvailable">Product is Available</label>
          </div>
          <div className="form-actions">
            <button type="button" className="cancel-btn" onClick={onClose}>Cancel</button>
            <button type="submit" className="submit-btn">Add Product</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddProductModal;