import { IsNotEmpty, IsString } from 'class-validator';

export default class RefreshTokenAuthRequestDto {
  @IsString()
  @IsNotEmpty()
  token!: string;
}
