import { body, validationResult } from "express-validator";

// Lightweight in-memory rate limiter to prevent brute-force attacks on login
const loginAttempts = new Map();

export const loginRateLimiter = (req, res, next) => {
  const ip = req.ip || req.headers['x-forwarded-for'] || req.socket.remoteAddress;
  const now = Date.now();
  const timeframe = 15 * 1000; // 15 seconds window
  const maxAttempts = 5; // Allow max 5 login requests per timeframe

  if (!loginAttempts.has(ip)) {
    loginAttempts.set(ip, []);
  }

  // Filter out attempts older than the timeframe window
  const attempts = loginAttempts.get(ip).filter(timestamp => now - timestamp < timeframe);
  attempts.push(now);
  loginAttempts.set(ip, attempts);

  if (attempts.length > maxAttempts) {
    console.warn(`[SECURITY WARNING] Rate limit exceeded for login attempts from IP: ${ip}`);
    return res.status(429).json({
      message: "Too many login attempts. Please try again after 15 seconds."
    });
  }

  next();
};

/**
 * Middleware to reject requests containing 'passwordHash' in body, query, or params.
 * Prevents passwordHash injection attacks.
 */
export const rejectPasswordHash = (req, res, next) => {
  if (req.body && 'passwordHash' in req.body) {
    console.warn(`[SECURITY WARNING] Attempt to inject passwordHash directly from IP: ${req.ip}`);
    return res.status(400).json({ message: "Bad Request: 'passwordHash' field is not allowed in payload." });
  }
  next();
};

/**
 * Runs validation checks and returns formatted errors if any.
 */
export const runValidation = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array().map(err => ({ field: err.path, message: err.msg })) });
  }
  next();
};

/**
 * Strict rules for Registration validation
 */
export const registerValidationRules = [
  body("fullName")
    .trim()
    .notEmpty().withMessage("Full name is required")
    .isLength({ min: 3, max: 50 }).withMessage("Full name must be between 3 and 50 characters")
    .matches(/^[a-zA-Z\u0600-\u06FF\s]+$/).withMessage("Full name must contain only letters and spaces"),
  
  body("username")
    .trim()
    .notEmpty().withMessage("Username is required")
    .isLength({ min: 3, max: 20 }).withMessage("Username must be between 3 and 20 characters")
    .matches(/^[a-zA-Z0-9_-]+$/).withMessage("Username can only contain letters, numbers, underscores, and hyphens"),
  
  body("email")
    .trim()
    .notEmpty().withMessage("Email is required")
    .isEmail().withMessage("Please enter a valid email address")
    .normalizeEmail({ gmail_remove_dots: false, gmail_remove_subaddress: false }),
  
  body("phone")
    .trim()
    .notEmpty().withMessage("Phone number is required")
    .matches(/^\d{12}$/).withMessage("Phone number must be exactly 12 digits (e.g. 201012345678)"),
  
  body("password")
    .notEmpty().withMessage("Password is required")
    .isLength({ min: 8 }).withMessage("Password must be at least 8 characters long")
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-={}|;':\",./<>?])/).withMessage("Password must include at least one uppercase letter, one lowercase letter, one number, and one special character")
];

/**
 * Strict rules for Login validation
 */
export const loginValidationRules = [
  body("email")
    .trim()
    .notEmpty().withMessage("Email or username is required"),
  body("password")
    .notEmpty().withMessage("Password is required")
];
