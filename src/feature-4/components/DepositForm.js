// src/feature-4/components/DepositForm.js
import React, { useState } from 'react';
import { formatCurrency } from '../utils/helpers';

const styles = {
  formCard: {
    backgroundColor: '#fff',
    borderRadius: '12px',
    padding: '25px',
    boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
    marginBottom: '30px',
  },
  formTitle: {
    fontSize: '22px',
    fontWeight: '600',
    color: '#333',
    marginBottom: '20px',
  },
  formGroup: {
    marginBottom: '20px',
  },
  label: {
    display: 'block',
    fontWeight: '500',
    marginBottom: '8px',
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
    minHeight: '100px',
  },
  buttonRow: {
    display: 'flex',
    justifyContent: 'space-between',
    gap: '15px',
    marginTop: '25px',
  },
  button: {
    padding: '12px 20px',
    borderRadius: '5px',
    border: 'none',
    fontSize: '16px',
    fontWeight: '500',
    cursor: 'pointer',
    fontFamily: 'Poppins, sans-serif',
    transition: 'background-color 0.3s',
  },
  cancelButton: {
    backgroundColor: '#e9ecef',
    color: '#495057',
  },
  submitButton: {
    backgroundColor: '#4285f4',
    color: '#fff',
  },
  disabledButton: {
    backgroundColor: '#a9c1f5',
    cursor: 'not-allowed',
  },
  previewCard: {
    backgroundColor: '#f8f9fa',
    padding: '15px',
    borderRadius: '8px',
    marginBottom: '20px',
  },
  previewTitle: {
    fontSize: '16px',
    fontWeight: '500',
    marginBottom: '10px',
    color: '#666',
  },
  previewAmount: {
    fontSize: '22px',
    fontWeight: '600',
    color: '#333',
    marginBottom: '5px',
  },
  error: {
    color: '#dc3545',
    fontSize: '14px',
    marginTop: '5px',
  },
};

const DepositForm = ({ onDeposit, onCancel, isLoading }) => {
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Parse amount as a number
    const numAmount = parseFloat(amount);
    
    // Validate amount
    if (!numAmount || numAmount <= 0) {
      setError('Please enter a valid amount greater than 0');
      return;
    }
    
    // Clear error
    setError('');
    
    // Call deposit handler
    onDeposit(numAmount, description);
  };

  return (
    <div style={styles.formCard}>
      <h2 style={styles.formTitle}>Deposit Funds</h2>
      
      <form onSubmit={handleSubmit}>
        <div style={styles.formGroup}>
          <label htmlFor="amount" style={styles.label}>Amount</label>
          <input
            type="number"
            id="amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            style={styles.input}
            placeholder="Enter amount to deposit"
            min="1"
            disabled={isLoading}
            required
          />
          {error && <div style={styles.error}>{error}</div>}
        </div>
        
        <div style={styles.formGroup}>
          <label htmlFor="description" style={styles.label}>Description (Optional)</label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            style={styles.textarea}
            placeholder="Add a note to your deposit"
            disabled={isLoading}
          />
        </div>
        
        {amount && !error && Number(amount) > 0 && (
          <div style={styles.previewCard}>
            <div style={styles.previewTitle}>Deposit Amount</div>
            <div style={styles.previewAmount}>{formatCurrency(amount)}</div>
          </div>
        )}
        
        <div style={styles.buttonRow}>
          <button 
            type="button" 
            style={{...styles.button, ...styles.cancelButton}} 
            onClick={onCancel}
            disabled={isLoading}
          >
            Cancel
          </button>
          <button 
            type="submit" 
            style={{
              ...styles.button, 
              ...styles.submitButton, 
              ...(isLoading ? styles.disabledButton : {})
            }} 
            disabled={isLoading}
          >
            {isLoading ? 'Processing...' : 'Deposit'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default DepositForm;
