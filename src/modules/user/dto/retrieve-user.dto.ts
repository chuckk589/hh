import { EntityDTO } from '@mikro-orm/core';
import { Tag } from 'src/modules/mikroorm/entities/Tag';
import { User } from 'src/modules/mikroorm/entities/User';

export class RetrieveUserTagDto {
  constructor(tag: EntityDTO<Tag>) {
    this.id = tag.id.toString();
    this.name = tag.name;
    this.sortOrder = tag.sortOrder.toString();
  }
  id: string;
  name: string;
  sortOrder: string;
}
export class RetieveUserDto {
  constructor(user: User) {
    this.nickname = user.nickname;
    this.email = user.email;
    this.tags = user.ownedTags
      .toArray()
      .map((tag) => new RetrieveUserTagDto(tag));
  }
  email: string;
  nickname: string;
  tags: RetrieveUserTagDto[];
}
