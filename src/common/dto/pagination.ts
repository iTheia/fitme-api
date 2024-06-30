import {
  IsOptional,
  IsInt,
  IsString,
  IsEnum,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { SortOrder } from '../types';

class SortDto {
  @IsOptional()
  @IsString()
  by?: string;

  @IsOptional()
  @IsString()
  @IsEnum(SortOrder)
  order?: SortOrder;
}

export class PaginationQueryDto {
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  limit?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  page?: number;

  @IsOptional()
  @ValidateNested()
  @Type(() => SortDto)
  sort?: SortDto;
}
