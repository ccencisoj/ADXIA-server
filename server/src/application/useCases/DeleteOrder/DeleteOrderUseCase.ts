import { EmployeeType } from "../../../domain";
import { DeleteOrderDTO } from "./DeleteOrderDTO";
import { IOrderRepository } from "../../repositories/IOrderRepository";
import { IClientRepository } from "../../repositories/IClientRepository";
import { OrderNoFoundException } from "../../exceptions/OrderNoFoundException";
import { ClientNoFoundException } from "../../exceptions/ClientNoFoundException";
import { IEmployeeTokenService } from "../../services/IEmployeeTokenService";
import { EmployeeCredentialsException } from "../../exceptions/EmployeeCredentialsException";
import { EmployeeActionNoAllowedException } from "../../exceptions/EmployeeActionNoAllowedException";

type Response = Promise<void>;

interface DeleteOrderUseCaseDeps {
  clientRepository: IClientRepository;
  orderRepository: IOrderRepository;
  employeeTokenService: IEmployeeTokenService;
}

export class DeleteOrderUseCase {
  protected readonly clientRepository: IClientRepository;
  protected readonly orderRepository: IOrderRepository;
  protected readonly employeeTokenService: IEmployeeTokenService;

  public constructor({
    clientRepository, 
    orderRepository,
    employeeTokenService
  }: DeleteOrderUseCaseDeps) {
    this.clientRepository = clientRepository;
    this.orderRepository = orderRepository;
    this.employeeTokenService = employeeTokenService;
  }

  public execute = async (req: DeleteOrderDTO): Response => {
    const decodedEmployeeOrError = this.employeeTokenService.decode(req.employeeToken);

    if(decodedEmployeeOrError.isFailure) {
      throw new EmployeeCredentialsException(decodedEmployeeOrError.getError() as string);
    }

    const decodedEmployee = decodedEmployeeOrError.getValue();

    if(!(decodedEmployee.type === EmployeeType.ADMIN ||
      decodedEmployee.type === EmployeeType.VENDOR)) {
      throw new EmployeeActionNoAllowedException();
    }

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
