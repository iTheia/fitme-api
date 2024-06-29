import { Model, Document, FilterQuery } from 'mongoose';
import { NotFoundException } from '@nestjs/common';

export class BaseRepository<T extends Document> {
  constructor(
    private readonly model: Model<T>,
    protected readonly entityName: string,
    private readonly privateFields: string[] = [],
  ) {}

  async create(createDto: Partial<T>): Promise<T> {
    const createdDocument = new this.model(createDto);
    return createdDocument.save();
  }

  async findAll(): Promise<T[]> {
    return this.model.find().exec();
  }

  async findOne(filter: FilterQuery<T>): Promise<T> {
    return this.model.findOne(filter).exec();
  }

  async findOneOrFail(filter: FilterQuery<T>): Promise<T> {
    const document = await this.model.findOne(filter).exec();

    if (!document) {
      throw new NotFoundException(`${this.entityName} not found`);
    }
    return document;
  }

  async findById(id: string): Promise<T> {
    return this.model.findById(id).exec();
  }

  async findByIdOrFail(id: string): Promise<T> {
    const document = await this.findById(id);
    if (!document) {
      throw new NotFoundException(`${this.entityName} with ID ${id} not found`);
    }
    return document;
  }

  async update(
    id: string,
    updateDto: Partial<T>,
  ): Promise<{ previous: T; updated: T }> {
    const previous = await this.findByIdOrFail(id);

    this.privateFields.forEach((field) => {
      if (updateDto[field]) {
        delete updateDto[field];
      }
    });

    const updated = await this.model
      .findByIdAndUpdate(id, updateDto, { new: true })
      .exec();
    return { previous, updated };
  }

  async remove(id: string): Promise<T> {
    return this.model.findByIdAndDelete(id).exec();
  }

  async softRemove(id: string): Promise<T> {
    return this.model
      .findByIdAndUpdate(id, { isDeleted: true }, { new: true })
      .exec();
  }
}
