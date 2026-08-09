import express from 'express';
import { ahamoveController } from '../controllers/ahamove.controller.js';
import { authenticate } from '../middlewares/auth.middleware.js';

const router = express.Router();

// Endpoint: POST /api/ahamove/estimate
router.post('/estimate', authenticate, ahamoveController.estimateShippingFee);

// Endpoint: POST /api/ahamove/create-order
router.post('/create-order', authenticate, ahamoveController.createOrderToAhamove);

export default router;