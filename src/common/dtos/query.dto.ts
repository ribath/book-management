import {
  IsInt,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
} from 'class-validator';

export class QueryDto {
  @IsOptional()
  @IsNumber()
  @IsInt()
  @IsPositive()
  page?: number = 1;

  @IsOptional()
  @IsNumber()
  @IsInt()
  @IsPositive()
  limit?: number = 10;

  @IsOptional()
  @IsString()
  search?: string;
}
