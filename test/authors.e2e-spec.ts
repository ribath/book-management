/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { Test, TestingModule } from '@nestjs/testing';
import {
  BadRequestException,
  INestApplication,
  ValidationPipe,
} from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../src/app.module';
import { DataSource } from 'typeorm';
import { AllExceptionsFilter } from '../src/common/filters/all-exceptions.filter';
import { ResponseInterceptor } from '../src/common/interceptors/response.interceptor';

describe('Authors (e2e)', () => {
  let app: INestApplication;
  let dataSource: DataSource;
  let createdAuthorId: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();

    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
        transformOptions: {
          enableImplicitConversion: true,
        },
        exceptionFactory: (errors) => {
          return new BadRequestException({
            statusCode: 400,
            message: 'Bad Request',
            error: Object.values(errors[0].constraints ?? {})[0],
          });
        },
      }),
    );

    app.useGlobalFilters(new AllExceptionsFilter());
    app.useGlobalInterceptors(new ResponseInterceptor());

    await app.init();

    dataSource = moduleFixture.get<DataSource>(DataSource);
    await dataSource.synchronize();
  });

  afterAll(async () => {
    if (dataSource) {
      await dataSource.dropDatabase();
    }
    await app.close();
  });

  describe('POST /authors', () => {
    it('should create a new author', async () => {
      const createAuthorDto = {
        firstName: 'John',
        lastName: 'Doe',
        bio: 'Famous author',
        birthDate: '1980-01-01',
      };

      const response = await request(app.getHttpServer())
        .post('/authors')
        .send(createAuthorDto)
        .expect(201);

      expect(response.body.data).toHaveProperty('id');
      expect(response.body.data.firstName).toBe('John');
      expect(response.body.data.lastName).toBe('Doe');
      expect(response.body.data.bio).toBe('Famous author');
      expect(response.body.data).toHaveProperty('createdAt');

      createdAuthorId = response.body.data.id;
    });

    it('should create author without optional fields', async () => {
      const createAuthorDto = {
        firstName: 'Jane',
        lastName: 'Smith',
      };

      const response = await request(app.getHttpServer())
        .post('/authors')
        .send(createAuthorDto)
        .expect(201);

      expect(response.body.data.firstName).toBe('Jane');
      expect(response.body.data.lastName).toBe('Smith');
      expect(response.body.data.bio).toBeNull();
      expect(response.body.data.birthDate).toBeNull();
    });

    it('should return 400 when firstName is missing', async () => {
      const createAuthorDto = {
        lastName: 'Doe',
        bio: 'Test bio',
      };

      const response = await request(app.getHttpServer())
        .post('/authors')
        .send(createAuthorDto)
        .expect(400);

      expect(response.body.statusCode).toBe(400);
      expect(response.body.message).toBe('Bad Request');
      expect(response.body.error).toBe('First name is required');
    });

    it('should return 400 when birthDate is not a date', async () => {
      const createAuthorDto = {
        firstName: 'John',
        lastName: 'Doe',
        bio: 'Test bio',
        birthDate: '1903-06-25a',
      };

      const response = await request(app.getHttpServer())
        .post('/authors')
        .send(createAuthorDto)
        .expect(400);

      expect(response.body.statusCode).toBe(400);
      expect(response.body.message).toBe('Bad Request');
      expect(response.body.error).toBe(
        'birthDate must be a valid ISO 8601 date string',
      );
    });
  });

  describe('GET /authors', () => {
    it('should return paginated list of authors', async () => {
      const response = await request(app.getHttpServer())
        .get('/authors')
        // .query()
        .expect(200);

      expect(response.body.data).toHaveProperty('authors');
      expect(response.body.data).toHaveProperty('pagination');
      expect(Array.isArray(response.body.data.authors)).toBe(true);
      expect(response.body.data.pagination).toHaveProperty('total');
      expect(response.body.data.pagination).toHaveProperty('page');
      expect(response.body.data.pagination).toHaveProperty('limit');
      expect(response.body.data.pagination.page).toBe(1);
      expect(response.body.data.pagination.limit).toBe(10);
    });

    it('should return authors with default pagination', async () => {
      const response = await request(app.getHttpServer())
        .get('/authors')
        .expect(200);

      expect(response.body.data).toHaveProperty('authors');
      expect(response.body.data).toHaveProperty('pagination');
    });

    it('should handle different page sizes', async () => {
      const response = await request(app.getHttpServer())
        .get('/authors')
        .query({ search: 'Jane' })
        .expect(200);

      expect(response.body.data.authors.length).toBeLessThanOrEqual(1);
    });
  });

  describe('GET /authors/:id', () => {
    it('should return a single author by id', async () => {
      const response = await request(app.getHttpServer())
        .get(`/authors/${createdAuthorId}`)
        .expect(200);

      expect(response.body.data).toHaveProperty('id');
      expect(response.body.data.id).toBe(createdAuthorId);
      expect(response.body.data).toHaveProperty('firstName');
      expect(response.body.data).toHaveProperty('lastName');
      expect(response.body.data).toHaveProperty('bio');
      expect(response.body.data).toHaveProperty('createdAt');
    });

    it('should return 404 when author not found', async () => {
      const response = await request(app.getHttpServer())
        .get('/authors/999999')
        .expect(404);

      expect(response.body.statusCode).toBe(404);
      expect(response.body.message).toBe('Author not found');
      expect(response.body.error).toBe('Not Found');
    });

    it('should return 400 when id is not a valid number', async () => {
      const response = await request(app.getHttpServer())
        .get('/authors/invalid-id')
        .expect(400);

      expect(response.body.statusCode).toBe(400);
      expect(response.body.error).toBe('Bad Request');
    });
  });

  describe('PATCH /authors/:id', () => {
    it('should update an author', async () => {
      const updateAuthorDto = {
        firstName: 'John Updated',
        bio: 'Updated bio',
      };

      const response = await request(app.getHttpServer())
        .patch(`/authors/${createdAuthorId}`)
        .send(updateAuthorDto)
        .expect(200);

      expect(response.body.data.id).toBe(createdAuthorId);
      expect(response.body.data.firstName).toBe('John Updated');
      expect(response.body.data.bio).toBe('Updated bio');
      expect(response.body.data.lastName).toBe('Doe');
    });

    it('should update only firstName', async () => {
      const updateAuthorDto = {
        firstName: 'John Final',
      };

      const response = await request(app.getHttpServer())
        .patch(`/authors/${createdAuthorId}`)
        .send(updateAuthorDto)
        .expect(200);

      expect(response.body.data.firstName).toBe('John Final');
    });

    it('should return 404 when updating non-existent author', async () => {
      const updateAuthorDto = {
        firstName: 'Test',
      };

      const response = await request(app.getHttpServer())
        .patch('/authors/999999')
        .send(updateAuthorDto)
        .expect(404);

      expect(response.body.statusCode).toBe(404);
      expect(response.body.message).toBe('Author not found');
    });

    it('should return 400 when id is invalid', async () => {
      const response = await request(app.getHttpServer())
        .patch('/authors/invalid-id')
        .send({ firstName: 'Test' })
        .expect(400);

      expect(response.body.statusCode).toBe(400);
      expect(response.body.error).toBe('Bad Request');
    });
  });

  describe('DELETE /authors/:id', () => {
    it('should return 404 when deleting non-existent author', async () => {
      const response = await request(app.getHttpServer())
        .delete('/authors/999999')
        .expect(404);

      expect(response.body.statusCode).toBe(404);
      expect(response.body.message).toBe('Author not found');
    });

    it('should return 400 when id is invalid', async () => {
      await request(app.getHttpServer())
        .delete('/authors/invalid-id')
        .expect(400);
    });

    it('should delete an author', async () => {
      await request(app.getHttpServer())
        .delete(`/authors/${createdAuthorId}`)
        .expect(204);

      await request(app.getHttpServer())
        .get(`/authors/${createdAuthorId}`)
        .expect(404);
    });
  });
});
