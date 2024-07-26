import { Category } from '@modules/category/store/category.entity';
import { PaginationQueryDto } from '@common/dto/pagination';

export class FindAllRoutineDto extends PaginationQueryDto {
  readonly categories?: Category[];
  readonly name?: string;
}
