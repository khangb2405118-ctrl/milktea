import { googleMapIntegration } from '../integrations/google-map.integrations.js';

export const mapService = {
  autocompleteAddress: async (input) => {
    const data = await googleMapIntegration.getAutocomplete(input);
    
    if (data.status !== 'OK' && data.status !== 'ZERO_RESULTS') {
      throw new Error(`Google Maps trả về trạng thái lỗi: ${data.status}`);
    }
    
    // Trả về danh sách các gợi ý địa chỉ
    return data.predictions || [];
  },

  geocodeAddress: async (address) => {
    const data = await googleMapIntegration.getGeocode(address);

    if (data.status !== 'OK' || !data.results || data.results.length === 0) {
      throw new Error(`Không thể tìm thấy tọa độ cho địa chỉ này (Trạng thái: ${data.status})`);
    }

    const location = data.results[0].geometry.location;
    const formattedAddress = data.results[0].formatted_address;

    // Trả về cấu trúc tọa độ và địa chỉ chuẩn hóa
    return {
      lat: location.lat,
      lng: location.lng,
      formatted_address: formattedAddress
    };
  }
};