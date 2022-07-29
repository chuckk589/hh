import {
  IsString,
  MaxLength,
  IsOptional,
  IsNumber,
  IsNumberString,
} from 'class-validator';
import { Tag } from 'src/modules/mikroorm/entities/Tag';

export class CreateTagResponseDto {
  constructor(tag: Tag) {
    this.id = tag.id.toString();
    this.name = tag.name;
    this.sortOrder = tag.sortOrder.toString();
  }
  id: string;

  name!: string;

  sortOrder: string;
}
