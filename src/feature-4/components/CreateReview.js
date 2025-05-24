// ./feature-4/components/CreateReview.js
import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../auth/context/AuthContext'; // Adjust path
import { Star, ChevronLeft, Send, Users } from 'lucide-react';
import Notification from './shared/Notification'; // Adjust path
import StarRating from './shared/StarRating'; // Adjust path

// Use the environment variable for the API base URL
const API_HOST = process.env.REACT_APP_API_URL || 'http://localhost:8080'; // Fallback if not set

const CreateReview = () => {
  const navigate = useNavigate();
  const { user, token } = useAuth(); // Get user and token from AuthContext

  const [technicians, setTechnicians] = useState([]);
  const [selectedTechnicianId, setSelectedTechnicianId] = useState('');
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [charCount, setCharCount] = useState(0);
  const MAX_COMMENT_LENGTH = 150;

  const [isLoading, setIsLoading] = useState(false);
  const [formError, setFormError] = useState(null);
  const [fetchTechniciansError, setFetchTechniciansError] = useState(null);
  const [notification, setNotification] = useState({ message: null, type: null });

  const showAppNotification = (message, type, duration = 3000) => {
    setNotification({ message, type });
    setTimeout(() => setNotification({ message: null, type: null }), duration);
  };

  const fetchTechnicians = useCallback(async () => {
    if (!user || user.role !== 'CUSTOMER' || !token) return; // Ensure user is a customer and token exists
    setIsLoading(true); // Consider a separate loading state for technicians
    setFetchTechniciansError(null);
    try {
      const response = await fetch(`${API_HOST}/api/reviews/technicians-for-review`, { // Endpoint from your ReviewController
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Failed to fetch technicians. Server error.' }));
        throw new Error(errorData.message || 'Failed to fetch technicians');
      }
      const data = await response.json();
      setTechnicians(data);
    } catch (err) {
      setFetchTechniciansError(err.message);
      showAppNotification(`Error fetching technicians: ${err.message}`, 'error');
    } finally {
      setIsLoading(false); // Reset specific loading state for technicians
    }
  }, [user, token]); // Dependency: user role and token

  useEffect(() => {
    fetchTechnicians();
  }, [fetchTechnicians]);

  const handleCommentChange = (e) => {
    const text = e.target.value;
    if (text.length <= MAX_COMMENT_LENGTH) {
      setComment(text);
      setCharCount(text.length);
    }
  };

  const validateForm = () => {
    if (!selectedTechnicianId) {
      setFormError('Please select a technician.');
      return false;
    }
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
    if (!validateForm() || !token) { // Ensure token exists before submitting
        if (!token) {
            setFormError('Authentication error. Please log in again.');
        }
        return;
    }

    setIsLoading(true);
    setFormError(null); // Clear previous form errors

    // This is the ReviewRequestDto structure your backend expects
    const reviewPayload = {
      technicianId: selectedTechnicianId,
      rating: rating,
      comment: comment,
    };

    try {
      const response = await fetch(`${API_HOST}/api/reviews`, { // Target your backend create review endpoint
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`, // Send the JWT token
        },
        body: JSON.stringify(reviewPayload),
      });

      if (!response.ok) {
        // Try to parse error message from backend if available
        let errorMsg = 'Failed to create review.';
        try {
            const errorData = await response.json();
            errorMsg = errorData.message || errorData.detail || errorMsg; // Spring Boot might send 'detail' or 'message'
        } catch (parseError) {
            // If parsing fails, use a generic error based on status
            errorMsg = `Failed to create review. Server responded with status: ${response.status}`;
        }
        throw new Error(errorMsg);
      }

      // const createdReview = await response.json(); // Assuming backend returns the created review DTO
      // console.log('Review created:', createdReview); // For debugging

      showAppNotification('Review submitted successfully!', 'success');
      navigate('/reviews'); // Navigate back to the review list on success

    } catch (err) {
      setFormError(err.message); // Display the error to the user
      showAppNotification(`${err.message}`, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 md:p-8">
      <div className="container mx-auto max-w-xl">
        <button onClick={() => navigate('/reviews')} className="mb-6 text-blue-600 hover:text-blue-800 flex items-center font-medium transition-colors">
          <ChevronLeft size={20} className="mr-1" /> Back to Reviews
        </button>

        <div className="bg-white shadow-lg rounded-xl p-6 sm:p-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center flex items-center justify-center">
            <Users size={32} className="mr-3 text-blue-500" /> Create New Review
          </h2>
          
          {fetchTechniciansError && <p className="text-red-600 bg-red-100 p-3 rounded-md mb-4 text-sm">Error fetching technicians: {fetchTechniciansError}</p>}
          {formError && <p className="text-red-600 bg-red-100 p-3 rounded-md mb-4 text-sm">{formError}</p>}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="technician" className="block text-sm font-medium text-gray-700 mb-1">
                Select Technician <span className="text-red-500">*</span>
              </label>
              <select
                id="technician"
                value={selectedTechnicianId}
                onChange={(e) => setSelectedTechnicianId(e.target.value)}
                className="w-full p-3 bg-gray-50 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 transition-colors text-gray-900"
                required
                disabled={isLoading || technicians.length === 0}
              >
                <option value="" disabled>-- Choose a Technician --</option>
                {technicians.map(tech => (
                  <option key={tech.id} value={tech.id}>{tech.fullName}</option>
                ))}
              </select>
               {technicians.length === 0 && !isLoading && !fetchTechniciansError && <p className="text-xs text-gray-500 mt-1">No technicians available to review or error fetching them.</p>}
            </div>

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
                placeholder="Share your experience with the technician..."
                maxLength={MAX_COMMENT_LENGTH}
                required
              ></textarea>
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="submit"
                disabled={isLoading || (technicians.length === 0 && !fetchTechniciansError) }
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 px-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-150 ease-in-out flex items-center disabled:opacity-60 disabled:cursor-not-allowed"
              >
                <Send size={18} className="mr-2" /> {isLoading ? 'Submitting...' : 'Submit Review'}
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

export default CreateReview;
