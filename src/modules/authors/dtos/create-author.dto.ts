import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsOptional,
  IsDateString,
  IsNotEmpty,
} from 'class-validator';

export class CreateAuthorDto {
  @ApiProperty({
    description: 'First name of the author',
    example: 'John',
  })
  @IsString()
  @IsNotEmpty({ message: 'First name is required' })
  firstName: string;

  @ApiProperty({
    description: 'Last name of the author',
    example: 'Doe',
  })
  @IsString()
  @IsNotEmpty({ message: 'Last name is required' })
  lastName: string;

  @ApiProperty({
    description: 'Biography of the author',
    example: 'Award-winning author of multiple bestsellers',
  })
  @IsOptional()
  @IsString()
  bio?: string;

  @ApiProperty({
    description: 'Birth date of the author',
    example: '2025-11-07',
  })
  @IsOptional()
  @IsDateString()
  birthDate?: string;
}
