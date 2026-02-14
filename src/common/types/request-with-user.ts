import { Request } from 'express';
import { JwtPayload } from '@modules/auth/interfaces/jwt-payload.interface';

export interface RequestWithUser extends Request {
  user: JwtPayload;
  body: {
    refresh_token: string;
  };
}
