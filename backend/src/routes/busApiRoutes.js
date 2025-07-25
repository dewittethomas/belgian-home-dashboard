import express from 'express';
import BusApiController from '../controllers/BusApiController.js';

const router = express.Router();

router.get('/', BusApiController.handle);

export default router;