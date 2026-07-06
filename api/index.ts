import { createExpressApp } from '../app-server';
import express from 'express';

let app: any;
try {
  app = createExpressApp();

  // Express error handler for runtime errors in any route
  app.use((err: any, req: any, res: any, next: any) => {
    console.error('[Vercel API Error]:', err);
    res.status(500).json({
      error: 'Internal Server Error caught by Vercel Express Handler',
      message: err?.message || String(err),
      stack: err?.stack || null
    });
  });
} catch (error: any) {
  console.error('[Vercel Express Initialization Failed]:', error);
  
  // Fallback express app to return the initialization error in JSON format
  const fallbackApp = express();
  fallbackApp.use(express.json());
  
  fallbackApp.all('*', (req, res) => {
    res.status(500).json({
      error: 'Express initialization failed on Vercel',
      message: error?.message || String(error),
      stack: error?.stack || null
    });
  });
  
  app = fallbackApp;
}

export default app;
