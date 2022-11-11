import { Employee } from "../../../domain";
import { GetEmployeeByIdDTO } from "./GetEmployeeByIdDTO";
import { IEmployeeRepository } from "../../repositories/IEmployeeRepository";
import { EmployeeNoFoundException } from "../../exceptions/EmployeeNoFoundException";

type Response = Promise<Employee>;

interface GetEmployeeByIdUseCaseDeps {
  employeeRepository: IEmployeeRepository;
}

export class GetEmployeeByIdUseCase {
  protected readonly employeeRepository: IEmployeeRepository;

  public constructor({employeeRepository}: GetEmployeeByIdUseCaseDeps) {
    this.employeeRepository = employeeRepository;
  }

  public execute = async (req: GetEmployeeByIdDTO): Response => {
    const employee = await this.employeeRepository.findOne({id: req.employeeId});
    const employeeFound = !!employee;

    if(!employeeFound) {
      throw new EmployeeNoFoundException();
    }

    return employee;
  }
}
