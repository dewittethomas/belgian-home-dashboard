import express from 'express';
import BusApiController from '../controllers/BusApiController.js';

const router = express.Router();

router.post('/', BusApiController.handle);

export default router;