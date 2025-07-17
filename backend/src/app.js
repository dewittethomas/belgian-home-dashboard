import express from 'express';
import dogApiRoutes from './routes/weatherApiRoutes.js';

const app = express();

app.get("/", (req, res) => {
    res.send("Hello from Express");
});

app.use('/api', dogApiRoutes);

export default app;