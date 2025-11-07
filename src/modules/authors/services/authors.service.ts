import { Injectable, NotFoundException } from '@nestjs/common';
import { AuthorRepository } from '../repositories/authors.repository';
import { CreateAuthorDto } from '../dtos/create-author.dto';
import { Author } from '../entities/author.entity';
import { UpdateAuthorDto } from '../dtos/update-author.dto';
import { QueryDto } from '../../../common/dtos/query.dto';

@Injectable()
export class AuthorService {
  constructor(private readonly authorRepository: AuthorRepository) {}

  async findAll(query: QueryDto): Promise<{
    authors: Author[];
    pagination: { total: number; page: number; limit: number };
  }> {
    const result = await this.authorRepository.findAll(query);
    return {
      authors: result.authors,
      pagination: {
        total: result.total,
        page: result.page,
        limit: result.limit,
      },
    };
  }

  async findById(id: string): Promise<Author> {
    const result = await this.authorRepository.findById(id);
    if (!result) {
      throw new NotFoundException({
        statusCode: 404,
        message: 'Author not found',
        error: 'Not Found',
      });
    }
    return result;
  }

  async create(createAuthorDto: CreateAuthorDto): Promise<Author> {
    const result = await this.authorRepository.create(createAuthorDto);
    return result;
  }

  async updateById(
    id: string,
    updateAuthorDto: UpdateAuthorDto,
  ): Promise<Author> {
    const result = await this.authorRepository.updateById(id, updateAuthorDto);
    if (!result) {
      throw new NotFoundException({
        statusCode: 404,
        message: 'Author not found',
        error: 'Not Found',
      });
    }
    return result;
  }

  async deleteById(id: string) {
    const result = await this.authorRepository.deleteById(id);
    if (!result.affected) {
      throw new NotFoundException({
        statusCode: 404,
        message: 'Author not found',
        error: 'Not Found',
      });
    }
  }
}
