export class Customer {
  id: string;

  name: string;

  lastName: string;

  email: string;

  gender?: string;

  page?: number;

  constructor(data?: Partial<Customer>) {
    if (data) {
      Object.assign(this, data);
    }
  }
}

export type PaginatedResult<T> = {
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
  items: T[];
};
