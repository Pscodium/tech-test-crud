import express from 'express';
import swaggerUi from 'swagger-ui-express';
import openapi from './config/openapi.js';
import CustomerRoutes from './routes/customer.routes.js';
import logMiddleware from './middleware/log.middleware.js';
import errorMiddleware from './middleware/error.middleware.js';

const app = express();

app.use(express.json());
app.use(logMiddleware);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(openapi));
app.use('/api', [CustomerRoutes]);

app.use(errorMiddleware);
app.use('*', (req, res) => {
    res.status(404).json({ status: 'error', message: `This route doesn't exist - ${req.originalUrl}` });
});


export default app;