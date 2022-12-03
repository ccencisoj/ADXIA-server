import JWT from 'jsonwebtoken';
import { config } from '../config';
import { v4 as uuid } from 'uuid';
import { Employee, Result } from "../../domain";
import { IEmployeeTokenService } from "../../application";
import { EmployeeCredentialsException } from '../../application/exceptions/EmployeeCredentialsException';

type DecodedToken = { 
  id: string, 
  type: string 
};

export class EmployeeTokenService implements IEmployeeTokenService {
  validate = (token: string): Result<any> => {
    let decodedToken: DecodedToken;

    try {
      decodedToken = JWT.verify(token, config.JWT_SECRET_KEY) as DecodedToken;
    }catch(error) {
      throw new EmployeeCredentialsException();
    }

    return Result.ok();
  }

  generate = (employee: Employee): string => {
    const token = JWT.sign({
      key: uuid(), 
      id: employee.id,
      type: employee.type
    }, config.JWT_SECRET_KEY);
    
    return token;
  }

  decode = (token: string): Result<DecodedToken>  => {
    let decodedToken: DecodedToken;

    try {
      decodedToken = JWT.verify(token, config.JWT_SECRET_KEY) as DecodedToken;
    }catch(error) {
      throw new EmployeeCredentialsException();
    }

    return Result.ok(decodedToken);
  }
}
