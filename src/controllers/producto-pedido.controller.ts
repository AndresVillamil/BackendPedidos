import {
  Count,
  CountSchema,
  Filter,
  repository,
  Where,
} from '@loopback/repository';
import {
  del,
  get,
  getModelSchemaRef,
  getWhereSchemaFor,
  param,
  patch,
  post,
  requestBody,
} from '@loopback/rest';
import {
  Producto,
  Pedido,
} from '../models';
import {ProductoRepository} from '../repositories';

export class ProductoPedidoController {
  constructor(
    @repository(ProductoRepository) protected productoRepository: ProductoRepository,
  ) { }

  @get('/productos/{id}/pedido', {
    responses: {
      '200': {
        description: 'Producto has one Pedido',
        content: {
          'application/json': {
            schema: getModelSchemaRef(Pedido),
          },
        },
      },
    },
  })
  async get(
    @param.path.string('id') id: string,
    @param.query.object('filter') filter?: Filter<Pedido>,
  ): Promise<Pedido> {
    return this.productoRepository.pedido(id).get(filter);
  }

  @post('/productos/{id}/pedido', {
    responses: {
      '200': {
        description: 'Producto model instance',
        content: {'application/json': {schema: getModelSchemaRef(Pedido)}},
      },
    },
  })
  async create(
    @param.path.string('id') id: typeof Producto.prototype.id,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Pedido, {
            title: 'NewPedidoInProducto',
            exclude: ['id'],
            optional: ['productoId']
          }),
        },
      },
    }) pedido: Omit<Pedido, 'id'>,
  ): Promise<Pedido> {
    return this.productoRepository.pedido(id).create(pedido);
  }

  @patch('/productos/{id}/pedido', {
    responses: {
      '200': {
        description: 'Producto.Pedido PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async patch(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Pedido, {partial: true}),
        },
      },
    })
    pedido: Partial<Pedido>,
    @param.query.object('where', getWhereSchemaFor(Pedido)) where?: Where<Pedido>,
  ): Promise<Count> {
    return this.productoRepository.pedido(id).patch(pedido, where);
  }

  @del('/productos/{id}/pedido', {
    responses: {
      '200': {
        description: 'Producto.Pedido DELETE success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async delete(
    @param.path.string('id') id: string,
    @param.query.object('where', getWhereSchemaFor(Pedido)) where?: Where<Pedido>,
  ): Promise<Count> {
    return this.productoRepository.pedido(id).delete(where);
  }
}
