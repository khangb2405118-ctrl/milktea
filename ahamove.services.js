import axios from 'axios';

const GHN_API_URL = process.env.GHN_API_URL;
const GHN_TOKEN = process.env.GHN_TOKEN;
const GHN_SHOP_ID = Number(process.env.GHN_SHOP_ID);
const GHN_SHOP_DISTRICT_ID = Number(process.env.GHN_SHOP_DISTRICT_ID) || 1442; // Mặc định Quận 1 nếu quên nhập env

const ghnClient = axios.create({
  baseURL: GHN_API_URL,
  headers: {
    'Content-Type': 'application/json',
    'Token': GHN_TOKEN,
    'ShopId': GHN_SHOP_ID
  }
});

export const calculateFeeService = async ({
  toDistrictId,
  toWardCode,
  weight = 500,
  serviceTypeId = 2
}) => {
  const response = await ghnClient.post('/v2/shipping-order/fee', {
    service_type_id: serviceTypeId,
    insurance_value: 0,
    coupon: null,
    from_district_id: GHN_SHOP_DISTRICT_ID,
    to_district_id: Number(toDistrictId),
    to_ward_code: String(toWardCode),
    height: 10,
    length: 10,
    weight: Number(weight),
    width: 10
  });

  return response.data;
};

/**
 * Tạo đơn hàng vận chuyển trên hệ thống GHN
 */
export const createOrderService = async (orderData) => {
  const response = await ghnClient.post('/v2/shipping-order/create', {
    payment_type_id: orderData.paymentTypeId || 2, // 1: Người gửi trả, 2: Người nhận trả
    note: orderData.note || "Giao hàng trà sữa",
    required_note: "KHONGCHOXEMHANG",
    return_phone: orderData.returnPhone,
    return_address: orderData.returnAddress,
    to_name: orderData.toName,
    to_phone: orderData.toPhone,
    to_address: orderData.toAddress,
    to_ward_code: String(orderData.toWardCode),
    to_district_id: Number(orderData.toDistrictId),
    cod_amount: Number(orderData.codAmount || 0),
    content: "Đơn hàng trà sữa",
    weight: Number(orderData.weight || 500),
    length: 10,
    width: 10,
    height: 10,
    pick_station_id: null,
    insurance_value: Number(orderData.insuranceValue || 0),
    service_type_id: orderData.serviceTypeId || 2,
    items: orderData.items || []
  });

  return response.data;
};

/**
 * Hủy đơn hàng giao vận GHN
 */
export const cancelOrderService = async (orderCodes) => {
  const response = await ghnClient.post('/v2/shipping-order/cancel', {
    order_codes: Array.isArray(orderCodes) ? orderCodes : [orderCodes]
  });

  return response.data;
};
