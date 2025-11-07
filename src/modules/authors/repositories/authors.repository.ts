import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, ILike, Repository } from 'typeorm';
import { Author } from '../entities/author.entity';
import { CreateAuthorDto } from '../dtos/create-author.dto';
import { UpdateAuthorDto } from '../dtos/update-author.dto';
import { QueryDto } from '../../../common/dtos/query.dto';

@Injectable()
export class AuthorRepository {
  constructor(
    @InjectRepository(Author)
    private authorRepository: Repository<Author>,
  ) {}

  async findAll(query: QueryDto): Promise<{
    authors: Author[];
    total: number;
    page: number;
    limit: number;
  }> {
    const { page = 1, limit = 10, search } = query;
    const skip = (page - 1) * limit;

    const where = search
      ? [
          { firstName: ILike(`%${search}%`) },
          { lastName: ILike(`%${search}%`) },
        ]
      : {};

    const [data, total] = await this.authorRepository.findAndCount({
      where,
      take: limit,
      skip,
    });

    return {
      authors: data,
      total,
      page,
      limit,
    };
  }

  async findById(id: string): Promise<Author | null> {
    return this.authorRepository.findOne({
      where: { id },
      relations: ['books'],
    });
  }

  async create(createAuthorDto: CreateAuthorDto): Promise<Author> {
    return this.authorRepository.save(createAuthorDto);
  }

  async updateById(
    id: string,
    updateAuthorDto: UpdateAuthorDto,
  ): Promise<Author | null> {
    const author = await this.findById(id);
    if (author !== null) {
      Object.assign(author, updateAuthorDto);
      return this.authorRepository.save(author);
    }
    return null;
  }

  async deleteById(id: string): Promise<DeleteResult> {
    const result = await this.authorRepository.delete(id);
    return result;
  }
}
