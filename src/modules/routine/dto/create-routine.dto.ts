import { Category } from '@modules/category/store/category.entity';
import { Exercise } from '@modules/exercise/store/exercise.entity';

export class CreateRoutineDto {
  readonly exercises: Exercise[];
  readonly categories: Category[];
  readonly exercise_example: [{ url: string; name: string }];
}
