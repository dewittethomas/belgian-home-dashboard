import express from 'express';
import routes from './routes/index.js';

const app = express();

app.get("/", (req, res) => {
    res.send("Hello from Express");
});

app.use('/api', routes);

export default app;