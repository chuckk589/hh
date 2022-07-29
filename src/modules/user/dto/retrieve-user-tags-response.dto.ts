import { EntityDTO } from '@mikro-orm/core';
import { Tag } from 'src/modules/mikroorm/entities/Tag';
import { RetrieveTagResponseDto } from 'src/modules/tag/dto/retrieve-tag-response.dto';

export class RetrieveUserTagsResponseDto {
  constructor(tags: Tag[]) {
    this.tags = tags.map((tag) => new RetrieveTagResponseDto(tag));
  }
  tags: RetrieveTagResponseDto[];
}
