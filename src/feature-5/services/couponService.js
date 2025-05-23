// src/coupon-feature/service/couponService.js

const API_URL = process.env.REACT_APP_API_URL;

const couponService = {
    /**
     * Create a new coupon (admin only)
     * @param {Object} couponData - { discountValue, maxUsage, expiryDate }
     * @param {string} token - Auth token
     */
    createCoupon: async (couponData, token) => {
        const response = await fetch(`${API_URL}/coupons/admin`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(couponData),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Failed to create coupon');
        }

        return await response.json();
    },

    /**
     * Fetch all coupons (admin only)
     * @param {string} token - Auth token
     */
    getAllCoupons: async (token) => {
        const response = await fetch(`${API_URL}/coupons/admin`, {
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        });

        if (!response.ok) {
            throw new Error('Failed to fetch coupons');
        }

        return await response.json();
    },

    /**
     * Get coupon by code
     * @param {string} code - Coupon code
     */
    getCouponByCode: async (code) => {
        const response = await fetch(`${API_URL}/coupons/${code}`);

        if (!response.ok) {
            throw new Error('Coupon not found');
        }

        return await response.json();
    },

    /**
     * Use a coupon
     * @param {string} code - Coupon code
     */
    useCoupon: async (code) => {
        const response = await fetch(`${API_URL}/coupons/use/${code}`, {
            method: 'PUT',
        });

        if (!response.ok) {
            throw new Error('Failed to use coupon');
        }

        return await response.json();
    },

    /**
     * Update an existing coupon (admin only)
     * @param {string} code - Coupon code
     * @param {Object} couponData - { discountValue, maxUsage, expiryDate }
     * @param {string} token - Auth token
     */
    updateCoupon: async (code, couponData, token) => {
        const response = await fetch(`${API_URL}/coupons/admin/${code}`, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(couponData),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Failed to update coupon');
        }

        return await response.json();
    },

    /**
     * Delete a coupon (admin only)
     * @param {string} code - Coupon code
     * @param {string} token - Auth token
     */
    deleteCoupon: async (code, token) => {
        const response = await fetch(`${API_URL}/coupons/admin/${code}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        });

        if (!response.ok) {
            throw new Error('Failed to delete coupon');
        }

        return await response.json();
    },
};

export default couponService;
