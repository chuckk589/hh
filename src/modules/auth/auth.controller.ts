import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { DateTime } from 'luxon';
import { AuthData, RequestWithAuth } from 'src/types/interfaces';
import { AuthService } from './auth.service';
import RegisterAuthRequestDto from './dto/register-auth-request.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import JwtRefreshGuard from './guards/jwt-refresh.guard';
import { LocalAuthGuard } from './guards/local-auth.guard';

@Controller('')
export class AuthController {
  constructor(private authService: AuthService) {}
  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Req() req: RequestWithAuth): Promise<AuthData> {
    const user = req.user;

    const accessToken = await this.authService.createAccessToken(user.id);
    const refreshToken = await this.authService.createRefreshToken(user.id);
    await this.authService.updateUserRefreshToken(user.id, refreshToken.token);

    return { accessToken, refreshToken };
  }
  @Post('signup')
  async signup(@Body() data: RegisterAuthRequestDto): Promise<AuthData> {
    const existingUser = await this.authService.getExistingUser(data);
    if (existingUser) {
      throw new HttpException(
        'User with this nickname or email already exists',
        HttpStatus.BAD_REQUEST,
      );
    }
    const user = await this.authService.createUser(data);
    const accessToken = await this.authService.createAccessToken(user.id);
    const refreshToken = await this.authService.createRefreshToken(user.id);
    await this.authService.updateUserRefreshToken(user.id, refreshToken.token);
    return { accessToken, refreshToken };
  }
  @UseGuards(JwtAuthGuard)
  @Post('logout')
  async logout(@Req() req: RequestWithAuth) {
    await this.authService.deleteUser(req.user?.id);
    return HttpStatus.OK;
  }
  @UseGuards(JwtRefreshGuard)
  @Post('refresh')
  async refresh(@Req() req: RequestWithAuth): Promise<AuthData> {
    const user = req.user;
    const accessToken = await this.authService.createAccessToken(user.id);
    const refreshToken = await this.authService.createRefreshToken(user.id);
    await this.authService.updateUserRefreshToken(user.id, refreshToken.token);
    return { accessToken, refreshToken };
  }
}
