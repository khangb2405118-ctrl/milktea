import prisma from '../config/prisma.js'; // Đường dẫn import prisma client[cite: 2]
import { calculateFeeService, createOrderService, cancelOrderService } from '../services/ghn.services.js';

/**
 * API Tính phí vận chuyển
 */
export const calculateFee = async (req, res) => {
  try {
    const { toDistrictId, toWardCode, weight } = req.body;

    if (!toDistrictId || !toWardCode) {
      return res.status(400).json({
        success: false,
        message: "Thiếu tham số toDistrictId hoặc toWardCode."
      });
    }

    const result = await calculateFeeService({ toDistrictId, toWardCode, weight });

    return res.status(200).json({
      success: true,
      data: result.data
    });
  } catch (error) {
    console.error("[ghn.controller] calculateFee:", error?.response?.data || error.message);
    return res.status(500).json({
      success: false,
      message: error?.response?.data?.message || "Lỗi khi tính phí vận chuyển GHN."
    });
  }
};

/**
 * API Tạo vận đơn GHN và cập nhật mã vận đơn vào đơn hàng
 */
export const createShippingOrder = async (req, res) => {
  try {
    const { maDh, toName, toPhone, toAddress, toDistrictId, toWardCode, weight } = req.body;

    // Tìm đơn hàng trong cơ sở dữ liệu[cite: 3]
    const donHang = await prisma.dON_HANG.findUnique({
      where: { MA_DH: maDh },
      include: {
        CHI_TIET_DON_HANG: {
          include: { SAN_PHAM: true }
        }
      }
    });

    if (!donHang) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy đơn hàng trong hệ thống."
      });
    }

    // Chuẩn bị danh sách sản phẩm theo định dạng của GHN
    const items = donHang.CHI_TIET_DON_HANG.map((ct) => ({
      name: ct.SAN_PHAM?.TEN_SP || "Sản phẩm",
      quantity: ct.SOLUONG || 1,
      price: Number(ct.THANHTIEN || 0)
    }));

    const ghnPayload = {
      toName: toName || "Khách hàng",
      toPhone,
      toAddress: toAddress || donHang.DIA_CHI_GIAO_HANG,
      toDistrictId,
      toWardCode,
      codAmount: donHang.PTTT === "COD" ? Number(donHang.TONG_TIEN) : 0,
      weight: weight || 500,
      items
    };

    const ghnRes = await createOrderService(ghnPayload);

    if (ghnRes.code === 200) {
      const ghnData = ghnRes.data;

      // Cập nhật MA_VAN_DON và PHI_SHIP vào DB[cite: 3]
      const updatedOrder = await prisma.dON_HANG.update({
        where: { MA_DH: maDh },
        data: {
          MA_VAN_DON: ghnData.order_code, // Lưu mã vận đơn GHN[cite: 3]
          PHI_SHIP: ghnData.total_fee,   // Cập nhật phí ship[cite: 3]
          TRANG_THAI: "DANG_GIAO"        // Cập nhật trạng thái đơn[cite: 3]
        }
      });

      return res.status(200).json({
        success: true,
        message: "Tạo vận đơn GHN thành công.",
        data: {
          orderCode: ghnData.order_code,
          expectedDeliveryDate: ghnData.expected_delivery_time,
          order: updatedOrder
        }
      });
    }

    return res.status(400).json({
      success: false,
      message: ghnRes.message || "Tạo vận đơn GHN thất bại."
    });
  } catch (error) {
    console.error("[ghn.controller] createShippingOrder:", error?.response?.data || error.message);
    return res.status(500).json({
      success: false,
      message: error?.response?.data?.message || "Lỗi khi tạo vận đơn GHN."
    });
  }
};

/**
 * Webhook nhận cập nhật trạng thái từ GHN
 */
export const ghnWebhook = async (req, res) => {
  try {
    const { OrderCode, Status } = req.body;

    if (!OrderCode) {
      return res.status(400).json({ success: false, message: "Thiếu OrderCode." });
    }

    // Ánh xạ trạng thái GHN sang trạng thái hệ thống
    let statusMapping = "DANG_GIAO";
    if (Status === "delivered") {
      statusMapping = "DA_GIAO";
    } else if (Status === "cancel") {
      statusMapping = "DA_HUY";
    }

    // Cập nhật đơn hàng dựa theo mã vận đơn[cite: 3]
    await prisma.dON_HANG.updateMany({
      where: { MA_VAN_DON: OrderCode },
      data: { TRANG_THAI: statusMapping }
    });

    return res.status(200).json({ success: true, message: "Cập nhật webhook thành công." });
  } catch (error) {
    console.error("[ghn.controller] ghnWebhook:", error);
    return res.status(500).json({ success: false, message: "Lỗi xử lý Webhook." });
  }
};
