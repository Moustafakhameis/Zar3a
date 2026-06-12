import { Router } from 'express';
import { body, validationResult } from 'express-validator';
import authenticate from '../middlewares/authenticate.js';
import adminOnly from '../middlewares/adminOnly.js';
import {
  getAllUsers,
  getUserDetails,
  changeUserRole,
  deleteUser,
  deleteProduct,
  getAdminStats,
  getInquiries,
  updateInquiryStatus,
  boostProduct,
  removeBoost,
  getBoostedProducts,
} from '../controllers/admin.controller.js';

const router = Router();

const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(422).json({ errors: errors.array() });
  next();
};

router.use(authenticate, adminOnly);

router.get('/users', getAllUsers);
router.get('/users/:userId', getUserDetails);
router.post(
  '/users/:userId/role',
  [body('newRole').isIn(['FARMER', 'SUPPLIER', 'BUYER', 'ADMIN', 'AGRO_EXPERT']).withMessage('Invalid role')],
  validate,
  changeUserRole
);
router.delete('/users/:userId', deleteUser);
router.delete('/products/:productId', deleteProduct);
router.get('/products/boosted', getBoostedProducts);
router.post(
  '/products/:productId/boost',
  [body('boostExpiryDate').optional().isISO8601().withMessage('Invalid date format')],
  validate,
  boostProduct
);
router.delete('/products/:productId/boost', removeBoost);
router.get('/stats', getAdminStats);

router.get('/inquiries', getInquiries);
router.put(
  '/inquiries/:id/status',
  [body('status').isIn(['ACCEPTED', 'REJECTED']).withMessage('Invalid status')],
  validate,
  updateInquiryStatus
);

export default router;
