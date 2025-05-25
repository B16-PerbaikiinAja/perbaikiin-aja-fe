// src/feature-5/services/couponService.js

const API_URL = process.env.REACT_APP_API_URL;

/**
 * Service for handling coupon related API calls
 */
const couponService = {
    /**
     * Create a new coupon as an admin
     * @param {Object} couponData - Data for the new coupon (discountValue, maxUsage, expiryDate)
     * @param {string} token - Auth token
     * @returns {Promise<Object>} - The created coupon object
     */
    createCoupon: async (couponData, token) => {
        try {
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
        } catch (error) {
            console.error('Error creating coupon:', error);
            throw error;
        }
    },

    /**
     * Get all coupons (admin only)
     * @param {string} token - Auth token
     * @returns {Promise<Array<Object>>} - List of coupon objects
     */
    getAllCoupons: async (token) => {
        try {
            const response = await fetch(`${API_URL}/coupons/admin`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to fetch coupons');
            }

            return await response.json();
        } catch (error) {
            console.error('Error fetching all coupons:', error);
            throw error;
        }
    },

    /**
     * Update an existing coupon (admin only)
     * @param {string} code - The UUID code of the coupon to update
     * @param {Object} updatedCouponData - Data to update (discountValue, maxUsage, expiryDate)
     * @param {string} token - Auth token
     * @returns {Promise<Object>} - The updated coupon object
     */
    updateCoupon: async (code, updatedCouponData, token) => {
        try {
            const response = await fetch(`${API_URL}/coupons/admin/${code}`, {
                method: 'PUT', // Backend uses PUT for updates, good.
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(updatedCouponData),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to update coupon');
            }

            return await response.json();
        } catch (error) {
            console.error(`Error updating coupon with code ${code}:`, error);
            throw error;
        }
    },

    /**
     * Delete a coupon (admin only)
     * @param {string} code - The UUID code of the coupon to delete
     * @param {string} token - Auth token
     * @returns {Promise<Object>} - A success message object
     */
    deleteCoupon: async (code, token) => {
        try {
            const response = await fetch(`${API_URL}/coupons/admin/${code}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to delete coupon');
            }
            // parse message object.
            return await response.json();
        } catch (error) {
            console.error(`Error deleting coupon with code ${code}:`, error);
            throw error;
        }
    },

    /**
     * Get a single coupon by code
     * @param {string} code - The UUID code of the coupon
     * @returns {Promise<Object>} - The coupon object
     */
    getCouponByCode: async (code) => {
        try {
            const response = await fetch(`${API_URL}/coupons/${code}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to fetch coupon');
            }

            return await response.json();
        } catch (error) {
            console.error(`Error fetching coupon with code ${code}:`, error);
            throw error;
        }
    },
};

export default couponService;