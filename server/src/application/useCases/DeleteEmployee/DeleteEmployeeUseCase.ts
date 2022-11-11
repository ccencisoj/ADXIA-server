import { DeleteEmployeeDTO } from "./DeleteEmployeeDTO";
import { DeletedEmployeeEvent, DomainEvents } from "../../../domain";
import { IEmployeeRepository } from "../../repositories/IEmployeeRepository";
import { EmployeeNoFoundException } from "../../exceptions/EmployeeNoFoundException";

type Response = Promise<void>;

interface DeleteEmployeeUseCaseDeps {
  employeeRepository: IEmployeeRepository;
}

export class DeleteEmployeeUseCase {
  protected readonly employeeRepository: IEmployeeRepository;

  public constructor({employeeRepository}: DeleteEmployeeUseCaseDeps) {
    this.employeeRepository = employeeRepository;
  } 

  public execute = async (req: DeleteEmployeeDTO): Response => {
    const employee = await this.employeeRepository.findOne({id: req.employeeId});
    const employeeFound = !!employee;

    if(!employeeFound) {
      throw new EmployeeNoFoundException();
    }

    await this.employeeRepository.delete(employee);

    employee.addDomainEvent(new DeletedEmployeeEvent(employee));

    DomainEvents.dispatchEvents(employee);
  }
}
