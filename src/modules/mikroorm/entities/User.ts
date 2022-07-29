import {
  BeforeCreate,
  BeforeUpdate,
  Entity,
  PrimaryKey,
  Property,
  Unique,
  OneToMany,
  Collection,
  ManyToMany,
  EventArgs,
} from '@mikro-orm/core';
import { compare, hash } from 'bcrypt';
import { CustomBaseEntity } from './CustomBaseEntity';
import { Tag } from './Tag';

@Entity()
export class User extends CustomBaseEntity {
  @PrimaryKey()
  id!: number;

  @Unique()
  @Property({ length: 30 })
  nickname!: string;

  @Property({ length: 255, nullable: true })
  refreshToken?: string;

  @Unique()
  @Property({ length: 100, nullable: true })
  email?: string;

  @Property({ length: 255, nullable: true })
  password?: string;

  @OneToMany(() => Tag, (tag) => tag.creator, {
    orphanRemoval: true,
  })
  ownedTags = new Collection<Tag>(this);

  @ManyToMany(() => Tag)
  tags = new Collection<Tag>(this);

  @BeforeCreate()
  async beforeCreate(): Promise<void> {
    if (this.password) {
      this.password = await hash(this.password, 6);
    }
  }
  @BeforeUpdate()
  async beforeUpdate(args: EventArgs<User>): Promise<void> {
    if ('refreshToken' in args.changeSet.payload) {
      this.refreshToken = await hash(args.changeSet.payload.refreshToken, 6);
    }
    if ('password' in args.changeSet.payload) {
      this.password = await hash(args.changeSet.payload.password, 6);
    }
  }
  async comparePassword(password: string): Promise<boolean> {
    if (this.password) {
      return await compare(password, this.password);
    }
    return false;
  }
  async validateRefreshToken(token: string): Promise<boolean> {
    if (this.refreshToken) {
      return await compare(token, this.refreshToken);
    }
    return false;
  }
}
