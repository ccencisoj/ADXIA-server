import { HttpRequest } from "../http/HttpRequest";
import { HttpReponse } from "../http/HttpResponse";
import { EmployeeMapper } from "../mappers/EmployeeMapper";
import { ControllerErrorHandler } from "../errorHandlers/ControllerErrorHandler";
import {
  GetEmployeesDTO, 
  GetEmployeesUseCase
} from "../../application";

interface GetEmployeesControllerDeps {
  getEmployeesUseCase: GetEmployeesUseCase;
  controllerErrorHandler: ControllerErrorHandler;
}

export class GetEmployeesController {
  protected readonly getEmployeesUseCase: GetEmployeesUseCase;
  protected readonly controllerErrorHandler: ControllerErrorHandler;

  public constructor({
    getEmployeesUseCase,
    controllerErrorHandler
  }: GetEmployeesControllerDeps) {
    this.getEmployeesUseCase = getEmployeesUseCase;
    this.controllerErrorHandler = controllerErrorHandler;
  }

  public execute = async (req: HttpRequest, res: HttpReponse): Promise<void> => {
    const reqData = {
      skip: Number(req.query.skip),
      limit: Number(req.query.limit)
    } as GetEmployeesDTO;

    try {
      const employees = await this.getEmployeesUseCase.execute(reqData);
      
      const employeeJSON = employees.map((employee)=> EmployeeMapper.toJSON(employee));

      res.json({employees: employeeJSON});

    }catch(error) {
      this.controllerErrorHandler.execute(req, res, error);
    }
  }
}
