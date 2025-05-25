// src/feature-2/services/couponService.js

const API_URL = process.env.REACT_APP_API_URL;

/**
 * Service for handling coupon operations
 */
const couponService = {
  /**
   * Get coupon by code
   * @param {string} couponCode - Coupon code
   * @param {string} token - Auth token
   * @returns {Promise} - API response
   */
  getCouponByCode: async (couponCode, token) => {
    try {
      const response = await fetch(`${API_URL}/coupons/${couponCode}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to fetch coupon');
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching coupon:', error);
      throw error;
    }
  },

  /**
   * Validate coupon code
   * @param {string} couponCode - Coupon code to validate
   * @param {string} token - Auth token
   * @returns {Promise} - Validation result
   */
  validateCoupon: async (couponCode, token) => {
    try {
      if (!couponCode || couponCode.trim() === '') {
        return { isValid: false, message: 'Please enter a coupon code' };
      }

      const coupon = await couponService.getCouponByCode(couponCode.trim(), token);
      
      // Check if coupon is expired
      const now = new Date();
      const expiryDate = new Date(coupon.expiryDate);
      
      if (expiryDate < now) {
        return { isValid: false, message: 'This coupon has expired' };
      }

      // Check if coupon usage limit is reached
      if (coupon.usageCount >= coupon.maxUsage) {
        return { isValid: false, message: 'This coupon has reached its usage limit' };
      }

      return { 
        isValid: true, 
        coupon: coupon,
        discountValue: coupon.discountValue,
        message: `Coupon applied! ${Math.round(coupon.discountValue * 100)}% discount`
      };
    } catch (error) {
      return { isValid: false, message: 'Invalid coupon code' };
    }
  },

    useCoupon: async (couponCode, token) => {
    try {
      const response = await fetch(`${API_URL}/coupons/use/${couponCode}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to use coupon');
      }

      return await response.json();
    } catch (error) {
      console.error('Error using coupon:', error);
      throw error;
    }
  },

  /**
   * Validate coupon code and use it if valid
   * @param {string} couponCode - Coupon code to validate and use
   * @param {string} token - Auth token
   * @returns {Promise} - Validation result
   */
  validateAndUseCoupon: async (couponCode, token) => {
    try {
      if (!couponCode || couponCode.trim() === '') {
        return { isValid: false, message: 'Please enter a coupon code' };
      }

      // First get the coupon to check its validity
      const coupon = await couponService.getCouponByCode(couponCode.trim(), token);
      
      // Check if coupon is expired
      const now = new Date();
      const expiryDate = new Date(coupon.expiryDate);
      
      if (expiryDate < now) {
        return { isValid: false, message: 'This coupon has expired' };
      }

      // Check if coupon usage limit is reached
      if (coupon.usageCount >= coupon.maxUsage) {
        return { isValid: false, message: 'This coupon has reached its usage limit' };
      }

      // If valid, use the coupon (increment usage count)
      const usedCoupon = await couponService.useCoupon(couponCode.trim(), token);

      return { 
        isValid: true, 
        coupon: usedCoupon,
        discountValue: usedCoupon.discountValue,
        message: `Coupon applied! ${Math.round(usedCoupon.discountValue * 100)}% discount`
      };
    } catch (error) {
      return { isValid: false, message: error.message || 'Invalid coupon code' };
    }
  },
};

export default couponService;