import {
  IsString,
  MaxLength,
  IsOptional,
  IsNumber,
  IsNumberString,
} from 'class-validator';

export class CreateTagDto {
  @IsString()
  @MaxLength(40)
  name!: string;

  @IsNumberString()
  @IsOptional()
  sortOrder?: string;
}
