import express from 'express'
import { AdminController } from '../controllers'
import { getProfile } from '../middleware/getProfile'

const router = express.Router()
const controller = new AdminController()

router.route('/admin/best-profession')
  .get((req, response) => controller.getBestProfession(req as any, response))

router.route('/admin/best-clients')
  .get((req, response) => controller.getBestClients(req as any, response))

export const adminRouter = router
