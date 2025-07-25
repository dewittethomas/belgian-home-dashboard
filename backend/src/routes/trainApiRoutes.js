import express from 'express';
import TrainApiController from '../controllers/TrainApiController.js';

const router = express.Router();

router.get('/', TrainApiController.handle);

export default router;