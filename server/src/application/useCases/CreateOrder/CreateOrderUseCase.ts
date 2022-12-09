import { CreateOrderDTO } from "./CreateOrderDTO";
import { OrderException } from "../../exceptions/OrderException";
import { IOrderRepository } from "../../repositories/IOrderRepository";
import { IClientRepository } from "../../repositories/IClientRepository";
import { IProductRepository } from "../../repositories/IProductRepository";
import { IEmployeeTokenService } from "../../services/IEmployeeTokenService";
import { IOrderProductRepository } from "../../repositories/IOrderProductRepository";
import { EmployeeCredentialsException } from "../../exceptions/EmployeeCredentialsException";
import { EmployeeActionNoAllowedException } from "../../exceptions/EmployeeActionNoAllowedException";
import { OrderProductException } from "../../exceptions/OrderProductException";
import { 
  DateTime, 
  EmployeeType, 
  Order, 
  OrderProduct, 
  ProductBrand, 
  ProductName, 
  ProductPrice, 
  ProductQuantity, 
  UniqueEntityId 
} from "../../../domain";

type Response = Promise<Order>;

interface CreateOrderUseCaseDeps {
  orderRepository: IOrderRepository;
  clientRepository: IClientRepository;
  productRepository: IProductRepository,
  employeeTokenService: IEmployeeTokenService;
  orderProductRepository: IOrderProductRepository;
}

export class CreateOrderUseCase {
  protected readonly orderRepository: IOrderRepository;
  protected readonly clientRepository: IClientRepository;
  protected readonly employeeTokenService: IEmployeeTokenService;
  protected readonly productRepository: IProductRepository;
  protected readonly orderProductRepository: IOrderProductRepository;

  public constructor({
    orderRepository, 
    clientRepository,
    employeeTokenService,
    productRepository,
    orderProductRepository
  }: CreateOrderUseCaseDeps) {
    this.orderRepository = orderRepository;
    this.clientRepository = clientRepository;
    this.employeeTokenService = employeeTokenService;
    this.productRepository = productRepository;
    this.orderProductRepository = orderProductRepository;
  }
  
  public execute = async (req: CreateOrderDTO): Response => {
    const decodedEmployeeOrError = this.employeeTokenService.decode(req.employeeToken);

    if(decodedEmployeeOrError.isFailure) {
      throw new EmployeeCredentialsException(decodedEmployeeOrError.getError() as string);
    }

    const decodedEmployee = decodedEmployeeOrError.getValue();

    if(!(decodedEmployee.type === EmployeeType.ADMIN || 
      decodedEmployee.type === EmployeeType.VENDOR)) {
      throw new EmployeeActionNoAllowedException();
    }
    
    const orderId = UniqueEntityId.create().value;

    let total = 0;

    for(let productId of req.productIds) {
      const product = await this.productRepository.findOne({id: productId});
      const productFound = !!product;

      if(productFound) {
        const nameOrError = ProductName.create(product.name);
        const brandOrError = ProductBrand.create(product.brand);
        const avaliableQuantityOrError = ProductQuantity.create(product.avaliableQuantity);
        const priceOrError = ProductPrice.create(product.price);
        const orderProductOrError = OrderProduct.create({
          orderId: orderId,
          name: nameOrError.getValue(),
          brand: brandOrError.getValue(),
          avaliableQuantity: avaliableQuantityOrError.getValue(),
          price: priceOrError.getValue(),
          imageURL: product.imageURL,
          description: product.description,
          grammage: product.grammage
        });

        if(orderProductOrError.isFailure) {
          throw new OrderProductException(orderProductOrError.getError() as string);
        }

        const orderProduct = orderProductOrError.getValue();

        await this.orderProductRepository.save(orderProduct);

        total += orderProduct.price;
      }
    }

    const createdAtOrError = DateTime.create(DateTime.current());
    const orderOrError = Order.create({
      employeeId: decodedEmployee.id,
      clientId: req.clientId,
      createdAt: createdAtOrError.getValue(),
      total: total
    }, orderId);

    if(orderOrError.isFailure) {
      throw new OrderException(orderOrError.getError() as string);
    }

    const order = orderOrError.getValue();

    await this.orderRepository.save(order);

    return order;
  }
}
