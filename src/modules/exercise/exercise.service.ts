import { HttpStatus, Injectable } from '@nestjs/common';
import { ImagesService } from '@modules/images/images.service';
import { CreateExerciseDto } from './dto/create-exercise.dto';
import { ExerciseRepository } from './store/exercise.repository';
import { UpdateExerciseDto } from './dto/update-exercise.dto';
import { PaginationService } from '@modules/pagination/pagination.service';
import { PaginationQueryDto } from '@common/dto/pagination';

@Injectable()
export class ExerciseService {
  constructor(
    private readonly imageService: ImagesService,
    private readonly exerciseRepository: ExerciseRepository,
    private readonly paginationService: PaginationService,
  ) {}

  async updateExercise(id: string, updateExerciseDto: UpdateExerciseDto) {
    return this.exerciseRepository.update(id, updateExerciseDto);
  }

  async findExercise(id: string) {
    return this.exerciseRepository.findByIdOrFail(id);
  }

  async createExercise(createExerciseDto: CreateExerciseDto) {
    return this.exerciseRepository.create(createExerciseDto);
  }

  async createImages(file: Array<Express.Multer.File>) {
    return this.imageService.create(file);
  }

  async findAllExercise(query: PaginationQueryDto) {
    const paginationOptions =
      this.paginationService.getPaginationOptions(query);

    const { data } = await this.exerciseRepository.findAll(
      {},
      paginationOptions,
    );
    return data;
  }

  async removeExercise(id: string) {
    this.exerciseRepository.remove(id);
    return HttpStatus.OK;
  }
}
