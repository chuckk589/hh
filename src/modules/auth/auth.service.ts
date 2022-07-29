import { EntityManager, wrap } from '@mikro-orm/core';
import {
  HttpCode,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/modules/mikroorm/entities/User';
import { DateTime } from 'luxon';
import { hash, compare } from 'bcrypt';
import registerAuthRequestDto from './dto/register-auth-request.dto';
import { AuthToken } from 'src/types/interfaces';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly em: EntityManager,
    private readonly configService: ConfigService,
  ) {}
  async deleteUser(userId: number) {
    if (!userId) {
      throw new HttpException('User id is required', HttpStatus.BAD_REQUEST);
    }
    return await this.em.nativeUpdate(
      User,
      { id: userId },
      { refreshToken: '' },
    );
  }
  async getExistingUser(data: registerAuthRequestDto): Promise<User> {
    const user = await this.em.findOne(User, {
      $or: [{ nickname: data.nickname }, { email: data.email }],
    });
    return user;
  }
  async createUser(data: registerAuthRequestDto): Promise<User> {
    const user = this.em.create(User, data);
    await this.em.persistAndFlush(user);
    return wrap(user).init();
  }
  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.em.findOne(User, { email });
    if (user && (await user.comparePassword(password))) {
      return user;
    }
    return null;
  }
  async validateUserToken(userId: number, token: string): Promise<boolean> {
    const user = await this.em.findOne(User, { id: userId });
    if (user.validateRefreshToken(token)) {
      return true;
    }
    return false;
  }

  async createAccessToken(userId: number): Promise<AuthToken> {
    const secret = this.configService.get<string>('jwt_secret', {
      infer: true,
    });
    const life = this.configService.get<number>('jwt_life', {
      infer: true,
    });

    const tokenData = await this.createToken(secret, life, userId);
    const cookie = `Authentication=${tokenData.token}; HttpOnly; Path=/; Max-Age=${life}`;

    return {
      ...tokenData,
      cookie,
    };
  }

  async createRefreshToken(userId: number): Promise<AuthToken> {
    const secret = this.configService.get<string>('jwt_refresh_secret', {
      infer: true,
    });
    const life = this.configService.get<number>('jwt_refresh_life', {
      infer: true,
    });

    const tokenData = await this.createToken(secret, life, userId);
    const cookie = `Refresh=${tokenData.token}; HttpOnly; Path=/v1/auth; Max-Age=${life}`;

    return {
      ...tokenData,
      cookie,
    };
  }
  async updateUserRefreshToken(userId: number, token: string): Promise<void> {
    const user = await this.em.findOne(User, { id: userId });
    user.refreshToken = token;
    await this.em.persistAndFlush(user);
  }
  private async createToken(
    secret: string,
    expiresIn: number,
    userId: number,
  ): Promise<AuthToken> {
    const expiresAt = DateTime.now()
      .toUTC()
      .plus({
        seconds: expiresIn,
      })
      .toJSDate();

    const token = await this.jwtService.signAsync(
      { userId },
      {
        secret,
        expiresIn: `${expiresIn}s`,
      },
    );

    return {
      token,
      expiresIn,
      expiresAt,
    };
  }
}
