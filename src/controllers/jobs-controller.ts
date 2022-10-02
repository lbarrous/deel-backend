import { Response } from 'express'
import { Op } from 'sequelize'
import { Contract, Job, Profile } from '../model'
import { ContractStatus, IJob, IProfile, RequestCustom } from '../types'

export class JobController {
  /**
   * Get all unpaid jobs for a user (**_either_** a client or contractor),
   * for **_active contracts only_**.
   * @param req
   * @param res
   */
  async getUnpaid (req: RequestCustom, res: Response) {
    const allowedStatus = [ContractStatus.IN_PROGRESS, ContractStatus.NEW]
    const profileId = req.profile.id
    const jobs = await Job.findAll({
      include: [{
        model: Contract,
        where: {
          status: allowedStatus,
          [Op.or]: [{ ClientId: profileId }, { ContractorId: profileId }]
        }
      }],
      where: {
        paid: null
      }
    })

    res.json(jobs).send()
  }

  /**
   * ay for a job, a client can only pay if his balance >= the amount to pay.
   * The amount should be moved from the client's balance to the contractor balance.
   * @param req
   * @param res
   * @returns
   */
  async setPayment (req: RequestCustom, res: Response) {
    const jobId = req.params.job_id
    const allowedStatus = [ContractStatus.IN_PROGRESS, ContractStatus.NEW]
    const profileId = req.profile.id

    const job: IJob | null = await Job.findOne({
      include: [{
        model: Contract,
        where: {
          status: allowedStatus,
          [Op.or]: [{ ClientId: profileId }, { ContractorId: profileId }]
        }
      }],
      where: {
        id: jobId
      }
    }) as any

    if (!job) { return res.status(404).send() }

    const clientId = job.Contract.ClientId
    const contractorId = job.Contract.ContractorId
    const client: IProfile | null = await Profile.findOne({ where: { id: clientId } }) as any
    const contractor: IProfile | null = await Profile.findOne({ where: { id: contractorId } }) as any

    if (!client || !contractor) { return res.status(422).send() }

    const clientBalance = client.balance
    const contractorBalance = contractor.balance

    const price = job.price
    if (clientBalance < price) { return res.status(422).send('Error: not enough balance') }

    // TODO: Put this code inside a transaction...
    const numberJobsUpdated = await Job.update({ paid: true }, { where: { id: jobId } })
    await Profile.update({ balance: clientBalance - price }, { where: { id: clientId } })
    await Profile.update({ balance: contractorBalance + price }, { where: { id: contractorId } })

    return res.status(200).send(numberJobsUpdated).send()
  }
}
