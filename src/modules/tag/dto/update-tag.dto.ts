import { PartialType } from '@nestjs/mapped-types';
import {
  IsNumber,
  IsNumberString,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';
import { CreateTagDto } from './create-tag.dto';

export class UpdateTagDto {
  @IsString()
  @IsOptional()
  @MaxLength(40)
  name?: string;

  @IsNumberString()
  @IsOptional()
  sortOrder?: number;
}
