import express from 'express';
import WasteCollectionController from '../controllers/WasteCollectionApiController.js';

const router = express.Router();

router.get('/', WasteCollectionController.handle);

export default router;