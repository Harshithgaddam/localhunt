import React, { useState } from 'react';
import { FiX, FiStar } from 'react-icons/fi';
import './Dashboard.css'; // We'll add styles to this file

const RateVendorModal = ({ isOpen, onClose, onSubmit, vendorName }) => {
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [comment, setComment] = useState('');

  const handleSubmit = () => {
    if (rating === 0) {
      alert("Please select a star rating.");
      return;
    }
    onSubmit({ rating, comment });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h2>Rate {vendorName}</h2>
          <button onClick={onClose} className="close-btn"><FiX size={24} /></button>
        </div>
        <div className="rating-body">
          <p>Select a rating:</p>
          <div className="star-rating">
            {[...Array(5)].map((star, index) => {
              const ratingValue = index + 1;
              return (
                <label key={index}>
                  <input
                    type="radio"
                    name="rating"
                    value={ratingValue}
                    onClick={() => setRating(ratingValue)}
                    style={{ display: 'none' }}
                  />
                  <FiStar
                    className="star"
                    color={ratingValue <= (hover || rating) ? "#ffc107" : "#e4e5e9"}
                    size={30}
                    onMouseEnter={() => setHover(ratingValue)}
                    onMouseLeave={() => setHover(0)}
                  />
                </label>
              );
            })}
          </div>
          <div className="form-group" style={{marginTop: '1.5rem'}}>
            <label htmlFor="comment">Add a comment (optional)</label>
            <textarea 
              id="comment" 
              value={comment} 
              onChange={(e) => setComment(e.target.value)}
              placeholder="How was your experience?"
            />
          </div>
        </div>
        <div className="form-actions">
          <button type="button" className="cancel-btn" onClick={onClose}>Cancel</button>
          <button type="button" className="submit-btn" onClick={handleSubmit}>Submit Review</button>
        </div>
      </div>
    </div>
  );
};

export default RateVendorModal;