import express from 'express';
import { calculateFee, createShippingOrder, ghnWebhook } from '../controllers/ghn.controller.js';
import { authenticate } from '../middlewares/auth.middleware.js'; //[cite: 5]
import { authorize } from '../middlewares/authorize.middleware.js';    //[cite: 6]

const router = express.Router();

// Route công khai hoặc người dùng đã đăng nhập để tính phí
router.post('/calculate-fee', authenticate, calculateFee);

// Route dành cho Admin/Nhân viên tạo vận đơn[cite: 6]
router.post('/create-order', authenticate, authorize('ADMIN', 'NHAN_VIEN'), createShippingOrder);

// Webhook endpoint (GHN sẽ gọi tới)
router.post('/webhook', ghnWebhook);

export default router;
