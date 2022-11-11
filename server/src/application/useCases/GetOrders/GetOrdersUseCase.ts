import { Order } from "../../../domain";
import { GetOrdersDTO } from "./GetOrdersDTO";
import { IOrderRepository } from "../../repositories/IOrderRepository";

type Response = Promise<Order[]>;

interface GetOrdersUseCaseDeps {
  orderRepository: IOrderRepository;
}

export class GetOrdersUseCase {
  protected readonly orderRepository: IOrderRepository;

  public constructor({orderRepository}: GetOrdersUseCaseDeps) {
    this.orderRepository = orderRepository;
  }

  public execute = async (req: GetOrdersDTO): Response => {
    const orders = await this.orderRepository.findMany({}, req.skip, req.limit);

    return orders;
  }
}
