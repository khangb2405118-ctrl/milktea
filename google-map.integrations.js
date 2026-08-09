import axios from 'axios';

const GOOGLE_MAPS_API_KEY = process.env.GOOGLE_MAPS_API_KEY;
const BASE_URL = 'https://maps.googleapis.com/maps/api';

export const googleMapIntegration = {
  /**
   * Gọi Google Places Autocomplete API
   */
  getAutocomplete: async (input) => {
    try {
      const response = await axios.get(`${BASE_URL}/place/autocomplete/json`, {
        params: {
          input: input,
          key: GOOGLE_MAPS_API_KEY,
          language: 'vi',
          components: 'country:vn' // Giới hạn tìm kiếm trong lãnh thổ Việt Nam
        }
      });
      return response.data;
    } catch (error) {
      throw new Error(`Google Maps API Error (Autocomplete): ${error.response?.data?.error_message || error.message}`);
    }
  },

  /**
   * Gọi Google Geocoding API
   */
  getGeocode: async (address) => {
    try {
      const response = await axios.get(`${BASE_URL}/geocode/json`, {
        params: {
          address: address,
          key: GOOGLE_MAPS_API_KEY,
          language: 'vi',
          region: 'vn'
        }
      });
      return response.data;
    } catch (error) {
      throw new Error(`Google Maps API Error (Geocode): ${error.response?.data?.error_message || error.message}`);
    }
  }
};