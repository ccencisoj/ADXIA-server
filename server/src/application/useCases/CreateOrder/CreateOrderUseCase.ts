import { DateTime, Order } from "../../../domain";
import { CreateOrderDTO } from "./CreateOrderDTO";
import { OrderException } from "../../exceptions/OrderException";
import { IOrderRepository } from "../../repositories/IOrderRepository";
import { IClientRepository } from "../../repositories/IClientRepository";

type Response = Promise<Order>;

interface CreateOrderUseCaseDeps {
  orderRepository: IOrderRepository;
  clientRepository: IClientRepository;
}

export class CreateOrderUseCase {
  protected readonly orderRepository: IOrderRepository;
  protected readonly clientRepository: IClientRepository;

  public constructor({orderRepository, clientRepository}: CreateOrderUseCaseDeps) {
    this.orderRepository = orderRepository;
    this.clientRepository = clientRepository;
  }
  
  public execute = async (req: CreateOrderDTO): Response => {
    const createdAtOrError = DateTime.create(DateTime.current());
    const orderOrError = Order.create({
      employeeId: req.employeeId,
      createdAt: createdAtOrError.getValue()
    });

    if(orderOrError.isFailure) {
      throw new OrderException(orderOrError.getError() as string);
    }

    const order = orderOrError.getValue();

    await this.orderRepository.save(order);

    return order;
  }
}
