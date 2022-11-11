import { 
  DateTime, 
  Employee, 
  PersonDocument, 
  PersonEmail, 
  PersonName, 
  PersonSurname 
} from "../../domain";

type EmployeeRaw = {
  id: string;
  name: string;
  surname: string;
  email: string;
  birthDate: string;
  nroDocument: string;
}

export class EmployeeMapper {
  public static toJSON = (employee: Employee): any => {
    return {
      id: employee.id,
      name: employee.name,
      surname: employee.surname,
      email: employee.email,
      birthDate: employee.birthDate,
      nroDocument: employee.nroDocument
    }
  }

  public static toPersistence = (employee: Employee): any => {
    return {
      id: employee.id,
      name: employee.name,
      surname: employee.surname,
      email: employee.email,
      birthDate: employee.birthDate,
      nroDocument: employee.nroDocument
    }
  }

  public static toDomain = (raw: EmployeeRaw): Employee => {
    const nameOrError = PersonName.create(raw.name);
    const surnameOrError = PersonSurname.create(raw.surname);
    const emailOrError = PersonEmail.create(raw.email);
    const birthDateOrError = DateTime.create(raw.birthDate);
    const nroDocumentOrError = PersonDocument.create(raw.nroDocument);
    const employeeOrError = Employee.create({
      name: nameOrError.getValue(),
      surname: surnameOrError.getValue(),
      email: emailOrError.getValue(),
      birthDate: birthDateOrError.getValue(),
      nroDocument: nroDocumentOrError.getValue()
    }, raw.id);
    const employee = employeeOrError.getValue();
    return employee;
  }
}
