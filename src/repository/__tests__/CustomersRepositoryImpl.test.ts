import axios from 'axios';
import { Customer } from '../../domain/Customer';
import { CustomersRepositoryImpl } from '../CustomersRepositoryImpl';

// Mock de axios
jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

const mockUser = (first: string, last: string, gender: string, id = 'id1') => ({
  id: { value: id },
  name: { first, last },
  gender,
});

describe('CustomersRepositoryImpl', () => {
  let repository: CustomersRepositoryImpl;

  beforeEach(() => {
    repository = new CustomersRepositoryImpl();
    jest.clearAllMocks();
  });

  it('should filter customers correctly', async () => {
    mockedAxios.get.mockResolvedValue({
      data: {
        results: [
          mockUser('Alice', 'Smith', 'female'),
          mockUser('Bob', 'Johnson', 'male'),
          mockUser('Alice', 'Jones', 'female'),
        ],
      },
    });

    const customerFilter = new Customer({ name: 'Alice', page: 1 });
    const result = await repository.findByFilter(customerFilter);

    expect(result.total).toBe(2);
    expect(result.items).toHaveLength(2);
    expect(result.items[0].name).toBe('Alice');
    expect(result.items[1].name).toBe('Alice');

    expect(mockedAxios.get).toHaveBeenCalledWith(
      'https://randomuser.me/api/?results=100'
    );
  });

  it('should handle no results from API', async () => {
    mockedAxios.get.mockResolvedValue({ data: { results: [] } });

    const customerFilter = new Customer({ name: 'Unknown' });
    const result = await repository.findByFilter(customerFilter);

    expect(result.total).toBe(0);
    expect(result.items).toHaveLength(0);
  });

  it('should paginate results correctly', async () => {
    const results = Array.from({ length: 25 }, (_, i) =>
      mockUser(`User${i}`, 'Last', 'male', `id${i}`)
    );
    mockedAxios.get.mockResolvedValue({ data: { results } });

    const customerFilter = new Customer({ page: 2 });
    const result = await repository.findByFilter(customerFilter);

    expect(result.total).toBe(25);
    expect(result.page).toBe(2);
    expect(result.items).toHaveLength(10);
    expect(result.totalPages).toBe(3);

    expect(result.items[0].name).toBe('User10');
    expect(result.items[9].name).toBe('User19');
  });
});
