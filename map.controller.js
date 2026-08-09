import { mapService } from '../services/map.services.js';

export const mapController = {
  autocompleteAddress: async (req, res) => {
    try {
      const { input } = req.query;

      if (!input || input.trim() === '') {
        return res.status(400).json({
          success: false,
          message: 'Vui lòng cung cấp tham số input để tìm kiếm gợi ý địa chỉ!'
        });
      }

      const predictions = await mapService.autocompleteAddress(input);

      return res.status(200).json({
        success: true,
        message: 'Lấy danh sách gợi ý địa chỉ thành công',
        data: predictions
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message
      });
    }
  },

  geocodeAddress: async (req, res) => {
    try {
      const { address } = req.query;

      if (!address || address.trim() === '') {
        return res.status(400).json({
          success: false,
          message: 'Vui lòng cung cấp tham số address cần chuyển đổi!'
        });
      }

      const result = await mapService.geocodeAddress(address);

      return res.status(200).json({
        success: true,
        message: 'Chuyển đổi địa chỉ sang tọa độ thành công',
        data: result
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }
};