import { Injectable } from '@nestjs/common';
import { PaginationQueryDto } from '@common/dto/pagination';
import { Filter, PaginationOptions, SortOrder } from '@common/types';

@Injectable()
export class PaginationService {
  private readonly DEFAULT_LIMIT = 10;
  private readonly MAXIMUM_LIMIT = 100;
  private readonly DEFAULT_SORT_BY = '_id';
  private readonly DEFAULT_SORT_ORDER = SortOrder.DESC;

  public getPaginationOptions<T extends PaginationQueryDto>(
    query: T,
    filters: Filter[] = [],
  ): PaginationOptions {
    const paginationOptions = {
      limit: Math.min(
        Number(query.limit) || this.DEFAULT_LIMIT,
        this.MAXIMUM_LIMIT,
      ),
      page: Number(query.page) || 1,
      sort: {
        by: query.sort?.by || this.DEFAULT_SORT_BY,
        order: query.sort?.order || this.DEFAULT_SORT_ORDER,
      },
      filters: this.parseFilters(query, filters),
    };

    return paginationOptions;
  }

  private parseFilters(
    query: Record<string, any>,
    filters: Filter[],
  ): Filter[] {
    return filters
      .map((filter) => {
        const value = query[filter.filter];
        if (value !== undefined) {
          return {
            ...filter,
            value,
          };
        }
        return filter;
      })
      .filter((filter) => filter.value !== undefined);
  }
}
