import { DeleteOrderDTO } from "./DeleteOrderDTO";
import { IOrderRepository } from "../../repositories/IOrderRepository";
import { IClientRepository } from "../../repositories/IClientRepository";
import { OrderNoFoundException } from "../../exceptions/OrderNoFoundException";
import { ClientNoFoundException } from "../../exceptions/ClientNoFoundException";

type Response = Promise<void>;

interface DeleteOrderUseCaseDeps {
  clientRepository: IClientRepository;
  orderRepository: IOrderRepository;
}

export class DeleteOrderUseCase {
  protected readonly clientRepository: IClientRepository;
  protected readonly orderRepository: IOrderRepository;

  public constructor({clientRepository, orderRepository}: DeleteOrderUseCaseDeps) {
    this.clientRepository = clientRepository;
    this.orderRepository = orderRepository;
  }

  public execute = async (req: DeleteOrderDTO): Response => {
    const client = await this.clientRepository.findOne({id: req.clientId});
    const clientFound = !!client;

    if(!clientFound) {
      throw new ClientNoFoundException();
    }

    const order = await this.orderRepository.findOne({id: req.clientId, clientId: client.id});
    const orderFound = !!order;

    if(!orderFound) {
      throw new OrderNoFoundException();
    }

    await this.orderRepository.delete(order);
  }
}
