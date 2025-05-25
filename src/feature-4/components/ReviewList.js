import React, { useState, useEffect, useCallback } from 'react';
import { Star, Edit3, Trash2, PlusCircle, MessageSquare, UserCircle, Wrench, AlertTriangle, Loader2 } from 'lucide-react';
import '../../App.css';
// Assuming authService is in a path like this, adjust if necessary
import authService from '../../auth/services/authService'; // Added import

const API_BASE_URL = 'http://localhost:8080';

// REMOVED: MOCK_AUTH_TOKEN and MOCK_CURRENT_USER_ID

const StarRating = ({ rating }) => {
  const totalStars = 5;
  return (
    <div className="star-rating">
      {[...Array(totalStars)].map((_, index) => (
        <Star
          key={index}
          size={18}
          className={index < rating ? 'star-filled' : 'star-empty'}
        />
      ))}
      <span className="rating-text">({rating.toFixed(1)})</span>
    </div>
  );
};

const ReviewItem = ({ review, onDelete, onEdit }) => {
  const {
    id,
    userName,
    technicianName,
    rating,
    comment,
    createdAt,
    updatedAt,
    canEditDelete
  } = review;

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="review-item">
      <div className="review-item-header">
        <div className="review-item-userinfo">
          <div className="user-line">
            <UserCircle size={20} className="icon user-icon" />
            <h3>{userName || 'Anonymous User'}</h3>
          </div>
          <div className="technician-line">
            <Wrench size={16} className="icon tech-icon" />
            <span>Reviewed Technician: <span className="technician-name">{technicianName || 'Unknown Technician'}</span></span>
          </div>
        </div>
        <StarRating rating={rating} />
      </div>

      <p className="review-comment">{comment}</p>

      <div className="review-item-footer">
        <div className="review-dates">
          <p>Posted: {formatDate(createdAt)}</p>
          {updatedAt && createdAt !== updatedAt && (
            <p>Updated: {formatDate(updatedAt)}</p>
          )}
        </div>
        {canEditDelete && (
          <div className="review-actions">
            <button
              onClick={() => onEdit(id)}
              className="review-action-button edit-button"
              aria-label="Edit review"
            >
              <Edit3 size={16} className="icon" /> Edit
            </button>
            <button
              onClick={() => onDelete(id)}
              className="review-action-button delete-button"
              aria-label="Delete review"
            >
              <Trash2 size={16} className="icon" /> Delete
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

const ReviewList = () => {
  const [reviews, setReviews] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAddReviewModal, setShowAddReviewModal] = useState(false);
  const [editingReview, setEditingReview] = useState(null);

  // REMOVED: const [authToken] = useState(MOCK_AUTH_TOKEN);

  const fetchReviews = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    const token = authService.getToken(); // Get token dynamically

    try {
      const headers = {};
      if (token) { // Check if token exists
        headers['Authorization'] = `Bearer ${token}`;
      }
      const response = await fetch(`${API_BASE_URL}/reviews`, { headers });
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Failed to fetch reviews or server returned non-JSON error' }));
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setReviews(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.message);
      setReviews([]);
    } finally {
      setIsLoading(false);
    }
  }, []); // authToken removed from dependency array

  useEffect(() => {
    fetchReviews();
  }, [fetchReviews]);

  const handleDeleteReview = async (reviewId) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this review? This action cannot be undone.');
    if (!confirmDelete) return;

    const token = authService.getToken(); // Get token dynamically
    if (!token) {
        setError("Authentication token not found. Please log in.");
        return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/reviews/${reviewId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` },
      });
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Failed to delete review' }));
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }
      setReviews(prevReviews => prevReviews.filter(review => review.id !== reviewId));
      console.log('Review deleted successfully!');
    } catch (err) {
      setError(`Failed to delete review: ${err.message}`);
      console.error(`Error deleting review: ${err.message}`);
    }
  };

  const handleEditReview = (reviewId) => {
    const reviewToEdit = reviews.find(r => r.id === reviewId);
    if (reviewToEdit) {
      setEditingReview(reviewToEdit);
      setShowAddReviewModal(true);
    }
  };

  const handleOpenAddReviewModal = () => {
    setEditingReview(null);
    setShowAddReviewModal(true);
  };

  const handleCloseAddReviewModal = () => {
    setShowAddReviewModal(false);
    setEditingReview(null);
  };

  const handleSaveReview = async (reviewData) => {
    const method = editingReview ? 'PUT' : 'POST';
    const url = editingReview ? `${API_BASE_URL}/reviews/${editingReview.id}` : `${API_BASE_URL}/reviews`;
    const token = authService.getToken(); // Get token dynamically

    if (!token) {
        // This error should ideally be shown in the modal
        alert("Authentication token not found. Please log in.");
        throw new Error("Authentication token not found.");
    }

    try {
        const response = await fetch(url, {
            method: method,
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(reviewData),
        });
        if (!response.ok) {
            const errorData = await response.json().catch(() => ({ message: `Failed to ${editingReview ? 'update' : 'create'} review` }));
            throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
        }
        console.log(`Review ${editingReview ? 'updated' : 'created'} successfully!`);
        fetchReviews();
        handleCloseAddReviewModal();
    } catch (err) {
        console.error(`Error saving review: ${err.message}`);
        alert(`Error saving review: ${err.message}`); // Simple alert for now
        throw err;
    }
  };

  if (isLoading) {
    return (
      <div className="loading-state">
        <Loader2 size={48} className="loading-spinner" />
        <p>Loading reviews...</p>
      </div>
    );
  }

  return (
    <div className="review-list-container">
      <div className="review-list-header">
        <h1>Customer Reviews</h1>
        <button onClick={handleOpenAddReviewModal} className="add-review-button">
          <PlusCircle size={20} className="icon" /> Add New Review
        </button>
      </div>

      {error && (
        <div className="error-message">
          <AlertTriangle size={24} className="icon error-icon" />
          <div>
            <p className="error-title">Error</p>
            <p>{error}</p>
          </div>
        </div>
      )}

      {reviews.length === 0 && !error && (
        <div className="no-reviews-message">
          <MessageSquare size={64} className="icon" />
          <p>No reviews yet.</p>
          <p>Be the first to share your experience!</p>
        </div>
      )}

      {reviews.length > 0 && (
        <div className="reviews-grid">
            {reviews.map(review => (
              <ReviewItem
                key={review.id}
                review={review}
                onDelete={handleDeleteReview}
                onEdit={handleEditReview}
              />
            ))}
        </div>
      )}

      {showAddReviewModal && (
        <AddEditReviewModal
            isOpen={showAddReviewModal}
            onClose={handleCloseAddReviewModal}
            onSave={handleSaveReview}
            existingReview={editingReview}
            // authToken prop removed, as the modal will also use authService
        />
      )}
    </div>
  );
};

const AddEditReviewModal = ({ isOpen, onClose, onSave, existingReview }) => { // authToken prop removed
    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState('');
    const [technicianId, setTechnicianId] = useState('');
    const [technicians, setTechnicians] = useState([]);
    const [modalError, setModalError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (isOpen) {
            setModalError('');
            if (existingReview) {
                setRating(existingReview.rating);
                setComment(existingReview.comment);
                setTechnicianId(existingReview.technicianId);
                if (existingReview.technicianName) {
                     setTechnicians([{id: existingReview.technicianId, fullName: existingReview.technicianName}]);
                }
            } else {
                setRating(0);
                setComment('');
                setTechnicianId('');
            }

            if (!existingReview || (existingReview && !existingReview.technicianName)) {
                 const fetchTechnicians = async () => {
                    const token = authService.getToken(); // Get token dynamically
                    if (!token) {
                        setModalError("Authentication token not found. Cannot load technicians.");
                        return;
                    }
                    try {
                        const response = await fetch(`${API_BASE_URL}/reviews/technicians/available`, {
                            headers: { 'Authorization': `Bearer ${token}` }
                        });
                        if (!response.ok) {
                             const errData = await response.json().catch(() => null);
                             throw new Error(errData?.message || 'Failed to fetch technicians');
                        }
                        const data = await response.json();
                        setTechnicians(Array.isArray(data) ? data : []);
                        if (data.length > 0 && !existingReview) {
                            setTechnicianId(data[0].id);
                        }
                    } catch (err) {
                        setModalError('Could not load technicians: ' + err.message);
                    }
                };
                fetchTechnicians();
            }
        }
    }, [isOpen, existingReview]); // authToken removed from dependency array

    const handleSubmit = async (e) => {
        e.preventDefault();
        setModalError('');

        if (rating < 1 || rating > 5) {
            setModalError('Rating must be between 1 and 5.');
            return;
        }
        if (!comment.trim() || comment.trim().length < 10 || comment.trim().length > 5000) {
            setModalError('Comment must be between 10 and 5000 characters.');
            return;
        }
        if (!technicianId && !existingReview) { // For new reviews, technicianId is required
            setModalError('Please select a technician.');
            return;
        }
        
        setIsSubmitting(true);
        const reviewData = {
            // technicianId is only sent if it's a new review or if it was part of the editable fields.
            // If editing, the backend might not allow changing the technician, or it might.
            // The current logic sends existingReview.technicianId when editing.
            technicianId: existingReview ? existingReview.technicianId : technicianId,
            comment,
            rating,
        };
        
        try {
            await onSave(reviewData); // onSave (handleSaveReview) will now get the token itself
        } catch (saveError) {
            setModalError(saveError.message || "Failed to save review. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <h2>{existingReview ? 'Edit Review' : 'Add New Review'}</h2>
                {modalError && <p className="modal-error-message">{modalError}</p>}
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="technicianIdModal">Technician</label>
                        {existingReview ? (
                            <p className="form-control-static">
                                {existingReview.technicianName || technicians.find(t => t.id === existingReview.technicianId)?.fullName || 'Loading...'}
                            </p>
                        ) : (
                            <select
                                id="technicianIdModal"
                                value={technicianId}
                                onChange={(e) => setTechnicianId(e.target.value)}
                                required
                                disabled={isSubmitting}
                            >
                                <option value="" disabled>Select a Technician</option>
                                {technicians.map(tech => (
                                    <option key={tech.id} value={tech.id}>{tech.fullName}</option>
                                ))}
                            </select>
                        )}
                    </div>

                    <div className="form-group">
                        <label>Rating</label>
                        <div className="star-rating-input">
                            {[1, 2, 3, 4, 5].map(star => (
                                <button
                                    type="button"
                                    key={star}
                                    onClick={() => !isSubmitting && setRating(star)}
                                    className={`star-button ${star <= rating ? 'selected' : ''}`}
                                    aria-label={`Rate ${star} star${star > 1 ? 's' : ''}`}
                                    disabled={isSubmitting}
                                >
                                    <Star size={28} className={star <= rating ? 'star-filled' : 'star-empty'} />
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="form-group">
                        <label htmlFor="commentModal">Comment</label>
                        <textarea
                            id="commentModal"
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            rows="5"
                            placeholder="Share your experience (10-5000 characters)..."
                            required
                            minLength="10"
                            maxLength="5000"
                            disabled={isSubmitting}
                        ></textarea>
                    </div>

                    <div className="modal-actions">
                        <button
                            type="button"
                            onClick={onClose}
                            className="button button-secondary"
                            disabled={isSubmitting}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="button button-primary"
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? (
                                <Loader2 size={20} className="loading-spinner-inline" />
                            ) : null}
                            {isSubmitting ? 'Saving...' : (existingReview ? 'Save Changes' : 'Submit Review')}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default function App() {
  return (
    <div className="app-container">
      <nav className="app-navbar">
        <div className="navbar-content">
             <h1>PerbaikiinAja Reviews</h1>
        </div>
      </nav>

      <main className="app-main-content">
        <ReviewList />
      </main>

      <footer className="app-footer">
        <p>&copy; {new Date().getFullYear()} PerbaikiinAja. All rights reserved.</p>
        <p>Built with React & Spring Boot</p>
      </footer>
    </div>
  );
}