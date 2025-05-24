// src/review/components/EditReviewForm.js
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../auth/context/AuthContext';

const styles = {
  container: {
    maxWidth: '600px',
    margin: '40px auto',
    padding: '30px',
    fontFamily: 'Poppins, sans-serif',
    backgroundColor: '#fff',
    borderRadius: '10px',
    boxShadow: '0 4px 15px rgba(0, 0, 0, 0.1)',
  },
  title: {
    fontSize: '28px',
    fontWeight: '600',
    marginBottom: '30px',
    color: '#333',
    textAlign: 'center',
  },
  formGroup: {
    marginBottom: '20px',
  },
  label: {
    display: 'block',
    marginBottom: '8px',
    fontSize: '16px',
    fontWeight: '500',
    color: '#555',
  },
  input: {
    width: '100%',
    padding: '12px 15px',
    fontSize: '16px',
    border: '1px solid #ddd',
    borderRadius: '5px',
    fontFamily: 'Poppins, sans-serif',
  },
  textarea: {
    width: '100%',
    padding: '12px 15px',
    fontSize: '16px',
    border: '1px solid #ddd',
    borderRadius: '5px',
    fontFamily: 'Poppins, sans-serif',
    minHeight: '120px',
    resize: 'vertical',
  },
  ratingContainer: {
    display: 'flex',
    alignItems: 'center',
    marginBottom: '20px',
  },
  star: {
    fontSize: '24px',
    color: '#ddd',
    cursor: 'pointer',
    marginRight: '5px',
  },
  starFilled: {
    color: '#ffc107',
  },
  button: {
    width: '100%',
    padding: '12px',
    backgroundColor: '#4285f4',
    color: '#fff',
    border: 'none',
    borderRadius: '5px',
    fontSize: '16px',
    fontWeight: '500',
    cursor: 'pointer',
    fontFamily: 'Poppins, sans-serif',
    transition: 'background-color 0.3s',
  },
  buttonHover: {
    backgroundColor: '#3367d6',
  },
  buttonDisabled: {
    backgroundColor: '#cccccc',
    cursor: 'not-allowed',
  },
  error: {
    color: '#e53935',
    fontSize: '14px',
    marginTop: '5px',
  },
  backLink: {
    display: 'block',
    textAlign: 'center',
    marginTop: '20px',
    color: '#4285f4',
    textDecoration: 'none',
  },
  buttonGroup: {
    display: 'flex',
    gap: '10px',
    marginTop: '20px',
  },
  deleteButton: {
    padding: '12px',
    backgroundColor: '#e53935',
    color: '#fff',
    border: 'none',
    borderRadius: '5px',
    fontSize: '16px',
    fontWeight: '500',
    cursor: 'pointer',
    fontFamily: 'Poppins, sans-serif',
    transition: 'background-color 0.3s',
    flex: 1,
  },
  deleteButtonHover: {
    backgroundColor: '#c62828',
  },
  updateButton: {
    padding: '12px',
    backgroundColor: '#4285f4',
    color: '#fff',
    border: 'none',
    borderRadius: '5px',
    fontSize: '16px',
    fontWeight: '500',
    cursor: 'pointer',
    fontFamily: 'Poppins, sans-serif',
    transition: 'background-color 0.3s',
    flex: 2,
  },
  updateButtonHover: {
    backgroundColor: '#3367d6',
  },
};

const EditReviewForm = () => {
  const { reviewId } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [review, setReview] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReview = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/reviews/${reviewId}`);
        if (!response.ok) {
          throw new Error('Failed to fetch review');
        }
        const data = await response.json();
        
        // Check if the current user is the owner of the review
        if (data.userId !== user.id) {
          throw new Error('You are not authorized to edit this review');
        }
        
        setReview(data);
        setRating(data.rating);
        setComment(data.comment);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchReview();
  }, [reviewId, user]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    setError('');
    
    if (!rating) {
      setError('Please select a rating');
      return;
    }
    
    if (!comment.trim()) {
      setError('Please write a review comment');
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch(`/reviews/${reviewId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: user.id,
          technicianId: review.technicianId,
          reportId: review.reportId,
          rating,
          comment,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to update review');
      }

      navigate(`/reviews/technicians/${review.technicianId}`);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this review?')) {
      return;
    }

    setIsDeleting(true);
    setError('');

    try {
      const response = await fetch(`/reviews/${reviewId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: user.id,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to delete review');
      }

      navigate(`/reviews/technicians/${review.technicianId}`);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsDeleting(false);
    }
  };

  if (loading) {
    return (
      <div style={styles.container}>
        <div style={{ textAlign: 'center', padding: '40px' }}>Loading review...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={styles.container}>
        <div style={styles.error}>{error}</div>
        <Link 
          to={`/reviews/technicians/${review?.technicianId || ''}`} 
          style={styles.backLink}
        >
          Back to reviews
        </Link>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Edit Your Review</h2>
      
      {error && <div style={styles.error}>{error}</div>}
      
      <form onSubmit={handleUpdate}>
        <div style={styles.formGroup}>
          <label style={styles.label}>Your Rating</label>
          <div style={styles.ratingContainer}>
            {[1, 2, 3, 4, 5].map((star) => (
              <span
                key={star}
                style={{
                  ...styles.star,
                  ...(star <= rating ? styles.starFilled : {}),
                }}
                onClick={() => setRating(star)}
              >
                ★
              </span>
            ))}
          </div>
        </div>
        
        <div style={styles.formGroup}>
          <label htmlFor="comment" style={styles.label}>Review Comment</label>
          <textarea
            id="comment"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            style={styles.textarea}
            placeholder="Share your experience with this technician..."
            disabled={isSubmitting || isDeleting}
            required
          />
        </div>
        
        <div style={styles.buttonGroup}>
          <button
            type="button"
            style={{
              ...styles.deleteButton,
              ...(isSubmitting || isDeleting ? styles.buttonDisabled : {}),
            }}
            onClick={handleDelete}
            disabled={isSubmitting || isDeleting}
            onMouseOver={(e) => !isSubmitting && !isDeleting && (e.currentTarget.style.backgroundColor = styles.deleteButtonHover.backgroundColor)}
            onMouseOut={(e) => !isSubmitting && !isDeleting && (e.currentTarget.style.backgroundColor = styles.deleteButton.backgroundColor)}
          >
            {isDeleting ? 'Deleting...' : 'Delete'}
          </button>
          <button
            type="submit"
            style={{
              ...styles.updateButton,
              ...(isSubmitting || isDeleting ? styles.buttonDisabled : {}),
            }}
            disabled={isSubmitting || isDeleting}
            onMouseOver={(e) => !isSubmitting && !isDeleting && (e.currentTarget.style.backgroundColor = styles.updateButtonHover.backgroundColor)}
            onMouseOut={(e) => !isSubmitting && !isDeleting && (e.currentTarget.style.backgroundColor = styles.updateButton.backgroundColor)}
          >
            {isSubmitting ? 'Updating...' : 'Update Review'}
          </button>
        </div>
      </form>
      
      <Link 
        to={`/reviews/technicians/${review?.technicianId || ''}`} 
        style={styles.backLink}
      >
        Back to technician reviews
      </Link>
    </div>
  );
};

export default EditReviewForm;