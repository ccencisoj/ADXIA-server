import { GetOrdersDTO } from "./GetOrdersDTO";
import { EmployeeType, Order } from "../../../domain";
import { IOrderRepository } from "../../repositories/IOrderRepository";
import { IEmployeeTokenService } from "../../services/IEmployeeTokenService";
import { EmployeeCredentialsException } from "../../exceptions/EmployeeCredentialsException";
import { EmployeeActionNoAllowedException } from "../../exceptions/EmployeeActionNoAllowedException";
import { IClientRepository } from "../../repositories/IClientRepository";

type Response = Promise<Order[]>;

interface GetOrdersUseCaseDeps {
  orderRepository: IOrderRepository;
  clientRepository: IClientRepository;
  employeeTokenService: IEmployeeTokenService;
}

export class GetOrdersUseCase {
  protected readonly orderRepository: IOrderRepository;
  protected readonly clientRepository: IClientRepository;
  protected readonly employeeTokenService: IEmployeeTokenService;

  public constructor({
    orderRepository,
    clientRepository,
    employeeTokenService
  }: GetOrdersUseCaseDeps) {
    this.orderRepository = orderRepository;
    this.clientRepository = clientRepository;
    this.employeeTokenService = employeeTokenService;
  }

  public execute = async (req: GetOrdersDTO): Response => {
    const decodedEmployeeOrError = this.employeeTokenService.decode(req.employeeToken);

    if(decodedEmployeeOrError.isFailure) {
      throw new EmployeeCredentialsException(decodedEmployeeOrError.getError() as string);
    }

    const decodedEmployee = decodedEmployeeOrError.getValue();

    console.log(decodedEmployee);

    if(!(decodedEmployee.type === EmployeeType.ADMIN || 
      decodedEmployee.type === EmployeeType.VENDOR ||
      decodedEmployee.type === EmployeeType.DELIVERER)) {
      throw new EmployeeActionNoAllowedException();
    }

    let orders;

    if(req.searchValue) {
      const clients = await this.clientRepository.findMany({
        $or: [
          {name: {$regex: `.*${req.searchValue}.*`, $options: "i"}}, 
          {surname: {$regex: `.*${req.searchValue}.*`, $options: "i"}},
          {nroDocument: {$regex: `.*${req.searchValue}.*`, $options: "i"}},
          {phoneNumber: {$regex: `.*${req.searchValue}.*`, $options: "i"}},
          {address: {$regex: `.*${req.searchValue}.*`, $options: "i"}},
          {business: {$regex: `.*${req.searchValue}.*`, $options: "i"}}
        ]
      }, req.skip, req.limit);

      orders = [];

      for(let client of clients) {
        const order = await this.orderRepository.findOne({clientId: client.id});
        const orderFound = !!order;
        if(orderFound) orders.push(order);
      }
    }else {
      orders = await this.orderRepository.findMany({}, req.skip, req.limit);
    }

    return orders;
  }
}
