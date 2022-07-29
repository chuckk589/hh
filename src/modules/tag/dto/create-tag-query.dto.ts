import { IsOptional, IsNumberString } from 'class-validator';

export class CreateTagQueryDto {
  @IsNumberString()
  userId!: string;
}
