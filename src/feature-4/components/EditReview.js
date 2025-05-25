// ./feature-4/components/EditReview.js
import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../../auth/context/AuthContext'; // Adjust path
import { Star, ChevronLeft, Send, Edit3 as EditIcon } from 'lucide-react';
import Notification from './shared/Notification'; // Adjust path
import StarRating from './shared/StarRating'; // Adjust path

// Use the environment variable for the API base URL
const API_HOST = process.env.REACT_APP_API_URL || 'http://localhost:8080'; 

const EditReview = () => {
  const navigate = useNavigate();
  const { id: reviewId } = useParams(); // Get reviewId from URL
  const { user, token } = useAuth();

  const [initialReview, setInitialReview] = useState(null); // Stores the original review data fetched
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [charCount, setCharCount] = useState(0);
  const MAX_COMMENT_LENGTH = 150;

  const [isLoading, setIsLoading] = useState(false); // General loading state
  const [isFetchingDetails, setIsFetchingDetails] = useState(false); // Specific for fetching initial details
  const [isSubmitting, setIsSubmitting] = useState(false); // Specific for form submission

  const [formError, setFormError] = useState(null); // For form validation errors
  const [fetchError, setFetchError] = useState(null); // For errors during initial data fetch
  const [notification, setNotification] = useState({ message: null, type: null });

  const showAppNotification = (message, type, duration = 3000) => {
    setNotification({ message, type });
    setTimeout(() => setNotification({ message: null, type: null }), duration);
  };

  const fetchReviewDetails = useCallback(async () => {
    if (!reviewId || !user || !token) {
        setFetchError("Cannot fetch review: Missing ID, user, or authentication token.");
        showAppNotification("Authentication error. Please log in again.", "error");
        return;
    }
    setIsFetchingDetails(true);
    setFetchError(null);
    try {
      const response = await fetch(`${API_HOST}/api/reviews/${reviewId}`, { // Endpoint to get a single review
        headers: { 
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        }
      });
      if (!response.ok) {
        let errorMsg = `Failed to fetch review details. Status: ${response.status}`;
        try {
            const errorData = await response.json();
            errorMsg = errorData.message || errorData.detail || errorMsg;
        } catch (parseError) { /* Ignore parsing error, use status-based message */ }
        throw new Error(errorMsg);
      }
      const data = await response.json();

      // Authorization check: Customer can only edit their own reviews. Admin can edit any (if backend allows).
      // Your backend @PreAuthorize handles this, but an additional frontend check can be useful.
      if (user.role !== 'ADMIN' && data.userId !== user.id) {
        throw new Error("You are not authorized to edit this review.");
      }

      setInitialReview(data);
      setRating(data.rating);
      setComment(data.comment);
      setCharCount(data.comment ? data.comment.length : 0);

    } catch (err) {
      setFetchError(err.message);
      showAppNotification(`Error fetching review: ${err.message}`, 'error');
      // If not authorized or review not found, consider redirecting after showing notification
      if (err.message.includes("authorized") || err.message.includes("not found")) {
        setTimeout(() => navigate('/reviews'), 3000); 
      }
    } finally {
      setIsFetchingDetails(false);
    }
  }, [reviewId, user, token, navigate]);

  useEffect(() => {
    fetchReviewDetails();
  }, [fetchReviewDetails]);

  const handleCommentChange = (e) => {
    const text = e.target.value;
    if (text.length <= MAX_COMMENT_LENGTH) {
      setComment(text);
      setCharCount(text.length);
    }
  };

  const validateForm = () => {
    if (rating === 0) {
      setFormError('Please provide a rating (1-5 stars).');
      return false;
    }
    if (comment.trim() === '') {
      setFormError('Please write a comment.');
      return false;
    }
    setFormError(null);
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm() || !token) {
        if(!token) setFormError("Authentication error. Please log in again.");
        return;
    }

    setIsSubmitting(true);
    setFormError(null);

    // Backend DTO expects 'comment' and 'rating'
    const reviewUpdatePayload = { 
        comment: comment,
        rating: rating,
        // technicianId is NOT sent for update as per your backend ReviewRequestDto for PUT
    }; 

    try {
      const response = await fetch(`${API_HOST}/api/reviews/${reviewId}`, { 
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` 
        },
        body: JSON.stringify(reviewUpdatePayload),
      });

      if (!response.ok) {
        let errorMsg = `Failed to update review. Status: ${response.status}`;
        try {
            const errorData = await response.json();
            errorMsg = errorData.message || errorData.detail || errorMsg;
        } catch (parseError) { /* Ignore */ }
        throw new Error(errorMsg);
      }
      // const updatedReviewData = await response.json(); // Use if needed
      showAppNotification('Review updated successfully!', 'success');
      navigate('/reviews'); // Navigate back to the review list
    } catch (err) {
      setFormError(err.message);
      showAppNotification(`${err.message}`, 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isFetchingDetails) return <div className="text-center p-10 text-gray-700">Loading review details...</div>;
  if (fetchError && !initialReview) return ( // Only show full page error if initial load failed critically
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 md:p-8 flex flex-col items-center justify-center">
        <div className="text-center p-10 text-red-600 bg-red-50 rounded-md shadow max-w-md">
            <h2 className="text-xl font-semibold mb-2">Error Loading Review</h2>
            <p>{fetchError}</p>
            <button 
                onClick={() => navigate('/reviews')} 
                className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
                Back to Reviews
            </button>
        </div>
         <Notification 
            message={notification.message} 
            type={notification.type} 
            onClose={() => setNotification({ message: null, type: null })} 
        />
    </div>
  );
  if (!initialReview) return <div className="text-center p-10 text-gray-700">Review data not available.</div>;


  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 md:p-8">
      <div className="container mx-auto max-w-xl">
        <button onClick={() => navigate('/reviews')} className="mb-6 text-blue-600 hover:text-blue-800 flex items-center font-medium transition-colors">
          <ChevronLeft size={20} className="mr-1" /> Back to Reviews
        </button>

        <div className="bg-white shadow-lg rounded-xl p-6 sm:p-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center flex items-center justify-center">
            <EditIcon size={30} className="mr-3 text-blue-500" /> Edit Your Review
          </h2>

          <div className="mb-6 p-4 bg-gray-100 rounded-md border border-gray-200">
            <h4 className="text-md font-medium text-gray-600">Reviewing Technician:</h4>
            <p className="text-blue-700 text-lg font-semibold">{initialReview.technicianFullName || "N/A"}</p>
          </div>
          
          {formError && <p className="text-red-600 bg-red-100 p-3 rounded-md mb-4 text-sm">{formError}</p>}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Rating <span className="text-red-500">*</span>
              </label>
              <StarRating rating={rating} onRatingChange={setRating} />
            </div>

            <div>
              <label htmlFor="comment" className="block text-sm font-medium text-gray-700 mb-1">
                Comment ({charCount}/{MAX_COMMENT_LENGTH}) <span className="text-red-500">*</span>
              </label>
              <textarea
                id="comment"
                value={comment}
                onChange={handleCommentChange}
                rows="5"
                className="w-full p-3 bg-gray-50 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 transition-colors text-gray-900 resize-none"
                placeholder="Update your experience..."
                maxLength={MAX_COMMENT_LENGTH}
                required
              ></textarea>
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="submit"
                disabled={isSubmitting || isFetchingDetails} // Disable if fetching or submitting
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 px-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-150 ease-in-out flex items-center disabled:opacity-60 disabled:cursor-not-allowed"
              >
                <Send size={18} className="mr-2" /> {isSubmitting ? 'Updating...' : 'Update Review'}
              </button>
            </div>
          </form>
        </div>
      </div>
      <Notification 
        message={notification.message} 
        type={notification.type} 
        onClose={() => setNotification({ message: null, type: null })} 
      />
    </div>
  );
};

export default EditReview;
