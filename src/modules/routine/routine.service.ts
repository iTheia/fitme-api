import { HttpStatus, Injectable } from '@nestjs/common';
import { CreateRoutineDto } from './dto/create-routine.dto';
import { UpdateRoutineDto } from './dto/update-routine.dto';
import { RoutineRepository } from './store/routine.repository';
import { PaginationOptions } from '@common/types';
@Injectable()
export class RoutineService {
  constructor(private readonly routineRepository: RoutineRepository) {}

  async createRoutine(createRoutineDto: CreateRoutineDto) {
    return this.routineRepository.create(createRoutineDto);
  }

  async findAllRoutine(paginationOptions: PaginationOptions) {
    return this.routineRepository.findAll({}, paginationOptions, [
      'exercises',
      'categories',
    ]);
  }

  async findOneRoutine(id: string) {
    return this.routineRepository.findByIdOrFail(id, [
      'exercises',
      'categories',
    ]);
  }

  async updateRoutine(id: string, updateRoutineDto: UpdateRoutineDto) {
    return this.routineRepository.update(id, updateRoutineDto);
  }

  async removeRoutine(id: string) {
    await this.routineRepository.remove(id);
    return HttpStatus.OK;
  }
}
