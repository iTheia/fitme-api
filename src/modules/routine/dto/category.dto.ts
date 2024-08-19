import { PaginationQueryDto } from '@common/dto/pagination';

export class FindAllRoutineDto extends PaginationQueryDto {
  readonly categories?: string;
  readonly name?: string;
}
