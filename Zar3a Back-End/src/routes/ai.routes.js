import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import { chat } from '../controllers/ai.controller.js';

const router = Router();

// Rate limiter for AI chat: 20 requests per minute per IP
const chatLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 20, 
  message: { success: false, error: 'Too many requests. Please try again later.' },
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

router.post('/', chatLimiter, chat);

export default router;
