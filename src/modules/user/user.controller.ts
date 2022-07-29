import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Put,
  UseGuards,
  Req,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { AddTagDto } from './dto/add-tag.dto';
import { RequestWithAuth } from 'src/types/interfaces';
import { RetieveUserDto } from './dto/retrieve-user.dto';
import { plainToClass } from 'class-transformer';
import { RetrieveUserTagsResponseDto } from './dto/retrieve-user-tags-response.dto';

@UseGuards(JwtAuthGuard)
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }
  @Post('tag')
  async addTags(
    @Req() req: RequestWithAuth,
    @Body() addTagDto: AddTagDto,
  ): Promise<RetrieveUserTagsResponseDto> {
    const userTags = await this.userService.applyTags(addTagDto, +req.user.id);
    return new RetrieveUserTagsResponseDto(userTags);
  }
  @Delete('tag/:id')
  async deleteTag(
    @Param('id') id: string,
    @Req() req: RequestWithAuth,
  ): Promise<RetrieveUserTagsResponseDto> {
    const userTags = await this.userService.deleteTag(+id, +req.user.id);
    return new RetrieveUserTagsResponseDto(userTags);
  }
  @Get('tag/my')
  async getOwnTags(
    @Req() req: RequestWithAuth,
  ): Promise<RetrieveUserTagsResponseDto> {
    const userTags = await this.userService.findOwnedTags(+req.user.id);
    return new RetrieveUserTagsResponseDto(userTags);
  }
  @Get()
  async findAll(): Promise<RetieveUserDto[]> {
    const users = await this.userService.findAll();
    return users.map((user) => new RetieveUserDto(user));
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userService.findOne(+id);
  }

  @Put()
  update(@Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(updateUserDto);
  }

  @Delete()
  async remove(@Req() req: RequestWithAuth) {
    await this.userService.remove(+req.user.id);
    return HttpStatus.OK;
  }
}
