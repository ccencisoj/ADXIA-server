import { UpdateEmployeeDTO } from "./UpdateEmployeeDTO";
import { EmployeeException } from "../../exceptions/EmployeeException";
import { ValidationException } from "../../exceptions/ValidationException";
import { IEmployeeRepository } from "../../repositories/IEmployeeRepository";
import { EmployeeNoFoundException } from "../../exceptions/EmployeeNoFoundException";
import { 
  Result, 
  DateTime, 
  Employee, 
  PersonName, 
  PersonEmail, 
  PersonSurname, 
  PersonDocument,
  UpdatedEmployeeEvent,
  DomainEvents
} from "../../../domain";

type Response = Promise<void>;

interface UpdateEmployeeUseCaseDeps {
  employeeRepository: IEmployeeRepository;
}

export class UpdateEmployeeUseCase {
  protected readonly employeeRepository: IEmployeeRepository;

  public constructor({employeeRepository}: UpdateEmployeeUseCaseDeps) {
    this.employeeRepository = employeeRepository;
  }

  public execute = async (req: UpdateEmployeeDTO): Response => {
    const employee = await this.employeeRepository.findOne({id: req.employeeId});
    const employeeFound = !!employee;

    if(!employeeFound) {
      throw new EmployeeNoFoundException();
    }

    const nameOrError = PersonName.create(req.name || employee.name);
    const surnameOrError = PersonSurname.create(req.surname || employee.surname);
    const emailOrError = PersonEmail.create(req.email || employee.email);
    const nroDocumentOrError = PersonDocument.create(req.nroDocument || employee.nroDocument);
    const birthDateOrError = DateTime.create(req.birthDate || employee.birthDate);
    const combinedResult = Result.combine([
      nameOrError,
      surnameOrError,
      emailOrError,
      nroDocumentOrError,
      birthDateOrError
    ]);

    if(combinedResult.isFailure) {
      throw new ValidationException(combinedResult.getError() as string);
    }

    const updatedEmployeeOrError = Employee.create({
      name: nameOrError.getValue(),
      surname: surnameOrError.getValue(),
      email: emailOrError.getValue(),
      nroDocument: nroDocumentOrError.getValue(),
      birthDate: birthDateOrError.getValue()
    }, employee.id);

    if(updatedEmployeeOrError.isFailure) {
      throw new EmployeeException(updatedEmployeeOrError.getError() as string);
    }

    const updatedEmployee = updatedEmployeeOrError.getValue();

    await this.employeeRepository.save(updatedEmployee);

    updatedEmployee.addDomainEvent(new UpdatedEmployeeEvent(employee));

    DomainEvents.dispatchEvents(updatedEmployee);
  }
}
