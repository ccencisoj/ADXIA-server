import { GetOrdersDTO } from "./GetOrdersDTO";
import { EmployeeType, Order } from "../../../domain";
import { IOrderRepository } from "../../repositories/IOrderRepository";
import { IEmployeeTokenService } from "../../services/IEmployeeTokenService";
import { EmployeeCredentialsException } from "../../exceptions/EmployeeCredentialsException";
import { EmployeeActionNoAllowedException } from "../../exceptions/EmployeeActionNoAllowedException";

type Response = Promise<Order[]>;

interface GetOrdersUseCaseDeps {
  orderRepository: IOrderRepository;
  employeeTokenService: IEmployeeTokenService;
}

export class GetOrdersUseCase {
  protected readonly orderRepository: IOrderRepository;
  protected readonly employeeTokenService: IEmployeeTokenService;

  public constructor({
    orderRepository,
    employeeTokenService
  }: GetOrdersUseCaseDeps) {
    this.orderRepository = orderRepository;
    this.employeeTokenService = employeeTokenService;
  }

  public execute = async (req: GetOrdersDTO): Response => {
    const decodedEmployeeOrError = this.employeeTokenService.decode(req.employeeToken);

    if(decodedEmployeeOrError.isFailure) {
      throw new EmployeeCredentialsException(decodedEmployeeOrError.getError() as string);
    }

    const decodedEmployee = decodedEmployeeOrError.getValue();

    if(!(decodedEmployee.type === EmployeeType.ADMIN || 
      decodedEmployee.type === EmployeeType.VENDOR)) {
      throw new EmployeeActionNoAllowedException();
    }

    const orders = await this.orderRepository.findMany({}, req.skip, req.limit);

    return orders;
  }
}
