import { Customer } from '../domain/Customer';

export type PaginatedResult<T> = {
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
  items: T[];
};
export interface CustomersService {
  findByFilter(customer: Customer): Promise<PaginatedResult<Customer>>;
}
