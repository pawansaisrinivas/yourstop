import express from 'express';
import cors from 'cors';
import { env, isSupabaseConfigured } from './config/env';
import { bookingRouter } from './routes/booking.routes';
import { contactRouter } from './routes/contact.routes';
import { adminRouter } from './routes/admin.routes';

const app = express();

// Render provides PORT automatically
const port = Number(env.PORT) || 5000;

// ======================================================
// CORS CONFIGURATION
// ======================================================

const allowedOrigins = [
  'https://yourstopstudio.netlify.app',
  'http://localhost:3000',
  'http://localhost:3001',
];

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests without an Origin header
      // e.g. Postman, server-to-server requests, health checks
      if (!origin) {
        return callback(null, true);
      }

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      console.warn(`[CORS] Blocked origin: ${origin}`);

      return callback(new Error('Not allowed by CORS'));
    },

    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],

    allowedHeaders: [
      'Content-Type',
      'Authorization',
    ],

    credentials: true,
  })
);

// ======================================================
// BODY PARSERS
// ======================================================

app.use(express.json());

app.use(
  express.urlencoded({
    extended: true,
  })
);

// ======================================================
// HEALTH CHECK
// ======================================================

app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    status: 'healthy',
    service: 'YourStop Studio Backend API',
    database: isSupabaseConfigured()
      ? 'Supabase'
      : 'Local In-Memory Fallback',
    timestamp: new Date().toISOString(),
  });
});

// ======================================================
// API ROUTES
// ======================================================

app.use('/api/bookings', bookingRouter);
app.use('/api/contacts', contactRouter);
app.use('/api/admin', adminRouter);

// ======================================================
// 404 HANDLER
// ======================================================

app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: 'API route not found',
    path: req.originalUrl,
  });
});

// ======================================================
// GLOBAL ERROR HANDLER
// ======================================================

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
      error:
        process.env.NODE_ENV === 'production'
          ? 'Internal Server Error'
          : err.message || 'Internal Server Error',
    });
  }
);

// ======================================================
// START SERVER
// ======================================================

app.listen(port, '0.0.0.0', () => {
  console.log(`=======================================================`);
  console.log(`🚀 YourStop Studio API Server`);
  console.log(`🌐 Port: ${port}`);
  console.log(
    `⚡ Environment: ${process.env.NODE_ENV || 'development'}`
  );
  console.log(
    `🗄️  Database: ${
      isSupabaseConfigured()
        ? '✅ Supabase Live'
        : '⚠️ Local In-Memory Fallback'
    }`
  );
  console.log(`🔒 Allowed production origin:`);
  console.log(`   https://yourstopstudio.netlify.app`);
  console.log(`=======================================================`);
});
