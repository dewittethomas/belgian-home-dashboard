import express from 'express';
import TramApiController from '../controllers/TramApiController.js';

const router = express.Router();

router.post('/', TramApiController.handle);

export default router;