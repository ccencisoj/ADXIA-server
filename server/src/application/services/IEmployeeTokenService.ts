import { Employee, Result } from '../../domain';

export interface IEmployeeTokenService {
  generate(employee: Employee): string;
  validate(token: string): Result<any>;  
  decode(token: string): Result<any>;
}
