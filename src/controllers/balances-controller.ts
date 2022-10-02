import { Response } from 'express'
import { Op } from 'sequelize'
import { Contract, Job, Profile } from '../model'
import { ContractStatus, IJob, IProfile, ProfileTypes, RequestCustom } from '../types'

export class BalanceController {
  /**
   * Deposits money into the the the balance of a client,
   * a client can't deposit more than 25% his total of jobs to pay.
   * (at the deposit moment)
   * @param req Express request
   * @param res Express response
   */
  async deposit (req: RequestCustom, res: Response) {
    const clientId = parseInt(req.params.userId)
    const profileId = req.profile.id
    const depositAmount = req.body.amount

    if (!clientId || !depositAmount || profileId !== clientId) { return res.status(400).send('Error: bad params') }

    const profile: IProfile | null = await Profile.findOne({ where: { id: clientId } }) as any

    if (!profile) { return res.status(400).send() }

    if (profile.type !== ProfileTypes.CLIENT) { return res.status(400).send() }

    const jobs = await this.getClientJobs(profile.id)

    const prices = jobs.map((job) => job.price)
    const unpaidBalance = prices.reduce((prev, curr) => prev + curr, 0)

    if (depositAmount > unpaidBalance * 0.25) { return res.status(400).send('Error: amount is too big') }

    await Profile.update({ balance: profile.balance + depositAmount }, { where: { id: profile.id } })
    const updatedProfile: IProfile | null = await Profile.findOne({ where: { id: profile.id } }) as any

    return res.status(200).json(updatedProfile)
  }

  /**
   * Get all jobs that belong to a client
   * @param clientId clientid
   * @returns
   */
  private async getClientJobs (clientId: number): Promise<IJob[]> {
    const allowedStatus = [ContractStatus.IN_PROGRESS, ContractStatus.NEW]

    const jobs: IJob[] = await Job.findAll({
      include: [{
        model: Contract,
        where: {
          status: allowedStatus,
          [Op.or]: [{ ClientId: clientId }]
        }
      }],
      where: {
        paid: null
      }
    }) as any

    return jobs
  }
}
