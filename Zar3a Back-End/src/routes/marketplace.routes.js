import { Router } from 'express';
import { body, validationResult } from 'express-validator';
import { uploadProductImage, uploadExpertImage } from '../middlewares/upload.js';
import authenticate from '../middlewares/authenticate.js';
import { requireApproved } from '../middlewares/roleBasedAccess.js';
import {
  getCropMarketProducts,
  createCropMarketProduct,
  getAgriShopProducts,
  createAgriShopProduct,
  getSensorMarketProducts,
  createSensorMarketProduct,
  getExpertListings,
  createExpertListing,
  searchProducts,
  getProductById,
  deleteProduct,
  updateProduct,
  createProductReview,
  getProductReviews,
  updateProductReview,
  deleteProductReview,
  updateExpertListing,
  deleteExpertListing,
  boostUserProduct,
  boostProductsBatch,
} from '../controllers/marketplace.controller.js';
import { createInquiry } from '../controllers/inquiry.controller.js';

const router = Router();

const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(422).json({ errors: errors.array() });
  next();
};

// ─────────────────────────────────────────────────────────
// CROP MARKET ENDPOINTS
// ─────────────────────────────────────────────────────────

// GET /marketplace/crop-products
// Get all Crop Market products (public)
router.get('/crop-products', getCropMarketProducts);

// POST /marketplace/crop-products
// Add product to Crop Market (FARMER ONLY)
router.post(
  '/crop-products',
  authenticate,
  requireApproved,
  uploadProductImage,
  [
    body('title').trim().notEmpty().withMessage('Title is required'),
    body('description').trim().notEmpty().withMessage('Description is required'),
    body('category').trim().notEmpty().withMessage('Category is required'),
    body('price').isFloat({ gt: 0 }).withMessage('Price must be a positive number'),
  ],
  validate,
  createCropMarketProduct
);

// ─────────────────────────────────────────────────────────
// AGRI SHOP ENDPOINTS
// ─────────────────────────────────────────────────────────

// GET /marketplace/agri-products
// Get all Agri Shop products (public)
router.get('/agri-products', getAgriShopProducts);

// POST /marketplace/agri-products
// Add product to Agri Shop (SUPPLIER ONLY)
router.post(
  '/agri-products',
  authenticate,
  requireApproved,
  uploadProductImage,
  [
    body('title').trim().notEmpty().withMessage('Title is required'),
    body('description').trim().notEmpty().withMessage('Description is required'),
    body('category').trim().notEmpty().withMessage('Category is required'),
    body('price').isFloat({ gt: 0 }).withMessage('Price must be a positive number'),
  ],
  validate,
  createAgriShopProduct
);

// ─────────────────────────────────────────────────────────
// SENSOR MARKET ENDPOINTS
// ─────────────────────────────────────────────────────────

// GET /marketplace/sensor-products
// Get all Sensor Market products (public)
router.get('/sensor-products', getSensorMarketProducts);

// POST /marketplace/sensor-products
// Add product to Sensor Market (ADMIN ONLY)
router.post(
  '/sensor-products',
  authenticate,
  uploadProductImage,
  [
    body('title').trim().notEmpty().withMessage('Title is required'),
    body('description').trim().notEmpty().withMessage('Description is required'),
    body('category').trim().notEmpty().withMessage('Category is required'),
    body('price').isFloat({ gt: 0 }).withMessage('Price must be a positive number'),
  ],
  validate,
  createSensorMarketProduct
);

// ─────────────────────────────────────────────────────────
// PRODUCT SEARCH & DETAILS
// ─────────────────────────────────────────────────────────

// GET /marketplace/search
// Search products across both marketplaces
// Query: ?q=search&marketplace=crop|agri&category=SEEDS
router.get('/search', searchProducts);

// DELETE /marketplace/products/:productId
// Delete a product (role checks done in controller)
router.delete('/products/:productId', authenticate, deleteProduct);

// GET /marketplace/products/:productId
// Get detailed product info
router.get('/products/:productId', getProductById);

// PUT /marketplace/products/:productId
// Edit/Update a product
router.put(
  '/products/:productId',
  authenticate,
  requireApproved,
  uploadProductImage,
  [
    body('title').optional().trim().notEmpty().withMessage('Title cannot be empty'),
    body('description').optional().trim().notEmpty().withMessage('Description cannot be empty'),
    body('price').optional().isFloat({ gt: 0 }).withMessage('Price must be a positive number'),
  ],
  validate,
  updateProduct
);

// ─────────────────────────────────────────────────────────
// PRODUCT REVIEW ENDPOINTS
// ─────────────────────────────────────────────────────────

// GET /marketplace/products/:productId/reviews
// Get reviews for a product (public)
router.get('/products/:productId/reviews', getProductReviews);

// POST /marketplace/products/:productId/reviews
// Add a review (authenticated)
router.post(
  '/products/:productId/reviews',
  authenticate,
  [
    body('rating').isInt({ min: 1, max: 5 }).withMessage('Rating must be between 1 and 5'),
    body('comment').trim().notEmpty().withMessage('Comment is required'),
  ],
  validate,
  createProductReview
);

// PUT /marketplace/products/:productId/reviews/:reviewId
// Edit own review (authenticated)
router.put(
  '/marketplace/products/:productId/reviews/:reviewId',
  authenticate,
  [
    body('rating').optional().isInt({ min: 1, max: 5 }).withMessage('Rating must be between 1 and 5'),
    body('comment').optional().trim().notEmpty().withMessage('Comment cannot be empty'),
  ],
  validate,
  updateProductReview
);

// DELETE /marketplace/products/:productId/reviews/:reviewId
// Delete review (owner or Admin)
router.delete('/products/:productId/reviews/:reviewId', authenticate, deleteProductReview);

// ─────────────────────────────────────────────────────────
// EXPERT LISTINGS ENDPOINTS
// ─────────────────────────────────────────────────────────

// GET /marketplace/expert-listings
// Get all APPROVED expert listings (public)
router.get('/expert-listings', getExpertListings);

// POST /marketplace/expert-listings
// Create expert listing (APPROVED AGRO_EXPERT ONLY)
router.post(
  '/expert-listings',
  authenticate,
  requireApproved,
  uploadExpertImage,
  [
    body('title').trim().notEmpty().withMessage('Title is required'),
    body('specialty').trim().notEmpty().withMessage('Specialty is required'),
    body('description').trim().notEmpty().withMessage('Description is required'),
    body('hourlyRate').isFloat({ gt: 0 }).withMessage('Hourly rate must be greater than 0'),
  ],
  validate,
  createExpertListing
);

// PUT /marketplace/expert-listings/:id
// Update an expert listing
router.put(
  '/expert-listings/:id',
  authenticate,
  uploadExpertImage,
  [
    body('title').optional().trim().notEmpty().withMessage('Title is required'),
    body('specialty').optional().trim().notEmpty().withMessage('Specialty is required'),
    body('description').optional().trim().notEmpty().withMessage('Description is required'),
    body('hourlyRate').optional().isFloat({ gt: 0 }).withMessage('Hourly rate must be greater than 0'),
  ],
  validate,
  updateExpertListing
);

// DELETE /marketplace/expert-listings/:id
// Delete an expert listing
router.delete('/expert-listings/:id', authenticate, deleteExpertListing);

// ─────────────────────────────────────────────────────────
// INQUIRIES ENDPOINTS
// ─────────────────────────────────────────────────────────

// POST /marketplace/inquiries
router.post(
  '/inquiries',
  authenticate,
  [
    body('productId').isInt().withMessage('Product ID must be an integer'),
    body('quantity').isInt({ gt: 0 }).withMessage('Quantity must be positive'),
    body('message').trim().notEmpty().withMessage('Message is required'),
    body('location').optional().trim(),
  ],
  validate,
  createInquiry
);

// ─────────────────────────────────────────────────────────
// BOOSTING ENDPOINTS
// ─────────────────────────────────────────────────────────

// POST /marketplace/products/boost-batch
router.post('/products/boost-batch', authenticate, boostProductsBatch);

// POST /marketplace/products/:productId/boost
router.post('/products/:productId/boost', authenticate, boostUserProduct);

export default router;
