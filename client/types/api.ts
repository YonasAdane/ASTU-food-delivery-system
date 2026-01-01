export interface PaginatedApi<T> {
  data: T[];
  meta: {
    total: number;
    page: number;
    limit: number;
    pages: number;
  };
}

export type PaginatedApiResponse<T> = {
  success: boolean;
  message: string;
  data: {
    data: T[]
    meta: {
      total: number;
      page: number;
      limit: number;
      pages: number;
    };
  };
  error?: undefined;
} | {
  error: boolean;
  message: string;
  success?: undefined;
  data?: undefined;
};
