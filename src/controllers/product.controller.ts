import {service} from '@loopback/core';
import {
  del,
  get,
  param,
  patch,
  post,
  requestBody
} from '@loopback/rest';
import {ProductService} from '../services';

export class ProductController {
  constructor(
    @service(ProductService)
    public productService: ProductService,
  ) { }

  // @authenticate('jwt')
  @post('/products', {
    summary: 'Create product API Endpoint',
    responses: {
      '200': {},
      '400': {description: 'Cannot find category'},
    },
  })
  async create(
    @requestBody({
      description: 'Create product API Endpoint',
      content: {
        'application/json': {
          schema: {
            required: ['categoryId', 'name', 'description'],
            properties: {
              categoryId: {
                type: 'string',
              },
              name: {
                type: 'string',
              },
              description: {
                type: 'string',
              },
            }
          }
        },
      },
    })
    payload: {
      categoryId: 'string',
      name: 'string',
      description: 'string',
    }) {
    const result = await this.productService.create(
      payload.categoryId,
      payload.name,
      payload.description,
    );
    if (result.statusCode === 400) {
      throw {
        statusCode: 400,
        message: 'Cannot find category ',
      };
    }
    return result;
  }

  // @authenticate('jwt')
  @get('/products/count', {
    summary: 'Count products API Endpoint',
    responses: {
      '200': {},
      '404': {description: 'Data not found'},
    },
  })
  async count() {
    const data = await this.productService.countProduct();

    if (data === 0) {
      return {
        statusCode: 404,
        message: 'Data not found'
      }
    }

    return {
      statusCode: 200,
      message: 'success',
      data
    }
  }

  // @authenticate('jwt')
  @get('/products', {
    summary: 'List of products API Endpoint',
    responses: {
      '200': {},
      '404': {description: 'Data not found'},
    },
  })
  async find() {
    const data = await this.productService.findAll();
    if (!data || data.length === 0) {
      throw {
        statusCode: 404,
        message: 'Data not found',
      };
    }
    return {
      statusCode: 200,
      message: 'success',
      data,
    };
  }

  // @authenticate('jwt')
  @get('/products/{id}', {
    summary: 'Get products by ID API Endpoint',
    responses: {
      '200': {},
      '404': {description: 'Data not found'},
    },
  })
  async findById(
    @param.path.string('id') id: string,
  ) {
    const data = await this.productService.findById(id);
    if (!data) {
      throw {
        statusCode: 404,
        message: 'Data not found',
      };
    }
    return {
      statusCode: 200,
      message: 'success',
      data,
    };
  }

  // @authenticate('jwt')
  @patch('/products/{id}', {
    summary: 'Update products API Endpoint',
    responses: {
      '200': {},
      '404': {description: 'Data not found'},
    },
  })
  async updateById(
    @param.path.string('id') id: string,
    @requestBody({
      description: 'Update products API Endpoint',
      content: {
        'application/json': {
          schema: {
            properties: {
              categoryId: {
                type: 'string',
              },
              name: {
                type: 'string',
              },
              description: {
                type: 'string',
              },
            }
          }
        },
      },
    })
    payload: {
      categoryId: 'string',
      name: 'string',
      description: 'string',
    }) {
    const result = await this.productService.updateById(id, payload);
    if (result.statusCode === 404) {
      throw {
        statusCode: 404,
        message: 'Data not found',
      };
    }
    return result;
  }

  // @authenticate('jwt')
  @del('/products/{id}', {
    summary: 'Delete products API Endpoint',
    responses: {
      '200': {},
      '404': {description: 'Data not found or data already deleted'},
    },
  })
  async deleteById(@param.path.string('id') id: string) {
    const result = await this.productService.deleteProductById(id);
    if (result.statusCode === 404) {
      throw {
        statusCode: 404,
        message: 'Data not found or data already deleted',
      };
    }
    return result;
  }
}
