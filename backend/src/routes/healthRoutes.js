import express from 'express';
import HealthController from '../controllers/HealthController.js';

const router = express.Router();

router.get('/', HealthController.handle);

export default router;