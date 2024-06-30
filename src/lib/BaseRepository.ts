import { Model, Document, FilterQuery, Query } from 'mongoose';
import { NotFoundException } from '@nestjs/common';
import { Filter, PaginationOptions } from '@common/types';
type filterMap = {
  [operator: string]: (field: string, value: any) => any;
};
export class BaseRepository<T extends Document> {
  filterMap: filterMap = {
    '=': (field, value) => ({ [field]: value }),
    in: (field, value) => ({ [field]: { $in: value } }),
    gte: (field, value) => ({ [field]: { $gte: value } }),
    lt: (field, value) => ({ [field]: { $lt: value } }),
    gt: (field, value) => ({ [field]: { $gt: value } }),
    lte: (field, value) => ({ [field]: { $lte: value } }),
  };

  constructor(
    private readonly model: Model<T>,
    private readonly entityName: string,
    private readonly privateFields: string[] = [],
  ) {}

  async create(createDto: Partial<T>): Promise<T> {
    const createdDocument = new this.model(createDto);
    return createdDocument.save();
  }

  private applyFilters(query: Query<any, any>, filters: Filter[]) {
    if (!filters) return query;
    filters.forEach((filter) => {
      const { operator, value, field } = filter;

      const filterFunction = this.filterMap[operator];
      if (!filterFunction) {
        throw new Error(`Unsupported filter operator: ${operator}`);
      }

      const filterObject = filterFunction(field, value);
      query.where(filterObject);
    });
    return query;
  }

  private applyPagination(
    query: Query<any, any>,
    offset: number,
    limit: number,
  ) {
    return query.skip(offset).limit(limit);
  }

  async findAll(
    filter: FilterQuery<T> = {},
    paginationOptions?: PaginationOptions,
  ) {
    const { page, limit, filters } = paginationOptions;
    const offset = (page - 1) * limit;

    let query = this.model.find(filter);
    query = this.applyFilters(query, filters);

    if (offset >= 0 && limit >= 1) {
      query = this.applyPagination(query, offset, limit);
    }

    let countQuery = this.model.countDocuments(filter);
    countQuery = this.applyFilters(countQuery, filters);

    const [data, total_count] = await Promise.all([query.exec(), countQuery]);

    return {
      data,
      page,
      limit,
      total_count,
    };
  }

  async findOne(filter: FilterQuery<T>): Promise<T> {
    return this.model.findOne(filter).exec();
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
