import { Expose, Type } from 'class-transformer';
import { Request } from 'express';
import { User } from 'src/modules/mikroorm/entities/User';

export interface RequestWithAuth extends Request {
  user: User;
  refreshToken?: string;
}

export class AuthToken {
  @Expose()
  token!: string;
  @Expose()
  expiresIn!: number;
  @Expose()
  expiresAt!: Date;
  @Expose()
  cookie?: string;
}

export class AuthData {
  @Expose()
  @Type(() => AuthToken)
  accessToken!: AuthToken;
  @Expose()
  @Type(() => AuthToken)
  refreshToken!: AuthToken;
}
