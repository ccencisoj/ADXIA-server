import { OrderProduct } from "../../../domain";
import { GetOrderProductsDTO } from "./GetOrderProductsDTO";
import { IOrderRepository } from "../../repositories/IOrderRepository";
import { OrderNoFoundException } from "../../exceptions/OrderNoFoundException";
import { IOrderProductRepository } from "../../repositories/IOrderProductRepository";

type Response = Promise<OrderProduct[]>;

interface GetOrderProductsUseCaseDeps {
  orderRepository: IOrderRepository;
  orderProductRepository: IOrderProductRepository;
}

export class GetOrderProductsUseCase {
  protected readonly orderRepository: IOrderRepository;
  protected readonly orderProductRepository: IOrderProductRepository;

  public constructor({
    orderRepository, 
    orderProductRepository
  }: GetOrderProductsUseCaseDeps) {
    this.orderRepository = orderRepository;
    this.orderProductRepository = orderProductRepository;
  }

  public execute = async (req: GetOrderProductsDTO): Response => {
    const order = await this.orderRepository.findOne({id: req.orderId});
    const orderFound = !!order;

    if(!orderFound) {
      throw new OrderNoFoundException();
    }

    const orderProducts = await this.orderProductRepository.findMany({orderId: order.id}, req.skip, req.limit);

    return orderProducts;
  }
}
