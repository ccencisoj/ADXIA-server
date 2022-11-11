import { Employee } from "../../../domain";
import { GetEmployeesDTO } from './GetEmployeesDTO';
import { IEmployeeRepository } from "../../repositories/IEmployeeRepository";

type Response = Promise<Employee[]>;

interface GetEmployeesUseCaseDeps {
  employeeRepository: IEmployeeRepository;
}

export class GetEmployeesUseCase {
  protected readonly employeeRepository: IEmployeeRepository;

  public constructor({employeeRepository}: GetEmployeesUseCaseDeps) {
    this.employeeRepository = employeeRepository;
  }

  public execute = async (req: GetEmployeesDTO): Response => {
    const employees = await this.employeeRepository.findMany({}, req.skip, req.limit);

    return employees;
  }
}
