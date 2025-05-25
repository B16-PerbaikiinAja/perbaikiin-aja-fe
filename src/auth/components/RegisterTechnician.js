// src/auth/components/RegisterTechnician.js
import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

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
    maxWidth: '650px',
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
  buttonDisabled: {
    backgroundColor: '#cccccc',
    cursor: 'not-allowed',
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
  },
  unauthorizedMessage: {
    textAlign: 'center',
    color: '#e53935',
    padding: '20px',
    fontSize: '18px',
    backgroundColor: '#ffebee',
    borderRadius: '5px',
    margin: '20px 0',
  },
  backButton: {
    padding: '10px 20px',
    backgroundColor: '#f44336',
    color: '#fff',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    fontFamily: 'Poppins, sans-serif',
    marginTop: '20px',
    display: 'block',
    marginLeft: 'auto',
    marginRight: 'auto',
  }
};

const RegisterTechnician = () => {
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
  const { registerTechnician, isAdmin } = useAuth();
  const navigate = useNavigate();

  // Check if user is admin on component mount
  useEffect(() => {
    if (!isAdmin) {
      // Optionally redirect non-admin users
      // navigate('/dashboard');
    }
  }, [isAdmin, navigate]);

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
      
      await registerTechnician(registrationData);
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
      
      // Optional: redirect to technician management page after success
      setTimeout(() => {
        navigate('/admin/technicians');
      }, 3000);
    } catch (error) {
      setErrors({ 
        general: error.message || 'Technician registration failed. Please try again.' 
      });
    } finally {
      setIsLoading(false);
    }
  };

  // If user is not an admin, show unauthorized message
  if (!isAdmin) {
    return (
      <div style={styles.container}>
        <div style={styles.formContainer}>
          <div style={styles.logoContainer}>
            <h1 style={{ fontFamily: 'Poppins, sans-serif', color: '#4285f4' }}>PerbaikiinAja</h1>
          </div>
          <div style={styles.unauthorizedMessage}>
            <h2>Unauthorized Access</h2>
            <p>Only administrators can register new technicians.</p>
            <button 
              style={styles.backButton}
              onClick={() => navigate('/dashboard')}
            >
              Back to Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.formContainer}>
        <div style={styles.logoContainer}>
          <h1 style={{ fontFamily: 'Poppins, sans-serif', color: '#4285f4' }}>PerbaikiinAja</h1>
        </div>
        <h2 style={styles.title}>Register New Technician</h2>
        
        {success && (
          <div style={styles.successMessage}>
            Technician registered successfully!
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
                placeholder="technician@example.com"
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
                placeholder="Confirm password"
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
            
            <div style={styles.formColumn}>
              <label htmlFor="address" style={styles.label}>Address</label>
              <input
                type="text"
                id="address"
                name="address"
                value={formData.address}
                onChange={handleChange}
                style={styles.input}
                placeholder="Technician's address"
                disabled={isLoading || success}
              />
              {errors.address && <div style={styles.error}>{errors.address}</div>}
            </div>
          </div>
          
          <button 
            type="submit" 
            style={{
              ...styles.button,
              ...(isLoading || success ? styles.buttonDisabled : {})
            }} 
            disabled={isLoading || success}
            onMouseOver={(e) => {
              if (!isLoading && !success) {
                e.currentTarget.style.backgroundColor = styles.buttonHover.backgroundColor;
              }
            }}
            onMouseOut={(e) => {
              if (!isLoading && !success) {
                e.currentTarget.style.backgroundColor = styles.button.backgroundColor;
              }
            }}
          >
            {isLoading ? 'Registering Technician...' : 'Register Technician'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default RegisterTechnician;