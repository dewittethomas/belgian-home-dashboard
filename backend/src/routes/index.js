import express from 'express';
import weatherApiRoutes from './weatherApiRoutes.js';
import wasteCollectionApiRoutes from './wasteCollectionApiRoutes.js';

const router = express.Router();

router.use('/weather', weatherApiRoutes);
router.use('/waste', wasteCollectionApiRoutes);

export default router;