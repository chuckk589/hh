import { PartialType } from '@nestjs/mapped-types';
import { CreateTagQueryDto } from './create-tag-query.dto';

export class UpdateTagQueryDto extends PartialType(CreateTagQueryDto) {}
