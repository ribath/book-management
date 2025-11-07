import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, ILike, Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { Book } from '../entities/book.entity';
import { CreateBookDto } from '../dtos/create-book.dto';
import { QueryDto } from '../../../common/dtos/query.dto';
import { Author } from '../../authors/entities/author.entity';
import { UpdateBookDto } from '../dtos/update-book.dto';

@Injectable()
export class BookRepository {
  constructor(
    @InjectRepository(Book)
    private bookRepository: Repository<Book>,
    @InjectRepository(Author)
    private authorRepository: Repository<Author>,
  ) {}

  async findAll(query: QueryDto): Promise<{
    books: Book[];
    total: number;
    page: number;
    limit: number;
  }> {
    const { page = 1, limit = 10, search } = query;
    const skip = (page - 1) * limit;

    const where = search
      ? [{ title: ILike(`%${search}%`) }, { isbn: ILike(`%${search}%`) }]
      : {};

    const [data, total] = await this.bookRepository.findAndCount({
      where,
      take: limit,
      skip,
    });

    return {
      books: data,
      total,
      page,
      limit,
    };
  }

  async findById(id: string): Promise<Book | null> {
    return this.bookRepository.findOne({
      where: { id },
      relations: ['author'],
    });
  }

  async checkIfAuthorExists(id: string): Promise<Author | null> {
    return await this.authorRepository.findOne({
      where: { id },
    });
  }

  async create(createBookDto: CreateBookDto, author: Author): Promise<Book> {
    const book = this.bookRepository.create({
      ...createBookDto,
      author,
    });
    return this.bookRepository.save(book);
  }

  async updateById(
    id: string,
    updateBookDto: UpdateBookDto,
  ): Promise<Book | null> {
    const book = await this.findById(id);
    if (book !== null) {
      Object.assign(book, updateBookDto);
      return this.bookRepository.save(book);
    }
    return null;
  }

  async deleteById(id: string): Promise<DeleteResult> {
    const result = await this.bookRepository.delete(id);
    return result;
  }
}
