import { Result } from "../../domain";
import { HttpRequest } from "../http/HttpRequest";

type Response = Promise<Result<string>>;

export const getEmployeeToken = async (req: HttpRequest): Response => {
  const employeeToken = req.headers["authorization"]?.split("Bearer ").pop();
  const hasEmployeeToken = !!employeeToken;

  if(!hasEmployeeToken) {
    return Result.fail("The employee token is required");
  }
  
  return Result.ok(employeeToken);
}
