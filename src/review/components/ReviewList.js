
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '../../auth/context/AuthContext';
import { Link } from 'react-router-dom';

const styles = {
  container: {
    maxWidth: '800px',
    margin: '40px auto',
    padding: '20px',
    fontFamily: 'Poppins, sans-serif',
    backgroundColor: '#fff',
    borderRadius: '10px',
    boxShadow: '0 4px 15px rgba(0, 0, 0, 0.1)',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '30px',
  },
  title: {
    fontSize: '28px',
    fontWeight: '600',
    color: '#333',
  },
  button: {
    padding: '10px 20px',
    backgroundColor: '#4285f4',
    color: '#fff',
    border: 'none',
    borderRadius: '5px',
    fontSize: '16px',
    fontWeight: '500',
    cursor: 'pointer',
    fontFamily: 'Poppins, sans-serif',
    transition: 'background-color 0.3s',
    textDecoration: 'none',
  },
  buttonHover: {
    backgroundColor: '#3367d6',
  },
  reviewCard: {
    border: '1px solid #ddd',
    borderRadius: '8px',
    padding: '20px',
    marginBottom: '20px',
    backgroundColor: '#f9f9f9',
  },
  reviewHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: '10px',
  },
  rating: {
    display: 'flex',
    alignItems: 'center',
  },
  stars: {
    color: '#ffc107',
    marginRight: '5px',
  },
  comment: {
    margin: '15px 0',
    color: '#555',
    lineHeight: '1.6',
  },
  meta: {
    fontSize: '14px',
    color: '#777',
  },
  noReviews: {
    textAlign: 'center',
    color: '#777',
    padding: '40px 0',
  },
  error: {
    color: '#e53935',
    fontSize: '14px',
    marginTop: '5px',
    textAlign: 'center',
  },
  loading: {
    textAlign: 'center',
    padding: '20px',
    color: '#777',
  },
};

const ReviewList = () => {
  const { technicianId } = useParams();
  const { user } = useAuth();
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [averageRating, setAverageRating] = useState(0);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/reviews/technicians/${technicianId}`);
        if (!response.ok) {
          throw new Error('Failed to fetch reviews');
        }
        const data = await response.json();
        setReviews(data);
        
        // Calculate average rating
        if (data.length > 0) {
          const avg = data.reduce((sum, review) => sum + review.rating, 0) / data.length;
          setAverageRating(avg.toFixed(1));
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, [technicianId]);

  const renderStars = (rating) => {
    return (
      <div style={styles.rating}>
        <div style={styles.stars}>
          {[...Array(5)].map((_, i) => (
            <span key={i}>{i < rating ? '★' : '☆'}</span>
          ))}
        </div>
        <span>{rating}/5</span>
      </div>
    );
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>
          Technician Reviews {averageRating > 0 && `(Avg: ${averageRating}★)`}
        </h1>
        {user && (
          <Link 
            to={`/reviews/create/${technicianId}`} 
            style={styles.button}
            onMouseOver={(e) => e.currentTarget.style.backgroundColor = styles.buttonHover.backgroundColor}
            onMouseOut={(e) => e.currentTarget.style.backgroundColor = styles.button.backgroundColor}
          >
            Add Review
          </Link>
        )}
      </div>

      {loading ? (
        <div style={styles.loading}>Loading reviews...</div>
      ) : error ? (
        <div style={styles.error}>{error}</div>
      ) : reviews.length === 0 ? (
        <div style={styles.noReviews}>No reviews yet for this technician.</div>
      ) : (
        reviews.map((review) => (
          <div key={review.id} style={styles.reviewCard}>
            <div style={styles.reviewHeader}>
              {renderStars(review.rating)}
              <div style={styles.meta}>
                {new Date(review.createdAt).toLocaleDateString()}
              </div>
            </div>
            <div style={styles.comment}>{review.comment}</div>
            <div style={styles.meta}>
              Reviewed by: User {review.userId.substring(0, 8)}...
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default ReviewList;