import { Request } from 'express';
import { License } from './../../auth/license.entity';

export interface IRequestWithLicense extends Request {
  user: License
}