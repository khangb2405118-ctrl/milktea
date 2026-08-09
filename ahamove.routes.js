import express from 'express';
import { calculateFee, createShippingOrder, ghnWebhook } from '../controllers/ghn.controller.js';
import { authenticate } from '../middlewares/auth.middleware.js'; 
import { authorize } from '../middlewares/authorize.middleware.js';    

const router = express.Router();

router.post('/calculate-fee', authenticate, calculateFee);
router.post('/create-order', authenticate, authorize('ADMIN', 'NHAN_VIEN'), createShippingOrder);
router.post('/webhook', ghnWebhook);

export default router;
