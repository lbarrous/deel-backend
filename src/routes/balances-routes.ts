import express from 'express';
import { BalanceController } from '../controllers';
import { getProfile } from '../middleware/getProfile'

const router = express.Router();
const controller = new BalanceController();

router.route('/balances/deposit/:userId').post(getProfile, (req, response) => controller.deposit(req as any, response));

export const balanceRouter = router;
