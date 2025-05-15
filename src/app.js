import express from 'express';
import UserRoutes from './routes/user.routes.js'
import logMiddleware from './middleware/log.middleware.js';

const app = express();

app.use(express.json());
app.use(logMiddleware);
app.use('/api', [UserRoutes]);


export default app;