import { ahamoveService } from '../services/ahamove.services.js';

export const ahamoveController = {
  // Xử lý tính cước phí
  estimateShippingFee: async (req, res) => {
    try {
      const { customerName, customerPhone, customerAddress, customerLat, customerLng } = req.body;

      if (!customerAddress || customerLat === undefined || customerLng === undefined) {
        return res.status(400).json({
          success: false,
          message: 'Vui lòng cung cấp đầy đủ địa chỉ và tọa độ của khách hàng!'
        });
      }

      const result = await ahamoveService.estimateFee({
        customerName,
        customerPhone,
        customerAddress,
        customerLat: parseFloat(customerLat),
        customerLng: parseFloat(customerLng)
      });

      return res.status(200).json({
        success: true,
        message: 'Tính phí vận chuyển thành công',
        data: result
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message
      });
    }
  },

  // Xử lý đẩy đơn hàng sang Ahamove
  createOrderToAhamove: async (req, res) => {
    try {
      const { maDh, customerName, customerPhone, customerAddress, customerLat, customerLng, items } = req.body;

      if (!maDh || !customerAddress || !items || items.length === 0) {
        return res.status(400).json({
          success: false,
          message: 'Thiếu thông tin mã đơn hàng, địa chỉ hoặc danh sách sản phẩm!'
        });
      }

      const result = await ahamoveService.createAhamoveOrder({
        maDh,
        customerName,
        customerPhone,
        customerAddress,
        customerLat: parseFloat(customerLat),
        customerLng: parseFloat(customerLng),
        items
      });

      return res.status(200).json({
        success: true,
        message: 'Tạo đơn hàng trên Ahamove thành công',
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