import { EntityDTO, EntityManager, Loaded, wrap } from '@mikro-orm/core';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Tag } from '../mikroorm/entities/Tag';
import { CreateTagDto } from './dto/create-tag.dto';
import { UpdateTagDto } from './dto/update-tag.dto';
import { User } from '../mikroorm/entities/User';
import { RetrieveTagsQueryDto } from './dto/retrieve-tags-query.dto';
import {
  RetrieveTagResponseDto,
  RetrieveTagsResponseDto,
} from './dto/retrieve-tag-response.dto';

@Injectable()
export class TagService {
  constructor(private readonly em: EntityManager) {}
  async create(createTagDto: CreateTagDto, creatorId: number): Promise<Tag> {
    const tag = this.em.create(Tag, {
      name: createTagDto.name,
      sortOrder: Number(createTagDto.sortOrder) || 0,
      creator: this.em.getReference(User, creatorId),
    });
    await this.em.persistAndFlush(tag);
    return tag;
  }

  async findAll(
    queryParams: RetrieveTagsQueryDto,
  ): Promise<RetrieveTagsResponseDto> {
    const offset = Number(queryParams.offset) || 0;
    const limit = Number(queryParams.length) || 10;
    const tags = await this.em.findAndCount(
      Tag,
      {},
      {
        offset: offset,
        limit: limit,
        populate: ['creator'],
      },
    );
    return {
      data: tags[0].map((tag) => new RetrieveTagResponseDto(tag)),
      meta: {
        offset: offset,
        length: limit,
        quantity: tags[1],
      },
    };
  }

  async findOne(id: number): Promise<Tag> {
    const tag = await this.em.findOne(Tag, { id }, { populate: ['creator'] });
    return tag;
  }

  async update(
    id: number,
    updateTagDto: UpdateTagDto,
    userId: number,
  ): Promise<Tag> {
    const existingTag = await this.em.findOne(
      Tag,
      { id },
      { populate: ['creator'] },
    );
    if (!existingTag) {
      throw new HttpException('Tag not found', HttpStatus.NOT_FOUND);
    }
    if (existingTag.creator?.id !== userId) {
      throw new HttpException(
        'You are not allowed to update this tag',
        HttpStatus.FORBIDDEN,
      );
    }
    wrap(existingTag).assign(updateTagDto);
    await this.em.persistAndFlush(existingTag);
    return existingTag;
  }

  async remove(id: number, userId: number) {
    const existingTag = await this.em.findOne(
      Tag,
      { id },
      { populate: ['creator'] },
    );
    if (!existingTag) {
      throw new HttpException('Tag not found', HttpStatus.NOT_FOUND);
    }
    if (existingTag.creator?.id !== userId) {
      throw new HttpException(
        'You are not allowed to delete this tag',
        HttpStatus.FORBIDDEN,
      );
    }
    await this.em.nativeDelete(Tag, { id });
  }
}
