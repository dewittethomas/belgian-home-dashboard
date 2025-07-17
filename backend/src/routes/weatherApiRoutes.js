import express from 'express';
import WeatherApiController from '../controllers/WeatherApiController.js';

const router = express.Router();

router.get('/weather', WeatherApiController.handle);

export default router;