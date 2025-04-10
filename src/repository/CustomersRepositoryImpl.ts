import axios from 'axios';
import { CustomersRepository } from './CustomersRepository';
import { Customer, PaginatedResult } from '../domain/Customer';

type RandomUser = {
  id: {
    value: string;
  };
  name: {
    first: string;

    last: string;
  };
  gender: string;
};

export class CustomersRepositoryImpl implements CustomersRepository {
  async findByFilter(customer: Customer): Promise<PaginatedResult<Customer>> {
    const result = await axios.get('https://randomuser.me/api/?results=100');
    if (!result.data.results) {
      return {
        total: 0,
        page: 1,
        pageSize: 10,
        totalPages: 0,
        items: [],
      };
    }

    const filtered = result.data.results
      .filter(
        (item: RandomUser) =>
          (!customer.name ||
            item.name.first
              .toLowerCase()
              .startsWith(customer.name.toLowerCase())) &&
          (!customer.lastName ||
            item.name.last
              .toLocaleLowerCase()
              .startsWith(customer.lastName.toLowerCase())) &&
          (!customer.gender ||
            item.gender.toLowerCase() === customer.gender.toLocaleLowerCase())
      )
      .map(
        (item: RandomUser) =>
          new Customer({
            id: item.id.value,
            name: item.name.first,
            lastName: item.name.last,
          })
      );

    const page = customer.page || 1;
    const pageSize = 10;
    const total = filtered.length;
    const totalPages = Math.ceil(total / pageSize);
    const startIndex = (page - 1) * pageSize;
    const paginated = filtered.slice(startIndex, startIndex + pageSize);

    return { total, page, pageSize, totalPages, items: paginated };
  }
}
