import express from 'express';

import weatherApiRoutes from './weatherApiRoutes.js';
import wasteCollectionApiRoutes from './wasteCollectionApiRoutes.js';
import trainApiRoutes from './trainApiRoutes.js';
import busApiRoutes from './busApiRoutes.js';
import tramApiRoutes from './tramApiRoutes.js';

const router = express.Router();

router.use('/weather', weatherApiRoutes);
router.use('/waste', wasteCollectionApiRoutes);
router.use('/train', trainApiRoutes);
router.use('/bus', busApiRoutes);
router.use('/tram', tramApiRoutes);

export default router;