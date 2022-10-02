import express from 'express';
import { JobController } from '../controllers';
import { RequestCustom } from '../types';
import { getProfile } from '../middleware/getProfile'

const router = express.Router();
const controller = new JobController();

router.route('/jobs/unpaid').get(getProfile, (req, response) => controller.getUnpaid(req as RequestCustom, response));
router.route('/jobs/:job_id/pay').post(getProfile, (req, response) => controller.setPayment(req as any, response));


export const jobRouter = router;