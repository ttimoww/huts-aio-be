import { Request } from 'express';
import { User } from '../../user/user.entity';

export interface IRequestWithUser extends Request {
  user: User
}