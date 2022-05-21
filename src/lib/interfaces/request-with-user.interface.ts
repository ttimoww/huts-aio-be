import { Request } from 'express';
import { User } from './../../user/entities/user.entity';

export interface IRequestWithUser extends Request {
  user: User
}