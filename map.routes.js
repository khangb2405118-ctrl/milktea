import express from 'express';
import { mapController } from '../controllers/map.controller.js';
import { authenticate } from '../middlewares/auth.middleware.js';

const router = express.Router();

// Endpoint: GET /api/map/autocomplete?input=...
router.get('/autocomplete', authenticate, mapController.autocompleteAddress);

// Endpoint: GET /api/map/geocode?address=...
router.get('/geocode', authenticate, mapController.geocodeAddress);

export default router;