import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { AuthToken, RequestWithAuth } from 'src/types/interfaces';
import { AuthService } from '../auth.service';

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(
  Strategy,
  'jwt-refresh',
) {
  constructor(
    private readonly configService: ConfigService,
    private readonly authService: AuthService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request: Request) => {
          return request?.cookies?.Refresh;
        },
      ]),
      secretOrKey: configService.get('jwt_refresh_secret'),
      passReqToCallback: true,
    });
  }

  async validate(request: RequestWithAuth, payload: { userId: number }) {
    const refreshToken = request.cookies?.Refresh;
    if (this.authService.validateUserToken(payload.userId, refreshToken)) {
      return {
        id: payload.userId,
        refreshToken,
      };
    } else {
      throw new HttpException('Invalid refresh token', HttpStatus.BAD_REQUEST);
    }
  }
}
