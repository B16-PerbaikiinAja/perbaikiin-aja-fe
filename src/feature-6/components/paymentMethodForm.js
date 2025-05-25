import React, { useState } from 'react';
import paymentService from '../services/paymentService';
import authService from '../../auth/services/authService';

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
    fontSize: '24px',
    fontWeight: '600',
    marginBottom: '20px',
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
  button: {
    width: '100%',
    padding: '12px',
    backgroundColor: '#28a745',
    color: '#fff',
    border: 'none',
    borderRadius: '5px',
    fontSize: '16px',
    fontWeight: '500',
    cursor: 'pointer',
    fontFamily: 'Poppins, sans-serif',
    transition: 'background-color 0.3s',
  },
  error: {
    color: '#e53935',
    marginBottom: '15px',
    fontSize: '14px',
    fontWeight: '500',
  },
};

const PaymentMethodForm = ({ onSuccess }) => {
  const [name, setName] = useState('');
  const [provider, setProvider] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const token = authService.getToken();
      await paymentService.create({ name, provider }, token);
      onSuccess?.();
      setName('');
      setProvider('');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div style={styles.container}>
      <h4 style={styles.title}>Tambah Metode Pembayaran</h4>
      <form onSubmit={handleSubmit}>
        {error && <div style={styles.error}>{error}</div>}

        <div style={styles.formGroup}>
          <label htmlFor="name" style={styles.label}>Nama Metode</label>
          <input
            id="name"
            style={styles.input}
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Contoh: Bank Transfer"
            required
          />
        </div>

        <div style={styles.formGroup}>
          <label htmlFor="provider" style={styles.label}>Provider</label>
          <input
            id="provider"
            style={styles.input}
            value={provider}
            onChange={(e) => setProvider(e.target.value)}
            placeholder="Contoh: BCA, Mandiri"
            required
          />
        </div>

        <button type="submit" style={styles.button}>Simpan</button>
      </form>
    </div>
  );
};

export default PaymentMethodForm;
