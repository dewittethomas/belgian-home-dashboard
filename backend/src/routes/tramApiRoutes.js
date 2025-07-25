import express from 'express';
import TramApiController from '../controllers/TramApiController.js';

const router = express.Router();

router.get('/', TramApiController.handle);

export default router;