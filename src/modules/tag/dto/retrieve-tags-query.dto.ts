import { IsOptional, IsNumberString, IsString, IsIn } from 'class-validator';

export class RetrieveTagsQueryDto {
  @IsOptional()
  @IsNumberString()
  offset?: string;

  @IsOptional()
  sortByOrder?: any;

  @IsOptional()
  sortByName?: any;

  @IsOptional()
  @IsNumberString()
  length?: string;
}
