// src/auth/components/RegisterCustomer.js
import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

// Styling
const styles = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '100vh',
    fontFamily: 'Poppins, sans-serif',
    backgroundColor: '#f5f5f5',
    padding: '20px 0',
  },
  formContainer: {
    width: '100%',
    maxWidth: '550px',
    padding: '40px',
    backgroundColor: '#fff',
    borderRadius: '10px',
    boxShadow: '0 4px 15px rgba(0, 0, 0, 0.1)',
  },
  title: {
    fontSize: '28px',
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: '30px',
    color: '#333',
  },
  formGroup: {
    marginBottom: '20px',
  },
  input: {
    width: '100%',
    padding: '12px 15px',
    fontSize: '16px',
    border: '1px solid #ddd',
    borderRadius: '5px',
    fontFamily: 'Poppins, sans-serif',
  },
  label: {
    display: 'block',
    marginBottom: '8px',
    fontSize: '16px',
    fontWeight: '500',
    color: '#555',
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
  error: {
    color: '#e53935',
    fontSize: '14px',
    marginTop: '5px',
  },
  loginText: {
    textAlign: 'center',
    marginTop: '20px',
    fontSize: '14px',
    color: '#666',
  },
  link: {
    color: '#4285f4',
    textDecoration: 'none',
    fontWeight: '500',
  },
  logoContainer: {
    textAlign: 'center',
    marginBottom: '20px',
  },
  logo: {
    width: '120px',
    height: 'auto',
  },
  formRow: {
    display: 'flex',
    gap: '20px',
    marginBottom: '20px',
  },
  formColumn: {
    flex: 1,
  },
  successMessage: {
    padding: '15px',
    backgroundColor: '#d4edda',
    borderRadius: '5px',
    color: '#155724',
    marginBottom: '20px',
    textAlign: 'center',
  }
};

const RegisterCustomer = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    phoneNumber: '',
    address: '',
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const { registerCustomer } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    
    // Clear error for this field when user types
    if (errors[name]) {
      setErrors({ ...errors, [name]: '' });
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    // Required fields
    if (!formData.fullName.trim()) newErrors.fullName = 'Full name is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    if (!formData.password) newErrors.password = 'Password is required';
    if (!formData.phoneNumber.trim()) newErrors.phoneNumber = 'Phone number is required';
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (formData.email && !emailRegex.test(formData.email)) {
      newErrors.email = 'Invalid email format';
    }
    
    // Password validation
    if (formData.password && formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }
    
    // Password confirmation
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    // Phone number validation (numeric only)
    if (formData.phoneNumber && !/^\d+$/.test(formData.phoneNumber)) {
      newErrors.phoneNumber = 'Phone number must contain only digits';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Remove confirmPassword before sending to API
      const { confirmPassword, ...registrationData } = formData;
      
      await registerCustomer(registrationData);
      setSuccess(true);
      
      // Reset form
      setFormData({
        fullName: '',
        email: '',
        password: '',
        confirmPassword: '',
        phoneNumber: '',
        address: '',
      });
      
      // Redirect to login after a short delay
      setTimeout(() => {
        navigate('/login');
      }, 3000);
    } catch (error) {
      setErrors({ 
        general: error.message || 'Registration failed. Please try again.' 
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.formContainer}>
        <div style={styles.logoContainer}>
          {/* Replace with your logo */}
          <h1 style={{ fontFamily: 'Poppins, sans-serif', color: '#4285f4' }}>PerbaikiinAja</h1>
        </div>
        <h2 style={styles.title}>Create a Customer Account</h2>
        
        {success && (
          <div style={styles.successMessage}>
            Registration successful! Redirecting to login...
          </div>
        )}
        
        {errors.general && <div style={styles.error}>{errors.general}</div>}
        
        <form onSubmit={handleSubmit}>
          <div style={styles.formRow}>
            <div style={styles.formColumn}>
              <label htmlFor="fullName" style={styles.label}>Full Name</label>
              <input
                type="text"
                id="fullName"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                style={styles.input}
                placeholder="John Doe"
                disabled={isLoading || success}
              />
              {errors.fullName && <div style={styles.error}>{errors.fullName}</div>}
            </div>
            
            <div style={styles.formColumn}>
              <label htmlFor="email" style={styles.label}>Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                style={styles.input}
                placeholder="your-email@example.com"
                disabled={isLoading || success}
              />
              {errors.email && <div style={styles.error}>{errors.email}</div>}
            </div>
          </div>
          
          <div style={styles.formRow}>
            <div style={styles.formColumn}>
              <label htmlFor="password" style={styles.label}>Password</label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                style={styles.input}
                placeholder="Create a password"
                disabled={isLoading || success}
              />
              {errors.password && <div style={styles.error}>{errors.password}</div>}
            </div>
            
            <div style={styles.formColumn}>
              <label htmlFor="confirmPassword" style={styles.label}>Confirm Password</label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                style={styles.input}
                placeholder="Confirm your password"
                disabled={isLoading || success}
              />
              {errors.confirmPassword && <div style={styles.error}>{errors.confirmPassword}</div>}
            </div>
          </div>
          
          <div style={styles.formRow}>
            <div style={styles.formColumn}>
              <label htmlFor="phoneNumber" style={styles.label}>Phone Number</label>
              <input
                type="tel"
                id="phoneNumber"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleChange}
                style={styles.input}
                placeholder="e.g., 081234567890"
                disabled={isLoading || success}
              />
              {errors.phoneNumber && <div style={styles.error}>{errors.phoneNumber}</div>}
            </div>
          </div>
          
          <div style={styles.formGroup}>
            <label htmlFor="address" style={styles.label}>Address</label>
            <input
              type="text"
              id="address"
              name="address"
              value={formData.address}
              onChange={handleChange}
              style={styles.input}
              placeholder="Your address"
              disabled={isLoading || success}
            />
            {errors.address && <div style={styles.error}>{errors.address}</div>}
          </div>
          
          <button 
            type="submit" 
            style={styles.button} 
            disabled={isLoading || success}
            onMouseOver={(e) => e.currentTarget.style.backgroundColor = styles.buttonHover.backgroundColor}
            onMouseOut={(e) => e.currentTarget.style.backgroundColor = styles.button.backgroundColor}
          >
            {isLoading ? 'Creating Account...' : 'Register'}
          </button>
        </form>
        
        <p style={styles.loginText}>
          Already have an account? <Link to="/login" style={styles.link}>Login</Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterCustomer;