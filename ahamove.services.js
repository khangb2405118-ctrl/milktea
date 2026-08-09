import { ahamoveIntegration } from '../integrations/ahamove.integrations.js';
import prisma from '../config/prisma.js';

const SHOP_INFO = {
  name: process.env.SHOP_NAME || 'Cửa hàng Trà Sữa MilkTea',
  mobile: process.env.SHOP_PHONE || '0901234567',
  address: process.env.SHOP_ADDRESS || 'Cần Thơ',
  lat: parseFloat(process.env.SHOP_LAT || '10.0299337'),
  lng: parseFloat(process.env.SHOP_LNG || '105.7706153')
};

export const ahamoveService = {
  estimateFee: async ({ customerName, customerPhone, customerAddress, customerLat, customerLng }) => {
    const payload = {
      order_time: 0,
      service_id: "SGN-BIKE",
      path: [
        { lat: SHOP_INFO.lat, lng: SHOP_INFO.lng, address: SHOP_INFO.address, name: SHOP_INFO.name, mobile: SHOP_INFO.mobile },
        { lat: customerLat, lng: customerLng, address: customerAddress, name: customerName, mobile: customerPhone }
      ]
    };

    return await ahamoveIntegration.estimateOrder(payload);
  },

  createAhamoveOrder: async ({ maDh, customerName, customerPhone, customerAddress, customerLat, customerLng, items }) => {
    const payload = {
      order_time: 0,
      service_id: "SGN-BIKE",
      payment_method: "CASH",
      path: [
        { lat: SHOP_INFO.lat, lng: SHOP_INFO.lng, address: SHOP_INFO.address, name: SHOP_INFO.name, mobile: SHOP_INFO.mobile, remarks: "Lấy đơn tại quán" },
        { lat: customerLat, lng: customerLng, address: customerAddress, name: customerName, mobile: customerPhone, tracking_number: maDh, remarks: "Giao đồ uống cho khách" }
      ],
      items: items.map(item => ({
        _id: item.MA_SP,
        name: item.TEN_SP || "Đồ uống",
        num: item.SOLUONG,
        price: Number(item.THANHTIEN)
      }))
    };

    const orderData = await ahamoveIntegration.createOrder(payload);
    const trackingNumber = orderData.order_id || orderData._id;
    const totalFee = orderData.total_pay || orderData.total_fee || 0;

    // Cập nhật database DON_HANG[cite: 19]
    await prisma.dON_HANG.update({
      where: { MA_DH: maDh },
      data: {
        MA_VAN_DON: trackingNumber,
        PHI_SHIP: totalFee,
        TRANG_THAI: 'CHO_LAY_HANG'
      }
    });

    return orderData;
  }
};