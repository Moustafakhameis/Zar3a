import express from 'express';
import authenticate from '../middlewares/authenticate.js';
import roleBasedAccess from '../middlewares/roleBasedAccess.js';
import { getFarms, createFarm, deleteFarm, createSector, deleteSector } from '../controllers/farm.controller.js';

const router = express.Router();

router.use(authenticate);
router.use(roleBasedAccess('FARMER', 'ADMIN'));

router.get('/', getFarms);
router.post('/', createFarm);
router.delete('/:farmId', deleteFarm);

router.post('/:farmId/sectors', createSector);
router.delete('/sectors/:sectorId', deleteSector);

export default router;
