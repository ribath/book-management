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
import { BookService } from '../services/books.service';
import { CreateBookDto } from '../dtos/create-book.dto';
import { Book } from '../entities/book.entity';
import { QueryDto } from '../../../common/dtos/query.dto';
import { UpdateBookDto } from '../dtos/update-book.dto';

@Controller('books')
export class BookController {
  constructor(private readonly bookService: BookService) {}

  @Get()
  findAll(@Query() query: QueryDto): Promise<{
    books: Book[];
    pagination: { total: number; page: number; limit: number };
  }> {
    return this.bookService.findAll(query);
  }

  @Get(':id')
  findById(@Param('id', ParseIntPipe) id: string): Promise<Book> {
    return this.bookService.findById(id);
  }

  @Post()
  create(@Body() createBookDto: CreateBookDto): Promise<Book> {
    return this.bookService.create(createBookDto);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: string,
    @Body() updateBookDto: UpdateBookDto,
  ): Promise<Book> {
    return this.bookService.updateById(id, updateBookDto);
  }

  @Delete(':id')
  @HttpCode(204)
  delete(@Param('id', ParseIntPipe) id: string): Promise<void> {
    return this.bookService.deleteById(id);
  }
}
