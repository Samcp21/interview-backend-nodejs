import { Customer, PaginatedResult } from '../domain/Customer';

export interface CustomersRepository {
  findByFilter(customer: Customer): Promise<PaginatedResult<Customer>>;
}
