import { Entity, PrimaryKey, Property, ManyToOne } from '@mikro-orm/core';
import { CustomBaseEntity } from './CustomBaseEntity';
import { User } from './User';

@Entity()
export class Tag extends CustomBaseEntity {
  @PrimaryKey()
  id!: number;

  @Property({ length: 40 })
  name!: string;

  @Property({ default: 0 })
  sortOrder!: number;

  @ManyToOne(() => User, { fieldName: 'creator', nullable: true })
  creator!: User;
}
