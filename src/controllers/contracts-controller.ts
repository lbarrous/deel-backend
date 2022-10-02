import { Response } from 'express';
import { Op } from 'sequelize';
import { Contract } from '../model';
import { ContractStatus, RequestCustom } from '../types';

export class ContractController {
  /**
   * Gets all contract that belong to a profile id that are not terminated
   * @param req 
   * @param res 
   */
  async getAll(req: RequestCustom, res: Response){
    const allowedStatus = [ContractStatus.IN_PROGRESS, ContractStatus.NEW];
    const profileId = req.profile.id;
    const contracts = await Contract.findAll({
      where: {
        status: allowedStatus,
        [Op.or]: [{ ClientId: profileId }, { ContractorId: profileId }]
      }
    });

    res.json(contracts).end();
  }
}