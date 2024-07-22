import { HttpStatus, Injectable } from '@nestjs/common';
import { CreateRoutineDto } from './dto/create-routine.dto';
import { UpdateRoutineDto } from './dto/update-routine.dto';
import { RoutineRepository } from './store/routine.repository';
import { PaginationService } from '@modules/pagination/pagination.service';
import { FindAllCategoriesDto } from './dto/category.dto';
import { CategoryRepository } from '@modules/category/store/category.repository';
import { PaginationQueryDto } from '@common/dto/pagination';
import { filters } from './pagination/filter';

@Injectable()
export class RoutineService {
  constructor(
    private readonly routineRepository: RoutineRepository,
    private readonly paginationService: PaginationService,
    private readonly categoryRepository: CategoryRepository,
  ) {}

  async createRoutine(createRoutineDto: CreateRoutineDto) {
    return this.routineRepository.create(createRoutineDto);
  }

  async findAllRoutine(query: FindAllCategoriesDto | PaginationQueryDto) {
    const paginationOptions = this.paginationService.getPaginationOptions(
      query,
      filters,
    );

    const { data } = await this.routineRepository.findAll(
      {},
      paginationOptions,
    );
    return data;
  }

  async findOneRoutine(id: string) {
    return this.routineRepository.findByIdOrFail(id);
  }

  async updateRoutine(id: string, updateRoutineDto: UpdateRoutineDto) {
    return this.routineRepository.update(id, updateRoutineDto);
  }

  async removeRoutine(id: string) {
    await this.routineRepository.remove(id);
    return HttpStatus.OK;
  }
}
