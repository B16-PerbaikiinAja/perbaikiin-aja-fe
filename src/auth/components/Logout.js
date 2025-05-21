// src/auth/components/Logout.js
import React, { useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Logout = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Perform logout operation
    logout();
    
    // Redirect to login page
    navigate('/login');
  }, [logout, navigate]);

  // This component doesn't render anything visible
  return null;
};

export default Logout;