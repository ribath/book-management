import { Injectable, NotFoundException } from '@nestjs/common';
import { BookRepository } from '../repositories/books.repository';
import { CreateBookDto } from '../dtos/create-book.dto';
import { Book } from '../entities/book.entity';
import { QueryDto } from '../../../common/dtos/query.dto';
import { UpdateBookDto } from '../dtos/update-book.dto';

@Injectable()
export class BookService {
  constructor(private readonly bookRepository: BookRepository) {}

  async findAll(query: QueryDto): Promise<{
    books: Book[];
    pagination: { total: number; page: number; limit: number };
  }> {
    const result = await this.bookRepository.findAll(query);
    return {
      books: result.books,
      pagination: {
        total: result.total,
        page: result.page,
        limit: result.limit,
      },
    };
  }

  async findById(id: string): Promise<Book> {
    const result = await this.bookRepository.findById(id);
    if (!result) {
      throw new NotFoundException({
        statusCode: 404,
        message: 'Book not found',
        error: 'Not Found',
      });
    }
    return result;
  }

  async create(createBookDto: CreateBookDto): Promise<Book> {
    const author = await this.bookRepository.checkIfAuthorExists(
      createBookDto.authorId.toString(),
    );
    if (!author) {
      throw new NotFoundException({
        statusCode: 400,
        message: 'Author not found',
        error: 'Bad Request',
      });
    } else {
      return await this.bookRepository.create(createBookDto, author);
    }
  }

  async updateById(id: string, updateBookDto: UpdateBookDto): Promise<Book> {
    const result = await this.bookRepository.updateById(id, updateBookDto);
    if (!result) {
      throw new NotFoundException({
        statusCode: 404,
        message: 'Book not found',
        error: 'Not Found',
      });
    }
    return result;
  }

  async deleteById(id: string) {
    const result = await this.bookRepository.deleteById(id);
    if (!result.affected) {
      throw new NotFoundException({
        statusCode: 404,
        message: 'Book not found',
        error: 'Not Found',
      });
    }
  }
}
