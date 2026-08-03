import express from 'express';
import cors from 'cors';
import { env, isSupabaseConfigured } from './config/env';
import { bookingRouter } from './routes/booking.routes';
import { contactRouter } from './routes/contact.routes';
import { adminRouter } from './routes/admin.routes';

const app = express();
const port = parseInt(env.PORT, 10) || 5000;

// CORS Configuration
app.use(
  cors({
    origin: 'https://yourstopstudio.netlify.app',
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health Check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'healthy',
    service: 'YourStop Studio Backend API',
    timestamp: new Date().toISOString(),
  });
});

// API Routes
app.use('/api/bookings', bookingRouter);
app.use('/api/contacts', contactRouter);
app.use('/api/admin', adminRouter);

// Global Error Handler
app.use(
  (
    err: any,
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    console.error('[Global Error]:', err);

    res.status(500).json({
      success: false,
      error: err.message || 'Internal Server Error',
    });
  }
);

app.listen(port, () => {
  console.log(`=======================================================`);
  console.log(`🚀 YourStop Studio API Server running on port ${port}`);
  console.log(
    `⚡ Environment: ${process.env.NODE_ENV || 'development'}`
  );
  console.log(
    `🗄️  Database: ${
      isSupabaseConfigured()
        ? '✅ Supabase Live'
        : '⚠️  Local In-Memory Fallback (configure SUPABASE_URL + SUPABASE_SERVICE_ROLE_KEY in .env to go live)'
    }`
  );
  console.log(`🌐 CORS Origin: https://yourstopstudio.netlify.app`);
  console.log(`=======================================================`);
});
