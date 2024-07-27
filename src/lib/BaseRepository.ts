import { Model, Document, FilterQuery, Query } from 'mongoose';
import { NotFoundException } from '@nestjs/common';
import { Filter, PaginationOptions } from '@common/types';
import { string } from 'joi';

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
    protected readonly entityName: string,
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
      if (field === 'name') {
        // @ts-ignore
        query = query.fuzzySearch(value);
      } else {
        const filterFunction = this.filterMap[operator];
        if (!filterFunction) {
          throw new Error(`Unsupported filter operator: ${operator}`);
        }
        const filterObject = filterFunction(field, value);
        query.where(filterObject);
      }
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

  applyPopulate(query: Query<any, any>, fieldsPopulate: string[]) {
    return query.populate(fieldsPopulate);
  }

  async findAll(
    filter: FilterQuery<T> = {},
    paginationOptions?: PaginationOptions,
    fieldsPopulate?: string[],
  ) {
    const { page, limit, filters } = paginationOptions;
    const offset = (page - 1) * limit;

    let query = this.model.find(filter);

    query = this.applyFilters(query, filters);

    const countQuery = this.model.find(query.getFilter());

    if (offset >= 0 && limit >= 1) {
      query = this.applyPagination(query, offset, limit);
    }

    const [data, total_count] = await Promise.all([
      this.applyPopulate(query, fieldsPopulate).exec(),
      countQuery.countDocuments().exec(),
    ]);

    return {
      data,
      page,
      limit,
      total_count,
    };
  }

  async findOne(filter: FilterQuery<T>, fieldsPopulate?: string[]): Promise<T> {
    const document = this.model.findOne(filter);
    return this.applyPopulate(document, fieldsPopulate).exec();
  }

  async findOneOrFail(
    filter: FilterQuery<T>,
    fieldsPopulate?: string[],
  ): Promise<T> {
    const document = this.model.findOne(filter);

    if (!document) {
      throw new NotFoundException(`${this.entityName} not found`);
    }
    return this.applyPopulate(document, fieldsPopulate);
  }

  async findById(id: string, fieldsPopulate?: string[]): Promise<T> {
    const document = this.model.findById(id);
    return this.applyPopulate(document, fieldsPopulate).exec();
  }

  async findByIdOrFail(id: string, fieldsPopulate?: string[]): Promise<T> {
    const document = this.model.findById(id);
    if (!document) {
      throw new NotFoundException(`${this.entityName} with ID ${id} not found`);
    }
    return this.applyPopulate(document, fieldsPopulate);
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
