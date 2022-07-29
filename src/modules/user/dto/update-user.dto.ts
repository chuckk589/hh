import { Expose } from 'class-transformer';
import {
  IsString,
  MaxLength,
  MinLength,
  Matches,
  IsOptional,
  ValidateIf,
} from 'class-validator';

export class UpdateUserDto {
  @IsString()
  @IsOptional()
  @MaxLength(30)
  @ValidateIf((value) => !value.email || value.nickname)
  nickname?: string;

  @IsString()
  @IsOptional()
  @MaxLength(100)
  @ValidateIf((value) => !value.nickname || value.email)
  email?: string;

  @IsString()
  @IsOptional()
  @MinLength(8)
  @MaxLength(100)
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/, {
    message:
      'password: должен содержать как минимум одну цифру, одну заглавную и одну строчную буквы',
  })
  password?: string;
}
