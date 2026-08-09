import axios from 'axios';

const AHAMOVE_BASE_URL = process.env.AHAMOVE_BASE_URL || 'https://partner-apistg.ahamove.com/v3';
const AHAMOVE_API_KEY = process.env.AHAMOVE_API_KEY;

export const ahamoveIntegration = {
  // Gửi request tính cước sang Ahamove
  estimateOrder: async (payload) => {
    try {
      const response = await axios.post(`${AHAMOVE_BASE_URL}/orders/estimate`, payload, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${AHAMOVE_API_KEY}`
        }
      });
      return response.data;
    } catch (error) {
      throw new Error(`Ahamove API Error (Estimate): ${error.response?.data?.message || error.message}`);
    }
  },

  // Gửi request tạo đơn giao hàng sang Ahamove
  createOrder: async (payload) => {
    try {
      const response = await axios.post(`${AHAMOVE_BASE_URL}/orders`, payload, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${AHAMOVE_API_KEY}`
        }
      });
      return response.data;
    } catch (error) {
      throw new Error(`Ahamove API Error (Create): ${error.response?.data?.message || error.message}`);
    }
  }
};