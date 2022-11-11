import { IOrderRepository } from "../../repositories/IOrderRepository";
import { DeleteProductFromOrderDTO } from "./DeleteProductFromOrderDTO";
import { OrderNoFoundException } from "../../exceptions/OrderNoFoundException";
import { IOrderProductRepository } from "../../repositories/IOrderProductRepository";
import { OrderProductNoFound } from "../../exceptions/OrderProductNoFoundException";

type Response = Promise<void>;

interface DeleteProductFromOrderUseCaseDeps {
  orderRepository: IOrderRepository;
  orderProductRepository: IOrderProductRepository;
}

export class DeleteProductFromOrderUseCase {
  protected readonly orderRepository: IOrderRepository;
  protected readonly orderProductRepository: IOrderProductRepository;

  public constructor({
    orderRepository, 
    orderProductRepository
  }: DeleteProductFromOrderUseCaseDeps) {
    this.orderRepository = orderRepository;
    this.orderProductRepository = orderProductRepository;
  }

  public execute = async (req: DeleteProductFromOrderDTO): Response => {
    const order = await this.orderRepository.findOne({id: req.orderId});
    const orderFound = !!order;

    if(!orderFound) {
      throw new OrderNoFoundException();
    }

    const orderProduct = await this.orderProductRepository.findOne({id: req.productId, orderId: order.id});
    const orderProductFound = !!orderProduct;

    if(!orderProductFound) {
      throw new OrderProductNoFound();
    }

    await this.orderProductRepository.delete(orderProduct);
  }
}
