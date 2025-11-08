import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsOptional,
  IsDateString,
  IsNotEmpty,
  IsPositive,
  IsNumber,
  ValidateBy,
} from 'class-validator';
import ISBN from 'isbn3';

function IsISBN() {
  return ValidateBy({
    name: 'isISBN',
    validator: {
      validate: (value: string) => {
        if (!value) return false;
        return ISBN.parse(value) !== null;
      },
      defaultMessage: () => 'ISBN must be a valid ISBN-10 or ISBN-13',
    },
  });
}

export class CreateBookDto {
  @ApiProperty({
    description: 'Title of the book',
    example: 'The Great Gatsby',
  })
  @IsString()
  @IsNotEmpty({ message: 'Title is required' })
  title: string;

  @ApiProperty({
    description: 'ISBN number of the book',
    example: '978-0-7432-7356-5',
  })
  @IsString()
  @IsNotEmpty({ message: 'ISBN is required' })
  @IsISBN()
  isbn: string;

  @ApiProperty({
    description: 'Publication date of the book',
    example: '1925-04-10',
  })
  @IsOptional()
  @IsDateString()
  publishedDate?: string;

  @ApiProperty({
    description: 'Genre or category of the book',
    example: 'Fiction',
  })
  @IsOptional()
  @IsString()
  genre?: string;

  @ApiProperty({
    description: 'ID of the author',
    example: 1,
  })
  @IsNumber()
  @IsPositive()
  @IsNotEmpty({ message: 'Author ID is required' })
  authorId: number;
}
