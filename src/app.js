import express from 'express';
import CustomerRoutes from './routes/customer.routes.js';
import logMiddleware from './middleware/log.middleware.js';

const app = express();

app.use(express.json());
app.use(logMiddleware);
app.use('/api', [CustomerRoutes]);


export default app;