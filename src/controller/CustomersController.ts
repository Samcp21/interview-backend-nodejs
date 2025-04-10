import { APIGatewayProxyEvent } from 'aws-lambda';
import { CustomersService, PaginatedResult } from '../service/CustomersService';
import { Customer } from '../domain/Customer';

export class CustomersController {
  constructor(private service: CustomersService) {}

  async findByFilter(event: APIGatewayProxyEvent) {
    if (!event.queryStringParameters?.name) {
      return this.apiResponseBadRequestError();
    }
    const { name, lastName, gender, page } = event.queryStringParameters;

    const customer = new Customer({
      name,
      lastName,
      gender,
      page: page ? Number(page) : 1,
    });

    return this.apiResponseOk(await this.service.findByFilter(customer));
  }

  apiResponseBadRequestError() {
    return {
      statusCode: 400,
      isBase64Encoded: false,
    };
  }

  apiResponseOk(customers: Customer[] | PaginatedResult<Customer>) {
    return {
      statusCode: 200,
      isBase64Encoded: false,
      body: JSON.stringify(customers),
    };
  }
}
