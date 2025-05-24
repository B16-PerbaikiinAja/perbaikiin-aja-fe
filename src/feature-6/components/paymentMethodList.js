import React, { useEffect, useState } from 'react';
import paymentService from '../services/paymentService';
import authService from '../../auth/services/authService';

const styles = {
  container: {
    maxWidth: '800px',
    margin: '40px auto',
    padding: '30px',
    fontFamily: 'Poppins, sans-serif',
    backgroundColor: '#fff',
    borderRadius: '10px',
    boxShadow: '0 4px 15px rgba(0, 0, 0, 0.1)',
  },
  title: {
    fontSize: '26px',
    fontWeight: '600',
    marginBottom: '20px',
    color: '#333',
  },
  listItem: {
    padding: '12px 20px',
    border: '1px solid #ddd',
    borderRadius: '6px',
    marginBottom: '10px',
    backgroundColor: '#f9f9f9',
    fontSize: '16px',
  },
  error: {
    color: '#e53935',
    marginBottom: '15px',
    fontWeight: '500',
  },
};

const PaymentMethodList = () => {
  const [methods, setMethods] = useState([]);
  const [error, setError] = useState('');

  const token = authService.getToken();

  useEffect(() => {
    const fetchMethods = async () => {
      try {
        const data = await paymentService.getAll(token);
        setMethods(data);
      } catch (e) {
        setError(e.message);
      }
    };

    fetchMethods();
  }, [token]);

  return (
    <div style={styles.container}>
      <h3 style={styles.title}>Metode Pembayaran</h3>
      {error && <div style={styles.error}>{error}</div>}
      <ul style={{ padding: 0, listStyle: 'none' }}>
        {methods.map((m) => (
          <li key={m.id} style={styles.listItem}>
            <strong>{m.name}</strong> - {m.provider}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default PaymentMethodList;
