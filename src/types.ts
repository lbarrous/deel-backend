import { Request } from 'express';

export enum ContractStatus {
  NEW = 'new',
  IN_PROGRESS = 'in_progress',
  TERMINATED = 'terminated'
}

export enum ProfileTypes {
  CONTRACTOR = 'contractor',
  CLIENT = 'client',
}

export interface IContract {
  ClientId: string,
  ContractorId: string,
  terms: string,
  status: ContractStatus
}

export interface RequestCustom extends Request
{
    profile: {id: number, type: ProfileTypes };
}