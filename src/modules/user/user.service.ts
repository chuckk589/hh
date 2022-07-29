import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { EntityManager, wrap } from '@mikro-orm/core';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from '../mikroorm/entities/User';
import { AddTagDto } from './dto/add-tag.dto';
import { Tag } from '../mikroorm/entities/Tag';

@Injectable()
export class UserService {
  constructor(private readonly em: EntityManager) {}
  async create(createUserDto: CreateUserDto): Promise<void> {
    const user = this.em.create(User, createUserDto);
    return await this.em.persistAndFlush(user);
  }
  async findOwnedTags(userid: number) {
    const tags = await this.em.find(Tag, { creator: userid });
    return tags;
  }
  async deleteTag(id: number, userId: number) {
    try {
      const user = await this.em.findOne(
        User,
        { id: userId },
        { populate: ['tags'] },
      );
      user.tags.remove(this.em.getReference(Tag, id));
      await this.em.persistAndFlush(user);
      return user.tags.loadItems();
    } catch (error) {
      throw new HttpException('Tag not found', HttpStatus.NOT_FOUND);
    }
  }
  async applyTags(addTagDto: AddTagDto, userId: number) {
    try {
      const user = await this.em.findOne(
        User,
        { id: userId },
        { populate: ['tags'] },
      );
      addTagDto.tags.forEach((tagId) => {
        user.tags.add(this.em.getReference(Tag, tagId));
      });
      await this.em.persistAndFlush(user);
      return user.tags.loadItems();
    } catch (error) {
      console.log(error);
      throw new HttpException('Tag not found', HttpStatus.NOT_FOUND);
    }
  }
  async findAll() {
    return await this.em.find(User, {}, { populate: ['ownedTags'] });
  }

  async findOne(id: number) {
    const user = await this.em.findOne(
      User,
      { id: id },
      { populate: ['ownedTags'] },
    );
    return user;
  }

  async update(updateUserDto: UpdateUserDto) {
    try {
      const user = await this.em.findOne(User, {
        $or: [
          { nickname: updateUserDto.nickname },
          { email: updateUserDto.email },
        ],
      });
      if (!user) {
        throw new HttpException('User not found', HttpStatus.NOT_FOUND);
      }
      wrap(user).assign(updateUserDto);
      await this.em.persistAndFlush(user);
      return { email: user.email, nickname: user.nickname };
    } catch (error) {
      throw new HttpException('Duplicate fields', HttpStatus.BAD_REQUEST);
    }
  }

  async remove(id: number): Promise<number> {
    return await this.em.nativeDelete(User, { id });
  }
}
