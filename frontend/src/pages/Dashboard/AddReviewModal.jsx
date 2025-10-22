import React, { useState } from 'react';
import { FiStar } from 'react-icons/fi';
import './AddReviewModal.css'; // We'll add styles later

const AddReviewModal = ({ isOpen, onClose, onSubmit, productName }) => {
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [comment, setComment] = useState('');

  if (!isOpen) {
    return null;
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    if (rating === 0) {
      alert('Please select a star rating.');
      return;
    }
    onSubmit({ rating, comment });
    // Reset state and close
    setRating(0);
    setComment('');
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content review-modal" onClick={(e) => e.stopPropagation()}>
        <button onClick={onClose} className="modal-close-btn">&times;</button>
        <h2>Add Your Review for {productName}</h2>
        <form onSubmit={handleSubmit}>
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
                    style={{ display: 'none' }} // Hide the radio button
                  />
                  <FiStar
                    className="star"
                    color={ratingValue <= (hover || rating) ? "#ffc107" : "#e4e5e9"}
                    size={30}
                    onMouseEnter={() => setHover(ratingValue)}
                    onMouseLeave={() => setHover(0)}
                    style={{ cursor: 'pointer' }}
                  />
                </label>
              );
            })}
          </div>
          <textarea
            placeholder="Write your comment here..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            required
            rows={4}
          ></textarea>
          <button type="submit" className="submit-review-btn">Submit Review</button>
        </form>
      </div>
    </div>
  );
};

export default AddReviewModal;