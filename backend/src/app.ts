import './instrument';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import * as Sentry from '@sentry/node';
import 'express-async-errors';
import { config } from '@/config/unifiedConfig';
import authRoutes from '@/routes/authRoutes';
import creditCardRoutes from '@/routes/creditCardRoutes';
import transactionRoutes from '@/routes/transactionRoutes';
import categoryRoutes from '@/routes/categoryRoutes';
import goalRoutes from '@/routes/goalRoutes';

const app = express();

// Rate limiting configuration
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 150, // limit each IP to 150 requests per windowMs
  message: { success: false, error: 'Too many requests, please try again later.' },
  standardHeaders: true,
  legacyHeaders: false,
});

// Middlewares
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use('/api/', apiLimiter); // Apply rate limiter to all /api routes

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/credit-cards', creditCardRoutes);
app.use('/api/transactions', transactionRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/goals', goalRoutes);

// Basic health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Sentry Error Handler must be before any other error middleware
if (config.sentry.dsn) {
  Sentry.setupExpressErrorHandler(app);
}

// Global Exception Handler
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err);
  res.status(500).json({ success: false, error: 'Internal Server Error' });
});

export default app;
