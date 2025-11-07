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
  @IsString()
  @IsNotEmpty({ message: 'Title is required' })
  title: string;

  @IsString()
  @IsNotEmpty({ message: 'ISBN is required' })
  @IsISBN()
  isbn: string;

  @IsOptional()
  @IsDateString()
  publishedDate?: string;

  @IsOptional()
  @IsString()
  genre?: string;

  @IsNumber()
  @IsPositive()
  @IsNotEmpty({ message: 'Author ID is required' })
  authorId: number;
}
