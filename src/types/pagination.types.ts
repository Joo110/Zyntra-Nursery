
export interface PagedResult<T> {
  items: T[];
  totalCount: number;
  pageNumber: number;
  pageSize: number;
  totalPages: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
}

export interface PaginationParams {
  pageNumber: number;
  take: number;
}

export const DEFAULT_PAGINATION: PaginationParams = {
  pageNumber: 1,
  take: 10,
};

export interface MessageResponse {
  message: string;
}
