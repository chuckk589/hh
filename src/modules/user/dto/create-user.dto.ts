import { IsString, MaxLength, MinLength, Matches } from 'class-validator';

export class CreateUserDto {
  @IsString()
  @MaxLength(30)
  nickname!: string;

  @IsString()
  @MaxLength(100)
  email!: string;

  @IsString()
  @MinLength(8)
  @MaxLength(100)
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/, {
    message:
      'password: должен содержать как минимум одну цифру, одну заглавную и одну строчную буквы',
  })
  password!: string;
}
