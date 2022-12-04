import { CreateOrderDTO } from "./CreateOrderDTO";
import { DateTime, EmployeeType, Order } from "../../../domain";
import { OrderException } from "../../exceptions/OrderException";
import { IOrderRepository } from "../../repositories/IOrderRepository";
import { IClientRepository } from "../../repositories/IClientRepository";
import { IEmployeeTokenService } from "../../services/IEmployeeTokenService";
import { EmployeeCredentialsException } from "../../exceptions/EmployeeCredentialsException";
import { EmployeeActionNoAllowedException } from "../../exceptions/EmployeeActionNoAllowedException";

type Response = Promise<Order>;

interface CreateOrderUseCaseDeps {
  orderRepository: IOrderRepository;
  clientRepository: IClientRepository;
  employeeTokenService: IEmployeeTokenService;
}

export class CreateOrderUseCase {
  protected readonly orderRepository: IOrderRepository;
  protected readonly clientRepository: IClientRepository;
  protected readonly employeeTokenService: IEmployeeTokenService;

  public constructor({
    orderRepository, 
    clientRepository,
    employeeTokenService
  }: CreateOrderUseCaseDeps) {
    this.orderRepository = orderRepository;
    this.clientRepository = clientRepository;
    this.employeeTokenService = employeeTokenService;
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
