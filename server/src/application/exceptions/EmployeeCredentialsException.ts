import { ApplicationException } from "../common/ApplicationException";

export class EmployeeCredentialsException extends ApplicationException {
  public constructor() {
    super("EmployeeCredentialsException", 400, "Employee credentials are incorrect");
  }
}
