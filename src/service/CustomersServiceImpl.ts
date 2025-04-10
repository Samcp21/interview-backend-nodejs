import { CustomersService, PaginatedResult } from './CustomersService';
import { CustomersRepository } from '../repository/CustomersRepository';
import { Customer } from '../domain/Customer';

export class CustomersServiceImpl implements CustomersService {
  constructor(private repository: CustomersRepository) {}

  async findByFilter(customer: Customer): Promise<PaginatedResult<Customer>> {
    const paginatedResult = await this.repository.findByFilter(customer);
    const updatedItems = paginatedResult.items.map(
      (item) =>
        new Customer({
          ...item,
          email: `${item.name.charAt(0)}${item.lastName}@ihfintech.com.pe`,
        })
    );

    return { ...paginatedResult, items: updatedItems };
  }
}
