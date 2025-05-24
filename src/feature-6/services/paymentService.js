const API_URL = process.env.REACT_APP_API_URL;

const paymentService = {
  getAllPaymentMethods: async (token) => {
    const response = await fetch(`${API_URL}/api/payment-methods`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Gagal mengambil metode pembayaran');
    }

    return await response.json();
  },

  createPaymentMethod: async (methodData, token) => {
    const response = await fetch(`${API_URL}/api/payment-methods`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(methodData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Gagal menambahkan metode pembayaran');
    }

    return await response.json();
  },

  updatePaymentMethod: async (id, methodData, token) => {
    const response = await fetch(`${API_URL}/api/payment-methods/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(methodData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Gagal memperbarui metode pembayaran');
    }

    return await response.json();
  },

  deletePaymentMethod: async (id, token) => {
    const response = await fetch(`${API_URL}/api/payment-methods/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok && response.status !== 204) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Gagal menghapus metode pembayaran');
    }
  },
};

export default paymentService;
