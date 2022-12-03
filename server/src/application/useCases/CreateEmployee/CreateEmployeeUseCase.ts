import { CreateEmployeeDTO } from "./CreateEmployeeDTO";
import { IHashService } from "../../services/IHashService";
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
  hashService: IHashService;
}

export class CreateEmployeeUseCase {
  protected readonly employeeRepository: IEmployeeRepository;
  protected readonly hashService: IHashService;


  public constructor({employeeRepository, hashService}: CreateEmployeeUseCaseDeps) {
    this.employeeRepository = employeeRepository;
    this.hashService = hashService;
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

    const accessCode = this.hashService.hash(req.accessCode);

    const newEmployeeOrError = Employee.create({
      name: nameOrError.getValue(),
      surname: surnameOrError.getValue(),
      email: emailOrError.getValue(),
      nroDocument: nroDocumentOrError.getValue(),
      birthDate: birthDateOrError.getValue(),
      imageURL: req.imageURL,
      type: req.type,
      accessCode: accessCode,
      phone: req.phone
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
