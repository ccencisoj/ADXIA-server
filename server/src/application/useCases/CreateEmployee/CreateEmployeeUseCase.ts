import { CreateEmployeeDTO } from "./CreateEmployeeDTO";
import { EmployeeException } from "../../exceptions/EmployeeException";
import { ValidationException } from "../../exceptions/ValidationException";
import { IEmployeeRepository } from "../../repositories/IEmployeeRepository";
import { EmployeeAlreadyRegisteredException } from "../../exceptions/EmployeeAlreadyRegisteredException";
import { 
  Result,
  DateTime,
  Employee, 
  PersonName, 
  PersonEmail, 
  PersonSurname, 
  PersonDocument,
  DomainEvents, 
} from "../../../domain";

type Response = Promise<Employee>;

interface CreateEmployeeUseCaseDeps {
  employeeRepository: IEmployeeRepository;
}

export class CreateEmployeeUseCase {
  protected readonly employeeRepository: IEmployeeRepository;

  public constructor({employeeRepository}: CreateEmployeeUseCaseDeps) {
    this.employeeRepository = employeeRepository;
  }

  public execute = async (req: CreateEmployeeDTO): Response => {
    const employee = await this.employeeRepository.findOne({
      nroDocument: req.nroDocument
    });
    const alreadyRegistered = !!employee;

    if(alreadyRegistered) {
      throw new EmployeeAlreadyRegisteredException(employee);
    }

    const nameOrError = PersonName.create(req.name);
    const surnameOrError = PersonSurname.create(req.surname);
    const emailOrError = PersonEmail.create(req.email);
    const nroDocumentOrError = PersonDocument.create(req.nroDocument);
    const birthDateOrError = DateTime.create(req.birthDate);
    const combinedResult = Result.combine([
      nameOrError,
      surnameOrError,
      emailOrError,
      nroDocumentOrError
    ]);

    if(combinedResult.isFailure) {
      throw new ValidationException(combinedResult.getError() as string);
    }

    const newEmployeeOrError = Employee.create({
      name: nameOrError.getValue(),
      surname: surnameOrError.getValue(),
      email: emailOrError.getValue(),
      nroDocument: nroDocumentOrError.getValue(),
      birthDate: birthDateOrError.getValue()
    });

    if(newEmployeeOrError.isFailure) {
      throw new EmployeeException(newEmployeeOrError.getError() as string);
    }

    const newEmployee = newEmployeeOrError.getValue();

    await this.employeeRepository.save(newEmployee);

    DomainEvents.dispatchEvents(newEmployee);

    return newEmployee
  }
}
