import { EntityDTO } from '@mikro-orm/core';
import { Tag } from 'src/modules/mikroorm/entities/Tag';

export class RetrieveTagResponseDto {
  constructor(tag: Tag) {
    this.creator = {
      nickname: tag.creator?.nickname,
      id: tag.creator?.id?.toString(),
    };
    this.name = tag.name;
    this.sortOrder = tag.sortOrder.toString();
  }
  creator: {
    nickname: string;
    id: string;
  };
  name: string;
  sortOrder: string;
}

export class RetrieveTagsResponseDto {
  data: RetrieveTagResponseDto[];
  meta: {
    offset: number;
    length: number;
    quantity: number;
  };
}
