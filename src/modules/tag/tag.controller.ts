import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  Put,
  Req,
  UseGuards,
  HttpStatus,
} from '@nestjs/common';
import { TagService } from './tag.service';
import { CreateTagDto } from './dto/create-tag.dto';
import { UpdateTagDto } from './dto/update-tag.dto';
import { RetrieveTagsQueryDto } from './dto/retrieve-tags-query.dto';
import { RequestWithAuth } from 'src/types/interfaces';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CreateTagResponseDto } from './dto/create-tag-response.dto';
import {
  RetrieveTagResponseDto,
  RetrieveTagsResponseDto,
} from './dto/retrieve-tag-response.dto';
import { UpdateTagResponseDto } from './dto/update-tag-response.dto';

@UseGuards(JwtAuthGuard)
@Controller('tag')
export class TagController {
  constructor(private readonly tagService: TagService) {}

  @Post()
  async create(
    @Body() createTagDto: CreateTagDto,
    @Req() req: RequestWithAuth,
  ): Promise<CreateTagResponseDto> {
    const tag = await this.tagService.create(createTagDto, +req.user.id);
    return new CreateTagResponseDto(tag);
  }

  @Get()
  findAll(@Query() queryParams: RetrieveTagsQueryDto) {
    return this.tagService.findAll(queryParams);
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<RetrieveTagResponseDto> {
    const tag = await this.tagService.findOne(+id);
    return new RetrieveTagResponseDto(tag);
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateTagDto: UpdateTagDto,
    @Req() req: RequestWithAuth,
  ): Promise<UpdateTagResponseDto> {
    const updatedTag = await this.tagService.update(
      +id,
      updateTagDto,
      +req.user.id,
    );
    return new UpdateTagResponseDto(updatedTag);
  }

  @Delete(':id')
  async remove(@Param('id') id: string, @Req() req: RequestWithAuth) {
    await this.tagService.remove(+id, +req.user.id);
    return HttpStatus.OK;
  }
}
