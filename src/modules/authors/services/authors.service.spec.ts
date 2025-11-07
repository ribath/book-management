/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { AuthorService } from './authors.service';
import { AuthorRepository } from '../repositories/authors.repository';
import { CreateAuthorDto } from '../dtos/create-author.dto';
import { UpdateAuthorDto } from '../dtos/update-author.dto';
import { QueryDto } from '../../../common/dtos/query.dto';
import { Author } from '../entities/author.entity';

describe('AuthorService', () => {
  let service: AuthorService;
  let repository: AuthorRepository;

  const mockUpdateTimestamp = jest.fn();

  const mockAuthor: Author = {
    id: '1',
    firstName: 'John',
    lastName: 'Doe',
    bio: 'Famous author',
    birthDate: new Date('1980-01-01'),
    createdAt: Date.now(),
    updatedAt: Date.now(),
    books: [],
    updateTimestamp: jest.fn(),
  };

  const mockAuthor2: Author = {
    id: '2',
    firstName: 'Jane',
    lastName: 'Smith',
    bio: 'Bestselling author',
    birthDate: new Date('1985-05-15'),
    createdAt: Date.now(),
    updatedAt: Date.now(),
    books: [],
    updateTimestamp: jest.fn(),
  };

  const mockAuthors: Author[] = [mockAuthor, mockAuthor2];

  const mockAuthorRepository = {
    findAll: jest.fn(),
    findById: jest.fn(),
    create: jest.fn(),
    updateById: jest.fn(),
    deleteById: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthorService,
        {
          provide: AuthorRepository,
          useValue: mockAuthorRepository,
        },
      ],
    }).compile();

    service = module.get<AuthorService>(AuthorService);
    repository = module.get<AuthorRepository>(AuthorRepository);

    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(repository).toBeDefined();
  });

  describe('findAll', () => {
    it('should return paginated authors with correct structure', async () => {
      const query: QueryDto = { page: 1, limit: 10 };
      const mockRepositoryResult = {
        authors: mockAuthors,
        total: 2,
        page: 1,
        limit: 10,
      };

      mockAuthorRepository.findAll.mockResolvedValue(mockRepositoryResult);

      const result = await service.findAll(query);

      expect(result).toEqual({
        authors: mockAuthors,
        pagination: {
          total: 2,
          page: 1,
          limit: 10,
        },
      });
    });

    it('should return empty array when no authors exist', async () => {
      const query: QueryDto = { page: 1, limit: 10 };
      const mockRepositoryResult = {
        authors: [],
        total: 0,
        page: 1,
        limit: 10,
      };

      mockAuthorRepository.findAll.mockResolvedValue(mockRepositoryResult);

      const result = await service.findAll(query);

      expect(result.authors).toEqual([]);
      expect(result.pagination.total).toBe(0);
      expect(result.pagination.page).toBe(1);
      expect(result.pagination.limit).toBe(10);
    });
  });

  describe('findById', () => {
    it('should return an author by id', async () => {
      mockAuthorRepository.findById.mockResolvedValue(mockAuthor);

      const result = await service.findById('1');

      expect(result).toEqual(mockAuthor);
      expect(result.id).toBe('1');
      expect(result.firstName).toBe('John');
      expect(result.lastName).toBe('Doe');
    });

    it('should throw NotFoundException when author not found', async () => {
      mockAuthorRepository.findById.mockResolvedValue(null);

      await expect(service.findById('999')).rejects.toThrow(NotFoundException);

      try {
        await service.findById('999');
      } catch (error) {
        expect(error).toBeInstanceOf(NotFoundException);
        expect(error.getResponse()).toEqual({
          statusCode: 404,
          message: 'Author not found',
          error: 'Not Found',
        });
      }
    });
  });

  describe('create', () => {
    it('should create a new author', async () => {
      const createAuthorDto: CreateAuthorDto = {
        firstName: 'John',
        lastName: 'Doe',
        bio: 'Famous author',
        birthDate: '1980-01-01',
      };

      mockAuthorRepository.create.mockResolvedValue(mockAuthor);

      const result = await service.create(createAuthorDto);

      expect(result).toEqual(mockAuthor);
      expect(result.firstName).toBe(createAuthorDto.firstName);
      expect(result.lastName).toBe(createAuthorDto.lastName);
      expect(result.bio).toBe(createAuthorDto.bio);
    });
  });

  describe('updateById', () => {
    it('should update an author by id', async () => {
      const updateAuthorDto: UpdateAuthorDto = {
        firstName: 'John Updated',
        bio: 'Updated bio',
      };

      const updatedAuthor: Author = {
        ...mockAuthor,
        firstName: 'John Updated',
        bio: 'Updated bio',
        updatedAt: Date.now(),
        updateTimestamp: mockUpdateTimestamp,
      };

      mockAuthorRepository.updateById.mockResolvedValue(updatedAuthor);

      const result = await service.updateById('1', updateAuthorDto);

      expect(result).toEqual(updatedAuthor);
      expect(result.firstName).toBe('John Updated');
      expect(result.bio).toBe('Updated bio');
      expect(mockAuthorRepository.updateById).toHaveBeenCalledWith(
        '1',
        updateAuthorDto,
      );
    });

    it('should throw NotFoundException when author not found during update', async () => {
      const updateAuthorDto: UpdateAuthorDto = {
        firstName: 'John Updated',
      };

      mockAuthorRepository.updateById.mockResolvedValue(null);

      await expect(service.updateById('999', updateAuthorDto)).rejects.toThrow(
        NotFoundException,
      );

      try {
        await service.updateById('999', updateAuthorDto);
      } catch (error) {
        expect(error).toBeInstanceOf(NotFoundException);
        expect(error.getResponse()).toEqual({
          statusCode: 404,
          message: 'Author not found',
          error: 'Not Found',
        });
      }
    });

    it('should update only provided fields', async () => {
      const updateAuthorDto: UpdateAuthorDto = {
        firstName: 'John Updated',
      };

      const updatedAuthor: Author = {
        ...mockAuthor,
        firstName: 'John Updated',
        updatedAt: Date.now(),
        updateTimestamp: mockUpdateTimestamp,
      };

      mockAuthorRepository.updateById.mockResolvedValue(updatedAuthor);

      const result = await service.updateById('1', updateAuthorDto);

      expect(result.firstName).toBe('John Updated');
      expect(result.lastName).toBe(mockAuthor.lastName); // Unchanged
    });
  });

  describe('deleteById', () => {
    it('should delete an author by id successfully', async () => {
      mockAuthorRepository.deleteById.mockResolvedValue({ affected: 1 });

      await service.deleteById('1');

      expect(mockAuthorRepository.deleteById).toHaveBeenCalledWith('1');
      expect(mockAuthorRepository.deleteById).toHaveBeenCalledTimes(1);
    });

    it('should throw NotFoundException when author not found during deletion', async () => {
      mockAuthorRepository.deleteById.mockResolvedValue({ affected: 0 });

      await expect(service.deleteById('999')).rejects.toThrow(
        NotFoundException,
      );

      try {
        await service.deleteById('999');
      } catch (error) {
        expect(error).toBeInstanceOf(NotFoundException);
        expect(error.getResponse()).toEqual({
          statusCode: 404,
          message: 'Author not found',
          error: 'Not Found',
        });
      }
    });
  });
});
