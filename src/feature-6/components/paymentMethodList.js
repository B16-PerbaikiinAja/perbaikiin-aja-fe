import React, { useEffect, useState } from 'react';
import paymentService from '../services/paymentService';
import authService from '../../auth/services/authService';

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
    <div>
      <h3>Metode Pembayaran</h3>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <ul>
        {methods.map((m) => (
          <li key={m.id}>{m.name} - {m.provider}</li>
        ))}
      </ul>
    </div>
  );
};

export default PaymentMethodList;
