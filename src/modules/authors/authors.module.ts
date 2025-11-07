import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthorService } from './services/authors.service';
import { AuthorController } from './controllers/authors.controller';
import { Author } from './entities/author.entity';
import { AuthorRepository } from './repositories/authors.repository';

@Module({
  imports: [TypeOrmModule.forFeature([Author])],
  controllers: [AuthorController],
  providers: [AuthorService, AuthorRepository],
})
export class AuthorsModule {}
