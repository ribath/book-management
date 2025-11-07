import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { AuthorService } from '../services/authors.service';
import { CreateAuthorDto } from '../dtos/create-author.dto';
import { Author } from '../entities/author.entity';
import { UpdateAuthorDto } from '../dtos/update-author.dto';
import { QueryDto } from '../../../common/dtos/query.dto';

@Controller('authors')
export class AuthorController {
  constructor(private readonly authorService: AuthorService) {}

  @Get()
  findAll(@Query() query: QueryDto): Promise<{
    authors: Author[];
    pagination: { total: number; page: number; limit: number };
  }> {
    return this.authorService.findAll(query);
  }

  @Get(':id')
  findById(@Param('id', ParseIntPipe) id: string): Promise<Author> {
    return this.authorService.findById(id);
  }

  @Post()
  create(@Body() createAuthorDto: CreateAuthorDto): Promise<Author> {
    return this.authorService.create(createAuthorDto);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: string,
    @Body() updateAuthorDto: UpdateAuthorDto,
  ): Promise<Author> {
    return this.authorService.updateById(id, updateAuthorDto);
  }

  @Delete(':id')
  @HttpCode(204)
  delete(@Param('id', ParseIntPipe) id: string): Promise<void> {
    return this.authorService.deleteById(id);
  }
}
