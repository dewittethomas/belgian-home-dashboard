import express from 'express';
import WeatherApiController from '../controllers/WeatherApiController.js';

const router = express.Router();

router.post('/', WeatherApiController.handle);

export default router;