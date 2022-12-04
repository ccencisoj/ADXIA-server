import { UpdateOrderDTO } from "./UpdateOrderDTO";
import { IOrderRepository } from "../../repositories/IOrderRepository";
import { IProductRepository } from "../../repositories/IProductRepository";
import { IEmployeeTokenService } from "../../services/IEmployeeTokenService";
import { OrderNoFoundException } from "../../exceptions/OrderNoFoundException";
import { OrderProductException } from "../../exceptions/OrderProductException";
import { IOrderProductRepository } from "../../repositories/IOrderProductRepository";
import { EmployeeCredentialsException } from "../../exceptions/EmployeeCredentialsException";
import { EmployeeActionNoAllowedException } from "../../exceptions/EmployeeActionNoAllowedException";
import { EmployeeType, OrderProduct, ProductBrand, ProductName, ProductPrice, ProductQuantity } from "../../../domain";

type Response = Promise<void>;

interface UpdateOrderUseCaseDeps {
  orderRepository: IOrderRepository;
  productRepository: IProductRepository;
  orderProductRepository: IOrderProductRepository;
  employeeTokenService: IEmployeeTokenService;
}

export class UpdateOrderUseCase {
  protected readonly orderRepository: IOrderRepository;
  protected readonly productRepository: IProductRepository;
  protected readonly orderProductRepository: IOrderProductRepository;
  protected readonly employeeTokenService: IEmployeeTokenService;
  
  public constructor({
    orderRepository, 
    productRepository,
    orderProductRepository,
    employeeTokenService
  }: UpdateOrderUseCaseDeps) {
    this.orderRepository = orderRepository;
    this.productRepository = productRepository;
    this.employeeTokenService = employeeTokenService;
    this.orderProductRepository = orderProductRepository;
  }

  public execute = async (req: UpdateOrderDTO): Response => {
    const decodedEmployeeOrError = this.employeeTokenService.decode(req.employeeToken);

    if(decodedEmployeeOrError.isFailure) {
      throw new EmployeeCredentialsException(decodedEmployeeOrError.getError() as string);
    }

    const decodedEmployee = decodedEmployeeOrError.getValue();

    if(!(decodedEmployee.type === EmployeeType.ADMIN ||
      decodedEmployee.type === EmployeeType.VENDOR)) {
      throw new EmployeeActionNoAllowedException();
    }

    const order = await this.orderRepository.findOne({id: req.orderId});
    const orderFound = !!order;

    if(!orderFound) {
      throw new OrderNoFoundException();
    }

    await this.orderProductRepository.deleteMany({id: order.id});

    for(let productId of req.productIds) {
      const product = await this.productRepository.findOne({id: productId});
      const productFound = !!product;

      if(productFound) {
        const nameOrError = ProductName.create(product.name);
        const brandOrError = ProductBrand.create(product.brand);
        const avaliableQuantityOrError = ProductQuantity.create(product.avaliableQuantity);
        const priceOrError = ProductPrice.create(product.price);
        const orderProductOrError = OrderProduct.create({
          orderId: order.id,
          name: nameOrError.getValue(),
          brand: brandOrError.getValue(),
          avaliableQuantity: avaliableQuantityOrError.getValue(),
          price: priceOrError.getValue(),
          imageURL: product.imageURL
        });

        if(orderProductOrError.isFailure) {
          throw new OrderProductException(orderProductOrError.getError() as string);
        }

        const orderProduct = orderProductOrError.getValue();

        await this.orderProductRepository.save(orderProduct);
      }
    }
  }
}
