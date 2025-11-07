import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BookService } from './services/books.service';
import { BookController } from './controllers/books.controller';
import { Book } from './entities/book.entity';
import { AuthorsModule } from '../authors/authors.module';
import { BookRepository } from './repositories/books.repository';
import { Author } from '../authors/entities/author.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Book, Author]), AuthorsModule],
  controllers: [BookController],
  providers: [BookService, BookRepository],
})
export class BooksModule {}
