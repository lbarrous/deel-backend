import express from 'express';
import { ContractController } from '../controllers/';
import { RequestCustom } from '../types';
import { getProfile } from '../middleware/getProfile'

const router = express.Router();
const controller = new ContractController();

router.route('/contracts').get(getProfile, (req, response) => controller.getAll(req as RequestCustom, response));

export const contractRouter = router;