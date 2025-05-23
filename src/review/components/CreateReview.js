import React, { useState } from 'react';
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
};

const CreateReviewForm = () => {
  const { technicianId } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
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
      const response = await fetch('/reviews', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          technicianId,
          userId: user.id,
          reportId: 'some-report-id', // You'll need to get this from somewhere
          rating,
          comment,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to submit review');
      }

      navigate(`/reviews/technicians/${technicianId}`);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Write a Review</h2>
      
      {error && <div style={styles.error}>{error}</div>}
      
      <form onSubmit={handleSubmit}>
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
            disabled={isSubmitting}
            required
          />
        </div>
        
        <button
          type="submit"
          style={{
            ...styles.button,
            ...(isSubmitting ? styles.buttonDisabled : {}),
          }}
          disabled={isSubmitting}
          onMouseOver={(e) => !isSubmitting && (e.currentTarget.style.backgroundColor = styles.buttonHover.backgroundColor)}
          onMouseOut={(e) => !isSubmitting && (e.currentTarget.style.backgroundColor = styles.button.backgroundColor)}
        >
          {isSubmitting ? 'Submitting...' : 'Submit Review'}
        </button>
      </form>
      
      <Link 
        to={`/reviews/technicians/${technicianId}`} 
        style={styles.backLink}
      >
        Back to technician reviews
      </Link>
    </div>
  );
};

export default CreateReviewForm;