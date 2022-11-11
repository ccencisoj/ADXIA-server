import { Result } from "./common/Result";
import { ValueObject } from "./common/ValueObject";

interface EmployeeTypeProps {
  value: string;
}

export class EmployeeType extends ValueObject<EmployeeTypeProps> {
  private constructor(props: EmployeeTypeProps) {
    super(props);
  }

  public static create = (value: string): Result<EmployeeType> => {
    const employeeType = new EmployeeType({value});

    return Result.ok<EmployeeType>(employeeType);
  }
}
