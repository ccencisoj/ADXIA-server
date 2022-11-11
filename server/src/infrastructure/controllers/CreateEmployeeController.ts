import { HttpRequest } from "../http/HttpRequest";
import { HttpReponse } from "../http/HttpResponse";
import { EmployeeMapper } from "../mappers/EmployeeMapper";
import { ControllerErrorHandler } from "../errorHandlers/ControllerErrorHandler";
import {
  CreateEmployeeDTO, 
  CreateEmployeeUseCase
} from "../../application";

interface CreateEmployeeControllerDeps {
  createEmployeeUseCase: CreateEmployeeUseCase;
  controllerErrorHandler: ControllerErrorHandler;
}

export class CreateEmployeeController {
  protected readonly createEmployeeUseCase: CreateEmployeeUseCase;
  protected readonly controllerErrorHandler: ControllerErrorHandler;

  public constructor({
    createEmployeeUseCase,
    controllerErrorHandler
  }: CreateEmployeeControllerDeps) {
    this.createEmployeeUseCase = createEmployeeUseCase;
    this.controllerErrorHandler = controllerErrorHandler;
  }

  public execute = async (req: HttpRequest, res: HttpReponse): Promise<void> => {
    const reqData = {
      name: req.body.name,
      surname: req.body.surname,
      email: req.body.email,
      nroDocument: req.body.nroDocument,
      birthDate: req.body.birthDate
    } as CreateEmployeeDTO;

    try {
      const employee = await this.createEmployeeUseCase.execute(reqData);
      
      const employeeJSON = EmployeeMapper.toJSON(employee);

      res.json({employee: employeeJSON});

    }catch(error) {
      this.controllerErrorHandler.execute(req, res, error);
    }
  }
}
