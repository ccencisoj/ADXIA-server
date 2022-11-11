import { AddProductToOrderDTO } from './AddProductToOrderDTO';
import { OrderException } from '../../exceptions/OrderException';
import { IOrderRepository } from '../../repositories/IOrderRepository';
import { IProductRepository } from '../../repositories/IProductRepository';
import { OrderNoFoundException } from '../../exceptions/OrderNoFoundException';
import { ProductNoFoundException } from '../../exceptions/ProductNoFoundException';
import { IOrderProductRepository } from '../../repositories/IOrderProductRepository';
import { OrderProductAlreadyInOrder } from '../../exceptions/OrderProductAlreadyInOrderException';
import { 
  DomainEvents,
  OrderProduct, 
  ProductBrand, 
  ProductName, 
  ProductPrice,
  ProductQuantity, 
} from '../../../domain';

type Response = Promise<OrderProduct>;

interface AddProductToOrderUseCaseDeps {
  orderRepository: IOrderRepository;
  productRepository: IProductRepository;
  orderProductRepository: IOrderProductRepository;
}

export class AddProductToOrderUseCase {
  protected readonly orderRepository: IOrderRepository;
  protected readonly productRepository: IProductRepository;
  protected readonly orderProductRepository: IOrderProductRepository;

  public constructor({
    orderRepository, 
    productRepository,
    orderProductRepository
  }: AddProductToOrderUseCaseDeps) {
    this.orderRepository = orderRepository;
    this.productRepository = productRepository;
    this.orderProductRepository = orderProductRepository;
  }

  public execute = async (req: AddProductToOrderDTO): Response => {
    const order = await this.orderRepository.findOne({id: req.orderId, clientId: req.clientId});
    const orderFound = !!order;

    if(!orderFound) {
      throw new OrderNoFoundException();
    }

    const product = await this.productRepository.findOne({id: req.productId});
    const productFound = !!product;

    if(!productFound) {
      throw new ProductNoFoundException();
    }

    const orderProduct = await this.orderProductRepository.findOne({id: req.productId});
    const orderProductFound = !!orderProduct;

    if(orderProductFound) {
      throw new OrderProductAlreadyInOrder(orderProduct);
    }

    const nameOrError = ProductName.create(product.name);
    const brandOrError = ProductBrand.create(product.name);
    const avaliableQuantityOrError = ProductQuantity.create(product.avaliableQuantity);
    const priceOrError = ProductPrice.create(product.price);
    const newOrderProductOrError = OrderProduct.create({
      orderId: order.id,
      name: nameOrError.getValue(),
      brand: brandOrError.getValue(),
      avaliableQuantity: avaliableQuantityOrError.getValue(),
      price: priceOrError.getValue()
    }, product.id);

    if(newOrderProductOrError.isFailure) {
      throw new OrderException(newOrderProductOrError.getError() as string);
    }

    const newOrderProduct = newOrderProductOrError.getValue();

    await this.orderProductRepository.save(newOrderProduct);

    DomainEvents.dispatchEvents(newOrderProduct);

    return newOrderProduct;
  }
}
